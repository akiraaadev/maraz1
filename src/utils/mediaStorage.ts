/**
 * Sistema de persistência na Nuvem (Firestore) + Cache Local (IndexedDB)
 * Garante que fotos e vídeos enviados fiquem salvos no Banco de Dados
 * e visíveis em qualquer dispositivo e celular.
 */

import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { ClinicData, INITIAL_CLINIC_DATA, mergeClinicData } from "../data/initialClinicData";

const DB_NAME = "AurumClinicMediaDB";
const STORE_NAME = "mediaFiles";
const DB_VERSION = 2;
const CHUNK_SIZE = 400 * 1024; // 400 KB por fatia

// Cache em memória de ObjectURLs ativos
const objectUrlCache = new Map<string, string>();

/**
 * Converte Blob para base64
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1] || result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Converte base64 para Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Abre ou atualiza o banco de dados IndexedDB de forma segura
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === "undefined" || !window.indexedDB) {
        return reject(new Error("IndexedDB não suportado neste navegador"));
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const idb = (event.target as IDBOpenDBRequest).result;
        if (!idb.objectStoreNames.contains(STORE_NAME)) {
          idb.createObjectStore(STORE_NAME);
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => {
        console.warn("IndexedDB abertura bloqueada");
        reject(new Error("IndexedDB bloqueado"));
      };
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Formata tamanho de arquivo em formato legível
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
 * Otimiza e comprime imagens via HTML Canvas para salvar em DataURL leve de alta qualidade
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

        try {
          const webpData = canvas.toDataURL("image/webp", quality);
          if (webpData.startsWith("data:image/webp")) {
            resolve(webpData);
            return;
          }
        } catch {}

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

export function fileToDataUrl(file: File | Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

/**
 * Faz upload de vídeo/foto fatiado para o Banco de Dados Firestore
 */
export async function uploadMediaToFirestore(
  mediaId: string,
  file: File | Blob,
  onProgress?: (pct: number) => void
): Promise<void> {
  try {
    const totalSize = file.size;
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

    const mediaDocRef = doc(db, "media_files", mediaId);
    await setDoc(mediaDocRef, {
      mediaId,
      name: file instanceof File ? file.name : mediaId,
      type: file.type || "video/mp4",
      size: totalSize,
      totalChunks,
      updatedAt: new Date().toISOString(),
    });

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, totalSize);
      const chunkBlob = file.slice(start, end);
      const base64Data = await blobToBase64(chunkBlob);

      const chunkDocRef = doc(db, "media_files", mediaId, "chunks", String(i));
      await setDoc(chunkDocRef, {
        chunkIndex: i,
        data: base64Data,
      });

      if (onProgress) {
        onProgress(Math.round(((i + 1) / totalChunks) * 100));
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `media_files/${mediaId}`);
    throw error;
  }
}

/**
 * Baixa e remonta o arquivo do Banco de Dados Firestore
 */
export async function downloadMediaFromFirestore(mediaId: string): Promise<Blob | null> {
  try {
    const localBlob = await getMediaBlob(mediaId);
    if (localBlob) return localBlob;

    const mediaDocRef = doc(db, "media_files", mediaId);
    const mediaSnap = await getDoc(mediaDocRef);
    if (!mediaSnap.exists()) return null;

    const mediaMeta = mediaSnap.data();
    const mimeType = mediaMeta.type || "video/mp4";
    const totalChunks = mediaMeta.totalChunks || 1;

    const chunksColRef = collection(db, "media_files", mediaId, "chunks");
    const chunksSnap = await getDocs(chunksColRef);

    const chunkMap = new Map<number, Uint8Array>();
    chunksSnap.forEach((docSnap) => {
      const d = docSnap.data();
      const bytes = base64ToUint8Array(d.data);
      chunkMap.set(d.chunkIndex, bytes);
    });

    const byteArrays: Uint8Array[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const piece = chunkMap.get(i);
      if (piece) {
        byteArrays.push(piece);
      }
    }

    if (byteArrays.length === 0) return null;

    const reconstructedBlob = new Blob(byteArrays as unknown as BlobPart[], { type: mimeType });

    // Salva em cache local
    try {
      await saveMediaBlobToIndexedDB(mediaId, reconstructedBlob);
    } catch {}

    return reconstructedBlob;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `media_files/${mediaId}`);
    return null;
  }
}

async function saveMediaBlobToIndexedDB(key: string, file: Blob): Promise<void> {
  try {
    const idb = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = idb.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const putReq = store.put(file, key);
      putReq.onsuccess = () => resolve();
      putReq.onerror = () => reject(putReq.error);
    });
  } catch (err) {
    console.warn("IndexedDB cache erro:", err);
  }
}

export interface SaveMediaResult {
  displayUrl: string;
  persistentKey: string;
  isDataUrl: boolean;
  sizeFormatted: string;
}

/**
 * Salva foto ou vídeo tanto no IndexedDB local quanto no Banco de Dados Firestore na nuvem
 */
