import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export interface StlInfo {
  name: string;
  size: number;
  triangles: number;
  bbox: { x: string; y: string; z: string } | null;
  hints: string[];
  tall: boolean;
  thin: boolean;
  complex: boolean;
  needsSupports: boolean;
  overhangPercent: number;
}

const MAX_ANALYZED_TRIANGLES = 200000;
const SUPPORT_ANGLE_NORMAL_Z = -0.75;
const SUPPORT_CLEARANCE_MM = 3;
const SUPPORT_CLEARANCE_RATIO = 0.35;
const SUPPORT_AREA_THRESHOLD = 8;

function getTriangleData(geometry: THREE.BufferGeometry) {
  const normalizedGeometry = geometry.index ? geometry.toNonIndexed() : geometry.clone();
  const positions = normalizedGeometry.getAttribute('position');

  if (!positions || positions.count < 3) {
    normalizedGeometry.dispose();
    return null;
  }

  normalizedGeometry.computeBoundingBox();

  return { normalizedGeometry, positions, triangleCount: Math.floor(positions.count / 3) };
}

function buildHints({
  bbox,
  complex,
  needsSupports,
  overhangPercent,
  riskyAreaPercent,
  tall,
  thin,
}: {
  bbox: StlInfo['bbox'];
  complex: boolean;
  needsSupports: boolean;
  overhangPercent: number;
  riskyAreaPercent: number;
  tall: boolean;
  thin: boolean;
}) {
  const hints: string[] = [];

  if (needsSupports) {
    hints.push(`⚠️ Есть выраженные нависания (${riskyAreaPercent}% площади) → включи поддержки`);
  } else {
    hints.push(`✅ Критичных нависаний почти нет (${riskyAreaPercent}% площади) → поддержки, скорее всего, не нужны`);
  }

  if (overhangPercent > 15) {
    hints.push('Есть локальные нижние поверхности → при сомнениях включи Supports from Build Plate');
  }
  if (tall) hints.push('Высокая деталь (>80 мм) → скорость −10%');
  if (thin) hints.push('Тонкие стенки (<8 мм) → поток +2%');
  if (complex) hints.push('Сложная геометрия → проверь предпросмотр слоёв перед печатью');
  if (bbox) {
    const vol = parseFloat(bbox.x) * parseFloat(bbox.y) * parseFloat(bbox.z);
    if (vol > 500000) hints.push('Крупная деталь → рассмотри разделение на части для надёжности');
  }

  return hints;
}

export function analyzeStlFile(buf: ArrayBuffer, name: string, size: number): { geometry: THREE.BufferGeometry | null; info: StlInfo } {
  const loader = new STLLoader();

  try {
    const geometry = loader.parse(buf);
    const triangleData = getTriangleData(geometry);

    if (!triangleData) {
      return {
        geometry: null,
        info: createFallbackInfo(name, size, 'Не удалось прочитать STL-файл. Попробуй пересохранить его как Binary STL.'),
      };
    }

    const { normalizedGeometry, positions, triangleCount } = triangleData;
    const bbox3 = normalizedGeometry.boundingBox;

    if (!bbox3) {
      normalizedGeometry.dispose();
      return {
        geometry,
        info: createFallbackInfo(name, size, 'Не удалось определить габариты STL-модели.'),
      };
    }

    const bbox = {
      x: (bbox3.max.x - bbox3.min.x).toFixed(1),
      y: (bbox3.max.y - bbox3.min.y).toFixed(1),
      z: (bbox3.max.z - bbox3.min.z).toFixed(1),
    };

    const height = bbox3.max.z - bbox3.min.z;
    const minBaseClearance = bbox3.min.z + Math.max(SUPPORT_CLEARANCE_MM, height * SUPPORT_CLEARANCE_RATIO);
    const sampleStep = triangleCount > MAX_ANALYZED_TRIANGLES ? Math.ceil(triangleCount / MAX_ANALYZED_TRIANGLES) : 1;

    const a = new THREE.Vector3();
    const b = new THREE.Vector3();
    const c = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const ac = new THREE.Vector3();
    const normal = new THREE.Vector3();

    let analyzedTriangles = 0;
    let riskyTriangles = 0;
    let riskyArea = 0;
    let totalArea = 0;

    for (let faceIndex = 0; faceIndex < triangleCount; faceIndex += sampleStep) {
      const vertexIndex = faceIndex * 3;

      a.fromBufferAttribute(positions, vertexIndex);
      b.fromBufferAttribute(positions, vertexIndex + 1);
      c.fromBufferAttribute(positions, vertexIndex + 2);

      ab.subVectors(b, a);
      ac.subVectors(c, a);
      normal.crossVectors(ab, ac);

      const doubleArea = normal.length();
      if (!doubleArea) continue;

      const area = doubleArea * 0.5;
      totalArea += area;
      analyzedTriangles += 1;

      normal.normalize();
      const centroidZ = (a.z + b.z + c.z) / 3;
      const isRiskyOverhang = normal.z < SUPPORT_ANGLE_NORMAL_Z && centroidZ > minBaseClearance;

      if (isRiskyOverhang) {
        riskyTriangles += 1;
        riskyArea += area;
      }
    }

    normalizedGeometry.dispose();

    const overhangPercent = analyzedTriangles ? Math.round((riskyTriangles / analyzedTriangles) * 100) : 0;
    const riskyAreaPercent = totalArea ? Math.round((riskyArea / totalArea) * 100) : 0;
    const tall = height > 80;
    const thin = Math.min(parseFloat(bbox.x), parseFloat(bbox.y)) < 8;
    const complex = triangleCount > 50000;
    const needsSupports = riskyAreaPercent >= SUPPORT_AREA_THRESHOLD;

    return {
      geometry,
      info: {
        name,
        size,
        triangles: triangleCount,
        bbox,
        hints: buildHints({ bbox, complex, needsSupports, overhangPercent, riskyAreaPercent, tall, thin }),
        tall,
        thin,
        complex,
        needsSupports,
        overhangPercent,
      },
    };
  } catch {
    return {
      geometry: null,
      info: createFallbackInfo(name, size, 'Не удалось прочитать STL-файл. Проверь, что он не повреждён.'),
    };
  }
}

export function createFallbackInfo(name: string, size: number, hint: string): StlInfo {
  return {
    name,
    size,
    triangles: 0,
    bbox: null,
    hints: [hint],
    tall: false,
    thin: false,
    complex: false,
    needsSupports: false,
    overhangPercent: 0,
  };
}

export function createNonStlInfo(name: string, size: number, extension: string): StlInfo {
  return {
    name,
    size,
    triangles: 0,
    bbox: null,
    hints: [`Файл ${extension.toUpperCase()} загружен. Геоанализ и 3D-превью сейчас доступны для STL.`],
    tall: false,
    thin: false,
    complex: false,
    needsSupports: false,
    overhangPercent: 0,
  };
}