import OwnerDashboard from "@/components/OwnerDashboard";

export default async function OwnerPage({ params }: { params: Promise<{ cafeId: string }> }) {
  const { cafeId } = await params;
  return <OwnerDashboard cafeSlug={cafeId} />;
}
