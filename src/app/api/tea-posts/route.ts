import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const categories = new Set(["Situationship", "Friend group", "Work/college", "Family function", "Plot twist"]);

function scrubContacts(value: string) {
  return value
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email removed]")
    .replace(/(?:\+?\d[\d\s-]{7,}\d)/g, "[number removed]")
    .replace(/https?:\/\/\S+/g, "[link removed]")
    .trim();
}

function media(value: unknown, kind: "audio" | "image", limit: number) {
  return typeof value === "string" && value.length <= limit && value.startsWith("data:" + kind + "/") ? value : null;
}

const publicSelect = { id: true, category: true, text: true, audioDataUrl: true, receiptDataUrl: true, fireCount: true, shockCount: true, laughCount: true, createdAt: true };

export async function GET(request: Request) {
  const cafeId = new URL(request.url).searchParams.get("cafeId");
  if (!cafeId) return Response.json({ error: "Missing cafeId" }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ posts: [] });
  try {
    const posts = await prisma.teaPost.findMany({ where: { cafeId, status: "APPROVED" }, orderBy: { createdAt: "desc" }, take: 30, select: publicSelect });
    return Response.json({ posts });
  } catch (error) {
    console.error("Tea feed read failed", error);
    return Response.json({ error: "Could not load the tea feed" }, { status: 500 });
  } finally { await prisma.$disconnect(); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.cafeId || !categories.has(body.category) || !body.safetyAccepted || !body.publishAccepted) {
      return Response.json({ error: "Missing confirmation or invalid tea drop" }, { status: 400 });
    }
    const text = scrubContacts(String(body.text || "")).slice(0, 1500);
    const audioDataUrl = media(body.audioDataUrl, "audio", 16_000_000);
    const receiptDataUrl = media(body.receiptDataUrl, "image", 4_000_000);
    if (!text && !audioDataUrl && !receiptDataUrl) return Response.json({ error: "Add text, audio or a receipt" }, { status: 400 });
    const post = await prisma.teaPost.create({ data: { cafeId: body.cafeId, category: body.category, text, audioDataUrl, receiptDataUrl, status: "PENDING" }, select: { id: true, status: true } });
    return Response.json({ post, message: "Sent to the cafe owner for review" }, { status: 201 });
  } catch (error) {
    console.error("Tea submission failed", error);
    return Response.json({ error: "Could not submit this tea" }, { status: 500 });
  } finally { await prisma.$disconnect(); }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const field = body.reaction === "fire" ? "fireCount" : body.reaction === "shock" ? "shockCount" : body.reaction === "laugh" ? "laughCount" : null;
    if (!body.id || !field) return Response.json({ error: "Invalid reaction" }, { status: 400 });
    const existing = await prisma.teaPost.findFirst({ where: { id: body.id, status: "APPROVED" }, select: { id: true } });
    if (!existing) return Response.json({ error: "Post unavailable" }, { status: 404 });
    const post = await prisma.teaPost.update({ where: { id: body.id }, data: { [field]: { increment: 1 } }, select: { id: true, fireCount: true, shockCount: true, laughCount: true } });
    return Response.json({ post });
  } catch {
    return Response.json({ error: "Could not save reaction" }, { status: 500 });
  } finally { await prisma.$disconnect(); }
}
