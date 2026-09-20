import { getCafeBySlug, getCafeStatus, getMenu } from "@/lib/db";
import { json } from "@/lib/security";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return json({ error: "Cafe not found" }, { status: 404 });
  const { ownerPasswordHash: _ownerPasswordHash, ...safeCafe } = cafe;
  return json({ cafe: safeCafe, status: getCafeStatus(cafe), menu: await getMenu(cafe.id) });
}