export async function saveMediaFile(
  key: string,
  file: File | Blob,
  onUploadProgress?: (pct: number) => void
): Promise<SaveMediaResult> {
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const sizeFormatted = formatBytes(file.size);

  // 1. Salva no IndexedDB local
  await saveMediaBlobToIndexedDB(key, file);

  // 2. Se for imagem, comprime para DataURL permanente (salva direto no documento do Firestore)
  if (isImage) {
    try {
      const dataUrl = await compressImage(file);
      return {
        displayUrl: dataUrl,
        persistentKey: dataUrl,
        isDataUrl: true,
        sizeFormatted,
      };
    } catch {
      try {
        const rawDataUrl = await fileToDataUrl(file);
        return {
          displayUrl: rawDataUrl,
          persistentKey: rawDataUrl,
          isDataUrl: true,
          sizeFormatted,
        };
      } catch {}
    }
  }

  // 3. Se for vídeo, salva no Firestore em nuvem
  const objectUrl = URL.createObjectURL(file);
  objectUrlCache.set(key, objectUrl);

  try {
    await uploadMediaToFirestore(key, file, onUploadProgress);
  } catch (cloudErr) {
    console.warn("Falha no upload do vídeo para a nuvem:", cloudErr);
  }

  return {
    displayUrl: objectUrl,
    persistentKey: `firestore://${key}`,
    isDataUrl: false,
    sizeFormatted,
  };
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  try {
    const idb = await openDB();
    return new Promise((resolve) => {
      const transaction = idb.transaction(STORE_NAME, "readonly");
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

export async function getMediaFileUrl(key: string): Promise<string | null> {
  if (objectUrlCache.has(key)) {
    return objectUrlCache.get(key)!;
  }

  const blob = await getMediaBlob(key);
  if (blob) {
    const url = URL.createObjectURL(blob);
    objectUrlCache.set(key, url);
    return url;
  }

  return null;
}

/**
 * Resolve URL de imagem/vídeo buscando primeiro no cache e depois no Banco Firestore
 */
async function resolveSingleMediaUrl(
  urlOrKey: string,
  defaultFallback: string,
  suggestedSlotKey?: string
): Promise<string> {
  if (!urlOrKey) return defaultFallback;

  // 1. DataURL base64 ou URL pública
  if (
    urlOrKey.startsWith("data:") ||
    urlOrKey.startsWith("http://") ||
    urlOrKey.startsWith("https://") ||
    urlOrKey.startsWith("/src/assets/")
  ) {
    return urlOrKey;
  }

  // 2. Chave no Firestore
  if (urlOrKey.startsWith("firestore://")) {
    const mediaId = urlOrKey.replace("firestore://", "");
    if (objectUrlCache.has(mediaId)) return objectUrlCache.get(mediaId)!;

    const blob = await downloadMediaFromFirestore(mediaId);
    if (blob) {
      const url = URL.createObjectURL(blob);
      objectUrlCache.set(mediaId, url);
      return url;
    }
  }

  // 3. Chave no IndexedDB (com fallback para Firestore)
  if (urlOrKey.startsWith("idb://")) {
    const rawKey = urlOrKey.replace("idb://", "");
    const activeUrl = await getMediaFileUrl(rawKey);
    if (activeUrl) return activeUrl;

    const cloudBlob = await downloadMediaFromFirestore(rawKey);
    if (cloudBlob) {
      const url = URL.createObjectURL(cloudBlob);
      objectUrlCache.set(rawKey, url);
      return url;
    }
  }

  // 4. Caso seja URL blob expirada
  if (urlOrKey.startsWith("blob:") && suggestedSlotKey) {
    const activeUrl = await getMediaFileUrl(suggestedSlotKey);
    if (activeUrl) return activeUrl;

    const cloudBlob = await downloadMediaFromFirestore(suggestedSlotKey);
    if (cloudBlob) {
      const url = URL.createObjectURL(cloudBlob);
      objectUrlCache.set(suggestedSlotKey, url);
      return url;
    }
    return defaultFallback;
  }

  return defaultFallback;
}

/**
 * Hidrata todos os campos de fotos e vídeos da clínica
 */
export async function hydrateClinicMedia(data: ClinicData): Promise<ClinicData> {
  try {
    const safeData = mergeClinicData(data);
    const updated: ClinicData = { ...safeData };

    updated.hero = {
      ...safeData.hero,
      photo: await resolveSingleMediaUrl(
        safeData.hero.photo,
        INITIAL_CLINIC_DATA.hero.photo,
        "hero_photo"
      ),
    };

    const resolvedVideoUrl = await resolveSingleMediaUrl(
      safeData.video.videoUrl,
      INITIAL_CLINIC_DATA.video.videoUrl,
      "video_main"
    );
    const resolvedPoster = await resolveSingleMediaUrl(
      safeData.video.poster,
      INITIAL_CLINIC_DATA.video.poster,
      "video_poster"
    );

    updated.video = {
      ...safeData.video,
      videoUrl: resolvedVideoUrl,
      poster: resolvedPoster,
    };

    updated.beforeAfterCases = await Promise.all(
      (safeData.beforeAfterCases || []).map(async (c, idx) => {
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

    updated.professionals = await Promise.all(
      (safeData.professionals || []).map(async (p, idx) => {
        const defaultProf = INITIAL_CLINIC_DATA.professionals[idx] || p;
        const photo = await resolveSingleMediaUrl(
          p.photo,
          defaultProf.photo,
          `prof_${p.id}`
        );
        return { ...p, photo };
      })
    );

    updated.clinicPhotos = await Promise.all(
      (safeData.clinicPhotos || []).map(async (cp, idx) => {
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
  } catch (err) {
    console.warn("Erro ao hidratar mídia:", err);
    return mergeClinicData(data);
  }
}
