import { useRef, useState, useCallback } from 'react';
import { type StlInfo, parseSTL } from '@/data/calculator-data';

interface StlUploadProps {
  onStlLoaded: (info: StlInfo) => void;
  stlInfo: StlInfo | null;
}

export function StlUpload({ onStlLoaded, stlInfo }: StlUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    const r = new FileReader();
    r.onload = (ev) => {
      if (ev.target?.result instanceof ArrayBuffer) {
        const info = parseSTL(ev.target.result, file.name, file.size);
        onStlLoaded(info);
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
        <input ref={inputRef} type="file" accept=".stl" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
        <span className="text-3xl block mb-3 opacity-50">📦</span>
        <div className="font-mono text-[0.8rem] text-text3">
          Нажми или перетащи <span className="text-green">.STL файл</span>
        </div>
        <div className="text-[0.68rem] text-text3 mt-1 font-mono">Бинарный и ASCII STL · до 100 МБ</div>
      </div>

      {stlInfo && (
        <div className="bg-surface3 border border-green/20 rounded-lg px-5 py-4 mt-4 font-mono text-[0.78rem]">
          <div className="text-green font-bold mb-1">📦 {stlInfo.name}</div>
          <div className="text-text3 flex gap-6 flex-wrap mb-2">
            <span>{stlInfo.triangles.toLocaleString('ru')} треугольников</span>
            <span>{(stlInfo.size / 1024).toFixed(0)} КБ</span>
            {stlInfo.bbox && <span>{stlInfo.bbox.x} × {stlInfo.bbox.y} × {stlInfo.bbox.z} мм</span>}
          </div>
          <div className="text-purple text-[0.72rem] leading-7">
            {stlInfo.hints.map((h, i) => <div key={i}>→ {h}</div>)}
          </div>
        </div>
      )}
    </div>
  );
}
