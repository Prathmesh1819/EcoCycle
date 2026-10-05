import { ref, uploadBytes, getDownloadURL, uploadString } from "firebase/storage";
import { storage } from "../lib/firebase";

/**
 * Uploads a File object or base64/dataURL string to Firebase Storage and returns the download URL.
 */
export const uploadStorageFile = async (
  fileOrBase64: File | string,
  path: string
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);

    if (typeof fileOrBase64 === "string") {
      // Data URL or base64 string
      if (fileOrBase64.startsWith("data:")) {
        const snapshot = await uploadString(storageRef, fileOrBase64, "data_url");
        return await getDownloadURL(snapshot.ref);
      } else if (fileOrBase64.startsWith("http://") || fileOrBase64.startsWith("https://")) {
        // Already a remote URL
        return fileOrBase64;
      } else {
        const snapshot = await uploadString(storageRef, fileOrBase64, "raw");
        return await getDownloadURL(snapshot.ref);
      }
    } else {
      // File object
      const snapshot = await uploadBytes(storageRef, fileOrBase64);
      return await getDownloadURL(snapshot.ref);
    }
  } catch (error: any) {
    console.error("Storage upload error:", error);
    throw new Error(error.message || "Failed to upload image to Firebase Storage.");
  }
};
