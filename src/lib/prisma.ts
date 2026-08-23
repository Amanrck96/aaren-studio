import { PrismaClient } from "./prisma-client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  try {
    return (
      globalForPrisma.prisma ||
      new PrismaClient({
        log: ["error"],
      })
    );
  } catch (err) {
    console.error("Prisma Client initialization fallback:", err);
    return new Proxy({} as PrismaClient, {
      get(target, prop) {
        return new Proxy(() => {}, {
          get() {
            return () => Promise.resolve(null);
          },
          apply() {
            return Promise.resolve(null);
          },
        });
      },
    });
  }
}

export const prisma = createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalForPrisma.prisma = prisma;
}

