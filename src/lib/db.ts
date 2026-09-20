import bcrypt from "bcryptjs";
import { seedMenu } from "./menu";
import { hashValue, randomToken } from "./security";
import type { Cafe, CartLine, CafeStatus, Order } from "./types";

type Session = {
  cafeId: string;
  tableNumber: string;
  tokenHash: string;
  orderId?: string;
  expiresAt: string;
};

type Otp = {
  id: string;
  cafeId: string;
  codeHash: string;
  expiresAt: string;
  consumed: boolean;
};

type SuperAdminOtp = {
  id: string;
  email: string;
  codeHash: string;
  expiresAt: string;
  consumed: boolean;
};

const ownerPasswordHash = process.env.D_TREAT_OWNER_PASSWORD_HASH || bcrypt.hashSync(randomToken(), 12);
const seededTrialStart = new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString();
const seededTrialEnd = process.env.D_TREAT_TRIAL_END || new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString();

const seededCafes: Cafe[] = [
  {
    id: "d-treat",
    slug: "d-treat",
    name: "D'TREAT",
    email: "owner@greenbowl.example",
    address: "12 Basil Street, Ahmedabad",
    instagramUrl: "https://www.instagram.com/dtreat.in/?hl=en",
    facebookUrl: "https://facebook.com",
    whatsappUrl: "https://wa.me/919999999999",
    tables: Array.from({ length: 12 }, (_, index) => String(index + 1)),
    trialStart: seededTrialStart,
    trialEnd: seededTrialEnd,
    suspended: false,
    ownerPasswordHash
  }
];

type ReviewEntry = { cafeId: string; menuItemId: string; customerEmail: string; rating: number; body: string; createdAt: string };
type CafeMemoryStore = {
  cafes: Cafe[];
  sessions: Map<string, Session>;
  orders: Map<string, Order>;
  otps: Map<string, Otp>;
  superAdminOtps: Map<string, SuperAdminOtp>;
  reviews: ReviewEntry[];
  loyalty: Map<string, number>;
};

const globalCafeStore = globalThis as typeof globalThis & { __cafeMemoryStore?: CafeMemoryStore };
const memory = globalCafeStore.__cafeMemoryStore || {
  cafes: seededCafes,
  sessions: new Map<string, Session>(),
  orders: new Map<string, Order>(),
  otps: new Map<string, Otp>(),
  superAdminOtps: new Map<string, SuperAdminOtp>(),
  reviews: [],
  loyalty: new Map<string, number>()
};
globalCafeStore.__cafeMemoryStore = memory;

const { cafes, sessions, orders, otps, superAdminOtps, reviews, loyalty } = memory;

export async function getCafeBySlug(slug: string) {
  return cafes.find((c) => c.slug === slug) || null;
}

export async function listCafes() {
  return cafes.map(({ ownerPasswordHash: _, ...cafe }) => cafe);
}

export function getCafeStatus(cafe: Cafe): CafeStatus {
  if (cafe.suspended) return "suspended";
  if (new Date(cafe.trialEnd).getTime() < Date.now()) return "expired";
  return "active";
}

export async function createCafe(input: Omit<Cafe, "id" | "ownerPasswordHash" | "suspended"> & { ownerPassword: string }) {
  if (await getCafeBySlug(input.slug)) throw new Error("Cafe slug already exists");
  const cafe: Cafe = {
    id: input.slug,
    slug: input.slug,
    name: input.name,
    email: input.email,
    logoUrl: input.logoUrl,
    address: input.address,
    instagramUrl: input.instagramUrl,
    facebookUrl: input.facebookUrl,
    whatsappUrl: input.whatsappUrl,
    trialStart: input.trialStart,
    trialEnd: input.trialEnd,
    suspended: false,
    ownerPasswordHash: await bcrypt.hash(input.ownerPassword, 12)
  };
  cafes.push(cafe);
  return cafe;
}

export async function setCafeSuspended(slug: string, suspended: boolean) {
  const cafe = await getCafeBySlug(slug);
  if (!cafe) return null;
  cafe.suspended = suspended;
  return cafe;
}

export async function getMenu(cafeId: string) {
  return seedMenu.map((item) => {
    const actualReviews = reviews.filter((review) => review.cafeId === cafeId && review.menuItemId === item.id);
    if (actualReviews.length === 0) return { ...item, cafeId };
    const rating = actualReviews.reduce((sum, review) => sum + review.rating, 0) / actualReviews.length;
    return {
      ...item,
      cafeId,
      rating: Number(rating.toFixed(1)),
      reviewCount: actualReviews.length
    };
  });
}

export async function getOrCreateTableSession(cafeId: string, tableNumber: string, presentedToken?: string) {
  const key = `${cafeId}:${tableNumber}`;
  const existing = sessions.get(key);
  if (existing && new Date(existing.expiresAt).getTime() > Date.now()) {
    const ownsSession = presentedToken ? hashValue(presentedToken) === existing.tokenHash : false;
    return { active: true, ownsSession, orderId: existing.orderId, token: ownsSession ? presentedToken : undefined };
  }

  const token = randomToken();
  sessions.set(key, {
    cafeId,
    tableNumber,
    tokenHash: hashValue(token),
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString()
  });
  return { active: false, ownsSession: true, token };
}

