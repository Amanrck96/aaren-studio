/**
 * Client-Side Auth & User Detection Utility
 * Detects whether the current visitor is logged in (as Client, Architect, Admin,
 * Firebase user, or NextAuth Session) and provides silent PDF view logging.
 *
 * AUTH PRIORITY (highest → lowest):
 *   1. Workspace / Client token  (aaren_client_token + aaren_client_data)
 *   2. Admin auth flag           (aaren_admin_auth OR aaren_admin_logged_in)
 *   3. Firebase Designer login   (aaren_firebase_authed + aaren_firebase_user)
 *   4. NOT AUTHENTICATED         — aaren_user_session is form-fill data only,
 *                                  it never grants isLoggedIn:true.
 */

export type AuthUserInfo = {
  isLoggedIn: boolean;
  name?: string;
  email?: string;
  phone?: string;
  company?: string;
  role?: string;
};

export function getLoggedInUser(): AuthUserInfo {
  if (typeof window === "undefined") {
    return { isLoggedIn: false };
  }

  try {
    // ── 1. Workspace / Client Auth ──────────────────────────────────────────
    const clientDataStr = localStorage.getItem("aaren_client_data");
    const clientToken   = localStorage.getItem("aaren_client_token");

    if (clientDataStr && clientToken) {
      const parsed = JSON.parse(clientDataStr);
      return {
        isLoggedIn: true,
        name:    parsed.name    || "Client User",
        email:   parsed.email   || "",
        phone:   parsed.phone   || "",
        company: parsed.company || "",
        role:    "Client",
      };
    }

    // ── 2. Admin / Editor Auth ──────────────────────────────────────────────
    const isAdmin =
      localStorage.getItem("aaren_admin_auth")       === "true" ||
      localStorage.getItem("aaren_admin_logged_in")  === "true";

    if (isAdmin) {
      const adminEmail = localStorage.getItem("aaren_admin_email") || "admin@aarenstudio.com";
      const adminName  = localStorage.getItem("aaren_admin_name")  || "Aaren Admin";
      return {
        isLoggedIn: true,
        name:  adminName,
        email: adminEmail,
        phone: "+91 98800 12345",
        role:  "Admin",
      };
    }

    // ── 3. Firebase Designer / Staff Login ──────────────────────────────────
    //   Set by the login page (src/app/(os)/login/page.tsx) after Firebase
    //   onAuthStateChanged succeeds. Cleared on logout.
    const firebaseAuthed = localStorage.getItem("aaren_firebase_authed") === "true";
    if (firebaseAuthed) {
      const firebaseUserStr = localStorage.getItem("aaren_firebase_user");
      const firebaseUser    = firebaseUserStr ? JSON.parse(firebaseUserStr) : {};
      return {
        isLoggedIn: true,
        name:  firebaseUser.displayName || firebaseUser.name || "Studio Member",
        email: firebaseUser.email       || "",
        phone: firebaseUser.phone       || "",
        role:  "Designer",
      };
    }

    // ── NOTE: aaren_user_session is intentionally NOT treated as authenticated.
    //   It stores form-fill data (name/email entered in the PDF gate form) to
    //   pre-fill future forms — it does NOT mean the user has logged in.
    //   See CatalogPdfGateModal.tsx for pre-fill logic.

  } catch (e) {
    console.warn("Auth user lookup error:", e);
  }

  return { isLoggedIn: false };
}

/**
 * Returns pre-fill data from a previous PDF gate form submission.
 * Use this only to pre-populate form fields — never to check authentication.
 */
export function getFormPrefillData(): Partial<{ name: string; email: string; phone: string; profession: string }> {
  if (typeof window === "undefined") return {};
  try {
    const saved = localStorage.getItem("aaren_user_session");
    if (!saved) return {};
    const parsed = JSON.parse(saved);
    return {
      name:       parsed.name       || "",
      email:      parsed.email      || "",
      phone:      parsed.phone      || "",
      profession: parsed.profession || "",
    };
  } catch {
    return {};
  }
}

/**
 * Silently records a PDF view lead in the backend for logged-in users.
 * Does not display any modal, alert, or UI interruption.
 */
export async function logSilentPdfView(options: {
  pdfName: string;
  pdfUrl?: string;
  brandName?: string;
  productTitle?: string;
  user?: AuthUserInfo;
}) {
  try {
    const user = options.user || getLoggedInUser();
    if (!user.isLoggedIn) return;

    await fetch("/api/pdf-view-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pdfName:       options.pdfName,
        pdfUrl:        options.pdfUrl        || "",
        brandName:     options.brandName     || "",
        productTitle:  options.productTitle  || "",
        userName:      user.name             || "Logged-In User",
        userEmail:     user.email            || "client@aarenstudio.com",
        userPhone:     user.phone            || "+91 (Logged In User)",
        userRole:      user.role             || "Client",
        source:        "auto-logged-in",
      }),
    });
  } catch (e) {
    console.error("Silent PDF view logging failed:", e);
  }
}
