import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const cafeId = new URL(request.url).searchParams.get("cafeId");
  if (!cafeId) return Response.json({ error: "cafeId required" }, { status: 400 });
  try {
    const config = await prisma.gameConfig.findUnique({ where: { cafeId }, select: { minDiscountPercentage: true, maxDiscountPercentage: true, gamesPerCustomerDaily: true } });
    return Response.json({ config: config || { minDiscountPercentage: 5, maxDiscountPercentage: 20, gamesPerCustomerDaily: 2 } });
  } catch {
    return Response.json({ config: { minDiscountPercentage: 5, maxDiscountPercentage: 20, gamesPerCustomerDaily: 2 } });
  } finally { await prisma.$disconnect(); }
}
