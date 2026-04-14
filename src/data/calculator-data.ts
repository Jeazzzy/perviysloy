export interface FilamentPreset {
  nozzle: number;
  bed: number;
  flow: number;
  retract: number;
  fan: number;
  tips: Record<string, string>;
}

export const PRESETS: Record<string, FilamentPreset> = {
  PLA: {
    nozzle: 215, bed: 60, flow: 100, retract: 6, fan: 100,
    tips: {
      nozzle: 'PLA плавится при 200–220°C. Выше — стрининг.',
      bed: '60°C — оптимум для PLA. Можно и без подогрева.',
      flow: '100% — стандарт для большинства PLA.',
      retract: '6 мм для боудена. Директ — 1–2 мм.',
      fan: '100% охлаждение для мостов и свесов.'
    }
  },
  ABS: {
    nozzle: 240, bed: 100, flow: 98, retract: 5, fan: 20,
    tips: {
      nozzle: 'ABS 230–250°C. Нужна вентиляция в помещении.',
      bed: 'Без 100°C+ ABS будет коробиться.',
      flow: '98% снижает деформацию при усадке.',
      retract: 'Меньше ретракта — ABS чувствителен.',
      fan: 'Минимальный обдув, иначе расслоение.'
    }
  },
  PETG: {
    nozzle: 230, bed: 75, flow: 95, retract: 4, fan: 50,
    tips: {
      nozzle: 'PETG 225–235°C. Очень чувствителен к влаге.',
      bed: '70–85°C на PEI-пластине.',
      flow: '95% снижает характерные «волосы» PETG.',
      retract: '4 мм — PETG тянется больше PLA.',
      fan: '50% — баланс адгезии и охлаждения.'
    }
  },
  TPU: {
    nozzle: 225, bed: 50, flow: 95, retract: 2, fan: 50,
    tips: {
      nozzle: 'TPU 220–230°C. Медленно!',
      bed: '45–60°C.',
      flow: '95% или ниже — TPU легко передавить.',
      retract: 'Минимум — гибкий пластик застревает.',
      fan: '50% достаточно для TPU.'
    }
  }
};

export const PRINTERS: Record<string, { speed: number; layer: number; fs: number }> = {
  ender3: { speed: 50, layer: 0.2, fs: 20 },
  ender3pro: { speed: 55, layer: 0.2, fs: 22 },
  megax: { speed: 60, layer: 0.2, fs: 24 },
  prusa: { speed: 60, layer: 0.15, fs: 25 },
  other: { speed: 45, layer: 0.2, fs: 18 }
};

export const PNAMES: Record<string, string> = {
  ender3: 'Ender-3',
  ender3pro: 'Ender-3 Pro',
  megax: 'Anycubic Mega-X',
  prusa: 'Prusa i3 Mk3',
  other: 'Универсальный'
};

export const SNAMES: Record<string, string> = {
  cura: 'Cura',
  prusaslicer: 'PrusaSlicer',
  bambu: 'Bambu Studio',
  other: 'Другой слайсер'
};

export const PRINTER_OPTIONS = [
  { value: 'ender3', icon: '🖨️', name: 'Ender-3', sub: 'Creality · FDM' },
  { value: 'ender3pro', icon: '🖨️', name: 'Ender-3 Pro', sub: 'Creality · FDM' },
  { value: 'megax', icon: '🖨️', name: 'Anycubic Mega-X', sub: 'Anycubic · FDM' },
  { value: 'prusa', icon: '🖨️', name: 'Prusa i3 Mk3', sub: 'Prusa Research' },
  { value: 'other', icon: '⚙️', name: 'Другой принтер', sub: 'Общие настройки' },
];

export const SLICER_OPTIONS = [
  { value: 'cura', icon: '🔷', name: 'Cura', sub: 'Ultimaker · Бесплатно' },
  { value: 'prusaslicer', icon: '🟣', name: 'PrusaSlicer', sub: 'Prusa Research' },
  { value: 'bambu', icon: '🟢', name: 'Bambu Studio', sub: 'Bambu Lab' },
  { value: 'other', icon: '📦', name: 'Другой', sub: 'Общие рекомендации' },
];

