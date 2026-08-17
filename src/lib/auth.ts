import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Email or Access Code", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const input = (credentials.username || "").trim();
        const pwd = (credentials.password || "").trim();

        const adminEmail = process.env.ADMIN_EMAIL || "admin@aarenstudio.com";
        const adminPassword = process.env.ADMIN_PASSWORD || "Aaren@Admin2026!";
        const editorEmail = process.env.EDITOR_EMAIL || "editor@aarenstudio.com";
        const editorPassword = process.env.EDITOR_PASSWORD || "Aaren@Editor2026!";

        // 1. Admin & Editor
        if (input === adminEmail && pwd === adminPassword) {
          return { id: "1", name: "Aaren Admin", email: adminEmail, role: "admin" };
        }
        if (input === editorEmail && pwd === editorPassword) {
          return { id: "2", name: "Aaren Editor", email: editorEmail, role: "editor" };
        }

        // 2. Client Authentication (by email & accessCode or password)
        try {
          const client = await prisma.client.findFirst({
            where: {
              OR: [
                { email: input },
                { accessCode: input },
                { name: input },
              ],
            },
          });

          if (client) {
            // If client has passwordHash or accessCode check
            if (client.accessCode && client.accessCode === pwd) {
              return {
                id: client.id,
                name: client.name,
                email: client.email || `${client.name.toLowerCase().replace(/\s+/g, "")}@client.aarenstudio.com`,
                role: "CLIENT",
                clientId: client.id,
              } as any;
            }
            if (client.passwordHash && client.passwordHash === pwd) {
              return {
                id: client.id,
                name: client.name,
                email: client.email || "",
                role: "CLIENT",
                clientId: client.id,
              } as any;
            }
            // Allow passwordless access code in username field directly if password matches or empty
            if (input === client.accessCode || (!client.passwordHash && !client.accessCode)) {
              return {
                id: client.id,
                name: client.name,
                email: client.email || "",
                role: "CLIENT",
                clientId: client.id,
              } as any;
            }
          }
        } catch (e) {
          console.warn("Client auth query fallback:", e);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "editor";
        token.clientId = (user as any).clientId || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).clientId = token.clientId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "aaren-creative-studio-super-secret-key-123456",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { handler as auth };
