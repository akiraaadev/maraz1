/**
 * Serviço de sincronização da Clínica com o Banco de Dados Firestore na Nuvem
 */

import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { ClinicData, mergeClinicData } from "../data/initialClinicData";

export {
  uploadMediaToFirestore,
  downloadMediaFromFirestore,
} from "../utils/mediaStorage";

const CLINIC_DOC_PATH = "clinic_data";
const CLINIC_DOC_ID = "main";

/**
 * Salva as fotos, vídeos e informações da clínica no Banco de Dados Firestore
 * Fica salvo na nuvem e acessível para qualquer celular ou computador.
 */
export async function saveClinicDataToDatabase(data: ClinicData): Promise<void> {
  try {
    const docRef = doc(db, CLINIC_DOC_PATH, CLINIC_DOC_ID);
    const sanitized = JSON.parse(JSON.stringify(data));
    sanitized.updatedAt = new Date().toISOString();

    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CLINIC_DOC_PATH}/${CLINIC_DOC_ID}`);
    throw error;
  }
}

/**
 * Carrega os dados da clínica salvos no Banco de Dados
 */
export async function loadClinicDataFromDatabase(): Promise<ClinicData | null> {
  try {
    const docRef = doc(db, CLINIC_DOC_PATH, CLINIC_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return mergeClinicData(snap.data());
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${CLINIC_DOC_PATH}/${CLINIC_DOC_ID}`);
    return null;
  }
}

/**
 * Ouve em tempo real qualquer foto, vídeo ou alteração salva no Banco de Dados
 * Atualiza automaticamente a tela de todos os celulares e computadores conectados.
 */
export function subscribeClinicData(
  onUpdate: (data: ClinicData) => void
): () => void {
  const docRef = doc(db, CLINIC_DOC_PATH, CLINIC_DOC_ID);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const validated = mergeClinicData(snap.data());
        onUpdate(validated);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `${CLINIC_DOC_PATH}/${CLINIC_DOC_ID}`);
    }
  );
}
