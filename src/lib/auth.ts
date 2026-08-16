import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const adminEmail = process.env.ADMIN_EMAIL || "admin@aarenstudio.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Aaren@Admin2026!";
        const editorEmail = process.env.EDITOR_EMAIL || "editor@aarenstudio.com";
        const editorPassword = process.env.EDITOR_PASSWORD || "Aaren@Editor2026!";

        if (credentials.username === adminEmail && credentials.password === adminPassword) {
          return { id: "1", name: "Aaren Admin", email: adminEmail, role: "admin" };
        }
        if (credentials.username === editorEmail && credentials.password === editorPassword) {
          return { id: "2", name: "Aaren Editor", email: editorEmail, role: "editor" };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "editor";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/admin/login"
  },
  secret: process.env.NEXTAUTH_SECRET || "aaren-creative-studio-super-secret-key-123456"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { handler as auth };
