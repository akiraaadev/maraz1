/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  ClinicData,
  loadClinicData,
  saveClinicData,
  resetClinicData,
  mergeClinicData,
} from "./data/initialClinicData";
import { HeroSection } from "./components/HeroSection";
import { VideoSection } from "./components/VideoSection";
import { BeforeAfterSection } from "./components/BeforeAfterSection";
import { ProfessionalsSection } from "./components/ProfessionalsSection";
import { ClinicGallerySection } from "./components/ClinicGallerySection";
import { Footer } from "./components/Footer";
import { CustomizerModal } from "./components/CustomizerModal";
import { AdminLoginModal } from "./components/AdminLoginModal";
import { hydrateClinicMedia } from "./utils/mediaStorage";
import {
  saveClinicDataToDatabase,
  subscribeClinicData,
} from "./services/clinicDatabase";

export default function App() {
  const [clinicData, setClinicData] = useState<ClinicData>(() => loadClinicData());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // 1. Carrega dados e fotos/vídeos locais instantaneamente
    try {
      const initial = loadClinicData();
      hydrateClinicMedia(initial).then((hydrated) => {
        if (hydrated) setClinicData(hydrated);
      });
    } catch (err) {
      console.warn("Aviso na inicialização local:", err);
    }

    // 2. Conecta ao Banco de Dados Firestore na Nuvem em tempo real
    let unsubscribe: (() => void) | null = null;
    try {
      unsubscribe = subscribeClinicData(async (cloudData) => {
        if (cloudData) {
          const hydrated = await hydrateClinicMedia(cloudData);
          setClinicData(hydrated);
          saveClinicData(hydrated);
        }
      });
    } catch (err) {
      console.warn("Aviso ao conectar banco Firestore:", err);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSaveData = async (newData: ClinicData) => {
    const validated = mergeClinicData(newData);
    setClinicData(validated);
    saveClinicData(validated);

    // Salva no Banco de Dados Firestore na Nuvem
    try {
      await saveClinicDataToDatabase(validated);
    } catch (cloudErr) {
      console.warn("Aviso ao salvar no banco Firestore:", cloudErr);
    }
  };

  const handleResetData = () => {
    const defaultData = resetClinicData();
    setClinicData(defaultData);
  };

  const handleOpenAdmin = () => {
    if (isAdminLoggedIn) {
      setIsCustomizerOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setIsLoginModalOpen(false);
    setIsCustomizerOpen(true);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setIsCustomizerOpen(false);
  };

  const safeData = mergeClinicData(clinicData);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#8C6D1F]">
      {/* Main Mobile Vertical Scroll Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero: Apenas a foto com filtro escuro e um único botãozinho Fale Conosco para o WhatsApp */}
        <HeroSection
          photoUrl={safeData.hero.photo}
          ctaText={safeData.hero.ctaText || "Fale Conosco"}
          whatsappNumber={safeData.whatsappNumber}
          whatsappMessage={safeData.whatsappMessage}
        />

        {/* 2. Vídeo de Apresentação / Início (Formato TikTok / Stories em Tela Cheia) */}
        <VideoSection
          videoUrl={safeData.video.videoUrl}
          posterUrl={safeData.video.poster}
        />

        {/* 3. Antes e Depois Interativo */}
        <BeforeAfterSection
          cases={safeData.beforeAfterCases}
          whatsappNumber={safeData.whatsappNumber}
        />

        {/* 4. Corpo Clínico (Foto, CRM e Função na Clínica) */}
        <ProfessionalsSection
          professionals={safeData.professionals}
          whatsappNumber={safeData.whatsappNumber}
        />

        {/* 5. Fotos da Clínica (Tons de branco e dourado) */}
        <ClinicGallerySection photos={safeData.clinicPhotos} />
      </main>

      {/* Rodapé institucional com botão protegido para Área Administrativa */}
      <Footer
        clinicName={safeData.clinicName}
        address={safeData.address}
        phone={safeData.phone}
        openingHours={safeData.openingHours}
        whatsappNumber={safeData.whatsappNumber}
        whatsappMessage={safeData.whatsappMessage}
        onOpenCustomizer={handleOpenAdmin}
      />

      {/* Modal de Login e Senha para proteger a personalização do site */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Painel Administrativo para upload de fotos e vídeos direto do celular */}
      <CustomizerModal
        data={safeData}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleSaveData}
        onReset={handleResetData}
        onLogout={handleLogout}
      />
    </div>
  );
}
