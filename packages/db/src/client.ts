import dotenv from "dotenv";
import path from "path";

// force load root env
dotenv.config({
  path: path.resolve(process.cwd(), "../../.env"),
});

console.log("CWD =>", process.cwd());
console.log("ENV FILE =>", path.resolve(process.cwd(), "../../.env"));
console.log("DATABASE_URL =>", process.env.DATABASE_URL);


import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
    });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;