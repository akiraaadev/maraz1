import React, { useState } from "react";
import { Sparkles, Maximize2, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ClinicPhoto, INITIAL_CLINIC_DATA } from "../data/initialClinicData";

interface ClinicGallerySectionProps {
  photos?: ClinicPhoto[];
}

export const ClinicGallerySection: React.FC<ClinicGallerySectionProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<ClinicPhoto | null>(null);
  const safePhotos = (Array.isArray(photos) && photos.length > 0) ? photos : INITIAL_CLINIC_DATA.clinicPhotos;

  return (
    <section id="clinica" className="w-full py-16 sm:py-24 px-4 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-xl mx-auto">
        {/* Section Header com efeito de aparição */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] mb-2.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#855E1C]">
              Ambiente & Conforto
            </span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mb-2">
            Fotos da Clínica
          </h2>

          <p className="text-stone-600 text-xs sm:text-[13px] max-w-sm mx-auto leading-relaxed">
            Instalações planejadas para oferecer a máxima privacidade, acolhimento relaxante e tecnologia de padrão internacional.
          </p>
        </motion.div>

        {/* Photos Grid com efeito suave de aparição das fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {safePhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 24, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, delay: index * 0.12, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => setSelectedPhoto(photo)}
              className={`group relative rounded-2xl overflow-hidden border border-[#E6DFD5] bg-white shadow-xs hover:shadow-md transition-all cursor-pointer ${
                index === 0 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[4/3]"
              }`}
            >
              <img
                src={photo.image}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Gradient Scrim & Hover info */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent opacity-80 sm:opacity-70 group-hover:opacity-90 transition-opacity flex flex-col justify-end p-3.5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[9px] font-semibold tracking-wider uppercase text-[#F3E5AB]">
                      {photo.category}
                    </span>
                    <h3 className="font-serif text-sm sm:text-base font-medium leading-tight">
                      {photo.title}
                    </h3>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 ml-2 group-hover:bg-[#D4AF37] group-hover:text-stone-950 transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal com AnimatePresence */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors border border-white/20"
                aria-label="Fechar ampliação"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-full aspect-[4/3] sm:aspect-[16/10] bg-black">
                <img
                  src={selectedPhoto.image}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="p-4 bg-stone-950 text-white border-t border-white/10">
                <span className="text-[10px] font-medium tracking-wider uppercase text-[#D4AF37]">
                  {selectedPhoto.category}
                </span>
                <h3 className="font-serif text-base sm:text-lg font-medium mt-0.5">
                  {selectedPhoto.title}
                </h3>
                {selectedPhoto.description && (
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">
                    {selectedPhoto.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
