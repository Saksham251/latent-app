import { RequestHandler } from "express";
import { SUPERADMIN_JWT_PASSWORD } from "../config";
import { middleware } from "./index"

export const superAdminMiddleware: RequestHandler = middleware(SUPERADMIN_JWT_PASSWORD)