export const FILAMENT_OPTIONS = [
  { value: 'PLA', color: '#00e070', name: 'PLA', sub: 'Простой · Новичкам' },
  { value: 'ABS', color: '#9b59b6', name: 'ABS', sub: 'Прочный · Сложнее' },
  { value: 'PETG', color: '#f39c12', name: 'PETG', sub: 'Гибкий · Средний' },
  { value: 'TPU', color: '#888', name: 'TPU', sub: 'Эластичный · Гибкий' },
];

export const FIXES: Record<string, { l: string; d: string; w: string }> = {
  underextrusion: { l: 'Поток', d: '+5%', w: 'Недостаточно пластика — увеличь поток и проверь натяжение экструдера.' },
  stringing: { l: 'Ретракция', d: '+1–2 мм', w: 'Стрининг — увеличь ретракцию и снизь температуру на 5°C.' },
  warping: { l: 'Темп. стола', d: '+10°C', w: 'Коробление — выше стол, добавь Brim, убери сквозняки.' },
  layershift: { l: 'Скорость', d: '−15%', w: 'Смещение — снизь скорость и ускорение, проверь ремни.' },
  overheating: { l: 'Охлаждение', d: '+20%', w: 'Перегрев — больше обдув, снизь скорость или температуру сопла.' },
  adhesion: { l: 'Зазор сопла', d: '−0.05 мм', w: 'Плохая адгезия — откалибруй стол, используй клей-карандаш.' },
  cracks: { l: 'Темп. сопла', d: '+5°C', w: 'Трещины — слои не склеиваются, повысь температуру или снизь скорость.' }
};

export const PROBLEM_CHIPS = [
  { key: 'underextrusion', label: 'Лысины / недоэкструзия' },
  { key: 'stringing', label: 'Паутинка / стрининг' },
  { key: 'warping', label: 'Коробление углов' },
  { key: 'layershift', label: 'Смещение слоёв' },
  { key: 'overheating', label: 'Перегрев / капли' },
  { key: 'adhesion', label: 'Плохая адгезия к столу' },
  { key: 'cracks', label: 'Трещины / расслоение' },
];

export const PROBLEMS = [
  {
    icon: '🕳️', name: 'Лысины / недоэкструзия', tag: 'Экструдер',
    desc: 'Деталь выходит с дырами, пропусками и «лысыми» участками. Пластик подаётся в недостаточном количестве.',
    fixes: ['Увеличь поток (Flow) на 3–5%', 'Проверь натяжение прижимного ролика экструдера', 'Убедись, что пластик не сломан внутри тефлоновой трубки', 'Повысь температуру сопла на 5°C', 'Снизь скорость печати на 10–15%']
  },
  {
    icon: '🕸️', name: 'Паутинка / стрининг', tag: 'Ретракция',
    desc: 'Между частями детали тянутся тонкие нити — «паутина». Пластик вытекает при перемещении сопла.',
    fixes: ['Увеличь ретракцию на 0.5–1 мм', 'Снизь температуру сопла на 3–5°C', 'Включи Combing Mode в Cura', 'Увеличь скорость перемещения (Travel Speed)', 'Просуши филамент — влажный пластик стрингует сильнее']
  },
  {
    icon: '🌊', name: 'Коробление углов', tag: 'Адгезия',
    desc: 'Углы и края детали отлипают от стола и загибаются вверх. Особенно характерно для ABS.',
    fixes: ['Повысь температуру стола на 5–10°C', 'Добавь Brim — 5–10 линий в слайсере', 'Закрой принтер от сквозняков', 'Нанеси клей-карандаш или лак на стол', 'Уменьши скорость первого слоя до 15–20 мм/с']
  },
  {
    icon: '📉', name: 'Смещение слоёв', tag: 'Механика',
    desc: 'Слои модели смещаются горизонтально. Деталь выходит перекошенной.',
    fixes: ['Снизь скорость и ускорение', 'Проверь натяжение ремней X и Y', 'Убедись в надёжной фиксации шкивов', 'Снизь Jerk в настройках принтера', 'Проверь, не перегреваются ли шаговые двигатели']
  },
  {
    icon: '💧', name: 'Перегрев / капли на поверхности', tag: 'Охлаждение',
    desc: 'На поверхности появляются капли, «прыщи», оплавленные участки. Пластик не успевает застывать.',
    fixes: ['Увеличь обдув детали до 80–100%', 'Снизь скорость на 10–20%', 'Снизь температуру сопла на 3–5°C', 'Добавь Minimum Layer Time в слайсере', 'Проверь чистоту вентилятора детали']
  },
  {
    icon: '🧊', name: 'Плохая адгезия к столу', tag: 'Адгезия',
    desc: 'Первый слой не прилипает, деталь съезжает в процессе печати.',
    fixes: ['Откалибруй стол — зазор 0.1–0.2 мм', 'Нанеси клей-карандаш или лак', 'Обезжирь поверхность спиртом', 'Снизь скорость первого слоя', 'Убедись что Bed Leveling активен']
  },
  {
    icon: '💔', name: 'Трещины / расслоение', tag: 'Температура',
    desc: 'Слои не склеиваются между собой, деталь расслаивается по горизонтали.',
    fixes: ['Повысь температуру сопла на 5°C', 'Снизь скорость на 15%', 'Уменьши высоту слоя — 0.15 вместо 0.2 мм', 'Убедись что пластик сухой', 'Проверь износ сопла на засорение']
  }
];

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

