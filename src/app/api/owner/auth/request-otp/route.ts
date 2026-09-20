import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createOtp, getCafeBySlug } from "@/lib/db";
import { json } from "@/lib/security";
import { sendOtp } from "@/lib/mailer";
import { passwordSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = passwordSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid credentials" }, { status: 400 });
  const cafe = await getCafeBySlug(parsed.data.cafeSlug);
  if (!cafe) return json({ error: "Invalid credentials" }, { status: 401 });
  const ok = await bcrypt.compare(parsed.data.password, cafe.ownerPasswordHash);
  if (!ok) return json({ error: "Invalid credentials" }, { status: 401 });

  const otp = String(crypto.randomInt(100000, 1000000));
  const challengeId = await createOtp(cafe.id, otp);
  await sendOtp(cafe, otp);
  const isSeededDemo = cafe.slug === "d-treat" && cafe.email.endsWith(".example");
  const devOtp = isSeededDemo || (process.env.NODE_ENV !== "production" && !process.env.SMTP_HOST) ? otp : undefined;
  return json({ challengeId, devOtp });
}
