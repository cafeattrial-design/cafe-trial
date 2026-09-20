"use client";

import { Flame, Headphones, Image as ImageIcon, RefreshCw, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";

export type TeaPost = {
  id: string;
  category: string;
  text: string;
  audioDataUrl: string | null;
  receiptDataUrl: string | null;
  fireCount: number;
  shockCount: number;
  laughCount: number;
  createdAt: string;
};

export default function TeaFeed({ cafeId }: { cafeId: string }) {
  const [posts, setPosts] = useState<TeaPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const response = await fetch("/api/tea-posts?cafeId=" + encodeURIComponent(cafeId), { cache: "no-store" });
      if (response.ok) setPosts((await response.json()).posts || []);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, [cafeId]);

  async function react(postId: string, reaction: "fire" | "shock" | "laugh") {
    const key = "tea-reacted:" + postId + ":" + reaction;
    if (localStorage.getItem(key)) return;
    const response = await fetch("/api/tea-posts", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: postId, reaction }) });
    if (!response.ok) return;
    const updated = (await response.json()).post;
    localStorage.setItem(key, "yes");
    setPosts((items) => items.map((item) => item.id === postId ? { ...item, ...updated } : item));
  }

  return <section className="mt-7 overflow-hidden rounded-[2.25rem] border border-[#ead8c5] bg-[#fff8ef] p-5 shadow-[0_25px_70px_rgba(50,30,20,0.12)] sm:p-8">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#a02618]"><Flame size={15} /> Owner-approved only</p><h3 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#241a14] sm:text-5xl">THE CAFÉ TEA FEED</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-[#806956]">Read the latest anonymous drops, listen to voice notes and inspect redacted receipts while the order is cooking.</p></div><button onClick={load} disabled={loading} className="flex items-center gap-2 rounded-full border border-[#dfc9b5] bg-white px-4 py-2 text-xs font-black text-[#684f3c]"><RefreshCw size={14} className={loading ? "animate-spin" : ""} />Refresh tea</button></header>
    {loading ? <div className="grid min-h-52 place-items-center text-sm font-bold text-[#9b826d]">Brewing the feed…</div> : posts.length === 0 ? <div className="mt-7 rounded-3xl border border-dashed border-[#d9c0aa] bg-white/70 p-10 text-center"><div className="text-5xl">🫖</div><h4 className="mt-4 text-xl font-black text-[#33241b]">The feed is still steeping.</h4><p className="mt-2 text-sm text-[#8e7560]">Owner-approved customer drops will appear here.</p></div> :
    <div className="mt-7 columns-1 gap-5 md:columns-2 xl:columns-3">{posts.map((post) => <article key={post.id} className="mb-5 break-inside-avoid overflow-hidden rounded-[1.75rem] border border-[#ead8c5] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[#f1e5d9] px-5 py-4"><div><p className="text-xs font-black text-[#a02618]">anonymous bestie</p><p className="text-[10px] text-[#9a826e]">{new Date(post.createdAt).toLocaleDateString()} • {post.category}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-700"><ShieldCheck size={10} className="mr-1 inline" />approved</span></div>
      {post.receiptDataUrl && <div className="bg-[#1c1511] p-3"><img src={post.receiptDataUrl} alt="Customer-redacted receipt" className="max-h-80 w-full rounded-2xl object-contain" /><p className="mt-2 text-center text-[9px] font-black uppercase tracking-wider text-white/35"><ImageIcon size={11} className="mr-1 inline" />redacted by sender</p></div>}
      <div className="p-5">{post.text && <p className="whitespace-pre-wrap text-sm font-medium leading-6 text-[#3b2c23]">{post.text}</p>}{post.audioDataUrl && <div className="mt-4 rounded-2xl bg-gradient-to-br from-[#441b42] to-[#7e2857] p-4 text-white"><p className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#ffb5db]"><Headphones size={14} />tap to hear the voice tea</p><audio controls preload="none" src={post.audioDataUrl} className="h-9 w-full" /></div>}<div className="mt-5 flex gap-2"><Reaction label="🔥" count={post.fireCount} onClick={() => react(post.id, "fire")} /><Reaction label="🫢" count={post.shockCount} onClick={() => react(post.id, "shock")} /><Reaction label="💀" count={post.laughCount} onClick={() => react(post.id, "laugh")} /></div></div>
    </article>)}</div>}
  </section>;
}

function Reaction({ label, count, onClick }: { label: string; count: number; onClick: () => void }) {
  return <button onClick={onClick} className="rounded-full border border-[#ead8c5] bg-[#fff8ef] px-3 py-1.5 text-xs font-black text-[#624b39] transition hover:-translate-y-0.5 hover:border-[#d8939f]">{label} {count}</button>;
}
