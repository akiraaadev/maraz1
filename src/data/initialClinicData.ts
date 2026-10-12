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
  clinicName: "Clínica Mara Mendes",
  tagline: "Medicina Estética & Alta Performance",
  whatsappNumber: "5511987654321",
  whatsappMessage: "Olá! Gostaria de agendar uma consulta com a Dra. Mara Mendes na Clínica Mara Mendes.",
  hero: {
    doctorName: "Dra. Mara Mendes",
    title: "A Harmonia Natural da Sua Melhor Versão",
    subtitle: "Medicina estética de excelência, protocolos personalizados e tecnologia de ponta para realçar sua beleza com sofisticação.",
    photo: "/src/assets/images/hero_doctor_portrait_1791836405527.jpg",
    ctaText: "Fale Conosco no WhatsApp",
  },
  video: {
    title: "Conheça a Experiência Mara Mendes",
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
      id: "prof-mara-mendes",
      name: "Dra. Mara Mendes",
      role: "Médica & Diretora Técnica",
      crm: "CRM 182.940 · RQE 74.321",
      specialty: "Dermatologia Clínica, Estética & Harmonização Facial Avançada",
      photo: "/src/assets/images/hero_doctor_portrait_1791836405527.jpg",
      bio: "Especialista em medicina estética de alta precisão e rejuvenescimento facial natural. A Dra. Mara Mendes desenvolve protocolos exclusivos que unem ciência dérmica, tecnologias de última geração e um olhar artístico refinado, valorizando a identidade única de cada paciente com máxima segurança, ética e discrição.",
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

export function mergeClinicData(rawParsed: any): ClinicData {
  if (!rawParsed || typeof rawParsed !== "object") {
    return INITIAL_CLINIC_DATA;
  }

  const defaultHero = INITIAL_CLINIC_DATA.hero;
  const defaultVideo = INITIAL_CLINIC_DATA.video;

  return {
    clinicName: typeof rawParsed.clinicName === "string" ? rawParsed.clinicName : INITIAL_CLINIC_DATA.clinicName,
    tagline: typeof rawParsed.tagline === "string" ? rawParsed.tagline : INITIAL_CLINIC_DATA.tagline,
    whatsappNumber: typeof rawParsed.whatsappNumber === "string" ? rawParsed.whatsappNumber : INITIAL_CLINIC_DATA.whatsappNumber,
    whatsappMessage: typeof rawParsed.whatsappMessage === "string" ? rawParsed.whatsappMessage : INITIAL_CLINIC_DATA.whatsappMessage,
    hero: {
      doctorName: rawParsed.hero?.doctorName ?? defaultHero.doctorName,
      title: rawParsed.hero?.title ?? defaultHero.title,
      subtitle: rawParsed.hero?.subtitle ?? defaultHero.subtitle,
      photo: rawParsed.hero?.photo || defaultHero.photo,
      ctaText: rawParsed.hero?.ctaText || defaultHero.ctaText,
    },
    video: {
      title: rawParsed.video?.title ?? defaultVideo.title,
      subtitle: rawParsed.video?.subtitle ?? defaultVideo.subtitle,
      videoUrl: typeof rawParsed.video?.videoUrl === "string" ? rawParsed.video.videoUrl : defaultVideo.videoUrl,
      poster: rawParsed.video?.poster || defaultVideo.poster,
      caption: rawParsed.video?.caption ?? defaultVideo.caption,
    },
    beforeAfterCases: Array.isArray(rawParsed.beforeAfterCases) && rawParsed.beforeAfterCases.length > 0
      ? rawParsed.beforeAfterCases.map((c: any, i: number) => {
          const fallback = INITIAL_CLINIC_DATA.beforeAfterCases[i] || INITIAL_CLINIC_DATA.beforeAfterCases[0];
          return {
            id: c?.id || fallback.id,
            title: c?.title || fallback.title,
            procedure: c?.procedure || fallback.procedure,
            category: c?.category || fallback.category,
            beforeImage: c?.beforeImage || fallback.beforeImage,
            afterImage: c?.afterImage || fallback.afterImage,
            description: c?.description || fallback.description,
            sessions: c?.sessions || fallback.sessions,
          };
        })
      : INITIAL_CLINIC_DATA.beforeAfterCases,
    professionals: (() => {
      const fallbackProf = INITIAL_CLINIC_DATA.professionals[0];
      if (Array.isArray(rawParsed.professionals) && rawParsed.professionals.length > 0) {
        // Mantém apenas a profissional única da clínica (Dra. Mara Mendes), preservando edições salvas
        const savedMara = rawParsed.professionals.find((p: any) =>
          p?.id === "prof-mara-mendes" || (typeof p?.name === "string" && p.name.toLowerCase().includes("mara"))
        ) || rawParsed.professionals[0];

        return [
          {
            id: savedMara?.id || fallbackProf.id,
            name: savedMara?.name || fallbackProf.name,
            role: savedMara?.role || fallbackProf.role,
            crm: savedMara?.crm || fallbackProf.crm,
            specialty: savedMara?.specialty || fallbackProf.specialty,
            photo: savedMara?.photo || fallbackProf.photo,
            bio: savedMara?.bio || fallbackProf.bio,
          },
        ];
      }
      return INITIAL_CLINIC_DATA.professionals;
    })(),
    clinicPhotos: Array.isArray(rawParsed.clinicPhotos) && rawParsed.clinicPhotos.length > 0
      ? rawParsed.clinicPhotos.map((cp: any, i: number) => {
          const fallback = INITIAL_CLINIC_DATA.clinicPhotos[i] || INITIAL_CLINIC_DATA.clinicPhotos[0];
          return {
            id: cp?.id || fallback.id,
            title: cp?.title || fallback.title,
            category: cp?.category || fallback.category,
            image: cp?.image || fallback.image,
            description: cp?.description || fallback.description,
          };
        })
      : INITIAL_CLINIC_DATA.clinicPhotos,
    address: typeof rawParsed.address === "string" ? rawParsed.address : INITIAL_CLINIC_DATA.address,
    phone: typeof rawParsed.phone === "string" ? rawParsed.phone : INITIAL_CLINIC_DATA.phone,
    openingHours: typeof rawParsed.openingHours === "string" ? rawParsed.openingHours : INITIAL_CLINIC_DATA.openingHours,
  };
}

export function loadClinicData(): ClinicData {
  if (typeof window === "undefined") return INITIAL_CLINIC_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return mergeClinicData(parsed);
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

export function createWhatsAppLink(phoneNumber?: string, message?: string): string {
  const cleanNumber = (phoneNumber || "5511987654321").replace(/\D/g, "");
  const encodedText = encodeURIComponent(message || "Olá! Gostaria de agendar uma consulta.");
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}
