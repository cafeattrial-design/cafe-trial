"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BadgePercent,
  Coffee,
  Facebook,
  Instagram,
  KeyRound,
  Leaf,
  Mail,
  Minus,
  Music2,
  Plus,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Volume2,
  Star,
  Trash2,
  UserRound,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Cafe, CartLine, MenuItem } from "@/lib/types";
import TeaLounge from "./TeaLounge";
import TeaFeed from "./TeaFeed";
import QRScannerGuide from "./QRScannerGuide";
import TableGames from "./TableGames";

const dishHistory: Record<string, string> = {
  "Bao & Dimsum": "Bao and dim sum grew from Chinese tea-house traditions, where small steamed bites were made for sharing.",
  "Bagels & Ramen": "Bagels have roots in Eastern European baking, while ramen developed in Japan from Chinese noodle traditions.",
  "Fries & Snacks": "These are modern snack-bar favourites, built around crisp textures and easy sharing.",
  "Hummus & Bowls": "Hummus is a long-loved Levantine chickpea dip, while smoothie bowls are a modern café format.",
  "Coolers & Boba": "Bubble tea began in Taiwan in the 1980s; iced teas and frappes evolved through global café culture.",
  "Desserts": "This dessert style comes from the wider European and American baking tradition, now enjoyed in cafés around the world."
};

function narrationFor(dish: MenuItem) {
  return `${dish.name}. ${dish.description} ${dishHistory[dish.category] || "It is a café favourite made for a relaxed meal."} Please check with our team for the exact recipe, allergens, and today’s preparation.`;
}

async function playDishNarration(dish: MenuItem, onDone: () => void) {
  const text = narrationFor(dish);
  try {
    const response = await fetch("/api/voice/narrate", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ text }) });
    if (response.ok) {
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      audio.onended = () => { URL.revokeObjectURL(audio.src); onDone(); };
      audio.onerror = onDone;
      await audio.play();
      return;
    }
  } catch {
    // Use the device voice when the optional cloned-voice service is unavailable.
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.onend = onDone;
    utterance.onerror = onDone;
    window.speechSynthesis.speak(utterance);
  } else onDone();
}

const exclusions = ["No onions", "No mushrooms", "No garlic", "Jain preparation"];
const addOns = ["Extra cheese", "Extra chutney", "Roasted seeds", "Paneer boost"];

const portionOptions = (dish: MenuItem) => dish.portionOptions?.length
  ? dish.portionOptions
  : [{ label: "Regular serving", pricePaise: dish.pricePaise }];

function paise(value: number) {
  return `Rs. ${(value / 100).toFixed(0)}`;
}

function exactPaise(value: number) {
  return `Rs. ${(value / 100).toFixed(2)}`;
}

