/**
 * Sistema robusto de persistência para Fotos e Vídeos no navegador.
 * Suporta IndexedDB de alta capacidade para vídeos pesados do celular (.mp4, .mov, .webm)
 * e compressão inteligente com DataURL para fotos com carregamento instantâneo sem expiração.
 */

import { ClinicData, INITIAL_CLINIC_DATA } from "../data/initialClinicData";

const DB_NAME = "AurumClinicMediaDB";
const STORE_NAME = "mediaFiles";
const DB_VERSION = 2;

// Cache em memória de ObjectURLs ativos para evitar vazamento de memória e URLs duplicadas
const objectUrlCache = new Map<string, string>();

/**
 * Abre ou atualiza o banco de dados IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      return reject(new Error("IndexedDB não suportado neste navegador"));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Formata tamanho de arquivo em formato legível (KB, MB)
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Otimiza e comprime imagens via HTML Canvas para salvar em DataURL leve e de alta resolução
 */
export function compressImage(
  file: File | Blob,
  maxWidth = 1600,
  maxHeight = 1600,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Mantém a proporção redimensionando se necessário
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight = height;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Gera WebP com fallback para JPEG
        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData);
            return;
          }
        } catch {
          // Fallback para JPEG
        }

        const jpegData = canvas.toDataURL("image/jpeg", quality);
        resolve(jpegData);
      };
      img.onerror = () => reject(new Error("Erro ao decodificar imagem"));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Converte arquivo para DataURL genérico (fallback)
 */
export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export interface SaveMediaResult {
  displayUrl: string;       // URL para renderizar imediatamente na tela (DataURL ou BlobURL ativo)
  persistentKey: string;    // Chave permanente para salvar no LocalStorage (DataURL ou idb://key)
  isDataUrl: boolean;
  sizeFormatted: string;
}

/**
 * Salva foto ou vídeo no armazenamento permanente (IndexedDB + otimização de imagem)
 */
export async function saveMediaFile(
  key: string,
  file: File | Blob
): Promise<SaveMediaResult> {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const sizeFormatted = formatBytes(file.size);

  // 1. Sempre salva o Blob original no IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const putReq = store.put(file, key);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (idbErr) {
    console.warn("Aviso: Falha ao gravar no IndexedDB:", idbErr);
  }

  // 2. Se for imagem, comprime para DataURL para carregamento instantâneo no LocalStorage
  if (isImage) {
    try {
      const dataUrl = await compressImage(file);
      return {
        displayUrl: dataUrl,
        persistentKey: dataUrl, // Imagens podem ser salvas diretamente no JSON sem expirar!
        isDataUrl: true,
        sizeFormatted,
      };
    } catch {
      // Fallback para DataURL simples se canvas falhar
      try {
        const rawDataUrl = await fileToDataUrl(file);
        return {
          displayUrl: rawDataUrl,
          persistentKey: rawDataUrl,
          isDataUrl: true,
          sizeFormatted,
        };
      } catch {
        // Fallback final: idb
      }
    }
  }

  // 3. Se for vídeo (ou imagem muito pesada), gera ObjectURL ativo e chave idb://
  let objectUrl = objectUrlCache.get(key);
  if (objectUrl) {
    try {
      URL.revokeObjectURL(objectUrl);
    } catch {}
  }

  objectUrl = URL.createObjectURL(file);
  objectUrlCache.set(key, objectUrl);

  return {
    displayUrl: objectUrl,
    persistentKey: `idb://${key}`,
    isDataUrl: false,
    sizeFormatted,
  };
}

/**
 * Recupera o Blob de um arquivo salvo no IndexedDB
 */
export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const getReq = store.get(key);
      getReq.onsuccess = () => {
        const result = getReq.result;
        if (result && result instanceof Blob) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      getReq.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Obtém URL ativa para exibição de uma chave salva no IndexedDB
 */
export async function getMediaFileUrl(key: string): Promise<string | null> {
  if (objectUrlCache.has(key)) {
    return objectUrlCache.get(key)!;
  }

  const blob = await getMediaBlob(key);
  if (!blob) return null;

  const url = URL.createObjectURL(blob);
  objectUrlCache.set(key, url);
  return url;
}

/**
 * Remove mídia do IndexedDB e limpa URLs em cache
 */
export async function deleteMediaFile(key: string): Promise<void> {
  if (objectUrlCache.has(key)) {
    try {
      URL.revokeObjectURL(objectUrlCache.get(key)!);
    } catch {}
    objectUrlCache.delete(key);
  }

  try {
    const db = await openDB();
    await new Promise<void>((resolve) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => resolve();
    });
  } catch {}
}

