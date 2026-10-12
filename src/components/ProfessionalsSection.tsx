import React from "react";
import { Sparkles, ShieldCheck, Award, MessageCircle } from "lucide-react";
import { Professional, INITIAL_CLINIC_DATA, createWhatsAppLink } from "../data/initialClinicData";

interface ProfessionalsSectionProps {
  professionals?: Professional[];
  whatsappNumber?: string;
}

export const ProfessionalsSection: React.FC<ProfessionalsSectionProps> = ({
  professionals,
  whatsappNumber,
}) => {
  const safeProfessionals = (Array.isArray(professionals) && professionals.length > 0)
    ? professionals
    : INITIAL_CLINIC_DATA.professionals;

  return (
    <section id="profissionais" className="w-full py-16 sm:py-20 px-4 bg-white relative">
      <div className="max-w-xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF9F6] border border-[#E6DFD5] mb-2.5">
            <ShieldCheck className="w-3 h-3 text-[#B8860B]" />
            <span className="text-[10px] font-semibold tracking-wider uppercase text-[#855E1C]">
              Corpo Clínico Especializado
            </span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl text-stone-900 font-normal tracking-tight mb-1.5">
            Nossos Profissionais
          </h2>

          <p className="text-stone-600 text-xs sm:text-[13px] max-w-sm mx-auto leading-relaxed">
            Especialistas dedicados ao rigor técnico, constante atualização científica e atendimento humanizado.
          </p>
        </div>

        {/* List of Professionals */}
        <div className="space-y-4">
          {safeProfessionals.map((prof) => {
            const waProfLink = createWhatsAppLink(
              whatsappNumber,
              `Olá! Gostaria de agendar uma consulta presencial com ${prof.name} (${prof.role}).`
            );

            return (
              <div
                key={prof.id}
                className="bg-[#FAF9F6] rounded-2xl p-4 border border-[#E6DFD5] hover:border-[#D4AF37]/60 transition-all shadow-xs hover:shadow-sm group flex flex-col sm:flex-row gap-4 items-center sm:items-start"
              >
                {/* Doctor Portrait */}
                <div className="relative w-32 h-44 sm:w-36 sm:h-48 shrink-0 rounded-xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-sm">
                  <img
                    src={prof.photo}
                    alt={prof.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                  {/* Certified badge */}
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#B8860B] shadow-2xs">
                    <Award className="w-3 h-3" />
                  </div>
                </div>

                {/* Professional Info */}
                <div className="flex-1 flex flex-col justify-between text-center sm:text-left w-full">
                  <div>
                    {/* Role / Função */}
                    <div className="inline-block text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#B8860B] mb-0.5">
                      {prof.role}
                    </div>

                    {/* Name */}
                    <h3 className="font-serif text-lg sm:text-xl text-stone-900 font-medium leading-snug">
                      {prof.name}
                    </h3>

                    {/* CRM / RQE Box */}
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white border border-[#E8DFD3] text-[10px] font-mono text-stone-700">
                      <ShieldCheck className="w-3 h-3 text-[#B8860B]" />
                      <span className="font-semibold text-stone-900">{prof.crm}</span>
                    </div>

                    {/* Specialty description */}
                    <p className="text-[11px] font-medium text-stone-700 mt-1.5">
                      {prof.specialty}
                    </p>

                    {/* Bio */}
                    <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                      {prof.bio}
                    </p>
                  </div>

                  {/* Direct Contact for this doctor */}
                  <div className="mt-3 pt-2.5 border-t border-[#E8DFD3]/80">
                    <a
                      href={waProfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto px-3.5 py-1.5 text-[11px] font-semibold rounded-lg bg-white hover:bg-stone-50 border border-[#D4AF37] text-stone-900 shadow-2xs transition-all active:scale-95"
                    >
                      <MessageCircle className="w-3 h-3 text-[#25D366] fill-[#25D366]" />
                      <span>Agendar Consulta com {prof.name.split(" ")[0]} {prof.name.split(" ")[1]}</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
