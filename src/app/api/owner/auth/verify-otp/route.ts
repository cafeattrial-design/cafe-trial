import { consumeOtp, getCafeBySlug } from "@/lib/db";
import { json, setSecureCookie, signJwt } from "@/lib/security";
import { otpSchema } from "@/lib/validators";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const parsed = otpSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid OTP" }, { status: 400 });
  const cafe = await getCafeBySlug(parsed.data.cafeSlug);
  if (!cafe) return json({ error: "Invalid OTP" }, { status: 401 });
  const ok = await consumeOtp(cafe.id, parsed.data.challengeId, parsed.data.otp);
  if (!ok) return json({ error: "Invalid or expired OTP" }, { status: 401 });

  const res = NextResponse.json({ ok: true });
  setSecureCookie(res, "owner_session", signJwt({ role: "owner", cafeSlug: cafe.slug, cafeId: cafe.id }, "7d"), 60 * 60 * 24 * 7);
  return res;
}
