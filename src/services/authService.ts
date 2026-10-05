import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile as updateAuthProfile,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { createUserProfile, getUserProfile } from "./userService";
import { UserProfile } from "../types/firebase";

export const registerUser = async (
  email: string,
  password: string,
  name: string,
  phone: string = "",
  address: string = ""
): Promise<{ user: FirebaseUser; profile: UserProfile }> => {
  let user: FirebaseUser | null = null;
  let isNewAuthUser = false;
  
  // 1. Firebase Authentication User Creation
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
    isNewAuthUser = true;
  } catch (authErr: any) {
    // Handling requirement 9: if email is already registered in Auth due to a previous partial signup failure
    if (authErr?.code === "auth/email-already-in-use") {
      console.warn("Auth account already exists for email:", email);
      // Attempt to sign in to check if Auth account exists without profile
      try {
        const loginCred = await signInWithEmailAndPassword(auth, email, password);
        user = loginCred.user;
        const existingProfile = await getUserProfile(user.uid);
        if (existingProfile) {
          const errObj = new Error("[AUTH_ERROR] This email is already registered and has an active profile. Please Sign In.");
          (errObj as any).code = "auth/email-already-in-use";
          throw errObj;
        }
        console.log("Found orphan Auth account without Firestore profile. Proceeding to create profile...");
      } catch (loginErr: any) {
        if (loginErr?.message?.includes("[AUTH_ERROR]")) throw loginErr;
        const errObj = new Error("[AUTH_ERROR] This email is already registered in Firebase Authentication. Please Sign In.");
        (errObj as any).code = "auth/email-already-in-use";
        throw errObj;
      }
    } else {
      console.error("Firebase Auth creation failed [AUTH_ERROR]:", authErr);
      let message: string;
      switch (authErr?.code) {
        case "auth/configuration-not-found":
          message = "[AUTH_ERROR] Email/Password authentication is not configured in Firebase Console.";
          break;
        case "auth/operation-not-allowed":
          message = "[AUTH_ERROR] Email/Password provider is disabled in Firebase Console.";
          break;
        case "auth/invalid-email":
          message = "[AUTH_ERROR] Invalid email address format.";
          break;
        case "auth/weak-password":
          message = "[AUTH_ERROR] Password is too weak (minimum 6 characters required).";
          break;
        case "auth/network-request-failed":
          message = "[AUTH_ERROR] Network error. Please check your internet connection.";
          break;
        default:
          message = authErr?.message ? `[AUTH_ERROR] ${authErr.message}` : "[AUTH_ERROR] Registration failed.";
      }
      const errObj = new Error(message);
      (errObj as any).code = authErr?.code || "AUTH_ERROR";
      throw errObj;
    }
  }

  if (!user) {
    throw new Error("[AUTH_ERROR] Could not authenticate user for profile creation.");
  }

  // Update Auth display name
  try {
    await updateAuthProfile(user, { displayName: name });
  } catch (nameErr) {
    console.warn("Could not set Auth display name:", nameErr);
  }

  // Ensure Firebase Auth token is ready so request.auth is populated in Firestore Security Rules
  try {
    await user.getIdToken(true);
  } catch (tokenErr) {
    console.warn("Token refresh warning:", tokenErr);
  }

  // 2. Firestore Document Creation (users/{uid})
  let profile: UserProfile;
  try {
    profile = await createUserProfile({
      uid: user.uid,
      name: name || "",
      email: user.email || email,
      phone: phone || "",
      address: address || "",
      role: "user",
      points: 0,
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'User')}`,
      co2SavedKg: 0,
      itemsRecycledCount: 0
    });
  } catch (firestoreErr: any) {
    console.error("Firestore users/{uid} creation failed [FIRESTORE_PROFILE_ERROR]:", firestoreErr);
    
    // Requirement 8 & 9: Report partial registration status clearly without hiding
    const message = firestoreErr?.code === "permission-denied"
      ? `[FIRESTORE_PROFILE_ERROR] Authentication account created successfully (UID: ${user.uid}), but Firestore profile creation failed due to permission rules.`
      : `[FIRESTORE_PROFILE_ERROR] Authentication account exists (UID: ${user.uid}), but Firestore profile write failed: ${firestoreErr?.message || 'Permission denied'}`;

    const errObj = new Error(message);
    (errObj as any).code = firestoreErr?.code || "FIRESTORE_PROFILE_ERROR";
    throw errObj;
  }

  return { user, profile };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: FirebaseUser; profile: UserProfile | null }> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let profile = await getUserProfile(user.uid);

    if (!profile) {
      console.log("Orphan auth account detected during login. Creating default users/{uid} document...");
      profile = await createUserProfile({
        uid: user.uid,
        name: user.displayName || email.split("@")[0],
        email: user.email || email,
        phone: "",
        address: "",
        role: "user",
        points: 0
      });
    }

    return { user, profile };
  } catch (error: any) {
    console.error("Firebase login error [AUTH_ERROR]:", error);

    let message: string;
    switch (error?.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        message = "[AUTH_ERROR] Invalid email or password.";
        break;
      case "auth/too-many-requests":
        message = "[AUTH_ERROR] Access to this account has been temporarily disabled due to many failed login attempts.";
        break;
      default:
        message = error?.message ? `[AUTH_ERROR] ${error.message}` : "[AUTH_ERROR] Login failed.";
    }

    const errObj = new Error(message);
    (errObj as any).code = error?.code || "AUTH_ERROR";
    throw errObj;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    console.error("Logout error:", error);
    throw new Error("Failed to sign out. Please try again.");
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Password reset error:", error);
    let message = "Unable to send password reset email. Please try again.";
    if (error.code === "auth/user-not-found") {
      message = "No account found with this email address.";
    } else if (error.code === "auth/invalid-email") {
      message = "Invalid email address format.";
    }
    throw new Error(message);
  }
};