export function parseSTL(buf: ArrayBuffer, name: string, size: number): StlInfo {
  const bytes = new Uint8Array(buf);
  let triangles = 0;
  let isBin = false;

  if (bytes.length > 84) {
    const cnt = new DataView(buf).getUint32(80, true);
    if (80 + 4 + cnt * 50 === bytes.length) { triangles = cnt; isBin = true; }
  }
  if (!isBin) {
    const text = new TextDecoder().decode(bytes);
    const m = text.match(/facet\s+normal/gi);
    triangles = m ? m.length : 0;
  }

  let bbox: StlInfo['bbox'] = null;
  let overhangCount = 0;
  let needsSupports = false;

  if (isBin && triangles > 0) {
    const dv = new DataView(buf);
    let mnX = 1e9, mnY = 1e9, mnZ = 1e9, mxX = -1e9, mxY = -1e9, mxZ = -1e9;
    const lim = Math.min(triangles, 100000);
    for (let i = 0; i < lim; i++) {
      const base = 84 + i * 50;
      // Normal vector
      const nz = dv.getFloat32(base + 8, true);
      // Overhang: normal pointing downward (nz < -0.5 ≈ >60° overhang)
      if (nz < -0.5) overhangCount++;

      const vo = base + 12;
      for (let v = 0; v < 3; v++) {
        const x = dv.getFloat32(vo + v * 12, true);
        const y = dv.getFloat32(vo + v * 12 + 4, true);
        const z = dv.getFloat32(vo + v * 12 + 8, true);
        if (x < mnX) mnX = x; if (x > mxX) mxX = x;
        if (y < mnY) mnY = y; if (y > mxY) mxY = y;
        if (z < mnZ) mnZ = z; if (z > mxZ) mxZ = z;
      }
    }
    bbox = { x: (mxX - mnX).toFixed(1), y: (mxY - mnY).toFixed(1), z: (mxZ - mnZ).toFixed(1) };
    needsSupports = overhangCount / lim > 0.05;
  }

  const overhangPercent = triangles > 0 ? Math.round((overhangCount / Math.min(triangles, 100000)) * 100) : 0;
  const h = bbox ? parseFloat(bbox.z) : null;
  const thin = bbox ? Math.min(parseFloat(bbox.x), parseFloat(bbox.y)) < 8 : false;
  const tall = !!(h && h > 80);
  const complex = triangles > 50000;

  const hints: string[] = [];
  if (needsSupports) hints.push(`⚠️ Обнаружены нависания (${overhangPercent}% граней) → включи поддержки в слайсере`);
  if (tall) hints.push('Высокая деталь (>80 мм) → скорость −10%');
  if (thin) hints.push('Тонкие стенки (<8 мм) → поток +2%');
  if (complex) hints.push('Сложная геометрия → вероятны нависания, включи поддержки');
  if (overhangPercent > 20) hints.push('Много нависающих граней → используй Tree Supports для экономии пластика');
  if (bbox) {
    const vol = parseFloat(bbox.x) * parseFloat(bbox.y) * parseFloat(bbox.z);
    if (vol > 500000) hints.push('Крупная деталь → рассмотри разделение на части для надёжности');
  }
  if (!hints.length) hints.push('Геометрия простая — стандартные параметры подойдут');

  return { name, size, triangles, bbox, hints, tall, thin, complex, needsSupports, overhangPercent };
}
