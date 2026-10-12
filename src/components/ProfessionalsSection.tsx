import React from "react";
import { ShieldCheck, Award, MessageCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Professional, INITIAL_CLINIC_DATA, createWhatsAppLink } from "../data/initialClinicData";

interface ProfessionalsSectionProps {
  professionals?: Professional[];
  whatsappNumber?: string;
}

export const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({
  professionals,
  whatsappNumber,
}) => {
  // Garantir que apenas a Dra. Mara Mendes (ou a profissional única cadastrada) seja exibida
  const safeProfessional =
    (Array.isArray(professionals) && professionals.length > 0)
      ? professionals[0]
      : INITIAL_CLINIC_DATA.professionals[0];

  const waProfLink = createWhatsAppLink(
    whatsappNumber,
    `Olá! Gostaria de agendar uma consulta exclusiva com a ${safeProfessional.name} (${safeProfessional.role}) na Clínica Mara Mendes.`
  );

  return (
    <section id="profissionais" className="w-full py-16 sm:py-24 px-4 bg-[#FAF9F6] relative overflow-hidden">
      {/* Luz ambiente dourada de fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Cabeçalho da Seção com animação de entrada */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E6DFD5] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B]" />
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#855E1C]">
              Diretora & Responsável Técnica
            </span>
          </div>

          {/* Efeito refinado nas letras do título */}
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal tracking-tight mb-2">
            Conheça a Especialista
          </h2>

          <p className="text-stone-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
            Atendimento exclusivo, precisão médica e protocolos desenvolvidos sob medida para realçar a sua beleza natural.
          </p>
        </motion.div>

        {/* Card Principal: Foto da profissional de um lado e informações do outro lado */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#E6DFD5] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          {/* Brilho dourado sutil no canto do card */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#D4AF37]/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start">
            {/* LADO 1: FOTO DA PROFISSIONAL COM EFEITO DE APARECIMENTO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-44 sm:w-56 md:w-64 aspect-[3/4] shrink-0 rounded-2xl overflow-hidden border-2 border-[#D4AF37]/60 shadow-xl group"
            >
              <img
                src={safeProfessional.photo}
                alt={safeProfessional.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none"
              />

            </motion.div>

            {/* LADO 2: INFORMAÇÕES DA PROFISSIONAL COM EFEITO NAS LETRAS E TEXTOS */}
            <div className="flex-1 flex flex-col justify-between w-full text-center sm:text-left">
              <div>
                {/* Função / Role com fade in */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="inline-block text-[11px] font-semibold uppercase tracking-widest text-[#B8860B] mb-1"
                >
                  {safeProfessional.role}
                </motion.div>

                {/* Efeito nas letras e título do Nome */}
                <motion.h3
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="font-serif text-2xl sm:text-3xl text-stone-900 font-medium leading-tight"
                >
                  {safeProfessional.name}
                </motion.h3>

                {/* Linha dourada decorativa que se expande */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="h-0.5 w-16 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] my-2.5 mx-auto sm:mx-0 origin-left rounded-full"
                />

                {/* CRM / Registro profissional */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#FAF9F6] border border-[#E8DFD3] text-[11px] font-mono text-stone-800 shadow-2xs mb-2.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#B8860B]" />
                  <span className="font-semibold text-stone-900">{safeProfessional.crm}</span>
                </motion.div>

                {/* Especialidade Principal */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-xs sm:text-[13px] font-medium text-stone-800 leading-snug mb-3"
                >
                  {safeProfessional.specialty}
                </motion.p>

                {/* Biografia detalhada com efeito de aparição suave */}
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.45 }}
                  className="text-xs sm:text-[13px] text-stone-600 leading-relaxed font-light mb-4 text-justify sm:text-left"
                >
                  {safeProfessional.bio}
                </motion.p>

                {/* Pilares de Excelência */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-700 pt-1 mb-5"
                >
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>Protocolos Personalizados</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>Naturalidade sem Exageros</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>Tecnologia de Alta Precisão</span>
                  </div>
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                    <span>Segurança & Máxima Discrição</span>
                  </div>
                </motion.div>
              </div>

              {/* Botão de Agendamento Direto com a Dra. Mara Mendes */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="pt-2"
              >
                <a
                  href={waProfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-3 text-xs sm:text-[13px] font-semibold rounded-xl bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] hover:from-[#FFF1BC] hover:to-[#DBAE36] text-stone-950 shadow-md shadow-[#D4AF37]/20 transition-all active:scale-95"
                >
                  <div className="w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <MessageCircle className="w-3 h-3 fill-white" />
                  </div>
                  <span>Agendar Consulta com a Dra. Mara Mendes</span>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
