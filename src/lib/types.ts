export type CafeStatus = "active" | "expired" | "suspended";
export type OrderStatus = "LIVE" | "BILLING_PENDING" | "PAID" | "CANCELLED";
export type ContextType = "TABLE" | "TAKEAWAY";

export type Cafe = {
  id: string;
  slug: string;
  name: string;
  email: string;
  logoUrl?: string;
  address: string;
  instagramUrl?: string;
  facebookUrl?: string;
  whatsappUrl?: string;
  tables?: string[];
  trialStart: string;
  trialEnd: string;
  suspended: boolean;
  ownerPasswordHash: string;
};

export type MenuItem = {
  id: string;
  cafeId: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  pricePaise: number;
  pureVeg: boolean;
  highMargin: boolean;
  rating: number;
  reviewCount: number;
  portionOptions?: { label: string; pricePaise: number }[];
};

export type CartLine = {
  menuItemId: string;
  name: string;
  quantity: number;
  unitPricePaise: number;
  exclusions: string[];
  addOns: string[];
  notes?: string;
};

export type Order = {
  id: string;
  cafeId: string;
  customerEmail: string;
  customerName: string;
  contextType: ContextType;
  tableNumber?: string;
  status: OrderStatus;
  items: CartLine[];
  subtotalPaise: number;
  taxPaise: number;
  totalPaise: number;
  paymentMethod?: "CASH" | "UPI" | "CARD";
  createdAt: string;
  paidAt?: string;
};
