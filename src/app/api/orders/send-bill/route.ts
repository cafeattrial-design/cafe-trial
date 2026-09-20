import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

interface EmailData {
  customerEmail: string;
  customerName: string;
  cafeEmail: string;
  cafeName: string;
  billNumber: string;
  billItems: Array<{ name: string; quantity: number; price: string }>;
  subtotal: string;
  tax: string;
  discount: string;
  total: string;
  paymentMethod: string;
  billDate: string;
}

async function sendBillEmail(data: EmailData) {
  try {
    // Create email transporter using cafe's SMTP settings
    let transporter;

    // For demo, use a default SMTP or development mode
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
    } else {
      // Fallback to test account
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    }

    // Generate email HTML
    const billItemsHtml = data.billItems
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.price}</td>
        </tr>
      `
      )
      .join("");

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #a02618; color: white; padding: 20px; text-align: center; border-radius: 5px; }
          .bill-details { margin: 20px 0; }
          .bill-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .bill-table th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #a02618; }
          .totals { margin: 20px 0; text-align: right; }
          .total-row { font-size: 18px; font-weight: bold; color: #a02618; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>${data.cafeName}</h2>
            <p>Thank you for your order!</p>
          </div>
          
          <div class="bill-details">
            <p><strong>Dear ${data.customerName},</strong></p>
            <p>Here is your bill receipt:</p>
            
            <div>
              <strong>Bill #:</strong> ${data.billNumber}<br>
              <strong>Date:</strong> ${data.billDate}<br>
              <strong>Payment Method:</strong> ${data.paymentMethod}
            </div>
          </div>
          
          <table class="bill-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${billItemsHtml}
            </tbody>
          </table>
          
          <div class="totals">
            <div>Subtotal: <strong>${data.subtotal}</strong></div>
            <div>Tax: <strong>${data.tax}</strong></div>
            ${data.discount !== "0.00" ? `<div>Discount: <strong>-${data.discount}</strong></div>` : ""}
            <div class="total-row">Total: ${data.total}</div>
          </div>
          
          <div class="footer">
            <p>Thank you for dining with us! We look forward to your next visit.</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to customer
    await transporter.sendMail({
      from: data.cafeEmail || process.env.SMTP_FROM || "noreply@cafe.local",
      to: data.customerEmail,
      subject: `Bill Receipt #${data.billNumber} from ${data.cafeName}`,
      html: emailHtml
    });

    // Send copy to cafe owner
    await transporter.sendMail({
      from: data.cafeEmail || process.env.SMTP_FROM || "noreply@cafe.local",
      to: data.cafeEmail,
      subject: `Bill Copy #${data.billNumber} - ${data.customerName}`,
      html: emailHtml + `<p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 11px;">
        [This is a copy sent to cafe owner for records]
      </p>`
    });

    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
}

export async function POST(req: Request) {
  try {
    const emailData: EmailData = await req.json();

    await sendBillEmail(emailData);

    return Response.json({ success: true, message: "Bill sent to customer and owner emails" });
  } catch (error) {
    console.error("Error sending bill email:", error);
    return Response.json({ error: "Failed to send bill email" }, { status: 500 });
  }
}
