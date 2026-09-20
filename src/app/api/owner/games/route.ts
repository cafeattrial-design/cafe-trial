import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/security";

const prisma = new PrismaClient();

async function ownerCafeId() {
  const jar = await cookies();
  return verifyJwt<{ cafeId: string }>(jar.get("owner_session")?.value)?.cafeId || null;
}

// Get all games for owner
export async function GET(req: Request) {
  try {
    const cafeId = await ownerCafeId();
    if (!cafeId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const games = await prisma.game.findMany({
      where: { cafeId },
      include: {
        _count: {
          select: { plays: true }
        }
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

// Create or update game
export async function POST(req: Request) {
  try {
    const cafeId = await ownerCafeId();
    if (!cafeId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { gameId, name, description, gameType, isActive } = await req.json();

    let game;

    if (gameId) {
      // Update existing game
      const owned = await prisma.game.findFirst({ where: { id: gameId, cafeId }, select: { id: true } });
      if (!owned) return Response.json({ error: "Game not found" }, { status: 404 });
      game = await prisma.game.update({
        where: { id: owned.id },
        data: { name, description, gameType, isActive }
      });
    } else {
      // Create new game
      game = await prisma.game.create({
        data: {
          cafeId,
          name: name || "Lucky Game",
          description: description || "Play to win discounts!",
          gameType: gameType || "wheel"
        }
      });
    }

    return Response.json({ success: true, game });
  } catch (error) {
    console.error("Error managing game:", error);
    return Response.json({ error: "Failed to manage game" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Delete game
export async function DELETE(req: Request) {
  try {
    const cafeId = await ownerCafeId();
    if (!cafeId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { gameId } = await req.json();
    if (!gameId) {
      return Response.json({ error: "gameId required" }, { status: 400 });
    }

    const result = await prisma.game.deleteMany({ where: { id: gameId, cafeId } });
    if (!result.count) return Response.json({ error: "Game not found" }, { status: 404 });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting game:", error);
    return Response.json({ error: "Failed to delete game" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
