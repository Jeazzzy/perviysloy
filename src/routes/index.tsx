import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useRef } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Results } from "@/components/Results";
import { Tips } from "@/components/Tips";
import { HowItWorks } from "@/components/HowItWorks";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ProblemsModal } from "@/components/ProblemsModal";
import { PRESETS, PRINTERS, PNAMES, SNAMES, type StlInfo } from "@/data/calculator-data";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ПервыйСлой — Калькулятор 3D-печати" },
      { name: "description", content: "Выбери принтер, загрузи STL-модель, выбери пластик — получи точные параметры и объяснения без жаргона." },
    ],
  }),
});

function Index() {
  const [modalOpen, setModalOpen] = useState(false);
  const [printer, setPrinter] = useState<string | null>(null);
  const [slicer, setSlicer] = useState<string | null>(null);
  const [filament, setFilament] = useState<string | null>(null);
  const [stlInfo, setStlInfo] = useState<StlInfo | null>(null);
  const [resultsVisible, setResultsVisible] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [stlNotes, setStlNotes] = useState<string[]>([]);
  const [params, setParams] = useState<Array<{ label: string; value: number | string; unit: string; hint: string; adjusted: boolean }>>([]);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleCalculate = useCallback(() => {
    if (!printer || !slicer || !filament) return;
    const fil = PRESETS[filament];
    const pm = PRINTERS[printer];
    let sMod = 1, fMod = 1, fanMod = 1;
    const notes: string[] = [];
    if (stlInfo) {
      if (stlInfo.tall) { sMod = 0.9; notes.push('скорость −10% (деталь выше 80 мм)'); }
      if (stlInfo.thin) { fMod = 1.02; notes.push('поток +2% (тонкие стенки)'); }
      if (stlInfo.complex) { fanMod = 1.2; notes.push('охлаждение +20% (сложная геометрия/нависания)'); }
    }
    const speed = Math.round(pm.speed * sMod);
    const flow = Math.round(fil.flow * fMod);
    const fan = Math.min(100, Math.round(fil.fan * fanMod));

    let sub = `${PNAMES[printer]} · ${SNAMES[slicer]} · ${filament}`;
    if (stlInfo) sub += ` · ${stlInfo.name}`;
    setSubtitle(sub);
    setStlNotes(notes);

    setParams([
      { label: 'Высота слоя', value: pm.layer, unit: 'мм', hint: 'Больше слой — быстрее, но хуже качество. 0.2 мм — оптимально для начала.', adjusted: false },
      { label: 'Скорость печати', value: speed, unit: 'мм/с', hint: 'Увеличение скорости снижает качество. Первый слой — всегда медленнее.', adjusted: !!(stlInfo?.tall) },
      { label: 'Температура сопла', value: fil.nozzle, unit: '°C', hint: fil.tips.nozzle, adjusted: false },
      { label: 'Температура стола', value: fil.bed, unit: '°C', hint: fil.tips.bed, adjusted: false },
      { label: 'Поток (Flow)', value: flow, unit: '%', hint: fil.tips.flow, adjusted: !!(stlInfo?.thin) },
      { label: 'Ретракция', value: fil.retract, unit: 'мм', hint: fil.tips.retract, adjusted: false },
      { label: 'Охлаждение', value: fan, unit: '%', hint: fil.tips.fan, adjusted: !!(stlInfo?.complex) },
      { label: 'Скорость 1-го слоя', value: pm.fs, unit: 'мм/с', hint: 'Первый слой — всегда медленнее. Залог адгезии всей печати.', adjusted: false },
    ]);

    setResultsVisible(true);
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  }, [printer, slicer, filament, stlInfo]);

  return (
    <>
      <Header onOpenProblems={() => setModalOpen(true)} />
      <Hero />
      <Calculator
        printer={printer}
        slicer={slicer}
        filament={filament}
        stlInfo={stlInfo}
        onSelectPrinter={setPrinter}
        onSelectSlicer={setSlicer}
        onSelectFilament={setFilament}
        onStlLoaded={setStlInfo}
        onCalculate={handleCalculate}
      />
      <Results visible={resultsVisible} subtitle={subtitle} stlNotes={stlNotes} params={params} />
      <Tips />
      <HowItWorks />
      <Contact />
      <Footer />
      <ProblemsModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
