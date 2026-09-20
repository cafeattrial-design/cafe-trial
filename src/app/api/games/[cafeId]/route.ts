import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all games for a cafe
export async function GET(req: Request, { params }: { params: { cafeId: string } }) {
  try {
    const { cafeId } = await Promise.resolve(params);

    const games = await prisma.game.findMany({
      where: {
        cafeId,
        isActive: true
      }
    });

    return Response.json({ games });
  } catch (error) {
    console.error("Error fetching games:", error);
    return Response.json({ error: "Failed to fetch games" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
