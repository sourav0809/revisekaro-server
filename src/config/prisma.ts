import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Export prisma and Prisma types
 */
export { prisma, Prisma as PrismaTypes };
