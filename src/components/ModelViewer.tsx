import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const SUPPORT_ANGLE_NORMAL_Z = -0.75;
const SUPPORT_CLEARANCE_MM = 3;
const SUPPORT_CLEARANCE_RATIO = 0.35;

const COLOR_OK = new THREE.Color(0x00e070);
const COLOR_RISKY = new THREE.Color(0xff3333);

interface ModelViewerProps {
  geometry: THREE.BufferGeometry | null;
}

function buildOverhangColors(geometry: THREE.BufferGeometry): Float32Array {
  const nonIndexed = geometry.index ? geometry.toNonIndexed() : geometry;
  const positions = nonIndexed.getAttribute('position');
  const count = positions.count;
  const triCount = Math.floor(count / 3);

  // Find bounding box Z
  let minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < count; i++) {
    const z = positions.getZ(i);
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  const height = maxZ - minZ;
  const minBase = minZ + Math.max(SUPPORT_CLEARANCE_MM, height * SUPPORT_CLEARANCE_RATIO);

  const colors = new Float32Array(count * 3);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), normal = new THREE.Vector3();

  for (let fi = 0; fi < triCount; fi++) {
    const vi = fi * 3;
    a.fromBufferAttribute(positions, vi);
    b.fromBufferAttribute(positions, vi + 1);
    c.fromBufferAttribute(positions, vi + 2);

    ab.subVectors(b, a);
    ac.subVectors(c, a);
    normal.crossVectors(ab, ac);
    const len = normal.length();

    let isRisky = false;
    if (len > 0) {
      normal.normalize();
      const cz = (a.z + b.z + c.z) / 3;
      isRisky = normal.z < SUPPORT_ANGLE_NORMAL_Z && cz > minBase;
    }

    const col = isRisky ? COLOR_RISKY : COLOR_OK;
    for (let j = 0; j < 3; j++) {
      colors[(vi + j) * 3] = col.r;
      colors[(vi + j) * 3 + 1] = col.g;
      colors[(vi + j) * 3 + 2] = col.b;
    }
  }

  return colors;
}

export function ModelViewer({ geometry }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ renderer: THREE.WebGLRenderer; animId: number } | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const colorsRef = useRef<Float32Array | null>(null);
  const [showOverhangs, setShowOverhangs] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !geometry) return;

    if (sceneRef.current) {
      cancelAnimationFrame(sceneRef.current.animId);
      sceneRef.current.renderer.dispose();
      container.innerHTML = '';
    }

    const w = container.clientWidth;
    const h = 320;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Use non-indexed for per-face coloring
    const displayGeom = geometry.index ? geometry.toNonIndexed() : geometry.clone();
    displayGeom.computeVertexNormals();

    // Build overhang colors
    const overhangColors = buildOverhangColors(displayGeom);
    colorsRef.current = overhangColors;

    // Apply colors
    displayGeom.setAttribute('color', new THREE.BufferAttribute(overhangColors, 3));

    const material = new THREE.MeshStandardMaterial({
      vertexColors: true,
      metalness: 0.1,
      roughness: 0.6,
    });
    const mesh = new THREE.Mesh(displayGeom, material);
    meshRef.current = mesh;

    displayGeom.computeBoundingBox();
    const box = displayGeom.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 100 / maxDim;
    mesh.scale.setScalar(scale);

    scene.add(mesh);

    const grid = new THREE.GridHelper(200, 20, 0x333333, 0x222222);
    grid.position.y = -(size.y / 2) * scale;
    scene.add(grid);

    camera.position.set(120, 80, 120);
    camera.lookAt(0, 0, 0);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
    sceneRef.current = { renderer, animId };

    const onResize = () => {
      const newW = container.clientWidth;
      camera.aspect = newW / h;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      displayGeom.dispose();
      material.dispose();
      container.innerHTML = '';
      sceneRef.current = null;
      meshRef.current = null;
      colorsRef.current = null;
    };
  }, [geometry]);

  // Toggle overhang coloring
  useEffect(() => {
    const mesh = meshRef.current;
    const overhangColors = colorsRef.current;
    if (!mesh || !overhangColors) return;

    const geom = mesh.geometry;
    const colorAttr = geom.getAttribute('color');
    if (!colorAttr) return;

    const arr = colorAttr.array as Float32Array;
    const vertCount = arr.length / 3;

    if (showOverhangs) {
      arr.set(overhangColors);
    } else {
      for (let i = 0; i < vertCount; i++) {
        arr[i * 3] = COLOR_OK.r;
        arr[i * 3 + 1] = COLOR_OK.g;
        arr[i * 3 + 2] = COLOR_OK.b;
      }
    }
    colorAttr.needsUpdate = true;
  }, [showOverhangs]);

  if (!geometry) return null;

  return (
    <div className="mt-4 border border-green/20 rounded-[10px] overflow-hidden">
      <div className="bg-surface3 px-4 py-2 font-mono text-[0.7rem] text-text3 flex items-center justify-between">
        <span>🎮 3D-превью — крути мышкой</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOverhangs(!showOverhangs)}
            className={`font-mono text-[0.65rem] px-2 py-0.5 rounded border transition-colors ${
              showOverhangs
                ? 'border-red/40 bg-red/10 text-red'
                : 'border-border bg-surface2 text-text3 hover:border-green'
            }`}
          >
            {showOverhangs ? '🔴 Нависания' : '○ Нависания'}
          </button>
          <span className="text-green text-[0.65rem]">Orbit · Zoom · Pan</span>
        </div>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 320 }} />
    </div>
  );
}
