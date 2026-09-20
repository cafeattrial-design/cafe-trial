import { createOrder, getCafeBySlug, getCafeStatus } from "@/lib/db";
import { json } from "@/lib/security";
import { orderSchema } from "@/lib/validators";
import { printKot } from "@/lib/thermal";

export async function POST(req: Request) {
  const parsed = orderSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid order", issues: parsed.error.flatten() }, { status: 400 });
  const cafe = await getCafeBySlug(parsed.data.cafeSlug);
  if (!cafe) return json({ error: "Cafe not found" }, { status: 404 });
  if (getCafeStatus(cafe) !== "active") return json({ error: "Trial expired or cafe suspended" }, { status: 402 });
  if (parsed.data.contextType === "TAKEAWAY" && parsed.data.tableNumber) {
    return json({ error: "Takeaway orders must be collected at the counter" }, { status: 400 });
  }

  const subtotalPaise = parsed.data.items.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
  const taxPaise = Math.round(subtotalPaise * 0.05);
  try {
    const order = await createOrder({
      cafeId: cafe.id,
      customerEmail: parsed.data.customerEmail,
      customerName: parsed.data.customerName,
      contextType: parsed.data.contextType,
      tableNumber: parsed.data.tableNumber,
      items: parsed.data.items,
      subtotalPaise,
      taxPaise,
      totalPaise: subtotalPaise + taxPaise,
      sessionToken: parsed.data.sessionToken
    });
    await printKot(order, cafe);
    return json({ order }, { status: 201 });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Order failed" }, { status: 409 });
  }
}
