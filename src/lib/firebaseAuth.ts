import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { ref, set, get, push } from "firebase/database";
import { auth, googleProvider, db } from "./firebase";

export interface UserProfileData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  sector?: string;
  createdAt?: string;
}

export interface UserActivityLog {
  id?: string;
  email: string;
  action: string;
  details?: string;
  timestamp: string;
}

/**
 * Save user profile metadata into Firebase Realtime Database (/users/{uid})
 */
export async function saveUserProfileToDatabase(user: User, sector: string = "Architect"): Promise<UserProfileData> {
  const profileData: UserProfileData = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split("@")[0] || "Studio Member",
    email: user.email,
    photoURL: user.photoURL || null,
    sector: sector,
    createdAt: new Date().toISOString(),
  };

  try {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);

    if (!snapshot.exists()) {
      await set(userRef, profileData);
    } else {
      // Preserve existing sector if already configured
      const existing = snapshot.val();
      profileData.sector = existing.sector || sector;
    }

    // Record login activity in RTDB for Admin tracking
    await trackUserActivity(user.email || "anonymous@studio.com", "Workspace Login & Session Launch", `User UID: ${user.uid}`);
  } catch (err) {
    console.warn("Could not sync user profile to RTDB (proceeding with local session):", err);
  }

  return profileData;
}

/**
 * Track user work activity in Firebase Realtime Database (/user_activities)
 */
export async function trackUserActivity(email: string, action: string, details?: string) {
  try {
    const activitiesRef = ref(db, "user_activities");
    await push(activitiesRef, {
      email,
      action,
      details: details || "",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Failed to log user activity to Firebase:", err);
  }
}

/**
 * Sign In / Sign Up with Google Popup
 */
export async function signInWithGoogle(sector: string = "Architect", retryCount = 0): Promise<{ success: boolean; user?: UserProfileData; error?: string }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const profile = await saveUserProfileToDatabase(user, sector);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    const msg = error?.message || "";
    if ((msg.includes("closing") || msg.includes("hidden") || error?.code === "auth/internal-error") && retryCount < 2) {
      console.warn(`Retrying Google sign-in after database closing/hidden event (attempt ${retryCount + 1})...`);
      await new Promise((r) => setTimeout(r, 600));
      return signInWithGoogle(sector, retryCount + 1);
    }
    if (error?.code === "auth/popup-closed-by-user") {
      return { success: false, error: "Sign-in popup was closed. Please try again." };
    }
    if (msg.includes("closing") || msg.includes("hidden")) {
      return { success: false, error: "Connection interrupted during Google sign-in. Please try again." };
    }
    return { success: false, error: error.message || "Google sign-in failed." };
  }
}

/**
 * Sign Up with Email and Password
 */
export async function signUpWithEmail(name: string, email: string, pass: string, sector: string = "Architect", retryCount = 0): Promise<{ success: boolean; user?: UserProfileData; error?: string }> {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const user = res.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    const profile = await saveUserProfileToDatabase(user, sector);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Email Sign-Up Error:", error);
    const msg = error?.message || "";
    if ((msg.includes("closing") || msg.includes("hidden")) && retryCount < 2) {
      await new Promise((r) => setTimeout(r, 600));
      return signUpWithEmail(name, email, pass, sector, retryCount + 1);
    }
    let userMsg = error.message;
    if (error.code === "auth/email-already-in-use") userMsg = "This email is already registered. Please sign in.";
    if (error.code === "auth/weak-password") userMsg = "Password must be at least 6 characters long.";
    if (msg.includes("closing") || msg.includes("hidden")) userMsg = "Connection interrupted. Please try again.";
    return { success: false, error: userMsg };
  }
}

/**
 * Sign In with Email and Password
 */
export async function loginWithEmail(email: string, pass: string, retryCount = 0): Promise<{ success: boolean; user?: UserProfileData; error?: string }> {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const user = res.user;
    const profile = await saveUserProfileToDatabase(user);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Email Login Error:", error);
    const msg = error?.message || "";
    if ((msg.includes("closing") || msg.includes("hidden")) && retryCount < 2) {
      await new Promise((r) => setTimeout(r, 600));
      return loginWithEmail(email, pass, retryCount + 1);
    }
    let userMsg = error.message;
    if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      userMsg = "Invalid email or password. Please check your credentials.";
    }
    if (msg.includes("closing") || msg.includes("hidden")) userMsg = "Connection interrupted. Please try again.";
    return { success: false, error: userMsg };
  }
}

/**
 * Send Password Reset Email
 */
export async function resetUserPassword(email: string) {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to send password reset email." };
  }
}

/**
 * Sign Out Current User
 */
export async function logoutUser() {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Listen to Authentication State Changes
 */
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}
