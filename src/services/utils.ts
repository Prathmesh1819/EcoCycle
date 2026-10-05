import { serverTimestamp } from "firebase/firestore";

/**
 * Removes any key with `undefined` value to prevent Firestore setDoc/updateDoc errors.
 */
export const sanitizeData = <T extends Record<string, any>>(data: T): Record<string, any> => {
  const sanitized: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      sanitized[key] = data[key];
    }
  });
  return sanitized;
};

export const getTimestamp = () => serverTimestamp();
