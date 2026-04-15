import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export interface OrientationTip {
  label: string;
  description: string;
  overhangPercent: number;
  riskyAreaPercent: number;
  needsSupports: boolean;
  isBest: boolean;
}

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
  orientations: OrientationTip[];
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

// Orientation definitions: rotation axis + angle, label
const ORIENTATIONS = [
  { label: 'Текущая (как есть)', rx: 0, ry: 0, description: 'Без изменений — модель в исходной ориентации' },
  { label: 'Повернуть на бок (X +90°)', rx: Math.PI / 2, ry: 0, description: 'Поворот на 90° вокруг оси X — ложится на переднюю грань' },
  { label: 'Повернуть на бок (X −90°)', rx: -Math.PI / 2, ry: 0, description: 'Поворот на 90° вокруг оси X — ложится на заднюю грань' },
  { label: 'Перевернуть (X 180°)', rx: Math.PI, ry: 0, description: 'Полный переворот — верх становится низом' },
  { label: 'Повернуть боком (Y +90°)', rx: 0, ry: Math.PI / 2, description: 'Поворот на 90° вокруг оси Y — ложится на правую грань' },
  { label: 'Повернуть боком (Y −90°)', rx: 0, ry: -Math.PI / 2, description: 'Поворот на 90° вокруг оси Y — ложится на левую грань' },
];

function analyzeOrientation(
  positions: THREE.BufferAttribute | THREE.InterleavedBufferAttribute,
  triangleCount: number,
  sampleStep: number,
  rx: number,
  ry: number,
): { overhangPercent: number; riskyAreaPercent: number } {
  const rotMatrix = new THREE.Matrix4().makeRotationX(rx).multiply(new THREE.Matrix4().makeRotationY(ry));
  const normalMatrix = new THREE.Matrix3().setFromMatrix4(rotMatrix);

  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), normal = new THREE.Vector3();

  // First pass: find bounding box in rotated frame
  let minZ = Infinity, maxZ = -Infinity;
  for (let fi = 0; fi < triangleCount; fi += sampleStep) {
    const vi = fi * 3;
    a.fromBufferAttribute(positions, vi).applyMatrix4(rotMatrix);
    b.fromBufferAttribute(positions, vi + 1).applyMatrix4(rotMatrix);
    c.fromBufferAttribute(positions, vi + 2).applyMatrix4(rotMatrix);
    const lo = Math.min(a.z, b.z, c.z);
    const hi = Math.max(a.z, b.z, c.z);
    if (lo < minZ) minZ = lo;
    if (hi > maxZ) maxZ = hi;
  }

  const height = maxZ - minZ;
  const minBaseClearance = minZ + Math.max(SUPPORT_CLEARANCE_MM, height * SUPPORT_CLEARANCE_RATIO);

  let analyzed = 0, riskyCount = 0, riskyArea = 0, totalArea = 0;

  for (let fi = 0; fi < triangleCount; fi += sampleStep) {
    const vi = fi * 3;
    a.fromBufferAttribute(positions, vi).applyMatrix4(rotMatrix);
    b.fromBufferAttribute(positions, vi + 1).applyMatrix4(rotMatrix);
    c.fromBufferAttribute(positions, vi + 2).applyMatrix4(rotMatrix);

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    normal.crossVectors(ab, ac);
    const dblArea = normal.length();
    if (!dblArea) continue;

    const area = dblArea * 0.5;
    totalArea += area;
    analyzed++;

    normal.normalize();
    const cz = (a.z + b.z + c.z) / 3;
    if (normal.z < SUPPORT_ANGLE_NORMAL_Z && cz > minBaseClearance) {
      riskyCount++;
      riskyArea += area;
    }
  }

  return {
    overhangPercent: analyzed ? Math.round((riskyCount / analyzed) * 100) : 0,
    riskyAreaPercent: totalArea ? Math.round((riskyArea / totalArea) * 100) : 0,
  };
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
    const sampleStep = triangleCount > MAX_ANALYZED_TRIANGLES ? Math.ceil(triangleCount / MAX_ANALYZED_TRIANGLES) : 1;

    // Analyze all orientations
    const orientationResults = ORIENTATIONS.map((o) => {
      const result = analyzeOrientation(positions, triangleCount, sampleStep, o.rx, o.ry);
      return { ...o, ...result, needsSupports: result.riskyAreaPercent >= SUPPORT_AREA_THRESHOLD };
    });

    // Current orientation = first one
    const current = orientationResults[0];
    const bestOrientation = orientationResults.reduce((best, o) => o.riskyAreaPercent < best.riskyAreaPercent ? o : best, orientationResults[0]);

    // Build orientation tips
    const orientations: OrientationTip[] = orientationResults.map((o) => ({
      label: o.label,
      description: o.description,
      overhangPercent: o.overhangPercent,
      riskyAreaPercent: o.riskyAreaPercent,
      needsSupports: o.needsSupports,
      isBest: o === bestOrientation,
    }));

    normalizedGeometry.dispose();

    const tall = height > 80;
    const thin = Math.min(parseFloat(bbox.x), parseFloat(bbox.y)) < 8;
    const complex = triangleCount > 50000;

    const hints = buildHints({
      bbox, complex,
      needsSupports: current.needsSupports,
      overhangPercent: current.overhangPercent,
      riskyAreaPercent: current.riskyAreaPercent,
      tall, thin,
    });

    // Add orientation hint if rotating helps
    if (current.needsSupports && !bestOrientation.needsSupports) {
      hints.unshift(`🔄 Попробуй «${bestOrientation.label}» — нависания снизятся с ${current.riskyAreaPercent}% до ${bestOrientation.riskyAreaPercent}%, поддержки не понадобятся`);
    } else if (current.needsSupports && bestOrientation.riskyAreaPercent < current.riskyAreaPercent) {
      hints.unshift(`🔄 Попробуй «${bestOrientation.label}» — нависания снизятся с ${current.riskyAreaPercent}% до ${bestOrientation.riskyAreaPercent}%`);
    }

    return {
      geometry,
      info: {
        name, size,
        triangles: triangleCount,
        bbox, hints, tall, thin, complex,
        needsSupports: current.needsSupports,
        overhangPercent: current.overhangPercent,
        orientations,
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
    name, size, triangles: 0, bbox: null, hints: [hint],
    tall: false, thin: false, complex: false, needsSupports: false, overhangPercent: 0,
    orientations: [],
  };
}

export function createNonStlInfo(name: string, size: number, extension: string): StlInfo {
  return {
    name, size, triangles: 0, bbox: null,
    hints: [`Файл ${extension.toUpperCase()} загружен. Геоанализ и 3D-превью сейчас доступны для STL.`],
    tall: false, thin: false, complex: false, needsSupports: false, overhangPercent: 0,
    orientations: [],
  };
}