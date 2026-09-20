"use client";

import { BarChart3, BellRing, CheckCircle2, CreditCard, Download, KeyRound, Mail, Printer, QrCode, RefreshCw, ShieldCheck, Split, Utensils, Volume2, VolumeX, Wallet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Order } from "@/lib/types";
import GameSettings from "./GameSettings";
import TeaModeration from "./TeaModeration";
import QRCode from "qrcode";

function money(paise: number) {
  return `Rs. ${(paise / 100).toFixed(0)}`;
}

export default function OwnerDashboard({ cafeSlug }: { cafeSlug: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"orders" | "games" | "tea">("orders");
  const [unauthorized, setUnauthorized] = useState(false);
  const [spokenAlertsEnabled, setSpokenAlertsEnabled] = useState(false);
  const knownOrderIds = useRef(new Set<string>());
  const initialOrdersLoaded = useRef(false);

  function announceNewOrder(order: Order) {
    if (!spokenAlertsEnabled || !("speechSynthesis" in window)) return;
    const location = order.contextType === "TABLE" && order.tableNumber ? `table ${order.tableNumber}` : "the counter pickup queue";
    const items = order.items.map((item) => `${item.quantity} ${item.name}`).join(", ");
    window.speechSynthesis.cancel();
    const message = new SpeechSynthesisUtterance(`New order from ${location}. ${items}.`);
    message.rate = 0.9;
    message.volume = 1;
    window.speechSynthesis.speak(message);
  }


  async function refresh() {
    setLoading(true);
    const [ordersRes, analyticsRes] = await Promise.all([fetch("/api/owner/orders"), fetch("/api/owner/analytics")]);
    if (ordersRes.status === 401 || analyticsRes.status === 401) {
      setUnauthorized(true);
      setLoading(false);
      return;
    }
    setUnauthorized(false);
    if (ordersRes.ok) {
      const nextOrders = (await ordersRes.json()).orders as Order[];
      const newOrders = initialOrdersLoaded.current ? nextOrders.filter((order) => !knownOrderIds.current.has(order.id)) : [];
      knownOrderIds.current = new Set(nextOrders.map((order) => order.id));
      initialOrdersLoaded.current = true;
      setOrders(nextOrders);
      newOrders.slice().reverse().forEach(announceNewOrder);
    }
    if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 7000);
    return () => {
      clearInterval(id);

    };
  }, [cafeSlug]);


  async function setStatus(orderId: string, status: Order["status"]) {
    await fetch("/api/owner/orders", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, status }) });
    refresh();
  }

  async function pay(orderId: string, method: "CASH" | "UPI" | "CARD") {
    await fetch("/api/owner/orders/pay", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId, method }) });
    refresh();
  }

  async function sendBill(order: Order) {
    const billItems = order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: money(item.unitPricePaise * item.quantity)
    }));

    try {
      const res = await fetch("/api/orders/send-bill", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerEmail: order.customerEmail,
          customerName: order.customerName,
          cafeEmail: "cafe@example.com", // Get from cafe settings
          cafeName: cafeSlug,
          billNumber: order.id,
          billItems,
          subtotal: money(order.subtotalPaise),
          tax: money(order.taxPaise),
          discount: "0.00",
          total: money(order.totalPaise),
          paymentMethod: order.paymentMethod || "Not specified",
          billDate: new Date().toLocaleDateString()
        })
      });

      if (res.ok) {
        alert("Bill sent to customer and owner emails!");
      } else {
        alert("Failed to send bill");
      }
    } catch (error) {
      console.error("Error sending bill:", error);
      alert("Error sending bill");
    }
  }

  const live = orders.filter((order) => order.status === "LIVE");
  const billing = orders.filter((order) => order.status === "BILLING_PENDING");
  const paid = orders.filter((order) => order.status === "PAID");

  if (unauthorized) return <OwnerLogin cafeSlug={cafeSlug} onSuccess={() => { setUnauthorized(false); refresh(); }} />;

  return (
    <main className="min-h-screen bg-[#fff8ef] text-slate-950">
      <header className="border-b border-[#ead8c5] bg-white/90 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 md:px-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">Owner POS & Kitchen</p>
            <h1 className="text-3xl font-black uppercase tracking-tight">{cafeSlug}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2 rounded-lg bg-[#fff8ef] p-1">
              <button
                onClick={() => setView("orders")}
                className={`rounded px-4 py-2 font-bold transition ${
                  view === "orders"
                    ? "bg-[#a02618] text-white"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => setView("games")}
                className={`rounded px-4 py-2 font-bold transition ${
                  view === "games"
                    ? "bg-[#a02618] text-white"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                Games & Discounts
              </button>
              <button
                onClick={() => setView("tea")}
                className={"rounded px-4 py-2 font-bold transition " + (view === "tea" ? "bg-[#a02618] text-white" : "text-slate-700 hover:bg-white")}
              >
                Tea approvals
              </button>
            </div>
            <button className="tool-button" onClick={refresh} aria-label="Refresh" title="Refresh">
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={() => {
                const next = !spokenAlertsEnabled;
                setSpokenAlertsEnabled(next);
                if (next && "speechSynthesis" in window) window.speechSynthesis.speak(new SpeechSynthesisUtterance("Spoken new-order alerts enabled."));
                if (!next && "speechSynthesis" in window) window.speechSynthesis.cancel();
              }}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${spokenAlertsEnabled ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-700"}`}
              title="Enable spoken alerts on this device"
            >
              {spokenAlertsEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {spokenAlertsEnabled ? "Order voice on" : "Enable order voice"}
            </button>
          </div>
        </div>
      </header>

      {view === "orders" ? (
        <>
          <TableQrPanel cafeSlug={cafeSlug} />
          <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 md:grid-cols-4 md:px-6">
            <Metric icon={BarChart3} label="Revenue" value={analytics ? money(analytics.totalRevenuePaise) : "Rs. 0"} />
            <Metric icon={Utensils} label="Live Orders" value={live.length} />
            <Metric icon={CheckCircle2} label="Satisfaction" value={analytics ? analytics.satisfaction.toFixed(1) : "4.7"} />
            <Metric icon={Printer} label="Print & Invoice" value="Ready" />
          </section>

          <section className="mx-auto grid max-w-7xl gap-6 px-4 pb-10 xl:grid-cols-[1.55fr_0.75fr] md:px-6">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-4xl font-black uppercase tracking-tight">Order board</h2>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#ead8c5] bg-white px-4 py-2 text-sm font-bold text-slate-600"><BellRing size={15} /> Auto-refreshing</span>
              </div>
              <div className="grid gap-4 lg:grid-cols-3">
                <OrderColumn
                  title="Live orders"
                  orders={live}
                  empty="No kitchen orders"
                  action={(order) => <button className="rounded-full bg-[#a02618] px-4 py-2 text-sm font-bold text-white" onClick={() => setStatus(order.id, "BILLING_PENDING")}>Finish / Prepared</button>}
                />
                <OrderColumn
                  title="Billing pending"
                  orders={billing}
                  empty="No pending bills"
                  action={(order) => <PaymentActions onPay={(method) => pay(order.id, method)} onSendBill={() => sendBill(order)} />}
                />
                <OrderColumn title="Paid" orders={paid} empty="No paid orders yet" action={() => <span className="rounded-full bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">Settled</span>} />
              </div>
              {orders.length === 0 && <p className="mt-4 rounded-2xl border border-[#ead8c5] bg-white p-5 text-slate-500">No orders yet.</p>}
            </div>

            <aside className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-[0_22px_55px_rgba(31,41,51,0.08)]">
              <h2 className="text-3xl font-black uppercase tracking-tight">Analytics</h2>
              <div className="mt-5 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.peakHours || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(160,38,24,0.10)" />
                    <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ead8c5", color: "#0f172a" }} />
                    <Bar dataKey="orders" fill="#a02618" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <h3 className="mt-6 font-bold">Top dishes</h3>
              <div className="mt-3 grid gap-2 text-sm">
                {(analytics?.topDishes || []).map((dish: any) => (
                  <div key={dish.name} className="flex justify-between rounded-2xl bg-[#fff8ef] p-3">
                    <span>{dish.name}</span>
                    <strong>{dish.sold}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </section>
        </>
      ) : view === "games" ? (
        <section className="mx-auto max-w-7xl px-4 py-6 md:px-6">
          <GameSettings cafeSlug={cafeSlug} />
        </section>
      ) : (
        <TeaModeration />
      )}
    </main>
  );
}

function OwnerLogin({ cafeSlug, onSuccess }: { cafeSlug: string; onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestOtp() {
    setBusy(true); setError("");
    const response = await fetch("/api/owner/auth/request-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeSlug, password }) });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) { setError(data.error || "Login failed"); return; }
    setChallengeId(data.challengeId);
    if (data.devOtp) { setDevOtp(data.devOtp); setOtp(data.devOtp); }
  }

  async function verify() {
    setBusy(true); setError("");
    const response = await fetch("/api/owner/auth/verify-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeSlug, challengeId, otp }) });
    setBusy(false);
    if (response.ok) onSuccess();
    else setError("Invalid or expired OTP");
  }

  return <main className="grid min-h-screen place-items-center bg-[#fff8ef] p-4 text-slate-950"><section className="w-full max-w-md rounded-[2rem] border border-[#ead8c5] bg-white p-6 shadow-[0_30px_90px_rgba(80,35,20,0.14)] sm:p-8">
    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#a02618] text-white"><ShieldCheck size={27} /></div><p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">Secure owner access</p><h1 className="mt-2 text-4xl font-black tracking-tight">Open the control room.</h1><p className="mt-2 text-sm leading-6 text-slate-500">Sign in to manage orders, games, discounts and tea approvals.</p>
    {!challengeId ? <><label className="mt-6 block text-xs font-black uppercase tracking-wider text-slate-500">Owner password<input autoFocus type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") requestOtp(); }} className="field mt-2" placeholder="Enter owner password" /></label><button disabled={busy || password.length < 8} onClick={requestOtp} className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#a02618] px-5 py-3 font-black text-white disabled:opacity-40"><KeyRound size={17} />{busy ? "Checking…" : "Send login OTP"}</button></> :
    <><label className="mt-6 block text-xs font-black uppercase tracking-wider text-slate-500">6-digit OTP<input autoFocus inputMode="numeric" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} onKeyDown={(event) => { if (event.key === "Enter" && otp.length === 6) verify(); }} className="field mt-2 text-center text-2xl font-black tracking-[0.3em]" /></label>{devOtp && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-center text-xs font-bold text-amber-800">Local demo OTP: {devOtp}</p>}<button disabled={busy || otp.length !== 6} onClick={verify} className="mt-5 w-full rounded-full bg-[#a02618] px-5 py-3 font-black text-white disabled:opacity-40">{busy ? "Opening…" : "Verify & open dashboard"}</button><button onClick={() => { setChallengeId(""); setOtp(""); setError(""); }} className="mt-3 w-full text-xs font-black text-slate-400">Use another password</button></>}
    {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
  </section></main>;
}

function TableQrPanel({ cafeSlug }: { cafeSlug: string }) {
  const [tableCount, setTableCount] = useState(12);
  const [baseUrl, setBaseUrl] = useState("");
  const [codes, setCodes] = useState<Record<string, string>>({});

  useEffect(() => {
    setBaseUrl(process.env.NEXT_PUBLIC_APP_URL || window.location.origin);
  }, []);

  useEffect(() => {
    if (!baseUrl) return;
    const tables = Array.from({ length: tableCount }, (_, index) => String(index + 1));
    const cleanBaseUrl = baseUrl.trim().replace(/\/$/, "");
    Promise.all(tables.map(async (table) => [table, await QRCode.toDataURL(`${cleanBaseUrl}/${cafeSlug}?table=${table}`, { width: 180, margin: 1 })] as const))
      .then((entries) => setCodes(Object.fromEntries(entries)))
      .catch(() => setCodes({}));
  }, [baseUrl, cafeSlug, tableCount]);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.07)] md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#a02618]"><QrCode size={15} /> Table scanners</p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">One QR per table</h2>
            <p className="mt-1 max-w-xl text-sm text-slate-500">Print these codes. When a customer scans one, the order board identifies the exact table automatically.</p>
          </div>
          <label className="block text-sm font-bold text-slate-600 md:min-w-80">QR website address
            <input className="field mt-1 py-2" type="url" value={baseUrl} onChange={(event) => setBaseUrl(event.target.value)} placeholder="https://your-cafe-site.com" />
          </label>
          <label className="text-sm font-bold text-slate-600">Tables
            <input className="field ml-2 w-20 py-2" type="number" min="1" max="100" value={tableCount} onChange={(event) => setTableCount(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} />
          </label>
        </div>
        {/^https?:\/\/localhost(?::\d+)?$/i.test(baseUrl.trim()) && <p className="mt-3 rounded-xl border border-orange-200 bg-orange-50 p-3 text-sm font-semibold text-orange-800">This address only works on this computer. For phone testing, enter your computer LAN address, such as http://192.168.1.20:3000, or your hosted https address.</p>}
        <div className="mt-5 grid max-h-96 gap-3 overflow-auto sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: tableCount }, (_, index) => String(index + 1)).map((table) => (
            <article key={table} className="rounded-2xl border border-[#ead8c5] bg-[#fff8ef] p-3 text-center">
              {codes[table] ? <img src={codes[table]} alt={`QR code for table ${table}`} className="mx-auto aspect-square w-full max-w-32" /> : <div className="mx-auto aspect-square w-full max-w-32 animate-pulse rounded bg-white" />}
              <strong className="mt-2 block">Table {table}</strong>
              {codes[table] && <a className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-[#a02618]" href={codes[table]} download={`${cafeSlug}-table-${table}.png`}><Download size={13} /> Download</a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-[0_18px_45px_rgba(31,41,51,0.08)]">
      <Icon className="text-[#a02618]" size={20} />
      <p className="mt-3 text-sm font-semibold text-slate-500">{label}</p>
      <strong className="mt-1 block text-2xl">{value}</strong>
    </div>
  );
}

function OrderColumn({ title, orders, empty, action }: { title: string; orders: Order[]; empty: string; action: (order: Order) => ReactNode }) {
  return (
    <section className="rounded-3xl border border-[#ead8c5] bg-white p-4 shadow-[0_18px_45px_rgba(31,41,51,0.07)]">
      <h3 className="text-lg font-black uppercase tracking-tight">{title}</h3>
      <div className="mt-4 grid gap-3">
        {orders.map((order) => (
          <article key={order.id} className="rounded-2xl bg-[#fff8ef] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#a02618]">{order.contextType === "TAKEAWAY" ? "Parcel" : `Table ${order.tableNumber}`}</p>
                <h4 className="mt-1 text-lg font-black">{order.id}</h4>
                <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <strong>{money(order.totalPaise)}</strong>
            </div>
            <ul className="mt-3 grid gap-2 text-sm">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`} className="rounded-xl bg-white p-2">
                  <strong>{item.quantity} x {item.name}</strong>
                  <p className="text-xs text-slate-500">{[...item.exclusions, ...item.addOns, item.notes].filter(Boolean).join(" | ")}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3">{action(order)}</div>
          </article>
        ))}
        {orders.length === 0 && <p className="rounded-2xl bg-[#fff8ef] p-4 text-sm text-slate-500">{empty}</p>}
      </div>
    </section>
  );
}

function PaymentActions({ onPay, onSendBill }: { onPay: (method: "CASH" | "UPI" | "CARD") => void; onSendBill?: () => void }) {
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-3 gap-2">
        <button className="rounded-full bg-slate-950 px-3 py-2 text-xs font-bold text-white" onClick={() => onPay("CASH")}><Wallet className="mr-1 inline" size={13} />Cash</button>
        <button className="rounded-full bg-[#a02618] px-3 py-2 text-xs font-bold text-white" onClick={() => onPay("UPI")}><Split className="mr-1 inline" size={13} />UPI</button>
        <button className="rounded-full bg-slate-700 px-3 py-2 text-xs font-bold text-white" onClick={() => onPay("CARD")}><CreditCard className="mr-1 inline" size={13} />Card</button>
      </div>
      <button
        onClick={onSendBill}
        className="rounded-full bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition"
      >
        <Mail className="mr-1 inline" size={13} />
        Send Bill Email
      </button>
      <p className="text-xs text-slate-500"><Printer className="mr-1 inline" size={12} />Print & Email receipts</p>
    </div>
  );
}
