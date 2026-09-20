import { listOrders, updateOrderStatus } from "@/lib/db";
import { json, verifyJwt } from "@/lib/security";
import { cookies } from "next/headers";
import { z } from "zod";

async function ownerSession() {
  const jar = await cookies();
  return verifyJwt<{ cafeId: string; cafeSlug: string; role: string }>(jar.get("owner_session")?.value);
}

export async function GET() {
  const session = await ownerSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  return json({ orders: await listOrders(session.cafeId) });
}

export async function PATCH(req: Request) {
  const session = await ownerSession();
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const parsed = z.object({ orderId: z.string(), status: z.enum(["LIVE", "BILLING_PENDING", "PAID", "CANCELLED"]) }).safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid status update" }, { status: 400 });
  const order = await updateOrderStatus(parsed.data.orderId, parsed.data.status);
  return order ? json({ order }) : json({ error: "Order not found" }, { status: 404 });
}
