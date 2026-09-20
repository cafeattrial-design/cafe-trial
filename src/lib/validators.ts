import { z } from "zod";

export const customerContextSchema = z.object({
  table: z.string().trim().max(12).optional(),
  type: z.enum(["takeaway"]).optional()
});

export const orderSchema = z.object({
  cafeSlug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  customerEmail: z.string().email().max(254),
  customerName: z.string().min(2).max(80),
  contextType: z.enum(["TABLE", "TAKEAWAY"]),
  tableNumber: z.string().trim().max(12).optional(),
  sessionToken: z.string().min(20).max(256).optional(),
  items: z.array(z.object({
    menuItemId: z.string().min(2).max(80),
    name: z.string().min(2).max(120),
    quantity: z.number().int().min(1).max(20),
    unitPricePaise: z.number().int().min(0).max(1000000),
    exclusions: z.array(z.string().max(60)).max(12),
    addOns: z.array(z.string().max(60)).max(12),
    notes: z.string().max(240).optional()
  })).min(1).max(80)
}).superRefine((value, context) => {
  if (value.contextType === "TABLE" && !value.tableNumber) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["tableNumber"], message: "Scan a table QR code before ordering" });
  }
});

export const addItemsSchema = z.object({
  orderId: z.string().min(5),
  sessionToken: z.string().min(20).max(256).optional(),
  tableNumber: z.string().trim().max(12).optional(),
  items: z.array(z.object({
    menuItemId: z.string().min(2).max(80),
    name: z.string().min(2).max(120),
    quantity: z.number().int().min(1).max(20),
    unitPricePaise: z.number().int().min(0).max(1000000),
    exclusions: z.array(z.string().max(60)).max(12),
    addOns: z.array(z.string().max(60)).max(12),
    notes: z.string().max(240).optional()
  })).min(1).max(80)
});

export const passwordSchema = z.object({
  cafeSlug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  password: z.string().min(8).max(128)
});

export const otpSchema = z.object({
  cafeSlug: z.string().min(2).max(60).regex(/^[a-z0-9-]+$/),
  challengeId: z.string().min(8),
  otp: z.string().regex(/^\d{6}$/)
});

export const paymentSchema = z.object({
  orderId: z.string().min(5),
  method: z.enum(["CASH", "UPI", "CARD"])
});

export const reviewSchema = z.object({
  cafeSlug: z.string().min(2).max(60),
  menuItemId: z.string().min(2).max(80),
  customerEmail: z.string().email(),
  rating: z.number().int().min(1).max(5),
  body: z.string().min(3).max(500)
});
