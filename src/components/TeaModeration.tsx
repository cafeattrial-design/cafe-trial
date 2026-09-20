"use client";

import { Check, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { TeaPost } from "./TeaFeed";

export default function TeaModeration() {
  const [posts, setPosts] = useState<TeaPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const response = await fetch("/api/owner/tea-posts", { cache: "no-store" });
    if (response.ok) setPosts((await response.json()).posts || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function decide(id: string, status: "APPROVED" | "REJECTED") {
    const response = await fetch("/api/owner/tea-posts", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, status }) });
    if (response.ok) setPosts((items) => items.filter((item) => item.id !== id));
  }

  return <section className="mx-auto max-w-7xl px-4 pb-12 md:px-6"><div className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-sm sm:p-7"><header className="flex items-center justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#a02618]"><ShieldAlert size={15} />Private moderation queue</p><h2 className="mt-1 text-3xl font-black">Tea awaiting review</h2></div><button onClick={load} className="tool-button"><RefreshCw size={17} className={loading ? "animate-spin" : ""} /></button></header>
    {!loading && posts.length === 0 ? <p className="mt-6 rounded-2xl bg-[#fff8ef] p-5 text-sm text-slate-500">No tea is waiting for approval.</p> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{posts.map((post) => <article key={post.id} className="overflow-hidden rounded-2xl border border-[#ead8c5]"><div className="p-5"><p className="text-[10px] font-black uppercase tracking-wider text-[#a02618]">{post.category}</p>{post.text && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{post.text}</p>}{post.receiptDataUrl && <img src={post.receiptDataUrl} alt="Receipt pending moderation" className="mt-4 max-h-64 w-full rounded-xl bg-slate-950 object-contain" />}{post.audioDataUrl && <audio controls preload="none" src={post.audioDataUrl} className="mt-4 h-9 w-full" />}<div className="mt-5 rounded-xl bg-amber-50 p-3 text-[11px] leading-5 text-amber-900">Approve only if identities are hidden, everyone in audio consented, and the post contains no harassment, intimate material, private information or serious accusations.</div></div><div className="grid grid-cols-2 border-t border-[#ead8c5]"><button onClick={() => decide(post.id, "REJECTED")} className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-black text-red-700 hover:bg-red-50"><Trash2 size={16} />Reject</button><button onClick={() => decide(post.id, "APPROVED")} className="flex items-center justify-center gap-2 border-l border-[#ead8c5] px-4 py-3 text-sm font-black text-emerald-700 hover:bg-emerald-50"><Check size={16} />Approve</button></div></article>)}</div>}
  </div></section>;
}
