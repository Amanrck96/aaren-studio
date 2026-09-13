import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient | null };

// Only instantiate PrismaClient when DATABASE_URL is actually set.
// Without DATABASE_URL, Prisma throws a validation error at startup
// (not just at query time), which spams logs on every Vercel request.
// All call-sites in store.ts already catch errors and fall back to
// Firebase Storage / seeded JSON — so returning null here is safe.
function createPrismaClient(): PrismaClient | null {
  if (!process.env.DATABASE_URL) {
    return null;
  }
  try {
    return new PrismaClient({ log: ["error"] });
  } catch {
    return null;
  }
}

export const prisma: PrismaClient =
  (globalForPrisma.prisma ?? createPrismaClient()) as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
