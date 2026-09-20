import type { Cafe, Order } from "./types";
import { renderReceipt } from "./mailer";

export function buildEscPosTicket(order: Order, cafe: Cafe) {
  const text = renderReceipt(order, cafe);
  return Buffer.concat([
    Buffer.from([0x1b, 0x40]),
    Buffer.from(text, "utf8"),
    Buffer.from("\n\n\n"),
    Buffer.from([0x1d, 0x56, 0x41, 0x10])
  ]);
}

export async function printKot(order: Order, cafe: Cafe) {
  const payload = buildEscPosTicket(order, cafe);
  if (!process.env.LOCAL_PRINT_SERVER_URL) {
    console.info("Print server not configured. ESC/POS bytes prepared:", payload.length);
    return { mode: "preview", bytes: payload.length };
  }
  const res = await fetch(process.env.LOCAL_PRINT_SERVER_URL, {
    method: "POST",
    headers: { "content-type": "application/octet-stream" },
    body: payload
  });
  if (!res.ok) throw new Error("Printer server rejected ticket");
  return { mode: "server", bytes: payload.length };
}
