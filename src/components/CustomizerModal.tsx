import React, { useState } from "react";
import {
  X,
  Save,
  RotateCcw,
  Upload,
  Video,
  Phone,
  Check,
  Sparkles,
  Lock,
  KeyRound,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import { ClinicData, INITIAL_CLINIC_DATA } from "../data/initialClinicData";
import { saveMediaFile, fileToDataUrl } from "../utils/mediaStorage";
import { getAdminCredentials, saveAdminCredentials } from "./AdminLoginModal";

interface CustomizerModalProps {
  data: ClinicData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newData: ClinicData) => void;
  onReset: () => void;
  onLogout?: () => void;
}

export const CustomizerModal: React.FC<CustomizerModalProps> = ({
  data,
  isOpen,
  onClose,
  onSave,
  onReset,
  onLogout,
}) => {
  const [formData, setFormData] = useState<ClinicData>(data);
  const [activeTab, setActiveTab] = useState<
    "hero" | "video" | "antesDepois" | "equipe" | "clinica" | "geral" | "seguranca"
  >("hero");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<string | null>(null);

  // Security credentials state
  const [adminUser, setAdminUser] = useState(() => getAdminCredentials().user);
  const [adminPass, setAdminPass] = useState(() => getAdminCredentials().pass);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    typeKey: string,
    onSuccessUrl: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(typeKey);
      showToast("Salvando e sincronizando com o banco de dados...");

      // Chaves de slot fixas para garantir reidratação em Firestore e IndexedDB
      let slotKey = typeKey;
      if (typeKey === "hero") slotKey = "hero_photo";
      if (typeKey === "video") slotKey = "video_main";
      if (typeKey === "videoPoster") slotKey = "video_poster";

      const result = await saveMediaFile(slotKey, file, (pct) => {
        showToast(`Enviando para o banco de dados... ${pct}%`);
      });
      onSuccessUrl(result.displayUrl);
      showToast(`Arquivo salvo no banco de dados! (${result.sizeFormatted})`);
    } catch (err) {
      console.error("Erro no upload:", err);
      try {
        const dataUrl = await fileToDataUrl(file);
        onSuccessUrl(dataUrl);
        showToast("Arquivo carregado com sucesso!");
      } catch {
        alert("Não foi possível carregar este arquivo. Tente outro formato.");
      }
    } finally {
      setIsUploading(null);
      e.target.value = "";
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    saveAdminCredentials(adminUser, adminPass);
    showToast("Fotos, vídeos e dados salvos no banco de dados com sucesso!");
    setTimeout(() => {
      onClose();
    }, 700);
  };

  const handleReset = () => {
    if (window.confirm("Deseja restaurar as configurações e fotos originais da clínica?")) {
      onReset();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#FAF9F6] border-b border-[#E6DFD5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base sm:text-lg font-semibold text-stone-900 leading-tight">
                Painel Administrativo da Clínica
              </h2>
              <p className="text-[10px] text-[#8C6D1F] font-medium flex items-center gap-1">
                <span>●</span> Banco de Dados na Nuvem: Fotos e vídeos sincronizados em todos os aparelhos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-stone-100 transition-colors"
                title="Bloquear e sair"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
              aria-label="Fechar painel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-stone-200 px-3 gap-1 bg-stone-50 overflow-x-auto text-xs py-2 no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("hero")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "hero"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            Foto do Cliente (Início)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("video")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "video"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            Vídeo do Celular
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("antesDepois")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "antesDepois"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            Antes e Depois
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("equipe")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "equipe"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            Profissionais & CRM
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("clinica")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "clinica"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            Fotos da Clínica
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("geral")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === "geral"
                ? "bg-[#D4AF37] text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            WhatsApp & Dados
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("seguranca")}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-1 ${
              activeTab === "seguranca"
                ? "bg-stone-900 text-white shadow-xs"
                : "text-stone-600 hover:bg-stone-200/60"
            }`}
          >
            <Lock className="w-3 h-3 text-[#D4AF37]" />
            <span>Senha de Acesso</span>
          </button>
        </div>

        {/* Tab Contents Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs text-stone-800">
          {/* TAB: HERO / FOTO DO CLIENTE */}
          {activeTab === "hero" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FAF9F6] border border-[#E6DFD5] rounded-xl space-y-3">
                <label className="block text-xs font-semibold text-stone-900">
                  Foto Principal do Início (Tirada do Celular)
                </label>

                {/* Prévia */}
                <div className="rounded-xl overflow-hidden border border-[#D4AF37]/50 aspect-[3/4] max-h-56 mx-auto bg-stone-900 relative shadow-md">
                  <img
                    src={formData.hero.photo}
                    alt="Prévia Foto Inicial"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-[11px] font-medium pointer-events-none">
                    Prévia na tela inicial
                  </div>
                </div>

                {/* Botão de Upload do Celular */}
                <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] text-stone-950 font-semibold cursor-pointer shadow-sm hover:brightness-105 active:scale-98 transition-all">
                  <Upload className="w-4 h-4" />
                  <span>
                    {isUploading === "hero" ? "Enviando foto..." : "Escolher Foto da Galeria do Celular"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleFileUpload(e, "hero", (url) =>
                        setFormData({
                          ...formData,
                          hero: { ...formData.hero, photo: url },
                        })
                      )
                    }
                  />
                </label>

                {formData.hero.photo !== INITIAL_CLINIC_DATA.hero.photo && (
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, photo: INITIAL_CLINIC_DATA.hero.photo },
                      })
                    }
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-[11px] transition-colors"
                  >
                    <RotateCcw className="w-3 h-3 text-stone-500" />
                    <span>Restaurar Foto Original Padrão</span>
                  </button>
                )}

                <div className="pt-1">
                  <label className="block text-[10px] text-stone-500 mb-0.5">
                    Ou cole o link direto da imagem:
                  </label>
                  <input
                    type="text"
                    value={formData.hero.photo}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        hero: { ...formData.hero, photo: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Texto do Botão
                </label>
                <input
                  type="text"
                  value={formData.hero.ctaText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero: { ...formData.hero, ctaText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* TAB: VIDEO DO CELULAR */}
          {activeTab === "video" && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#FAF9F6] border border-[#E6DFD5] rounded-xl space-y-3">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <Video className="w-4 h-4 text-[#B8860B]" />
                  <span>Enviar Vídeo do Celular (Formato TikTok / Stories)</span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Você pode selecionar qualquer vídeo gravado no celular (.mp4, .mov, etc.) para rodar em tela cheia na página.
                </p>

                {/* Botões de Ação do Vídeo */}
                <div className="flex flex-col gap-2">
                  <label className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-stone-900 text-white font-semibold cursor-pointer shadow-sm hover:bg-stone-800 active:scale-98 transition-all">
                    <Upload className="w-4 h-4 text-[#D4AF37]" />
                    <span>
                      {isUploading === "video" ? "Salvando vídeo do celular..." : "Selecionar Vídeo Gravado no Celular"}
                    </span>
                    <input
                      type="file"
                      accept="video/mp4,video/quicktime,video/webm,video/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "video", (url) =>
                          setFormData({
                            ...formData,
                            video: { ...formData.video, videoUrl: url },
                          })
                        )
                      }
                    />
                  </label>

                  {formData.video.videoUrl !== INITIAL_CLINIC_DATA.video.videoUrl && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          video: { ...formData.video, videoUrl: INITIAL_CLINIC_DATA.video.videoUrl },
                        })
                      }
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-[11px] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                      <span>Restaurar Vídeo Original Padrão</span>
                    </button>
                  )}
                </div>

                {/* Prévia do Vídeo */}
                <div className="rounded-xl overflow-hidden border border-[#D4AF37]/50 aspect-[9/16] max-h-56 mx-auto bg-black relative shadow-md flex items-center justify-center">
                  <video
                    src={formData.video.videoUrl}
                    poster={formData.video.poster}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Input opcional de link direto ou YouTube */}
                <div>
                  <label className="block text-[10px] text-stone-500 mb-0.5">
                    Ou cole o link de um vídeo (YouTube, Vimeo ou link .mp4):
                  </label>
                  <input
                    type="text"
                    value={formData.video.videoUrl}
                    placeholder="https://..."
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        video: { ...formData.video, videoUrl: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg"
                  />
                </div>

                {/* Foto de Capa do Vídeo */}
                <div className="pt-2 border-t border-stone-200 space-y-2">
                  <label className="block text-xs font-semibold text-stone-800">
                    Foto de Capa do Vídeo (Poster Vertical)
                  </label>
                  <label className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#D4AF37] text-stone-900 bg-white hover:bg-stone-50 font-medium cursor-pointer transition-all">
                    <ImageIcon className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>
                      {isUploading === "videoPoster" ? "Carregando capa..." : "Enviar Foto de Capa do Celular"}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileUpload(e, "videoPoster", (url) =>
                          setFormData({
                            ...formData,
                            video: { ...formData.video, poster: url },
                          })
                        )
                      }
                    />
                  </label>

                  {formData.video.poster !== INITIAL_CLINIC_DATA.video.poster && (
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          video: { ...formData.video, poster: INITIAL_CLINIC_DATA.video.poster },
                        })
                      }
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 text-[11px] transition-colors"
                    >
                      <RotateCcw className="w-3 h-3 text-stone-500" />
                      <span>Restaurar Capa Padrão</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANTES E DEPOIS */}
          {activeTab === "antesDepois" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Selecione as fotos tiradas no celular para comparar o antes e depois:
              </p>

              {formData.beforeAfterCases.map((c, index) => (
                <div key={c.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-semibold text-xs text-[#B8860B]">
                    Caso #{index + 1}: {c.title}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Título do Caso
                    </label>
                    <input
                      type="text"
                      value={c.title}
                      onChange={(e) => {
                        const updated = [...formData.beforeAfterCases];
                        updated[index].title = e.target.value;
                        setFormData({ ...formData, beforeAfterCases: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                    />
                  </div>

                  {/* Upload Foto Antes */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Foto ANTES (Enviar do Celular)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs">
                        <Upload className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Carregar Foto ANTES</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, `case_${c.id}_before`, (url) => {
                              const updated = [...formData.beforeAfterCases];
                              updated[index].beforeImage = url;
                              setFormData({ ...formData, beforeAfterCases: updated });
                            })
                          }
                        />
                      </label>
                      <div className="w-9 h-9 rounded-md overflow-hidden border border-stone-300 shrink-0">
                        <img src={c.beforeImage} alt="Antes" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {/* Upload Foto Depois */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Foto DEPOIS (Enviar do Celular)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs">
                        <Upload className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Carregar Foto DEPOIS</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, `case_${c.id}_after`, (url) => {
                              const updated = [...formData.beforeAfterCases];
                              updated[index].afterImage = url;
                              setFormData({ ...formData, beforeAfterCases: updated });
                            })
                          }
                        />
                      </label>
                      <div className="w-9 h-9 rounded-md overflow-hidden border border-[#D4AF37] shrink-0">
                        <img src={c.afterImage} alt="Depois" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>

                  {INITIAL_CLINIC_DATA.beforeAfterCases[index] && (
                    <button
                      type="button"
                      onClick={() => {
                        const orig = INITIAL_CLINIC_DATA.beforeAfterCases[index];
                        const updated = [...formData.beforeAfterCases];
                        updated[index] = { ...updated[index], beforeImage: orig.beforeImage, afterImage: orig.afterImage };
                        setFormData({ ...formData, beforeAfterCases: updated });
                      }}
                      className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 pt-1"
                    >
                      <RotateCcw className="w-2.5 h-2.5" />
                      <span>Restaurar fotos originais deste caso</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* TAB: EQUIPE & CRM */}
          {activeTab === "equipe" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Edite os profissionais e envie a foto de cada um direto do celular:
              </p>

              {formData.professionals.map((prof, index) => (
                <div key={prof.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-semibold text-xs text-[#B8860B]">
                    Profissional #{index + 1}: {prof.name}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        value={prof.name}
                        onChange={(e) => {
                          const updated = [...formData.professionals];
                          updated[index].name = e.target.value;
                          setFormData({ ...formData, professionals: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                        CRM / RQE
                      </label>
                      <input
                        type="text"
                        value={prof.crm}
                        onChange={(e) => {
                          const updated = [...formData.professionals];
                          updated[index].crm = e.target.value;
                          setFormData({ ...formData, professionals: updated });
                        }}
                        className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Função na Clínica
                    </label>
                    <input
                      type="text"
                      value={prof.role}
                      onChange={(e) => {
                        const updated = [...formData.professionals];
                        updated[index].role = e.target.value;
                        setFormData({ ...formData, professionals: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Especialidade Principal
                    </label>
                    <input
                      type="text"
                      value={prof.specialty || ""}
                      onChange={(e) => {
                        const updated = [...formData.professionals];
                        updated[index].specialty = e.target.value;
                        setFormData({ ...formData, professionals: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Biografia & Filosofia de Atendimento
                    </label>
                    <textarea
                      rows={3}
                      value={prof.bio || ""}
                      onChange={(e) => {
                        const updated = [...formData.professionals];
                        updated[index].bio = e.target.value;
                        setFormData({ ...formData, professionals: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                    />
                  </div>

                  {/* Foto do Médico enviada do celular */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Foto do Profissional (Enviar do Celular)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs">
                        <Upload className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Carregar Foto do Médico</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, `prof_${prof.id}`, (url) => {
                              const updated = [...formData.professionals];
                              updated[index].photo = url;
                              setFormData({ ...formData, professionals: updated });
                            })
                          }
                        />
                      </label>
                      <div className="w-9 h-11 rounded-md overflow-hidden border border-stone-300 shrink-0">
                        <img src={prof.photo} alt={prof.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    {INITIAL_CLINIC_DATA.professionals[index] && formData.professionals[index].photo !== INITIAL_CLINIC_DATA.professionals[index].photo && (
                      <button
                        type="button"
                        onClick={() => {
                          const orig = INITIAL_CLINIC_DATA.professionals[index];
                          const updated = [...formData.professionals];
                          updated[index] = { ...updated[index], photo: orig.photo };
                          setFormData({ ...formData, professionals: updated });
                        }}
                        className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 pt-1"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Restaurar foto original deste profissional</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: FOTOS DA CLÍNICA */}
          {activeTab === "clinica" && (
            <div className="space-y-4">
              <p className="text-xs text-stone-600">
                Envie fotos dos ambientes da sua clínica direto do celular:
              </p>

              {formData.clinicPhotos.map((photo, index) => (
                <div key={photo.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="font-semibold text-xs text-[#B8860B]">
                    Ambiente #{index + 1}: {photo.title}
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-0.5">
                      Nome do Ambiente
                    </label>
                    <input
                      type="text"
                      value={photo.title}
                      onChange={(e) => {
                        const updated = [...formData.clinicPhotos];
                        updated[index].title = e.target.value;
                        setFormData({ ...formData, clinicPhotos: updated });
                      }}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-md"
                    />
                  </div>

                  {/* Foto do ambiente enviada do celular */}
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                      Foto do Espaço (Enviar do Celular)
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 cursor-pointer text-xs">
                        <Upload className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>Carregar Foto do Celular</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, `clinic_${photo.id}`, (url) => {
                              const updated = [...formData.clinicPhotos];
                              updated[index].image = url;
                              setFormData({ ...formData, clinicPhotos: updated });
                            })
                          }
                        />
                      </label>
                      <div className="w-12 h-8 rounded-md overflow-hidden border border-stone-300 shrink-0">
                        <img src={photo.image} alt={photo.title} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    {INITIAL_CLINIC_DATA.clinicPhotos[index] && formData.clinicPhotos[index].image !== INITIAL_CLINIC_DATA.clinicPhotos[index].image && (
                      <button
                        type="button"
                        onClick={() => {
                          const orig = INITIAL_CLINIC_DATA.clinicPhotos[index];
                          const updated = [...formData.clinicPhotos];
                          updated[index] = { ...updated[index], image: orig.image };
                          setFormData({ ...formData, clinicPhotos: updated });
                        }}
                        className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center gap-1 pt-1"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                        <span>Restaurar foto original deste ambiente</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: WHATSAPP E GERAL */}
          {activeTab === "geral" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Nome da Clínica
                </label>
                <input
                  type="text"
                  value={formData.clinicName}
                  onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Número do WhatsApp (com DDI e DDD, ex: 5511987654321)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                    placeholder="5511987654321"
                    className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Mensagem Automática para o WhatsApp
                </label>
                <textarea
                  rows={2}
                  value={formData.whatsappMessage}
                  onChange={(e) => setFormData({ ...formData, whatsappMessage: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* TAB: SEGURANÇA & SENHA */}
          {activeTab === "seguranca" && (
            <div className="space-y-4 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <div className="flex items-center gap-2 font-semibold text-stone-900 text-xs">
                <KeyRound className="w-4 h-4 text-[#B8860B]" />
                <span>Alterar Usuário e Senha do Painel</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Defina suas credenciais exclusivas para impedir que visitantes alterem o conteúdo do seu site.
              </p>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Novo Usuário
                </label>
                <input
                  type="text"
                  value={adminUser}
                  onChange={(e) => setAdminUser(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Nova Senha
                </label>
                <input
                  type="text"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Toast */}
          {toastMessage && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-[11px] text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Originais</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-stone-950 bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] rounded-lg shadow-sm hover:brightness-105 active:scale-95 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar Tudo</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
