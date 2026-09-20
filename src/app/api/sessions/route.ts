import { getCafeBySlug, getCafeStatus, getOrCreateTableSession } from "@/lib/db";
import { json } from "@/lib/security";
import { z } from "zod";

const schema = z.object({
  cafeSlug: z.string().min(2).max(60),
  tableNumber: z.string().min(1).max(12),
  sessionToken: z.string().optional()
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid session payload" }, { status: 400 });
  const cafe = await getCafeBySlug(parsed.data.cafeSlug);
  if (!cafe) return json({ error: "Cafe not found" }, { status: 404 });
  if (getCafeStatus(cafe) !== "active") return json({ error: "Cafe is not active" }, { status: 402 });
  const session = await getOrCreateTableSession(cafe.id, parsed.data.tableNumber, parsed.data.sessionToken);
  return json(session);
}
