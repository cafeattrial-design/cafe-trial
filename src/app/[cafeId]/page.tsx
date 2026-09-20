import { getCafeBySlug, getCafeStatus, getMenu } from "@/lib/db";
import CafeExperience from "@/components/CafeExperience";
import TrialExpired from "@/components/TrialExpired";
import { notFound } from "next/navigation";

export default async function CafePage({
  params,
  searchParams
}: {
  params: Promise<{ cafeId: string }>;
  searchParams: Promise<{ table?: string; type?: string; email?: string; customerEmail?: string }>;
}) {
  const { cafeId } = await params;
  const query = await searchParams;
  const cafe = await getCafeBySlug(cafeId);
  if (!cafe) notFound();
  const status = getCafeStatus(cafe);
  const { ownerPasswordHash: _ownerPasswordHash, ...safeCafe } = cafe;
  if (status !== "active") return <TrialExpired cafe={safeCafe} status={status} />;
  return (
    <CafeExperience
      cafe={safeCafe}
      menu={await getMenu(cafe.id)}
      table={query.table}
      type={query.type === "takeaway" ? "takeaway" : undefined}
      customerEmail={query.customerEmail || query.email}
    />
  );
}
