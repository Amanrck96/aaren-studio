/**
 * Client-Side Auth & User Detection Utility
 * Detects whether the current visitor is logged in (as Client, Architect, Admin, or NextAuth Session)
 * and provides silent PDF view logging.
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
    // 1. Check Workspace / Client Auth
    const clientDataStr = localStorage.getItem("aaren_client_data");
    const clientToken = localStorage.getItem("aaren_client_token");

    if (clientDataStr && clientToken) {
      const parsed = JSON.parse(clientDataStr);
      return {
        isLoggedIn: true,
        name: parsed.name || "Client User",
        email: parsed.email || "",
        phone: parsed.phone || "",
        company: parsed.company || "",
        role: "Client",
      };
    }

    // 2. Check Admin / Editor Auth
    const isAdmin =
      localStorage.getItem("aaren_admin_auth") === "true" ||
      localStorage.getItem("aaren_admin_logged_in") === "true";

    if (isAdmin) {
      const adminEmail = localStorage.getItem("aaren_admin_email") || "admin@aarenstudio.com";
      const adminName = localStorage.getItem("aaren_admin_name") || "Aaren Admin";
      return {
        isLoggedIn: true,
        name: adminName,
        email: adminEmail,
        phone: "+91 98800 12345",
        role: "Admin",
      };
    }

    // 3. Check generic user info saved in localStorage from previous session / form
    const savedUserStr = localStorage.getItem("aaren_user_session");
    if (savedUserStr) {
      const parsed = JSON.parse(savedUserStr);
      if (parsed && (parsed.email || parsed.name)) {
        return {
          isLoggedIn: true,
          name: parsed.name || "Registered User",
          email: parsed.email || "",
          phone: parsed.phone || "",
          company: parsed.company || "",
          role: parsed.role || "Architect",
        };
      }
    }
  } catch (e) {
    console.warn("Auth user lookup error:", e);
  }

  return { isLoggedIn: false };
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
        pdfName: options.pdfName,
        pdfUrl: options.pdfUrl || "",
        brandName: options.brandName || "",
        productTitle: options.productTitle || "",
        userName: user.name || "Logged-In User",
        userEmail: user.email || "client@aarenstudio.com",
        userPhone: user.phone || "+91 (Logged In User)",
        userRole: user.role || "Client",
        source: "auto-logged-in",
      }),
    });
  } catch (e) {
    console.error("Silent PDF view logging failed:", e);
  }
}
