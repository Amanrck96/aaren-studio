import { ref, uploadBytes, getDownloadURL, deleteObject, uploadString } from "firebase/storage";
import { storage } from "./firebase";

/**
 * Automatically determine folder based on file extension & MIME type:
 * - images/ (JPG, PNG, WEBP, SVG, GIF)
 * - documents/ (PDF, DOCX, TXT)
 * - excel/ (XLSX, XLS, CSV)
 * - general/
 */
export function getFolderForFile(fileName: string, mimeType?: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'].includes(ext) || mimeType?.startsWith('image/')) {
    return 'images';
  }
  if (['pdf', 'doc', 'docx', 'txt', 'rtf'].includes(ext) || mimeType?.includes('pdf') || mimeType?.includes('word')) {
    return 'documents';
  }
  if (['xlsx', 'xls', 'csv'].includes(ext) || mimeType?.includes('sheet') || mimeType?.includes('excel') || mimeType?.includes('csv')) {
    return 'excel';
  }
  return 'general';
}

/**
 * Upload any File or Blob to Firebase Storage
 */
export async function uploadFileToFirebase(
  file: File | Blob,
  customFolder?: string
): Promise<{ url: string; fullPath: string; fileName: string; size: number }> {
  const fileName = (file as File).name || `file_${Date.now()}`;
  const folder = customFolder || getFolderForFile(fileName, file.type);
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fullPath = `${folder}/${Date.now()}_${cleanName}`;

  const storageRef = ref(storage, fullPath);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    fullPath: snapshot.ref.fullPath,
    fileName,
    size: file.size,
  };
}

/**
 * Upload Base64 / Data URL to Firebase Storage
 */
export async function uploadDataUrlToFirebase(
  dataUrl: string,
  fileName: string,
  customFolder?: string
): Promise<{ url: string; fullPath: string }> {
  const folder = customFolder || getFolderForFile(fileName);
  const cleanName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fullPath = `${folder}/${Date.now()}_${cleanName}`;

  const storageRef = ref(storage, fullPath);
  const snapshot = await uploadString(storageRef, dataUrl, 'data_url');
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    url: downloadUrl,
    fullPath: snapshot.ref.fullPath,
  };
}

/**
 * Delete a file from Firebase Storage by its fullPath or URL
 */
export async function deleteFileFromFirebase(fullPath: string): Promise<void> {
  const storageRef = ref(storage, fullPath);
  await deleteObject(storageRef);
}
