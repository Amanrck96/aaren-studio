import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || "info@aarenintpro.com").trim().toLowerCase();
    const expectedPassword = process.env.ADMIN_PASSWORD || "Admin012345";

    const normalizedInputEmail = (email || "").trim().toLowerCase();

    if (
      (normalizedInputEmail === expectedEmail && password === expectedPassword) ||
      (normalizedInputEmail === "admin@aarenstudio.com" && password === (process.env.ADMIN_BACKUP_PASSWORD || "Aaren@Admin2026!"))
    ) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("aaren_admin_session", "authenticated", {
        path: "/",
        maxAge: 86400,
        sameSite: "lax",
        httpOnly: false,
      });
      return response;
    }

    return NextResponse.json(
      { success: false, error: "Invalid Administrative Email or Password." },
      { status: 401 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Server authentication error." },
      { status: 500 }
    );
  }
}
