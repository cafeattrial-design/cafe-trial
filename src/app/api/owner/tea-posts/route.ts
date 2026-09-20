import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/security";

const prisma = new PrismaClient();

async function owner() {
  const jar = await cookies();
  return verifyJwt<{ cafeId: string }>(jar.get("owner_session")?.value);
}

export async function GET() {
  const session = await owner();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const posts = await prisma.teaPost.findMany({ where: { cafeId: session.cafeId, status: "PENDING" }, orderBy: { createdAt: "asc" }, take: 50 });
    return Response.json({ posts });
  } finally { await prisma.$disconnect(); }
}

export async function PATCH(request: Request) {
  const session = await owner();
  if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await request.json();
    if (!body.id || !["APPROVED", "REJECTED"].includes(body.status)) return Response.json({ error: "Invalid action" }, { status: 400 });
    const result = await prisma.teaPost.updateMany({ where: { id: body.id, cafeId: session.cafeId, status: "PENDING" }, data: { status: body.status } });
    if (!result.count) return Response.json({ error: "Submission unavailable" }, { status: 404 });
    return Response.json({ success: true });
  } finally { await prisma.$disconnect(); }
}
