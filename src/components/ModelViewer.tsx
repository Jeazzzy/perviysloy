import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ModelViewerProps {
  geometry: THREE.BufferGeometry | null;
}

export function ModelViewer({ geometry }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ renderer: THREE.WebGLRenderer; animId: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !geometry) return;

    // Cleanup previous
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

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // Mesh
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({ color: 0x00e070, metalness: 0.1, roughness: 0.6 });
    const mesh = new THREE.Mesh(geometry, material);

    // Center and scale
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const center = new THREE.Vector3();
    box.getCenter(center);
    mesh.position.sub(center);

    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 100 / maxDim;
    mesh.scale.setScalar(scale);

    scene.add(mesh);

    // Grid
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
      container.innerHTML = '';
      sceneRef.current = null;
    };
  }, [geometry]);

  if (!geometry) return null;

  return (
    <div className="mt-4 border border-green/20 rounded-[10px] overflow-hidden">
      <div className="bg-surface3 px-4 py-2 font-mono text-[0.7rem] text-text3 flex items-center justify-between">
        <span>🎮 3D-превью — крути мышкой</span>
        <span className="text-green text-[0.65rem]">Orbit · Zoom · Pan</span>
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 320 }} />
    </div>
  );
}
