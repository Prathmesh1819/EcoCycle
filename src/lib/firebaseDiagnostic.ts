import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export const runAuthDiagnostic = async (): Promise<{ code: string; message: string }> => {
  const dummyEmail = `diag_${Date.now()}@ecocycle-test.invalid`;
  const dummyPassword = "DiagnosticPassword123!";

  try {
    const cred = await createUserWithEmailAndPassword(auth, dummyEmail, dummyPassword);
    // Clean up if somehow it created
    if (cred.user) {
      await cred.user.delete();
    }
    return { code: "SUCCESS", message: "Firebase Auth connection verified successfully." };
  } catch (err: any) {
    return {
      code: err?.code || "UNKNOWN_ERROR",
      message: err?.message || "Failed to communicate with Firebase Auth backend."
    };
  }
};
