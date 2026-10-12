import React, { Component, ErrorInfo, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary detectou erro não tratado:", error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF9F6] text-stone-900 flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-[#D4AF37]/40 shadow-xl space-y-4">
            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-white text-lg font-serif">
              ✦
            </div>
            <h1 className="font-serif text-xl font-semibold text-stone-900">
              Clínica Médica & Estética Aurum
            </h1>
            <p className="text-xs text-stone-600 leading-relaxed">
              Detectamos dados em cache que precisam ser atualizados. Clique abaixo para carregar a versão mais recente da clínica.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] text-stone-950 font-semibold text-xs shadow-md hover:brightness-105 active:scale-98 transition-all"
            >
              Restaurar e Abrir Site
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
