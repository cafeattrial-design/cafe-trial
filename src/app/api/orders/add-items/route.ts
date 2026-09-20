import { addItemsToOrder } from "@/lib/db";
import { json } from "@/lib/security";
import { addItemsSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const parsed = addItemsSchema.safeParse(await req.json());
  if (!parsed.success) return json({ error: "Invalid update", issues: parsed.error.flatten() }, { status: 400 });
  try {
    const order = await addItemsToOrder(parsed.data.orderId, parsed.data.items, parsed.data.sessionToken);
    return json({ order });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Could not update order" }, { status: 409 });
  }
}
