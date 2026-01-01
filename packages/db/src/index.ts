import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), ".env"),
});

export { prisma } from './client' // exports instance of prisma
export { AdminType } from "../generated/prisma/client";
// export * from "../generated/prisma/client" // exports generated types from prisma
export type * from "../generated/prisma/client";