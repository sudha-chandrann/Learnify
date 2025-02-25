import { PrismaClient } from "@prisma/client";

/* eslint-disable no-var */
declare global {
  var prisma: PrismaClient | undefined;
}
/* eslint-enable no-var */

// Create the PrismaClient instance or reuse the existing global instance
export const db = global.prisma || new PrismaClient();

// In non-production environments, store the instance in the global object to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  global.prisma = db;
}

