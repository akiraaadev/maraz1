export interface Professional {
  id: string;
  name: string;
  role: string;
  crm: string;
  specialty: string;
  photo: string;
  bio: string;
}

export interface BeforeAfterCase {
  id: string;
  title: string;
  procedure: string;
  category: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  sessions: string;
}

export interface ClinicPhoto {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
}

export interface ClinicData {
  clinicName: string;
  tagline: string;
  whatsappNumber: string; // e.g. "5511999998888"
  whatsappMessage: string;
  hero: {
    doctorName: string;
    title: string;
    subtitle: string;
    photo: string;
    ctaText: string;
  };
  video: {
    title: string;
    subtitle: string;
    videoUrl: string;
    poster: string;
    caption: string;
  };
  beforeAfterCases: BeforeAfterCase[];
  professionals: Professional[];
  clinicPhotos: ClinicPhoto[];
  address: string;
  phone: string;
  openingHours: string;
}

export const INITIAL_CLINIC_DATA: ClinicData = {
  clinicName: "Clínica Aurum",
  tagline: "Medicina Estética & Alta Performance",
  whatsappNumber: "5511987654321",
  whatsappMessage: "Olá! Gostaria de agendar uma consulta e conhecer os tratamentos da Clínica Aurum.",
  hero: {
    doctorName: "Dra. Helena Siqueira",
    title: "A Harmonia Natural da Sua Melhor Versão",
    subtitle: "Medicina estética de excelência, protocolos personalizados e tecnologia de ponta para realçar sua beleza com sofisticação.",
    photo: "/src/assets/images/hero_doctor_portrait_1791836405527.jpg",
    ctaText: "Fale Conosco no WhatsApp",
  },
  video: {
    title: "Conheça a Experiência Aurum",
    subtitle: "Cuidado individualizado, ética médica e os mais modernos tratamentos do mundo.",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    poster: "/src/assets/images/vertical_story_doctor_1791839179127.jpg",
    caption: "Apresentação institucional de boas-vindas e tecnologia aplicada aos nossos pacientes.",
  },
  beforeAfterCases: [
    {
      id: "case-1",
      title: "Bioestímulo & Glow Rejuvenescedor",
      procedure: "Bioestimulador de Colágeno + Skinbooster",
      category: "Rejuvenescimento Facial",
      beforeImage: "/src/assets/images/before_facial_case_1791836466259.jpg",
      afterImage: "/src/assets/images/after_facial_case_1791836475666.jpg",
      description: "Recuperação do viço dérmico, atenuação de linhas finas e estímulo progressivo de colágeno biológico.",
      sessions: "3 sessões com intervalo de 30 dias",
    },
    {
      id: "case-2",
      title: "Harmonização Full Face Elegante",
      procedure: "Preenchimento com Ácido Hialurônico de Alta Densidade",
      category: "Harmonização Facial",
      beforeImage: "/src/assets/images/before_facial_case_1791836466259.jpg",
      afterImage: "/src/assets/images/after_facial_case_1791836475666.jpg",
      description: "Reestruturação do contorno malar e suporte de tecidos profundos sem aspecto artificial.",
      sessions: "Protocolo de dose fracionada",
    },
  ],
  professionals: [
    {
      id: "prof-1",
      name: "Dra. Helena Siqueira",
      role: "Diretora Médica & Dermatologista",
      crm: "CRM/SP 142.890 · RQE 78.432",
      specialty: "Dermatologia Clínica, Cirúrgica e Cosmiatria Avançada",
      photo: "/src/assets/images/hero_doctor_portrait_1791836405527.jpg",
      bio: "Graduada pela USP com especialização em Harvard, pioneira em protocolos de rejuvenescimento tridimensional.",
    },
    {
      id: "prof-2",
      name: "Dr. Elias Thorne",
      role: "Cirurgião Plástico & Contorno Facial",
      crm: "CRM/SP 128.450 · RQE 69.112",
      specialty: "Cirurgia Plástica Facial e Minilifting Endoscópico",
      photo: "/src/assets/images/doctor_surgeon_1791836484834.jpg",
      bio: "Membro Titular da Sociedade Brasileira de Cirurgia Plástica com mais de 14 anos dedicados à harmonia da face.",
    },
    {
      id: "prof-3",
      name: "Dra. Camila Prado",
      role: "Médica Especialista em Cosmiatria",
      crm: "CRM/SP 165.230 · RQE 82.901",
      specialty: "Bioestimuladores de Colágeno e Terapias Regenerativas",
      photo: "/src/assets/images/doctor_dermatologist_1791836434767.jpg",
      bio: "Foco exclusivo em naturalidade e longevidade celular através de bioativos e lasers de pulso ultracurto.",
    },
  ],
  clinicPhotos: [
    {
      id: "photo-1",
      title: "Recepção Central & Lounge",
      category: "Recepção",
      image: "/src/assets/images/clinic_luxury_reception_1791836415575.jpg",
      description: "Mármore nobre, acabamentos em latão dourado e acolhimento privativo desde a chegada.",
    },
    {
      id: "photo-2",
      title: "Suíte de Procedimentos VIP",
      category: "Consultórios",
      image: "/src/assets/images/clinic_procedure_suite_1791836425274.jpg",
      description: "Equipamentos médicos certificados, máxima assepsia e conforto acústico para seu tratamento.",
    },
    {
      id: "photo-3",
      title: "Lounge de Espera Exclusivo",
      category: "Áreas de Estar",
      image: "/src/assets/images/clinic_lounge_detail_1791836446986.jpg",
      description: "Ambiente reservado com painéis dourados, iluminação suave e menu de chás e cafés especiais.",
    },
  ],
  address: "Av. Brigadeiro Faria Lima, 3477 · 14º andar · Itaim Bibi, São Paulo - SP",
  phone: "(11) 98765-4321",
  openingHours: "Segunda a Sexta: 08h às 20h · Sábado: 09h às 15h",
};

