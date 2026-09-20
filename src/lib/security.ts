import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

function jwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") throw new Error("JWT_SECRET must be configured in production");
  return "development-only-secret-do-not-use-in-production";
}

export function hashValue(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString("base64url");
}

export function signJwt(payload: object, expiresIn: SignOptions["expiresIn"]) {
  return jwt.sign(payload, jwtSecret(), { expiresIn, issuer: "pure-veg-cafe-saas" });
}

export function verifyJwt<T>(token?: string): T | null {
  if (!token) return null;
  try {
    return jwt.verify(token, jwtSecret(), { issuer: "pure-veg-cafe-saas" }) as T;
  } catch {
    return null;
  }
}

export function setSecureCookie(res: NextResponse, name: string, value: string, maxAge: number) {
  res.cookies.set(name, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge
  });
}

export function getClientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init);
}