/**
 * Mapeamento e resolução de um valor único de URL/Chave
 */
async function resolveSingleMediaUrl(
  urlOrKey: string,
  defaultFallback: string,
  suggestedSlotKey?: string
): Promise<string> {
  if (!urlOrKey) return defaultFallback;

  // 1. DataURL base64 permanente ou URL externa válida
  if (
    urlOrKey.startsWith("data:") ||
    urlOrKey.startsWith("http://") ||
    urlOrKey.startsWith("https://") ||
    urlOrKey.startsWith("/src/assets/")
  ) {
    return urlOrKey;
  }

  // 2. Chave explícita do IndexedDB (ex: idb://video_principal)
  if (urlOrKey.startsWith("idb://")) {
    const rawKey = urlOrKey.replace("idb://", "");
    const activeUrl = await getMediaFileUrl(rawKey);
    if (activeUrl) return activeUrl;
  }

  // 3. Caso seja uma URL 'blob:' expirada de sessão anterior
  if (urlOrKey.startsWith("blob:")) {
    // Tenta encontrar pelo slot sugerido no IndexedDB
    if (suggestedSlotKey) {
      const activeUrl = await getMediaFileUrl(suggestedSlotKey);
      if (activeUrl) return activeUrl;
    }
    // Se o blob expirou e não há arquivo no IndexedDB, restaura o padrão seguro
    return defaultFallback;
  }

  // 4. Caso seja apenas o nome da chave salva
  const activeUrl = await getMediaFileUrl(urlOrKey);
  if (activeUrl) return activeUrl;

  return defaultFallback;
}

/**
 * Hidrata todos os campos de fotos e vídeos da clínica na inicialização do app
 * para garantir que URLs temporárias (blob:) nunca quebrem após refresh da página.
 */
export async function hydrateClinicMedia(data: ClinicData): Promise<ClinicData> {
  const updated: ClinicData = { ...data };

  // 1. Foto Hero
  updated.hero = {
    ...data.hero,
    photo: await resolveSingleMediaUrl(
      data.hero.photo,
      INITIAL_CLINIC_DATA.hero.photo,
      "hero_photo"
    ),
  };

  // 2. Vídeo e Capa (Poster)
  const resolvedVideoUrl = await resolveSingleMediaUrl(
    data.video.videoUrl,
    INITIAL_CLINIC_DATA.video.videoUrl,
    "video_main"
  );
  const resolvedPoster = await resolveSingleMediaUrl(
    data.video.poster,
    INITIAL_CLINIC_DATA.video.poster,
    "video_poster"
  );

  updated.video = {
    ...data.video,
    videoUrl: resolvedVideoUrl,
    poster: resolvedPoster,
  };

  // 3. Antes e Depois
  updated.beforeAfterCases = await Promise.all(
    data.beforeAfterCases.map(async (c, idx) => {
      const defaultCase = INITIAL_CLINIC_DATA.beforeAfterCases[idx] || c;
      const before = await resolveSingleMediaUrl(
        c.beforeImage,
        defaultCase.beforeImage,
        `case_${c.id}_before`
      );
      const after = await resolveSingleMediaUrl(
        c.afterImage,
        defaultCase.afterImage,
        `case_${c.id}_after`
      );
      return { ...c, beforeImage: before, afterImage: after };
    })
  );

  // 4. Profissionais
  updated.professionals = await Promise.all(
    data.professionals.map(async (p, idx) => {
      const defaultProf = INITIAL_CLINIC_DATA.professionals[idx] || p;
      const photo = await resolveSingleMediaUrl(
        p.photo,
        defaultProf.photo,
        `prof_${p.id}`
      );
      return { ...p, photo };
    })
  );

  // 5. Fotos da Clínica
  updated.clinicPhotos = await Promise.all(
    data.clinicPhotos.map(async (cp, idx) => {
      const defaultPhoto = INITIAL_CLINIC_DATA.clinicPhotos[idx] || cp;
      const image = await resolveSingleMediaUrl(
        cp.image,
        defaultPhoto.image,
        `clinic_${cp.id}`
      );
      return { ...cp, image };
    })
  );

  return updated;
}