const STORAGE_KEY = "aurum_clinic_site_data_v1";

export function loadClinicData(): ClinicData {
  if (typeof window === "undefined") return INITIAL_CLINIC_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...INITIAL_CLINIC_DATA, ...parsed };
    }
  } catch (err) {
    console.warn("Erro ao carregar dados locais da clínica:", err);
  }
  return INITIAL_CLINIC_DATA;
}

export function sanitizeClinicDataForStorage(data: ClinicData): ClinicData {
  const sanitized = JSON.parse(JSON.stringify(data)) as ClinicData;

  // Substitui URLs blob: temporárias pelas chaves fixas do IndexedDB
  if (sanitized.hero?.photo?.startsWith("blob:")) {
    sanitized.hero.photo = "idb://hero_photo";
  }

  if (sanitized.video) {
    if (sanitized.video.videoUrl?.startsWith("blob:")) {
      sanitized.video.videoUrl = "idb://video_main";
    }
    if (sanitized.video.poster?.startsWith("blob:")) {
      sanitized.video.poster = "idb://video_poster";
    }
  }

  if (Array.isArray(sanitized.beforeAfterCases)) {
    sanitized.beforeAfterCases.forEach((c) => {
      if (c.beforeImage?.startsWith("blob:")) {
        c.beforeImage = `idb://case_${c.id}_before`;
      }
      if (c.afterImage?.startsWith("blob:")) {
        c.afterImage = `idb://case_${c.id}_after`;
      }
    });
  }

  if (Array.isArray(sanitized.professionals)) {
    sanitized.professionals.forEach((p) => {
      if (p.photo?.startsWith("blob:")) {
        p.photo = `idb://prof_${p.id}`;
      }
    });
  }

  if (Array.isArray(sanitized.clinicPhotos)) {
    sanitized.clinicPhotos.forEach((cp) => {
      if (cp.image?.startsWith("blob:")) {
        cp.image = `idb://clinic_${cp.id}`;
      }
    });
  }

  return sanitized;
}

export function saveClinicData(data: ClinicData): void {
  try {
    const toSave = sanitizeClinicDataForStorage(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.warn("Aviso ao salvar dados no localStorage (tentando modo compacto):", err);
    try {
      const compact = sanitizeClinicDataForStorage(data);
      // Se estourar a cota de 5MB do localStorage, converte DataURLs pesadas para idb://
      if (compact.hero.photo?.startsWith("data:")) compact.hero.photo = "idb://hero_photo";
      localStorage.setItem(STORAGE_KEY, JSON.stringify(compact));
    } catch (criticalErr) {
      console.error("Erro crítico ao persistir dados da clínica:", criticalErr);
    }
  }
}

export function resetClinicData(): ClinicData {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn("Erro ao resetar dados:", err);
  }
  return INITIAL_CLINIC_DATA;
}

export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
