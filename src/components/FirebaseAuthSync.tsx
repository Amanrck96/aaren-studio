/**
 * FirebaseAuthSync - Global Auth State Persistence
 *
 * Runs on every page (mounted in layout.tsx) and keeps localStorage in sync
 * with Firebase auth state. Ensures getLoggedInUser() returns isLoggedIn:true
 * for logged-in users on ALL pages (catalogs, brands, products, etc.) not
 * just after visiting the login page.
 *
 * Renders nothing - purely a side-effect component.
 */
"use client";

import { useEffect } from "react";
import { auth } from "@/lib/firebase";

export default function FirebaseAuthSync() {
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      try {
        if (user) {
          // User is logged in - persist auth flags so catalog gate skips form
          localStorage.setItem("aaren_firebase_authed", "true");
          localStorage.setItem(
            "aaren_firebase_user",
            JSON.stringify({
              email: user.email || "",
              displayName:
                user.displayName ||
                user.email?.split("@")[0] ||
                "Studio Member",
              uid: user.uid,
            })
          );
        } else {
          // User signed out - clear auth flags
          localStorage.removeItem("aaren_firebase_authed");
          localStorage.removeItem("aaren_firebase_user");
        }
      } catch (_) {
        // localStorage may be unavailable in private browsing - fail silently
      }
    });

    return () => unsub();
  }, []);

  return null;
}
