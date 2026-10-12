import React from "react";
import { MessageCircle } from "lucide-react";
import { createWhatsAppLink, INITIAL_CLINIC_DATA } from "../data/initialClinicData";

interface HeroSectionProps {
  photoUrl?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  ctaText?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  photoUrl,
  whatsappNumber,
  whatsappMessage,
  ctaText = "Fale Conosco",
}) => {
  const safePhoto = photoUrl || INITIAL_CLINIC_DATA.hero.photo;
  const waLink = createWhatsAppLink(whatsappNumber, whatsappMessage);

  return (
    <section
      id="inicio"
      className="relative w-full h-[100dvh] min-h-[100dvh] flex items-end justify-center pb-14 sm:pb-16 overflow-hidden bg-stone-950"
    >
      {/* Foto do cliente / médico */}
      <img
        src={safePhoto}
        alt="Foto principal"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* Camada com filtro meio escuro para dar o efeito cinematográfico */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Único botãozinho: Fale Conosco -> direciona para o WhatsApp */}
      <div className="relative z-10 px-4 w-full flex justify-center">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-stone-950 bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] hover:from-[#FFF1BC] hover:to-[#DBAE36] shadow-xl shadow-black/40 active:scale-95 transition-all duration-200"
        >
          <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </div>
          <span>{ctaText || "Fale Conosco"}</span>
        </a>
      </div>
    </section>
  );
};
