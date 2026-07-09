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
        if (credentials.username === "admin@aaren.com" && credentials.password === "admin123") {
          return { id: "1", name: "Aaren Admin", email: "admin@aaren.com", role: "admin" };
        }
        if (credentials.username === "editor@aaren.com" && credentials.password === "editor123") {
          return { id: "2", name: "Aaren Editor", email: "editor@aaren.com", role: "editor" };
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