function nameFromEmail(email: string) {
  const [local] = email.split("@");
  return (
    local
      .replace(/[._-]+/g, " ")
      .replace(/\d+/g, "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0]?.toUpperCase() + part.slice(1))
      .join(" ") || "Guest"
  );
}

export default function CafeExperience({
  cafe,
  menu,
  table,
  type,
  customerEmail
}: {
  cafe: Omit<Cafe, "ownerPasswordHash">;
  menu: MenuItem[];
  table?: string;
  type?: "takeaway";
  customerEmail?: string;
}) {
  const [category, setCategory] = useState(menu[0]?.category || "Menu");
  const [customizing, setCustomizing] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [ownerAuthOpen, setOwnerAuthOpen] = useState(false);
  const [sessionToken, setSessionToken] = useState<string | undefined>();
  const [resolvedEmail, setResolvedEmail] = useState(customerEmail || "");
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>();
  const [blockedSession, setBlockedSession] = useState<{ orderId?: string } | null>(null);
  const [narratingDishId, setNarratingDishId] = useState<string | null>(null);
  const [selectedPortions, setSelectedPortions] = useState<Record<string, { label: string; pricePaise: number }>>({});
  const contextType = type === "takeaway" ? "TAKEAWAY" : "TABLE";
  const tableNumber = contextType === "TABLE" ? table : undefined;
  const categories = useMemo(() => [...new Set(menu.map((item) => item.category))], [menu]);
  const dishes = menu.filter((item) => item.category === category);
  const totals = useMemo(() => {
    const subtotalPaise = cart.reduce((sum, item) => sum + item.unitPricePaise * item.quantity, 0);
    const taxPaise = Math.round(subtotalPaise * 0.05);
    return { subtotalPaise, taxPaise, totalPaise: subtotalPaise + taxPaise };
  }, [cart]);
  const heroImages = useMemo(() => ["/assets/cafe-feast-hero-v2.png", ...menu.slice(1, 6).map((item) => item.imageUrl)], [menu]);
  const heroCopy = [
    {
      eyebrow: "Premium pure-veg cafe",
      title: "Fresh cafe plates, served beautifully.",
      text: "Scan your table, choose your favorites, customize every bite, and send it straight to the kitchen."
    },
    {
      eyebrow: "Chef's live special",
      title: "Hot dishes, fresh from the counter.",
      text: "Explore high-rated vegetarian dishes with simple add-ons, Jain options, and kitchen notes."
    },
    {
      eyebrow: "Cafe classics",
      title: "Order fast without losing the vibe.",
      text: "Your table, takeaway rule, taxes, cart, and active order updates stay handled in the background."
    }
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const currentCopy = heroCopy[heroIndex % heroCopy.length];

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroImages.length);
    }, 4500);
    return () => window.clearInterval(id);
  }, [heroImages.length]);

  useEffect(() => {
    const openOwnerLogin = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
        event.preventDefault();
        setOwnerAuthOpen(true);
      }
    };
    window.addEventListener("keydown", openOwnerLogin);
    return () => window.removeEventListener("keydown", openOwnerLogin);
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem(`customerEmail:${cafe.slug}`) || "";
    const nextEmail = customerEmail || saved || "guest@scan.local";
    setResolvedEmail(nextEmail);
    if (customerEmail) localStorage.setItem(`customerEmail:${cafe.slug}`, customerEmail);
  }, [cafe.slug, customerEmail]);

  useEffect(() => {
    if (contextType !== "TABLE" || !tableNumber) return;
    const key = `session:${cafe.slug}:${tableNumber}`;
    const saved = localStorage.getItem(key) || undefined;
    fetch("/api/sessions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ cafeSlug: cafe.slug, tableNumber, sessionToken: saved })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem(key, data.token);
          setSessionToken(data.token);
        }
        if (data.active && data.ownsSession && data.orderId) setActiveOrderId(data.orderId);
        if (data.active && !data.ownsSession) setBlockedSession({ orderId: data.orderId });
      })
      .catch(() => undefined);
  }, [cafe.slug, contextType, tableNumber]);

  const addLine = (line: CartLine) => {
    setCart((current) => [...current, line]);
    setCartOpen(true);
  };

  const selectedPortionFor = (dish: MenuItem) => selectedPortions[dish.id] || portionOptions(dish)[0];
  const addDirectlyToCart = (dish: MenuItem) => {
    const selectedPortion = selectedPortionFor(dish);
    const hasChoices = (dish.portionOptions?.length || 0) > 1;
    addLine({ menuItemId: dish.id, name: hasChoices ? `${dish.name} (${selectedPortion.label})` : dish.name, quantity: 1, unitPricePaise: selectedPortion.pricePaise, exclusions: [], addOns: [] });
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ef] text-slate-950">
      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/15 bg-black/18 text-white shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <div className="flex items-center gap-3">
            <img src="/assets/dtreat-instagram-avatar.png" alt="D Treat Instagram profile" className="h-12 w-12 rounded-full border-2 border-white/80 bg-white object-cover shadow-lg shadow-black/20" />
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/70">Food | Music | Leisure</p>
              <h1 className="text-xl font-black leading-none text-white md:text-2xl">{cafe.name}</h1>
            </div>
          </div>
          <nav className="hidden items-center gap-7 text-sm font-bold uppercase tracking-[0.12em] text-white/80 lg:flex">
            <a href="#menu" className="hover:text-white">Menu</a>
            <a href="#spill-the-tea" className="hover:text-white">Spill the tea</a>
            <a href="#table-arcade" className="hover:text-white">Games</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={`/${cafe.slug}?type=takeaway`} className="hidden rounded-full border border-white/20 bg-white/12 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20 md:block">
              {contextType === "TAKEAWAY" ? "Counter pickup" : "Switch to counter pickup"}
            </a>
            
            <button className="tool-button relative" onClick={() => setCartOpen(true)} aria-label="Open cart">
              <ShoppingCart size={19} />
              {cart.length > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[#a02618] px-1.5 text-xs font-bold text-white">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      {!tableNumber && contextType === "TABLE" && (
        <section className="fixed inset-x-4 top-24 z-50 mx-auto max-w-3xl rounded-lg border border-orange-200 bg-white/95 p-4 text-sm text-slate-800 shadow-xl backdrop-blur">
          <strong>Scan your table QR code to order.</strong> This menu link needs a table number so the kitchen can identify exactly where your order came from.
          <a href={"/" + cafe.slug + "?type=takeaway"} className="ml-3 inline-flex rounded-full bg-[#a02618] px-4 py-2 text-xs font-black text-white">Switch to counter pickup</a>
        </section>
      )}

      {blockedSession && (
        <section className="fixed inset-x-4 top-24 z-50 mx-auto max-w-3xl rounded-lg border border-orange-200 bg-white/90 p-4 text-sm text-slate-800 shadow-xl backdrop-blur">
          <strong>Active order in progress.</strong> This table already has a protected session. Use the original device to add more items.
          {blockedSession.orderId && <span className="ml-2 text-slate-500">Order: {blockedSession.orderId}</span>}
        </section>
      )}

      <section className="relative min-h-screen overflow-hidden bg-[#fff8ef]">
        {heroImages.map((src, index) => (
          <motion.img
            key={`${src}-${index}`}
            src={src}
            alt=""
            className="hero-kenburns absolute inset-0 h-full w-full object-cover"
            onError={(event) => { event.currentTarget.src = "/assets/premium-cafe-hero.png"; }}
            animate={{ opacity: index === heroIndex ? 1 : 0 }}
            transition={{ duration: 1.15, ease: "easeOut" }}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.68)_0%,rgba(0,0,0,0.46)_38%,rgba(0,0,0,0.12)_72%,rgba(0,0,0,0.22)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/45 to-transparent" />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-end px-4 pb-16 pt-32 md:px-6 md:pb-24">
          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-sm backdrop-blur">
                  <Music2 size={15} /> {currentCopy.eyebrow}
                </p>
                <p className="mt-5 text-lg font-semibold text-white/85">Welcome, {nameFromEmail(resolvedEmail)}</p>
                <h2 className="mt-2 max-w-3xl text-4xl font-black uppercase leading-[0.96] tracking-tight text-white sm:text-5xl md:text-6xl">
                  {currentCopy.title}
                </h2>
                <p className="mt-5 max-w-2xl text-base font-medium leading-7 text-white/78 md:text-lg">
                  {currentCopy.text}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#menu" className="rounded-full bg-[#a02618] px-7 py-3 font-bold uppercase tracking-[0.08em] text-white shadow-lg shadow-black/20 transition hover:bg-[#821d13]">View menu</a>
              <a href="#spill-the-tea" className="rounded-full border border-white/30 bg-white/10 px-7 py-3 font-bold uppercase tracking-[0.08em] text-white backdrop-blur transition hover:bg-white/20">Play Spill the Tea</a>
            </div>
            <div className="mt-8 grid max-w-2xl grid-cols-3 gap-3" id="loyalty">
              <Feature icon={Leaf} label="Vegetarian Only" tone="text-emerald-600" />
              <Feature icon={Coffee} label="Cafe Classics" tone="text-[#a02618]" />
              <Feature icon={BadgePercent} label="Live Offers" tone="text-orange-500" />
            </div>
          </div>
          <div className="mt-12 flex gap-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                aria-label={`Show hero image ${index + 1}`}
                onClick={() => setHeroIndex(index)}
                className={`h-1.5 rounded-full transition-all ${index === heroIndex ? "w-12 bg-white" : "w-5 bg-white/35"}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section id="specials" className="border-b border-[#f0dfcd] bg-white py-6">
        <div className="mx-auto grid max-w-7xl gap-3 px-4 md:grid-cols-3 md:px-6">
          <Offer title="Chef's Live Special" text="A premium visual spotlight for dishes the cafe wants to push." />
          <Offer title="Pure Veg Promise" text="No meat, no egg, Jain customization supported." />
          <Offer title="Scan & Settle" text="Cart, tax, KOT print, invoice, and POS in one flow." />
        </div>
      </section>

      <section id="menu" className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a02618]">Our menu</p>
            <h2 className="mt-2 text-5xl font-black uppercase tracking-tight text-slate-950">Order cafe favorites</h2>
          </div>
          <SplitBill total={totals.totalPaise} />
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)} className={`rounded-full px-5 py-3 text-sm font-semibold shadow-sm transition ${cat === category ? "bg-[#a02618] text-white" : "border border-[#f0dfcd] bg-white text-slate-600 hover:border-[#a02618]/30 hover:text-[#a02618]"}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((dish) => (
            <article key={dish.id} className="group rounded-2xl border border-[#f0dfcd] bg-white p-4 shadow-[0_22px_55px_rgba(31,41,51,0.08)] transition hover:-translate-y-1 hover:shadow-[0_30px_80px_rgba(160,38,24,0.16)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_43%,#3a2920_0%,#24211f_43%,#171717_78%)] shadow-[inset_0_-22px_30px_rgba(0,0,0,0.28)]">
                <div aria-hidden="true" className="absolute inset-x-[16%] bottom-[7%] h-[28%] rounded-full bg-orange-300/10 blur-2xl" />
                <img src={dish.imageUrl} alt="" className={`relative z-10 h-full w-full ${dish.id === "flaming-hot-mozzarella-sticks" || dish.category === "Coolers & Boba" ? "object-contain p-3" : "scale-[1.12] object-cover"} mix-blend-screen drop-shadow-[0_18px_15px_rgba(0,0,0,0.62)] transition duration-500 ${dish.id === "flaming-hot-mozzarella-sticks" || dish.category === "Coolers & Boba" ? "" : "group-hover:scale-[1.18]"}`} onError={(event) => { event.currentTarget.src = "/assets/premium-cafe-hero.png"; }} />
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    <Leaf size={12} /> Pure Veg
                  </div>
                  <h3 className="text-2xl font-black leading-tight text-slate-950">{dish.name}</h3>
                </div>
                <p className="text-2xl font-black text-[#a02618]">{paise(selectedPortionFor(dish).pricePaise)}</p>
              </div>
              <p className="mt-3 min-h-12 text-sm text-slate-500">{dish.description}</p>
              {<div className="mt-2 flex flex-wrap gap-1.5" aria-label={`Select portion for ${dish.name}`}>{portionOptions(dish).map((portion) => { const isSelected = selectedPortionFor(dish).label === portion.label; return <button key={portion.label} type="button" onClick={() => setSelectedPortions((current) => ({ ...current, [dish.id]: portion }))} className={`rounded-full px-2 py-1 text-[11px] font-black transition ${isSelected ? "bg-emerald-600 text-white" : "border border-emerald-200 bg-emerald-50 text-emerald-800 hover:border-emerald-500"}`} aria-pressed={isSelected}>{portion.label} {paise(portion.pricePaise)}</button>; })}</div>}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm text-slate-600"><Star size={15} className="fill-yellow-400 text-yellow-400" /> {dish.rating} ({dish.reviewCount})</span>
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  <button
                    onClick={() => {
                      if (narratingDishId) return;
                      setNarratingDishId(dish.id);
                      void playDishNarration(dish, () => setNarratingDishId(null));
                    }}
                    disabled={Boolean(narratingDishId)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#a02618] px-4 py-2 font-semibold text-[#a02618] transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                    aria-label={`Listen to ${dish.name} description`}
                  >
                    <Volume2 size={16} /> {narratingDishId === dish.id ? "Playing…" : "Hear dish"}
                  </button>
                  <button onClick={() => addDirectlyToCart(dish)} className="rounded-full bg-[#a02618] px-4 py-2 font-semibold text-white transition hover:bg-[#821d13]">
                    Add to cart
                  </button>
                  <button onClick={() => setCustomizing(dish)} className="rounded-full border border-[#a02618] bg-[#a02618] px-4 py-2 font-semibold text-white transition hover:bg-[#821d13]">
                    Customize
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 md:px-6">
        <TeaLounge cafeId={cafe.id} customerEmail={resolvedEmail} customerName={nameFromEmail(resolvedEmail)} membershipTier="basic" />
        <TeaFeed cafeId={cafe.id} />
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-6">
        <TableGames cafeId={cafe.id} />
      </section>

      <SocialDock cafe={cafe} />
      <QRScannerGuide />
      <AnimatePresence>{customizing && <CustomizeModal dish={customizing} onClose={() => setCustomizing(null)} onAdd={addLine} />}</AnimatePresence>
      <CartDrawer cafe={cafe} email={resolvedEmail} cart={cart} totals={totals} tableNumber={tableNumber} contextType={contextType} sessionToken={sessionToken} activeOrderId={activeOrderId} onActiveOrder={setActiveOrderId} open={cartOpen} setOpen={setCartOpen} setCart={setCart} />
      <OwnerAuth cafeSlug={cafe.slug} open={ownerAuthOpen} onClose={() => setOwnerAuthOpen(false)} />
    </main>
  );
}

function Feature({ icon: Icon, label, tone }: { icon: any; label: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-[#f0dfcd] bg-white p-3 shadow-sm">
      <Icon className={tone} size={18} />
      <strong className="mt-2 block text-sm text-slate-800">{label}</strong>
    </div>
  );
}

function Offer({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-2xl border border-[#f0dfcd] bg-[#fff8ef] p-5">
      <p className="text-xl font-black uppercase tracking-tight text-slate-950">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
    </article>
  );
}

function CustomizeModal({ dish, onClose, onAdd }: { dish: MenuItem; onClose: () => void; onAdd: (line: CartLine) => void }) {
  const portions = portionOptions(dish);
  const [selectedPortion, setSelectedPortion] = useState(() => portions[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedExclusions, setSelectedExclusions] = useState<string[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const toggle = (value: string, list: string[], setter: (v: string[]) => void) => setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  return (
    <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.section className="glass max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg p-5" initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 30 }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#a02618]">Customize</p>
            <h3 className="font-serif text-4xl text-slate-950">{dish.name}</h3>
          </div>
          <button className="tool-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
        </div>
        {portions.length > 1 && <fieldset className="mt-6"><legend className="mb-3 text-sm font-bold text-slate-700">Choose portion</legend><div className="grid gap-3 sm:grid-cols-2">{portions.map((portion) => <label key={portion.label} className={`cursor-pointer rounded-xl border p-4 transition ${selectedPortion.label === portion.label ? "border-[#a02618] bg-red-50" : "border-slate-200 bg-white"}`}><input className="sr-only" type="radio" name="portion" checked={selectedPortion.label === portion.label} onChange={() => setSelectedPortion(portion)} /><strong className="block text-slate-900">{portion.label}</strong><span className="mt-1 block text-sm font-bold text-[#a02618]">{paise(portion.pricePaise)}</span></label>)}</div></fieldset>}
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <OptionGroup title="Exclusions" options={exclusions} selected={selectedExclusions} onToggle={(v) => toggle(v, selectedExclusions, setSelectedExclusions)} />
          <OptionGroup title="Add-ons" options={addOns} selected={selectedAddOns} onToggle={(v) => toggle(v, selectedAddOns, setSelectedAddOns)} />
        </div>
        <textarea className="field mt-5 min-h-24" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Special instructions for kitchen" />
        <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="tool-button" onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease"><Minus size={17} /></button>
            <span className="w-10 text-center text-xl font-bold">{quantity}</span>
            <button className="tool-button" onClick={() => setQuantity(quantity + 1)} aria-label="Increase"><Plus size={17} /></button>
          </div>
          <button
            className="rounded-full bg-[#a02618] px-5 py-3 font-semibold text-white shadow-lg shadow-red-200"
            onClick={() => {
              onAdd({ menuItemId: dish.id, name: dish.portionOptions ? `${dish.name} (${selectedPortion.label})` : dish.name, quantity, unitPricePaise: selectedPortion.pricePaise, exclusions: selectedExclusions, addOns: selectedAddOns, notes });
              onClose();
            }}
          >
            Add {paise(selectedPortion.pricePaise * quantity)}
          </button>
        </div>
      </motion.section>
    </motion.div>
  );
}

function OptionGroup({ title, options, selected, onToggle }: { title: string; options: string[]; selected: string[]; onToggle: (option: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-slate-700">{title}</legend>
      <div className="grid gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-slate-700">
            <input type="checkbox" checked={selected.includes(option)} onChange={() => onToggle(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CartDrawer(props: {
  cafe: Omit<Cafe, "ownerPasswordHash">;
  email: string;
  cart: CartLine[];
  totals: { subtotalPaise: number; taxPaise: number; totalPaise: number };
  tableNumber?: string;
  contextType: "TABLE" | "TAKEAWAY";
  sessionToken?: string;
  activeOrderId?: string;
  onActiveOrder: (orderId: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  setCart: (cart: CartLine[]) => void;
}) {
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [completedItems, setCompletedItems] = useState<CartLine[]>([]);
  const [reviewDishId, setReviewDishId] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const customerEmail = props.email || "guest@example.com";
  useEffect(() => {
    if (props.cart.length > 0) setOrderId("");
  }, [props.cart.length]);

  function changeQuantity(index: number, change: number) {
    const next = props.cart.flatMap((item, itemIndex) => {
      if (itemIndex !== index) return [item];
      const quantity = item.quantity + change;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    });
    props.setCart(next);
  }

  async function placeOrder() {
    setPlacing(true);
    const updating = Boolean(props.activeOrderId);
    const res = await fetch(updating ? "/api/orders/add-items" : "/api/orders", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(
        updating
          ? {
              orderId: props.activeOrderId,
              tableNumber: props.tableNumber,
              sessionToken: props.sessionToken,
              items: props.cart
            }
          : {
              cafeSlug: props.cafe.slug,
              customerEmail,
              customerName: nameFromEmail(customerEmail),
              contextType: props.contextType,
              tableNumber: props.tableNumber,
              sessionToken: props.sessionToken,
              items: props.cart
            }
      )
    });
    const data = await res.json();
    setPlacing(false);
    if (res.ok) {
      setCompletedItems(props.cart);
      props.setCart([]);
      setOrderId(data.order.id);
      props.onActiveOrder(data.order.id);

    } else {
      alert(data.error || "Order failed");
    }
  }
  async function submitReview() {
    if (!reviewDishId || !reviewBody.trim()) return;
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        cafeSlug: props.cafe.slug,
        menuItemId: reviewDishId,
        customerEmail,
        rating: reviewRating,
        body: reviewBody.trim()
      })
    });
    if (res.ok) setReviewed(true);
  }
  return (
    <AnimatePresence>
          {props.open && (
        <motion.aside className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[#f0dfcd] bg-white p-5 text-slate-900 shadow-2xl" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-4xl">Cart</h2>
            <button className="tool-button" onClick={() => props.setOpen(false)} aria-label="Close cart"><X size={18} /></button>
          </div>
          {orderId ? (
            <div className="mt-8 rounded-2xl border border-[#f0dfcd] bg-[#fff8ef] p-4">
              <ReceiptText className="mb-3 text-[#a02618]" />
              <p className="font-bold">{props.activeOrderId ? "Items added to active order." : "Order sent to kitchen."}</p>
              <p className="mt-1 text-sm text-slate-500">{orderId}</p>
              {!reviewed ? (
                <div className="mt-5 border-t border-[#f0dfcd] pt-4">
                  <p className="text-sm font-bold text-slate-900">Rate one dish from this order</p>
                  <select className="field mt-3" value={reviewDishId} onChange={(event) => setReviewDishId(event.target.value)}>
                    <option value="">Select dish</option>
                    {completedItems.map((item, index) => (
                      <option key={`${item.menuItemId}-${index}`} value={item.menuItemId}>{item.name}</option>
                    ))}
                  </select>
                  <div className="mt-3 flex gap-1">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button key={rating} className="p-1" onClick={() => setReviewRating(rating)} aria-label={`Rate ${rating}`}>
                        <Star size={22} className={rating <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                      </button>
                    ))}
                  </div>
                  <textarea className="field mt-3 min-h-20" value={reviewBody} onChange={(event) => setReviewBody(event.target.value)} placeholder="How was it?" />
                  <button className="mt-3 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white" onClick={submitReview}>Submit review</button>
                </div>
              ) : (
                <p className="mt-4 rounded-xl bg-white p-3 text-sm font-semibold text-emerald-700">Thanks. Ratings will update from real customer reviews.</p>
              )}
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-3">
                {props.cart.map((item, index) => (
                  <div key={`${item.menuItemId}-${index}`} className="rounded-2xl border border-[#f0dfcd] bg-[#fff8ef] p-3">
                    <div className="flex justify-between gap-3">
                      <strong>{item.name}</strong>
                      <span>{paise(item.unitPricePaise * item.quantity)}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">{[...item.exclusions, ...item.addOns, item.notes].filter(Boolean).join(" | ")}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <button onClick={() => changeQuantity(index, -1)} className="grid h-8 w-8 place-items-center rounded-full border border-[#dfcbb8] bg-white" aria-label={item.quantity === 1 ? "Remove item" : "Decrease quantity"}>{item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}</button>
                      <span className="min-w-8 text-center text-sm font-black">{item.quantity}</span>
                      <button onClick={() => changeQuantity(index, 1)} className="grid h-8 w-8 place-items-center rounded-full border border-[#dfcbb8] bg-white" aria-label="Increase quantity"><Plus size={14} /></button>
                      <button onClick={() => props.setCart(props.cart.filter((_, itemIndex) => itemIndex !== index))} className="ml-auto text-xs font-black text-[#a02618]" aria-label={"Remove " + item.name}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-2 border-t border-slate-200 pt-5 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{paise(props.totals.subtotalPaise)}</span></div>
                <div className="flex justify-between"><span>GST 5%</span><span>{paise(props.totals.taxPaise)}</span></div>
                <div className="flex justify-between text-xl font-bold"><span>Total</span><span>{paise(props.totals.totalPaise)}</span></div>
              </div>
              <button disabled={placing || props.cart.length === 0 || (props.contextType === "TABLE" && !props.tableNumber)} onClick={placeOrder} className="mt-6 w-full rounded-full bg-[#a02618] px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 disabled:opacity-40">
                {placing ? "Sending..." : props.activeOrderId ? "Add more items to order" : props.contextType === "TAKEAWAY" ? "Place counter pickup order" : "Place table order"}
              </button>
            </>
          )}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function SplitBill({ total }: { total: number }) {
  const [people, setPeople] = useState(2);
  return (
    <div className="rounded-2xl border border-[#f0dfcd] bg-white p-4 text-slate-800 shadow-sm">
      <p className="text-sm font-bold">Split bill</p>
      <div className="mt-2 flex items-center gap-2">
        <button className="tool-button" onClick={() => setPeople(Math.max(1, people - 1))} aria-label="Fewer people"><Minus size={16} /></button>
        <span className="w-16 text-center">{people}</span>
        <button className="tool-button" onClick={() => setPeople(people + 1)} aria-label="More people"><Plus size={16} /></button>
        <strong>{exactPaise(total / people)} each</strong>
      </div>
    </div>
  );
}

function SocialDock({ cafe }: { cafe: Omit<Cafe, "ownerPasswordHash"> }) {
  const links = [
    { href: cafe.instagramUrl, icon: Instagram, label: "Instagram", iconClass: "text-[#E4405F]" },
    { href: cafe.facebookUrl, icon: Facebook, label: "Facebook", iconClass: "text-[#1877F2]" },
  ].filter((link) => link.href);
  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 gap-2 rounded-full border border-[#f0dfcd] bg-white/85 p-2 shadow-xl backdrop-blur">
      {links.map(({ href, icon: Icon, label, iconClass }) => (
        <a key={label} className="tool-button bg-white" href={href} aria-label={label} title={label} target="_blank" rel="noreferrer">
          <Icon size={18} className={iconClass} />
        </a>
      ))}
    </nav>
  );
}

function OwnerAuth({ cafeSlug, open, onClose }: { cafeSlug: string; open: boolean; onClose: () => void }) {
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function requestOtp() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/owner/auth/request-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeSlug, password }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Authentication failed"); return; }
      setChallengeId(data.challengeId);
      if (data.devOtp) { setDevOtp(data.devOtp); setOtp(data.devOtp); }
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  async function verifyOtp() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/owner/auth/verify-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeSlug, challengeId, otp }) });
      if (res.ok) window.location.assign(`/${cafeSlug}/owner`);
      else setError("Invalid or expired OTP. Request a new one and try again.");
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <section className="glass w-full max-w-md rounded-lg p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <ShieldCheck className="mb-3 text-[#a02618]" />
                <h2 className="font-serif text-4xl text-slate-950">Owner access</h2>
              </div>
              <button className="tool-button" onClick={onClose} aria-label="Close"><X size={18} /></button>
            </div>
            {!challengeId ? (
              <div className="mt-5 space-y-3">
                <input autoFocus className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && password.length >= 8) requestOtp(); }} placeholder="Master password" />
                <button disabled={busy || password.length < 8} className="w-full rounded-full bg-[#a02618] px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={requestOtp}>{busy ? "Checking…" : "Send OTP"}</button>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                <input autoFocus inputMode="numeric" maxLength={6} className="field" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} onKeyDown={(event) => { if (event.key === "Enter" && otp.length === 6) verifyOtp(); }} placeholder="6-digit OTP" />
                {devOtp && <p className="rounded-lg bg-amber-50 p-3 text-center text-xs font-bold text-amber-800">Local demo OTP: {devOtp}</p>}
                <button disabled={busy || otp.length !== 6} className="w-full rounded-full bg-[#a02618] px-5 py-3 font-semibold text-white disabled:opacity-50" onClick={verifyOtp}>{busy ? "Opening…" : "Verify"}</button>
                <button className="w-full text-xs font-semibold text-slate-500" onClick={() => { setChallengeId(""); setOtp(""); setDevOtp(""); setError(""); }}>Use another password</button>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
