import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aaren IntPro OS — Sign In",
  description: "Access your Aaren IntPro OS Designer Workspace",
};

// This layout intentionally renders children WITHOUT the marketing site
// Header / Footer. It is used for the OS auth pages (login, signup)
// and the admin login. The route group folder name "(os)" is purely
// organisational — Next.js strips the parentheses from the URL.
export default function OSLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