export async function createOrder(input: Omit<Order, "id" | "status" | "createdAt"> & { sessionToken?: string }) {
  if (input.contextType === "TABLE" && input.tableNumber) {
    const active = sessions.get(`${input.cafeId}:${input.tableNumber}`);
    if (active && active.tokenHash !== hashValue(input.sessionToken || "")) {
      throw new Error("This table already has an active order. Use Add More Items from the original device.");
    }
  }

  const id = `ord_${randomToken(8)}`;
  const order: Order = {
    id,
    cafeId: input.cafeId,
    customerEmail: input.customerEmail,
    customerName: input.customerName,
    contextType: input.contextType,
    tableNumber: input.contextType === "TAKEAWAY" ? undefined : input.tableNumber,
    status: "LIVE",
    items: input.items,
    subtotalPaise: input.subtotalPaise,
    taxPaise: input.taxPaise,
    totalPaise: input.totalPaise,
    createdAt: new Date().toISOString()
  };
  orders.set(id, order);
  if (order.contextType === "TABLE" && order.tableNumber) {
    const session = sessions.get(`${order.cafeId}:${order.tableNumber}`);
    if (session) session.orderId = id;
  }
  const loyaltyKey = `${order.cafeId}:${order.customerEmail.toLowerCase()}`;
  loyalty.set(loyaltyKey, (loyalty.get(loyaltyKey) || 0) + 1);
  return order;
}

export async function addItemsToOrder(orderId: string, items: CartLine[], sessionToken?: string) {
  const order = orders.get(orderId);
  if (!order || order.status !== "LIVE") throw new Error("Order cannot be updated");
  if (order.contextType === "TABLE" && order.tableNumber) {
    const session = sessions.get(`${order.cafeId}:${order.tableNumber}`);
    if (!session || session.tokenHash !== hashValue(sessionToken || "")) {
      throw new Error("Only the active table device can update this order.");
    }
  }
  order.items.push(...items);
  order.subtotalPaise = order.items.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
  order.taxPaise = Math.round(order.subtotalPaise * 0.05);
  order.totalPaise = order.subtotalPaise + order.taxPaise;
  return order;
}

export async function listOrders(cafeId: string) {
  return [...orders.values()].filter((order) => order.cafeId === cafeId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const order = orders.get(orderId);
  if (!order) return null;
  order.status = status;
  return order;
}

export async function markPaid(orderId: string, paymentMethod: NonNullable<Order["paymentMethod"]>) {
  const order = orders.get(orderId);
  if (!order) return null;
  order.status = "PAID";
  order.paymentMethod = paymentMethod;
  order.paidAt = new Date().toISOString();
  return order;
}

export async function createOtp(cafeId: string, otp: string) {
  const id = `otp_${randomToken(8)}`;
  otps.set(id, {
    id,
    cafeId,
    codeHash: hashValue(otp),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    consumed: false
  });
  return id;
}

export async function consumeOtp(cafeId: string, challengeId: string, otp: string) {
  const challenge = otps.get(challengeId);
  if (!challenge || challenge.cafeId !== cafeId || challenge.consumed) return false;
  if (new Date(challenge.expiresAt).getTime() < Date.now()) return false;
  if (challenge.codeHash !== hashValue(otp)) return false;
  challenge.consumed = true;
  return true;
}

export async function createSuperAdminOtp(email: string, otp: string) {
  const id = `sadmin_otp_${randomToken(8)}`;
  superAdminOtps.set(id, {
    id,
    email: email.toLowerCase(),
    codeHash: hashValue(otp),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    consumed: false
  });
  return id;
}

export async function consumeSuperAdminOtp(email: string, challengeId: string, otp: string) {
  const challenge = superAdminOtps.get(challengeId);
  if (!challenge || challenge.email !== email.toLowerCase() || challenge.consumed) return false;
  if (new Date(challenge.expiresAt).getTime() < Date.now()) return false;
  if (challenge.codeHash !== hashValue(otp)) return false;
  challenge.consumed = true;
  return true;
}

export async function addReview(input: { cafeId: string; menuItemId: string; customerEmail: string; rating: number; body: string }) {
  reviews.push({ ...input, createdAt: new Date().toISOString() });
  return input;
}

export async function analytics(cafeId: string) {
  const cafeOrders = [...orders.values()].filter((o) => o.cafeId === cafeId && o.status === "PAID");
  const totalRevenuePaise = cafeOrders.reduce((sum, order) => sum + order.totalPaise, 0);
  const topDishes = new Map<string, number>();
  for (const order of cafeOrders) for (const item of order.items) topDishes.set(item.name, (topDishes.get(item.name) || 0) + item.quantity);
  return {
    totalRevenuePaise,
    totalOrders: cafeOrders.length,
    ytdRevenuePaise: totalRevenuePaise,
    peakHours: Array.from({ length: 12 }, (_, i) => ({ hour: `${10 + i}:00`, orders: Math.floor(Math.random() * 9) + 1 })),
    topDishes: [...topDishes.entries()].map(([name, sold]) => ({ name, sold })).slice(0, 5),
    satisfaction: reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 4.7
  };
}
