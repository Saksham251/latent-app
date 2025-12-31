import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

console.log("CWD =>", process.cwd());
console.log("DATABASE_URL =>", process.env.DATABASE_URL);
export { prisma } from './client' // exports instance of prisma
// export * from "../generated/prisma/client" // exports generated types from prisma
export type * from "../generated/prisma/client";