import { useRef, useState, useCallback } from 'react';
import { analyzeStlFile, createNonStlInfo, type StlInfo } from '@/lib/model-analysis';
import * as THREE from 'three';
import { ModelViewer } from './ModelViewer';

const ACCEPTED_EXTENSIONS = ['.stl', '.3mf', '.obj', '.amf'];

function getExtension(name: string): string {
  return name.slice(name.lastIndexOf('.')).toLowerCase();
}

interface StlUploadProps {
  onStlLoaded: (info: StlInfo) => void;
  stlInfo: StlInfo | null;
}

export function StlUpload({ onStlLoaded, stlInfo }: StlUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  const handleFile = useCallback((file: File) => {
    const ext = getExtension(file.name);
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      setError(`Формат «${ext}» не поддерживается. Допустимые: ${ACCEPTED_EXTENSIONS.join(', ')}`);
      setGeometry(null);
      return;
    }
    setError(null);

    const r = new FileReader();
    r.onload = (ev) => {
      if (ev.target?.result instanceof ArrayBuffer) {
        if (ext === '.stl') {
          const { geometry: parsedGeometry, info } = analyzeStlFile(ev.target.result, file.name, file.size);
          onStlLoaded(info);
          setGeometry(parsedGeometry);
        } else {
          onStlLoaded(createNonStlInfo(file.name, file.size, ext));
          setGeometry(null);
        }
      }
    };
    r.readAsArrayBuffer(file);
  }, [onStlLoaded]);

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
        }}
        className={`border-[1.5px] border-dashed rounded-[10px] p-8 text-center cursor-pointer transition-all my-8 ${
          dragging ? 'border-green bg-green-glow' : 'border-green/20 hover:border-green hover:bg-green-glow'
        }`}
      >
        <input ref={inputRef} type="file" accept=".stl,.3mf,.obj,.amf" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <span className="text-3xl block mb-3 opacity-50">📦</span>
        <div className="font-mono text-[0.8rem] text-text3">
          Нажми или перетащи <span className="text-green">3D-файл</span>
        </div>
        <div className="text-[0.68rem] text-text3 mt-1 font-mono">STL · 3MF · OBJ · AMF · до 100 МБ</div>
      </div>

      {error && (
        <div className="bg-red-glow border border-red/30 rounded-lg px-4 py-3 mt-2 font-mono text-[0.78rem] text-red">
          ⚠️ {error}
        </div>
      )}

      {stlInfo && (
        <div className="bg-surface3 border border-green/20 rounded-lg px-5 py-4 mt-4 font-mono text-[0.78rem]">
          <div className="text-green font-bold mb-1">📦 {stlInfo.name}</div>
          <div className="text-text3 flex gap-6 flex-wrap mb-2">
            <span>{stlInfo.triangles.toLocaleString('ru')} треугольников</span>
            <span>{(stlInfo.size / 1024).toFixed(0)} КБ</span>
            {stlInfo.bbox && <span>{stlInfo.bbox.x} × {stlInfo.bbox.y} × {stlInfo.bbox.z} мм</span>}
          </div>
          {stlInfo.bbox && (
            <div className={`rounded-md px-3 py-2 mb-2 text-[0.72rem] border ${
              stlInfo.needsSupports
                ? 'bg-[hsl(var(--red)/0.1)] border-red/30 text-red'
                : 'bg-green-glow border-green/30 text-green'
            }`}>
              {stlInfo.needsSupports
                ? `⚠️ Рекомендуются поддержки — обнаружено около ${stlInfo.overhangPercent}% рисковых граней выше основания`
                : `✅ Поддержки, скорее всего, не нужны — критичных нависаний почти нет (${stlInfo.overhangPercent}%)`}
            </div>
          )}
          <div className="text-purple text-[0.72rem] leading-7">
            {stlInfo.hints.map((h, i) => <div key={i}>→ {h}</div>)}
          </div>
        </div>
      )}

      <ModelViewer geometry={geometry} />
    </div>
  );
}
