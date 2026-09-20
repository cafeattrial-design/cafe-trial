import { getCafeBySlug, markPaid } from "@/lib/db";
import { sendInvoice } from "@/lib/mailer";
import { printKot } from "@/lib/thermal";
import { json, verifyJwt } from "@/lib/security";
import { paymentSchema } from "@/lib/validators";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const jar = await cookies();
  const session = verifyJwt<{ cafeId: string; cafeSlug: string; role: string }>(jar.get("owner_session")?.value);
  if (!session) return json({ error: "Unauthorized" }, { status: 401 });
  const parsed = paymentSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid payment" }, { status: 400 });
  const order = await markPaid(parsed.data.orderId, parsed.data.method);
  if (!order) return json({ error: "Order not found" }, { status: 404 });
  const cafe = await getCafeBySlug(session.cafeSlug);
  if (cafe) {
    await sendInvoice(cafe, order);
    await printKot(order, cafe);
  }
  return json({ order });
}
