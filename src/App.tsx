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

export default function App() {
  const [clinicData, setClinicData] = useState<ClinicData>(() => loadClinicData());
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    // Sincroniza dados com persistência local e hidrata fotos/vídeos do IndexedDB
    const initial = loadClinicData();
    hydrateClinicMedia(initial).then((hydrated) => {
      setClinicData(hydrated);
    });
  }, []);

  const handleSaveData = (newData: ClinicData) => {
    setClinicData(newData);
    saveClinicData(newData);
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

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col font-sans selection:bg-[#D4AF37]/20 selection:text-[#8C6D1F]">
      {/* Main Mobile Vertical Scroll Flow */}
      <main className="flex-1 w-full">
        {/* 1. Hero: Apenas a foto com filtro escuro e um único botãozinho Fale Conosco para o WhatsApp */}
        <HeroSection
          photoUrl={clinicData.hero.photo}
          ctaText={clinicData.hero.ctaText || "Fale Conosco"}
          whatsappNumber={clinicData.whatsappNumber}
          whatsappMessage={clinicData.whatsappMessage}
        />

        {/* 2. Vídeo de Apresentação / Início (Formato TikTok / Stories em Tela Cheia) */}
        <VideoSection
          videoUrl={clinicData.video.videoUrl}
          posterUrl={clinicData.video.poster}
        />

        {/* 3. Antes e Depois Interativo */}
        <BeforeAfterSection
          cases={clinicData.beforeAfterCases}
          whatsappNumber={clinicData.whatsappNumber}
        />

        {/* 4. Corpo Clínico (Foto, CRM e Função na Clínica) */}
        <ProfessionalsSection
          professionals={clinicData.professionals}
          whatsappNumber={clinicData.whatsappNumber}
        />

        {/* 5. Fotos da Clínica (Tons de branco e dourado) */}
        <ClinicGallerySection photos={clinicData.clinicPhotos} />
      </main>

      {/* Rodapé institucional com botão protegido para Área Administrativa */}
      <Footer
        clinicName={clinicData.clinicName}
        address={clinicData.address}
        phone={clinicData.phone}
        openingHours={clinicData.openingHours}
        whatsappNumber={clinicData.whatsappNumber}
        whatsappMessage={clinicData.whatsappMessage}
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
        data={clinicData}
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onSave={handleSaveData}
        onReset={handleResetData}
        onLogout={handleLogout}
      />
    </div>
  );
}
