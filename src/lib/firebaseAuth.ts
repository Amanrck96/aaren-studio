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
import { ref, set, get } from "firebase/database";
import { auth, googleProvider, db } from "./firebase";

export interface UserProfileData {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  sector?: string;
  createdAt?: string;
}

/**
 * Save user profile metadata into Firebase Realtime Database (/users/{uid})
 */
export async function saveUserProfileToDatabase(user: User, sector: string = "Architect"): Promise<UserProfileData> {
  const userRef = ref(db, `users/${user.uid}`);
  const snapshot = await get(userRef);

  const profileData: UserProfileData = {
    uid: user.uid,
    displayName: user.displayName || user.email?.split("@")[0] || "Studio Member",
    email: user.email,
    photoURL: user.photoURL || null,
    sector: sector,
    createdAt: new Date().toISOString(),
  };

  if (!snapshot.exists()) {
    await set(userRef, profileData);
  } else {
    // Preserve existing sector if already configured
    const existing = snapshot.val();
    profileData.sector = existing.sector || sector;
  }

  return profileData;
}

/**
 * Sign In / Sign Up with Google Popup
 */
export async function signInWithGoogle(sector: string = "Architect") {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const profile = await saveUserProfileToDatabase(user, sector);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Google Sign-In Error:", error);
    return { success: false, error: error.message || "Google sign-in failed." };
  }
}

/**
 * Sign Up with Email and Password
 */
export async function signUpWithEmail(name: string, email: string, pass: string, sector: string = "Architect") {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    const user = res.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    const profile = await saveUserProfileToDatabase(user, sector);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Email Sign-Up Error:", error);
    let msg = error.message;
    if (error.code === "auth/email-already-in-use") msg = "This email is already registered. Please sign in.";
    if (error.code === "auth/weak-password") msg = "Password must be at least 6 characters long.";
    return { success: false, error: msg };
  }
}

/**
 * Sign In with Email and Password
 */
export async function loginWithEmail(email: string, pass: string) {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    const user = res.user;
    const profile = await saveUserProfileToDatabase(user);
    return { success: true, user: profile };
  } catch (error: any) {
    console.error("Email Login Error:", error);
    let msg = error.message;
    if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
      msg = "Invalid email or password. Please check your credentials.";
    }
    return { success: false, error: msg };
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
