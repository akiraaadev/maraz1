import React, { useState } from "react";
import { Sparkles, Maximize2, X } from "lucide-react";
import { ClinicPhoto, INITIAL_CLINIC_DATA } from "../data/initialClinicData";

interface ClinicGallerySectionProps {
  photos?: ClinicPhoto[];
}

export const ClinicGallerySection: React.FC<ClinicGallerySectionProps> = ({ photos }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<ClinicPhoto | null>(null);
  const safePhotos = (Array.isArray(photos) && photos.length > 0) ? photos : INITIAL_CLINIC_DATA.clinicPhotos;

  return (
    <section id="clinica" className="w-full py-16 sm:py-20 px-4 bg-[#FAF9F6] relative">
      <div className="max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white border border-[#E6DFD5] mb-2.5 shadow-2xs">
            <Sparkles className="w-3 h-3 text-[#B8860B]" />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#855E1C]">
              Ambiente & Conforto
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal tracking-tight mb-1.5">
            Fotos da Clínica
          </h2>

          <p className="text-stone-600 text-xs sm:text-[13px] max-w-sm mx-auto leading-relaxed">
            Instalações planejadas para oferecer a máxima privacidade, acolhimento relaxante e tecnologia de padrão internacional.
          </p>
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {safePhotos.map((photo, index) => (
            <div
              key={photo.id}
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

                  <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-stone-950 transition-colors">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Golden Hairline Border */}
              <div className="absolute inset-0 border border-[#D4AF37]/0 group-hover:border-[#D4AF37]/50 rounded-2xl pointer-events-none transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-stone-900 rounded-2xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl text-white"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
              aria-label="Fechar ampliação"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo */}
            <div className="aspect-[16/10] sm:aspect-video w-full bg-black overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Meta */}
            <div className="p-5 bg-gradient-to-t from-stone-950 to-stone-900">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                {selectedPhoto.category}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal mt-0.5">
                {selectedPhoto.title}
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm mt-2 leading-relaxed">
                {selectedPhoto.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
