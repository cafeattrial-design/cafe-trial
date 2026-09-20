import Link from "next/link";
import { ArrowRight, CheckCircle2, QrCode, Smartphone, Sparkles, Utensils } from "lucide-react";

export default function IndexPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fff8ef] text-slate-950">
      <section className="relative min-h-[88vh] overflow-hidden bg-[#18231e] text-white">
        <img src="/assets/cafe-feast-hero-v2.png" alt="A colourful spread of fresh vegetarian cafÃ© dishes" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(24,35,30,0.98)_0%,rgba(24,35,30,0.78)_42%,rgba(24,35,30,0.22)_100%)]" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-between px-5 py-6 md:px-8 md:py-8">
          <header className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#a02618] font-black">DT</div><span className="text-xs font-black uppercase tracking-[0.2em] text-white/85">D&apos;TREAT â€¢ Pure-veg kitchen</span></div><span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/65">Built for every table</span></header>
          <div className="max-w-3xl pb-10 pt-24 md:pb-16">
            <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-[#ffbd70]"><Sparkles size={15} /> Scan-to-order, made warmer</p>
            <h1 className="font-display mt-6 max-w-3xl text-6xl font-bold leading-[0.92] tracking-[-0.05em] sm:text-7xl md:text-9xl">Big flavour.<br /><span className="text-[#ffbd70]">Zero compromise.</span></h1>
            <p className="mt-7 max-w-xl text-base font-medium leading-7 text-white/90 md:text-lg">D&apos;TREAT brings bold vegetarian comfort food, instant counter pickup, and effortless table ordering together in one polished experience.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link className="inline-flex items-center gap-2 rounded-full bg-[#a02618] px-5 py-3 font-black text-white shadow-lg transition hover:bg-[#821d13]" href="/d-treat?type=takeaway">Open takeaway menu <ArrowRight size={17} /></Link><Link className="rounded-full border border-white/25 px-5 py-3 font-black text-white transition hover:bg-white/10" href="/d-treat/owner">Open owner area</Link></div>
          </div>
          <div className="grid max-w-xl grid-cols-3 gap-2 text-xs font-bold text-white/75 md:gap-4"><div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"><QrCode className="mb-2 text-[#ffbd70]" size={19} />One QR per table</div><div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"><Utensils className="mb-2 text-[#ffbd70]" size={19} />Live kitchen orders</div><div className="rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur"><Smartphone className="mb-2 text-[#ffbd70]" size={19} />No app required</div></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-20">
        <div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">For your guests</p><h2 className="mt-3 max-w-xl font-display text-4xl font-bold leading-none tracking-[-0.04em] text-slate-950 md:text-6xl">Good food should feel easy.</h2><p className="mt-5 max-w-lg text-base font-medium leading-7 text-slate-700">Customers scan, browse dishes, add directly to cart or customize, then send the order without waiting at the counter.</p></div>
        <div className="grid gap-3 sm:grid-cols-2"><Info icon={QrCode} title="Table-aware QR" text="Each scan carries its table number to the owner board." /><Info icon={CheckCircle2} title="Counter pickup" text="The takeaway link works without assigning a table." /><Info icon={Smartphone} title="Mobile first" text="Designed for the phone already in your guest&apos;s hand." /><Info icon={Sparkles} title="Spill the Tea" text="Type, record or redact a receipt, then unlock a 5% cafÃ© reward." /></div>
      </section>
      <section className="border-y border-[#ead8c5] bg-white px-5 py-8 md:px-8"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">Try the customer flow</p><h2 className="mt-1 text-2xl font-black">Open a takeaway order in one tap.</h2></div><Link className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-[#a02618]" href="/d-treat?type=takeaway">Demo takeaway <ArrowRight size={17} /></Link></div></section>
    </main>
  );
}

function Info({ icon: Icon, title, text }: { icon: typeof QrCode; title: string; text: string }) {
  return <article className="rounded-2xl border border-[#ead8c5] bg-white p-5 shadow-sm"><Icon className="text-[#a02618]" size={21} /><h3 className="mt-3 font-black">{title}</h3><p className="mt-1 text-sm font-medium leading-6 text-slate-700">{text}</p></article>;
}