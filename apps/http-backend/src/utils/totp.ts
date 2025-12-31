import { generateToken } from "authenticator";
import { TOTP_SECRET } from "../routes/v1/config";

import { verifyToken as verifyTokenLib } from "authenticator";

export function getToken(number: string, type: "AUTH") {
    return generateToken(number + type + TOTP_SECRET);
}

export function verifyToken(number: string, type: "AUTH", otp: string) {
    return verifyTokenLib(number + type + TOTP_SECRET,  otp)
}