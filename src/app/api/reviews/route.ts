import { addReview, getCafeBySlug } from "@/lib/db";
import { json } from "@/lib/security";
import { reviewSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = reviewSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid review" }, { status: 400 });
  const cafe = await getCafeBySlug(parsed.data.cafeSlug);
  if (!cafe) return json({ error: "Cafe not found" }, { status: 404 });
  await addReview({ cafeId: cafe.id, ...parsed.data });
  return json({ ok: true }, { status: 201 });
}
