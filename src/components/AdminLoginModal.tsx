import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle } from "lucide-react";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_STORAGE_KEY = "aurum_clinic_admin_creds";

export function getAdminCredentials() {
  if (typeof window === "undefined") return { user: "admin", pass: "aurum2026" };
  try {
    const saved = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { user: "admin", pass: "aurum2026" };
}

export function saveAdminCredentials(user: string, pass: string) {
  try {
    localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify({ user, pass }));
  } catch {}
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const creds = getAdminCredentials();
    if (
      username.trim().toLowerCase() === creds.user.toLowerCase() &&
      password === creds.pass
    ) {
      onSuccess();
      setUsername("");
      setPassword("");
    } else {
      setError("Usuário ou senha incorretos. Acesso restrito.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/50 overflow-hidden text-stone-900 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 pt-6 pb-4 text-center bg-[#FAF9F6] border-b border-[#E6DFD5] relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#F3E5AB] mx-auto flex items-center justify-center text-stone-950 shadow-md mb-2">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="font-serif text-xl font-semibold text-stone-900">
            Acesso Restrito
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Área protegida para personalização do site
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Usuário Administrador
            </label>
            <input
              type="text"
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ex: admin"
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Senha de Acesso
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-3 pr-9 py-2 text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-stone-400 hover:text-stone-700"
                aria-label="Ver senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>



          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-stone-950 bg-gradient-to-r from-[#F4E3A1] via-[#E2BE5E] to-[#C99C29] hover:from-[#FFF1BC] hover:to-[#DBAE36] shadow-md shadow-[#D4AF37]/20 active:scale-95 transition-all"
            >
              Entrar no Painel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
