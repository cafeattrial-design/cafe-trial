import { analytics } from "@/lib/db";
import { json, verifyJwt } from "@/lib/security";
import { cookies } from "next/headers";

export async function GET() {
  const jar = await cookies();
  const session = verifyJwt<{ cafeId: string }>(jar.get("owner_session")?.value);
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  return json(await analytics(session.cafeId));
}
