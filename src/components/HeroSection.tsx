import React from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
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
      {/* Foto do cliente / médica com efeito suave de aparição */}
      <motion.img
        initial={{ opacity: 0, scale: 1.06 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        src={safePhoto}
        alt="Clínica Mara Mendes"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* Camada com filtro meio escuro para dar o efeito cinematográfico */}
      <div className="absolute inset-0 bg-black/45 pointer-events-none" />

      {/* Monograma / Nome da clínica discreto no topo com efeito de fade in */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        className="absolute top-6 left-0 right-0 z-10 flex justify-center pointer-events-none"
      >
        <div className="px-3.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-center">
          <span className="font-serif text-[13px] tracking-widest text-[#F4E3A1] uppercase font-light">
            Clínica Mara Mendes
          </span>
        </div>
      </motion.div>

      {/* Único botãozinho: Fale Conosco -> direciona para o WhatsApp com animação de aparição */}
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 px-4 w-full flex justify-center"
      >
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-xs sm:text-sm font-semibold text-stone-950 bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] hover:from-[#FFF1BC] hover:to-[#DBAE36] shadow-xl shadow-black/40 active:scale-95 transition-all duration-200 group"
        >
          <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
          </div>
          <span className="tracking-wide">{ctaText || "Fale Conosco"}</span>
        </a>
      </motion.div>
    </section>
  );
};
