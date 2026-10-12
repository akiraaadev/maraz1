import React, { useState, useRef, useCallback } from "react";
import { Sparkles, MoveHorizontal, Info, MessageCircle } from "lucide-react";
import { BeforeAfterCase, INITIAL_CLINIC_DATA, createWhatsAppLink } from "../data/initialClinicData";

interface BeforeAfterSectionProps {
  cases?: BeforeAfterCase[];
  whatsappNumber?: string;
}

export const BeforeAfterSection: React.FC<BeforeAfterSectionProps> = ({
  cases,
  whatsappNumber,
}) => {
  const safeCases = (Array.isArray(cases) && cases.length > 0) ? cases : INITIAL_CLINIC_DATA.beforeAfterCases;
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = safeCases[selectedCaseIndex] || safeCases[0] || INITIAL_CLINIC_DATA.beforeAfterCases[0];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clampedX = Math.max(0, Math.min(rect.width, x));
    const percentage = (clampedX / rect.width) * 100;
    setSliderPosition(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const waCaseLink = createWhatsAppLink(
    whatsappNumber,
    `Olá! Vi o resultado de "${currentCase?.title}" no site e gostaria de saber se é indicado para o meu caso.`
  );

  return (
    <section id="antes-e-depois" className="w-full py-16 sm:py-20 px-4 bg-[#FAF9F6] relative">
      <div className="max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E6DFD5] mb-2.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#855E1C]">
              Resultados Reais
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal tracking-tight mb-1.5">
            Antes e Depois
          </h2>

          <p className="text-stone-600 text-xs sm:text-[13px] max-w-sm mx-auto leading-relaxed">
            Arraste a linha dourada para o lado para comparar a transformação natural alcançada por nossos pacientes.
          </p>
        </div>

        {/* Case Switcher Tabs if multiple cases exist */}
        {safeCases.length > 1 && (
          <div className="flex items-center justify-center gap-2 mb-5 overflow-x-auto py-1 no-scrollbar">
            {safeCases.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedCaseIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-full transition-all whitespace-nowrap active:scale-95 ${
                  selectedCaseIndex === idx
                    ? "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white shadow-sm shadow-[#D4AF37]/20"
                    : "bg-white text-stone-600 border border-[#E6DFD5] hover:border-[#D4AF37]/50"
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Comparison Card */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-[#E6DFD5] shadow-lg shadow-stone-900/5">
          <div
            ref={containerRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden cursor-ew-resize select-none touch-none bg-stone-100"
          >
            {/* After Image (Full background) */}
            <img
              src={currentCase.afterImage}
              alt={`${currentCase.title} - Depois`}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Before Image (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden select-none pointer-events-none"
              style={{ width: `${sliderPosition}%` }}
            >
              <img
                src={currentCase.beforeImage}
                alt={`${currentCase.title} - Antes`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-cover max-w-none select-none pointer-events-none"
                style={{
                  width: containerRef.current
                    ? `${containerRef.current.clientWidth}px`
                    : "100%",
                  height: "100%",
                }}
              />
            </div>

            {/* Floating Badges */}
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/65 backdrop-blur-sm text-[10px] font-semibold text-white tracking-wider uppercase pointer-events-none border border-white/10">
              Antes
            </div>
            <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-[#D4AF37]/90 backdrop-blur-sm text-[10px] font-semibold text-stone-950 tracking-wider uppercase pointer-events-none border border-[#FFF1BC]/40 shadow">
              Depois
            </div>

            {/* Draggable Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFF1BC] via-[#D4AF37] to-[#B8860B] shadow-[0_0_10px_rgba(212,175,55,0.8)] pointer-events-none"
              style={{ left: `calc(${sliderPosition}% - 2px)` }}
            >
              {/* Center Handle Button */}
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-8 h-8 rounded-full bg-stone-950 border-2 border-[#D4AF37] shadow-xl flex items-center justify-center text-[#D4AF37]">
                <MoveHorizontal className="w-4 h-4 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Procedure Details */}
          <div className="mt-3 px-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-semibold text-[#B8860B] uppercase tracking-wider">
                {currentCase.procedure}
              </span>
              <span className="text-[10px] text-stone-400">
                {currentCase.sessions}
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed mb-3">
              {currentCase.description}
            </p>

            {/* Call to Action for this procedure */}
            <a
              href={waCaseLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#D4AF37] to-[#B8860B] hover:opacity-95 shadow-xs shadow-[#D4AF37]/20 active:scale-[0.99] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Consultar Indicação para o Meu Rosto</span>
            </a>
          </div>
        </div>

        {/* Regulatory disclaimer */}
        <div className="mt-3 flex items-start gap-1.5 px-1 text-[10px] text-stone-400 leading-normal">
          <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Fotografias autorizadas para fins informativos e científicos. Os resultados variam conforme anatomia, biotipo e estilo de vida de cada indivíduo.
          </span>
        </div>
      </div>
    </section>
  );
};
