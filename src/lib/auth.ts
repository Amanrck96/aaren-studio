import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "admin@aaren.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        
        // Mock authorization matching standard parameters to allow quick demo/testing out of the box
        if (credentials.email === "admin@aaren.com" && credentials.password === "admin123") {
          return {
            id: "1",
            name: "Aaren Admin",
            email: "admin@aaren.com",
            role: "admin",
          };
        }
        if (credentials.email === "editor@aaren.com" && credentials.password === "editor123") {
          return {
            id: "2",
            name: "Aaren Editor",
            email: "editor@aaren.com",
            role: "editor",
          };
        }
        return null;
      },
    }),
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
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "aaren-creative-studio-super-secret-key-123456",
});
