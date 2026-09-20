import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/security";

const prisma = new PrismaClient();

async function ownerCafeId() {
  const jar = await cookies();
  return verifyJwt<{ cafeId: string }>(jar.get("owner_session")?.value)?.cafeId || null;
}

// Get game configuration
export async function GET(req: Request) {
  try {
    const cafeId = await ownerCafeId();
    if (!cafeId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const gameConfig = await prisma.gameConfig.findUnique({
      where: { cafeId },
      include: {
        cafe: { select: { id: true, name: true } }
      }
    });

    if (!gameConfig) {
      // Create default config
      const newConfig = await prisma.gameConfig.create({
        data: { cafeId }
      });
      return Response.json({ config: newConfig });
    }

    return Response.json({ config: gameConfig });
  } catch (error) {
    console.error("Error fetching game config:", error);
    return Response.json({ error: "Failed to fetch config" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// Update game configuration
export async function POST(req: Request) {
  try {
    const cafeId = await ownerCafeId();
    if (!cafeId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const configData = await req.json();

    const minDiscountPercentage = Math.max(0, Math.min(80, Number(configData.minDiscountPercentage ?? 5)));
    const maxDiscountPercentage = Math.max(minDiscountPercentage, Math.min(80, Number(configData.maxDiscountPercentage ?? 30)));
    const safeConfigData = {
      ...configData,
      minDiscountPercentage,
      maxDiscountPercentage
    };

    const existing = await prisma.gameConfig.findUnique({
      where: { cafeId }
    });

    let config;
    if (existing) {
      config = await prisma.gameConfig.update({
        where: { cafeId },
        data: safeConfigData
      });
    } else {
      config = await prisma.gameConfig.create({
        data: { cafeId, ...safeConfigData }
      });
    }

    return Response.json({ success: true, config });
  } catch (error) {
    console.error("Error updating game config:", error);
    return Response.json({ error: "Failed to update config" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
