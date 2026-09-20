import nodemailer from "nodemailer";
import type { Cafe, Order } from "./types";

function money(paise: number) {
  return `₹${(paise / 100).toFixed(2)}`;
}

export function renderReceipt(order: Order, cafe: Cafe) {
  const lines = order.items
    .map((item) => `${item.quantity} x ${item.name} - ${money(item.unitPricePaise * item.quantity)}`)
    .join("\n");
  return `${cafe.name}
${cafe.address}

Order: ${order.id}
Customer: ${order.customerName}
Service: ${order.contextType === "TAKEAWAY" ? "Counter pickup" : `Table ${order.tableNumber}`}

${lines}

Subtotal: ${money(order.subtotalPaise)}
Tax: ${money(order.taxPaise)}
Total: ${money(order.totalPaise)}

Thank you for dining with us!`;
}

export async function sendMail(to: string | string[], subject: string, text: string) {
  if (!process.env.SMTP_HOST) {
    console.info("SMTP not configured. Mail preview:", { to, subject, text });
    return;
  }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "Pure Veg Cafe <orders@example.com>",
    to,
    subject,
    text
  });
}

export async function sendOtp(cafe: Cafe, otp: string) {
  await sendMail(cafe.email, `${cafe.name} owner OTP`, `Your 6-digit POS login OTP is ${otp}. It expires in 10 minutes.`);
}

export async function sendSuperAdminOtp(email: string, otp: string) {
  await sendMail(email, "Pure Veg Cafe super-admin OTP", `Your 6-digit super-admin login OTP is ${otp}. It expires in 10 minutes.`);
}

export async function sendInvoice(cafe: Cafe, order: Order) {
  const receipt = renderReceipt(order, cafe);
  await sendMail([order.customerEmail, cafe.email], `${cafe.name} receipt ${order.id}`, receipt);
}
