import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

// Play a game and determine win/loss with discount
export async function POST(req: Request) {
  try {
    const { cafeId, gameId, customerEmail, customerName, membershipTier = "basic" } = await req.json();

    if (!cafeId || !gameId || !customerEmail) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get or create customer profile
    let customerProfile = await prisma.customerProfile.findUnique({
      where: { cafeId_email: { cafeId, email: customerEmail } }
    });

    if (!customerProfile) {
      customerProfile = await prisma.customerProfile.create({
        data: {
          cafeId,
          email: customerEmail,
          name: customerName,
          membershipTier
        }
      });
    } else {
      // Update membership tier if provided
      if (membershipTier !== "basic") {
        await prisma.customerProfile.update({
          where: { id: customerProfile.id },
          data: { membershipTier }
        });
      }
    }

    // Get game config
    const gameConfig = await prisma.gameConfig.findUnique({
      where: { cafeId }
    });

    if (!gameConfig) {
      return Response.json({ error: "Game config not found" }, { status: 404 });
    }

    // Check daily game limit
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const playedToday = await prisma.gamePlay.count({
      where: {
        customerProfileId: customerProfile.id,
        playedAt: { gte: today, lt: tomorrow }
      }
    });

    if (playedToday >= gameConfig.gamesPerCustomerDaily) {
      return Response.json(
        { error: `You've reached your daily game limit (${gameConfig.gamesPerCustomerDaily})` },
        { status: 429 }
      );
    }

    // Simulate game result - 50% chance to win
    const won = Math.random() < 0.5;

    let discountPercentage = 0;
    let discountValue = 0;

    if (won) {
      // Calculate discount based on membership tier
      const multipliers: Record<string, number> = {
        basic: gameConfig.basicTierMultiplier,
        silver: gameConfig.silverTierMultiplier,
        gold: gameConfig.goldTierMultiplier,
        platinum: gameConfig.platinumTierMultiplier
      };

      const multiplier = multipliers[customerProfile.membershipTier] || 1.0;
      const minimum = Math.max(0, Math.min(gameConfig.minDiscountPercentage, gameConfig.maxDiscountPercentage));
      const maximum = Math.max(minimum, gameConfig.maxDiscountPercentage);
      const randomPercentage = minimum + Math.floor(Math.random() * (maximum - minimum + 1));
      discountPercentage = Math.min(maximum, Math.floor(randomPercentage * multiplier));
      discountValue = Math.min(
        gameConfig.maxDiscountValue,
        Math.floor((discountPercentage / 100) * 5000 * multiplier)
      );
    }

    // Record the game play
    const gamePlay = await prisma.gamePlay.create({
      data: {
        gameId,
        cafeId,
        customerProfileId: customerProfile.id,
        won,
        discountPercentage,
        discountValue
      }
    });

    // Update customer total discount
    await prisma.customerProfile.update({
      where: { id: customerProfile.id },
      data: { totalDiscountEarned: { increment: discountValue } }
    });

    return Response.json({
      success: true,
      won,
      discountPercentage,
      discountValue,
      discountValueRupees: (discountValue / 100).toFixed(2)
    });
  } catch (error) {
    console.error("Game play error:", error);
    return Response.json({ error: "Failed to process game" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
