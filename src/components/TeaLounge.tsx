"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Gift, Image as ImageIcon, Mic, MicOff, Pencil, RotateCcw, Send, ShieldCheck, Trash2, Upload, Users, X } from "lucide-react";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";

const teaTypes = ["Situationship", "Friend group", "Work/college", "Family function", "Plot twist"] as const;
type TeaType = typeof teaTypes[number];

function clock(seconds: number) {
  return Math.floor(seconds / 60) + ":" + String(seconds % 60).padStart(2, "0");
}

async function receiptFile(dataUrl: string) {
  const result = await fetch(dataUrl);
  return new File([await result.blob()], "redacted-receipt.jpg", { type: "image/jpeg" });
}

function blobAsDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export default function TeaLounge({ cafeId, customerEmail }: { cafeId: string; customerEmail: string; customerName: string; membershipTier?: string }) {
  const [type, setType] = useState<TeaType>("Situationship");
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [tea, setTea] = useState("");
  const [audio, setAudio] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingConsent, setRecordingConsent] = useState(false);
  const [safe, setSafe] = useState(false);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [receiptChecked, setReceiptChecked] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [rewarded, setRewarded] = useState(false);
  const [claimedToday, setClaimedToday] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const todayKey = "tea-share-reward:" + cafeId + ":" + customerEmail + ":" + new Date().toISOString().slice(0, 10);
  const ready = Boolean(tea.trim() || audio || receipt) && safe && (!receipt || receiptChecked) && !recording;

  useEffect(() => {
    setClaimedToday(localStorage.getItem(todayKey) === "claimed");
    return () => {
      if (timer.current) clearInterval(timer.current);
      stream.current?.getTracks().forEach((track) => track.stop());
    };
  }, [todayKey]);

  async function startRecording() {
    setNotice("");
    if (!recordingConsent) {
      setNotice("Ask everyone first, then confirm that they agreed to be recorded.");
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setNotice("Voice recording is not supported here. You can still type the tea.");
      return;
    }
    try {
      const liveStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const nextRecorder = new MediaRecorder(liveStream);
      stream.current = liveStream;
      recorder.current = nextRecorder;
      chunks.current = [];
      if (audio) URL.revokeObjectURL(audio);
      setAudio(null);
      setSeconds(0);
      nextRecorder.ondataavailable = (event) => { if (event.data.size) chunks.current.push(event.data); };
      nextRecorder.onstop = () => {
        setAudio(URL.createObjectURL(new Blob(chunks.current, { type: nextRecorder.mimeType || "audio/webm" })));
        liveStream.getTracks().forEach((track) => track.stop());
        stream.current = null;
      };
      nextRecorder.start();
      setRecording(true);
      timer.current = setInterval(() => setSeconds((value) => value + 1), 1000);
    } catch {
      setNotice("Microphone permission was blocked. You can still type the tea.");
    }
  }

  function stopRecording() {
    if (recorder.current?.state === "recording") recorder.current.stop();
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setRecording(false);
  }

  function deleteAudio() {
    if (audio) URL.revokeObjectURL(audio);
    setAudio(null);
    setSeconds(0);
  }

  function chooseReceipt(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) {
      setNotice("Choose an image smaller than 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setEditing(String(reader.result));
    reader.readAsDataURL(file);
  }

  function unlockReward() {
    if (localStorage.getItem(todayKey) === "claimed") {
      setClaimedToday(true);
      return;
    }
    let previous = 0;
    try { previous = Number(JSON.parse(localStorage.getItem("tea-reward:" + cafeId) || "{}").discount || 0); } catch { previous = 0; }
    localStorage.setItem("tea-reward:" + cafeId, JSON.stringify({ discount: Math.max(5, previous), source: previous > 5 ? "existing-higher-reward" : "tea-share", earnedAt: new Date().toISOString() }));
    localStorage.setItem(todayKey, "claimed");
    setClaimedToday(true);
    setRewarded(true);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!ready) return;
    const drop = { id: "tea-" + Date.now(), type, text: tea.trim().slice(0, 500), hasVoice: Boolean(audio), hasReceipt: Boolean(receipt), createdAt: new Date().toISOString() };
    try {
      const oldDrops = JSON.parse(localStorage.getItem("my-tea-drops:" + cafeId) || "[]");
      localStorage.setItem("my-tea-drops:" + cafeId, JSON.stringify([drop, ...oldDrops].slice(0, 20)));
    } catch { localStorage.setItem("my-tea-drops:" + cafeId, JSON.stringify([drop])); }
    unlockReward();
    setSent(true);
  }

  async function share() {
    const text = (tea.trim() || "I just dropped a voice note with the tea.") + "\n\n— shared from Spill the Tea (identities redacted by the sender)";
    try {
      if (navigator.share) {
        const data: ShareData = { title: "Spill the Tea ☕", text };
        const files: File[] = [];
        if (receipt) {
          files.push(await receiptFile(receipt));
        }
        if (audio) {
          const audioResult = await fetch(audio);
          const audioBlob = await audioResult.blob();
          files.push(new File([audioBlob], "voice-tea.webm", { type: audioBlob.type || "audio/webm" }));
        }
        if (files.length && navigator.canShare?.({ files })) data.files = files;
        await navigator.share(data);
      } else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        await navigator.clipboard?.writeText(text);
        setCopied(true);
      }
    }
  }

  function reset() {
    deleteAudio();
    setTea("");
    setReceipt(null);
    setReceiptChecked(false);
    setSafe(false);
    setRecordingConsent(false);
    setSent(false);
    setCopied(false);
    setNotice("");
  }

  const reaction = type === "Situationship" ? "BESTIE??? That was not a situationship, that was a full investigation. 🫢" : type === "Friend group" ? "Not the group chat having a secret group chat. 💀" : type === "Work/college" ? "Attendance: missing. Drama: present. ☕" : type === "Family function" ? "One function, fourteen side plots and zero peace. 😭" : "You saved THAT detail for last? Straight to jail. 🚨";

  return <section id="spill-the-tea" className="relative overflow-hidden rounded-[2.25rem] bg-[#120d18] text-white shadow-[0_35px_100px_rgba(45,15,50,0.28)]">
    <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-28 -right-16 h-96 w-96 rounded-full bg-orange-500/20 blur-3xl" />
    <div className="relative grid lg:grid-cols-[0.82fr_1.18fr]">
      <aside className="border-b border-white/10 p-6 sm:p-9 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-3"><span className="rounded-full border border-fuchsia-300/20 bg-fuchsia-300/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-fuchsia-200">Gen Z safe space-ish</span><span className="flex items-center gap-2 text-xs font-bold text-emerald-300"><i className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />bestie online</span></div>
        <div className="mt-8 text-6xl">☕</div><p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-[#ff8ac5]">No quiz. No fake files.</p>
        <h2 className="mt-2 text-5xl font-black leading-[0.88] tracking-[-0.065em] sm:text-6xl">YOU SPILL.<br /><span className="bg-gradient-to-r from-[#ff65b3] to-[#ff985f] bg-clip-text text-transparent">WE LISTEN.</span></h2>
        <p className="mt-6 max-w-md text-sm leading-7 text-white/55">Type it, voice-note it, or bring a screenshot receipt. It feels like sending tea to the one friend who replies in 0.2 seconds.</p>
        <div className="mt-7 rotate-[-2deg] rounded-3xl border border-[#ff8ac5]/25 bg-gradient-to-br from-[#6f1d62]/65 to-[#401d51]/65 p-5 shadow-xl"><p className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#ffb5db]"><Gift size={16} /> Today’s little bribe</p><div className="mt-2 flex items-end gap-2"><strong className="text-5xl font-black">5%</strong><span className="pb-1 text-sm font-bold text-white/55">off for one completed tea drop</span></div><p className="mt-3 text-[11px] leading-5 text-white/40">One reward per guest daily. A higher arcade discount will never be replaced.</p></div>
        <div className="mt-6 space-y-3 text-xs text-white/45"><Info icon={ShieldCheck}>Nothing posts publicly until you tap Share.</Info><Info icon={Users}>Recording requires permission from everyone recorded.</Info><Info icon={Pencil}>Scratch over names and faces before attaching receipts.</Info></div>
      </aside>

      <div className="p-4 sm:p-7"><div className="mx-auto overflow-hidden rounded-[2rem] border border-white/10 bg-[#201828]/85 shadow-2xl backdrop-blur">
        <header className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-4 sm:px-6"><div className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#ff65b3] to-[#ff985f] text-xl">🫢<i className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#201828] bg-emerald-400" /></div><div><p className="font-black">your no-judgement bestie</p><p className="text-[11px] text-white/40">online • ready for the voice note</p></div><span className="ml-auto rounded-full bg-white/5 px-3 py-1 text-[10px] font-black text-white/35">PRIVATE PREVIEW</span></header>
        <AnimatePresence mode="wait">{!sent ? <motion.form key="write" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="tea-chat-scroll max-h-[350px] min-h-[250px] space-y-3 overflow-y-auto p-4 sm:p-6"><Bubble>Okay bestie, phone face-down. What happened? 👀</Bubble><Bubble delay={0.1}>Start anywhere. When did the plot twist hit?</Bubble>{(tea.trim() || audio || receipt) && <div className="flex justify-end"><motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-[88%] rounded-3xl rounded-br-md bg-gradient-to-br from-[#d93f91] to-[#e85d67] px-4 py-3">{tea.trim() && <p className="whitespace-pre-wrap text-sm leading-6">{tea}</p>}{audio && <div className="mt-2 rounded-2xl bg-black/20 p-3"><p className="mb-2 text-[10px] font-black uppercase"><Mic size={12} className="mr-1 inline" />voice tea • {clock(seconds)}</p><audio controls src={audio} className="h-8 w-full" /></div>}{receipt && <img src={receipt} alt="Redacted receipt" className="mt-2 max-h-48 w-full rounded-2xl object-cover" />}</motion.div></div>}{(tea.length > 20 || audio || receipt) && <Bubble delay={0.15}>{reaction}</Bubble>}</div>
          <div className="border-t border-white/10 p-4 sm:p-6">
            <div className="flex flex-wrap gap-2">{teaTypes.map((item) => <button type="button" key={item} onClick={() => setType(item)} className={type === item ? "rounded-full bg-[#ff75b9] px-3 py-1.5 text-[11px] font-black text-[#211324]" : "rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-black text-white/45"}>{item}</button>)}</div>
            <div className="mt-4 grid grid-cols-2 rounded-2xl bg-black/20 p-1"><button type="button" onClick={() => setMode("text")} className={mode === "text" ? "rounded-xl bg-white py-2 text-xs font-black text-[#211324]" : "rounded-xl py-2 text-xs font-black text-white/45"}>⌨️ Type the tea</button><button type="button" onClick={() => setMode("voice")} className={mode === "voice" ? "rounded-xl bg-white py-2 text-xs font-black text-[#211324]" : "rounded-xl py-2 text-xs font-black text-white/45"}>🎙️ Voice note</button></div>
            {mode === "text" ? <label className="mt-4 block"><span className="sr-only">Type the tea</span><textarea maxLength={1500} value={tea} onChange={(event) => setTea(event.target.value)} className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 outline-none placeholder:text-white/25 focus:border-[#ff75b9]/60" placeholder="Tujhe pata hai kya hua… so basically 👀" /><span className="mt-1 block text-right text-[10px] text-white/25">{tea.length}/1500</span></label> :
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4"><label className="flex items-start gap-3 text-xs leading-5 text-white/55"><input type="checkbox" checked={recordingConsent} onChange={(event) => setRecordingConsent(event.target.checked)} className="mt-1 accent-[#ff65b3]" /><span><strong className="text-white/80">Everyone being recorded agreed.</strong><br />Ask out loud first. Never secretly record people.</span></label><div className="mt-4 flex items-center gap-3">{!recording ? <button type="button" onClick={startRecording} className="grid h-14 w-14 place-items-center rounded-full bg-[#ff477e]"><Mic size={23} /></button> : <button type="button" onClick={stopRecording} className="grid h-14 w-14 place-items-center rounded-full bg-white text-[#ff477e]"><MicOff size={23} /></button>}<div><p className="font-black">{recording ? "Recording " + clock(seconds) : audio ? "Voice note ready" : "Tap to record"}</p><p className="text-[11px] text-white/35">{recording ? "No time limit • tap Stop when finished" : "Record for as long as your device allows"}</p></div>{audio && !recording && <button type="button" onClick={deleteAudio} className="ml-auto text-white/40"><Trash2 size={17} /></button>}</div>{audio && !recording && <audio controls src={audio} className="mt-4 h-9 w-full" />}<p className="mt-3 text-[10px] leading-4 text-white/25">Very long recordings use more phone memory and may be limited by the browser or device.</p></div>}
            <div className="mt-4 rounded-2xl border border-dashed border-[#ff8ac5]/25 bg-[#ff8ac5]/5 p-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#ff8ac5]/15 text-[#ff8ac5]"><ImageIcon size={19} /></span><div className="flex-1"><p className="text-sm font-black">Got receipts?</p><p className="text-[11px] text-white/35">Upload, then scratch out identities.</p></div><label className="cursor-pointer rounded-full bg-white px-4 py-2 text-xs font-black text-[#211324]"><Upload size={14} className="mr-1 inline" />{receipt ? "Replace" : "Choose"}<input type="file" accept="image/*" onChange={chooseReceipt} className="hidden" /></label></div>{receipt && <div className="mt-4"><img src={receipt} alt="Edited receipt preview" className="max-h-52 w-full rounded-2xl bg-black/30 object-contain" /><label className="mt-3 flex items-start gap-2 text-[11px] text-white/55"><input type="checkbox" checked={receiptChecked} onChange={(event) => setReceiptChecked(event.target.checked)} className="accent-[#ff65b3]" />I covered names, faces, usernames and private details.</label></div>}</div>
            <div className="mt-4 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-[11px] leading-5 text-amber-100/60"><strong className="text-amber-100">Real names identify real people.</strong> Include them only at your own risk; roles like “my flatmate” are safer. No phone numbers, addresses, intimate content, minors’ information, threats or unverified criminal accusations.</div>
            <label className="mt-4 flex items-start gap-3 text-xs leading-5 text-white/55"><input required type="checkbox" checked={safe} onChange={(event) => setSafe(event.target.checked)} className="mt-1 accent-[#ff65b3]" />I have the right to share this and I am not using it to bully, threaten or expose private information.</label>
            {notice && <p className="mt-3 rounded-xl bg-red-400/10 px-3 py-2 text-xs font-bold text-red-200">{notice}</p>}
            <button disabled={!ready} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#ff7a55] px-5 py-3.5 font-black shadow-lg disabled:opacity-35"><Send size={17} /> Drop the tea & unlock 5%</button>
          </div>
        </motion.form> : <motion.div key="sent" className="p-5 sm:p-8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-300 to-teal-500 text-[#10251e]"><Check size={38} /></div><p className="mt-5 text-center text-xs font-black uppercase tracking-[0.22em] text-emerald-300">Tea successfully dropped</p><h3 className="mt-2 text-center text-4xl font-black">{rewarded ? "5% OFF UNLOCKED" : "Bestie, we got it."}</h3><p className="mx-auto mt-3 max-w-md text-center text-sm leading-6 text-white/45">{rewarded ? "Your reward is saved. If you had a bigger arcade reward, we protected the bigger discount." : claimedToday ? "Today’s 5% was already claimed, but you can still share more tea." : "Tea received."}</p><div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-4"><p className="text-[10px] font-black uppercase tracking-wider text-[#ff8ac5]">Bestie’s reaction</p><p className="mt-2 text-sm font-semibold">{reaction}</p>{tea && <p className="mt-4 line-clamp-4 rounded-2xl bg-white/5 p-3 text-xs leading-5 text-white/45">“{tea}”</p>}</div><PublishToFeed cafeId={cafeId} type={type} tea={tea} audio={audio} receipt={receipt} /><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={share} className="flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-[#211324]"><Send size={17} />{copied ? "Copied!" : "Share with the group"}</button><button type="button" onClick={reset} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 px-5 py-3 font-black text-white/70"><RotateCcw size={17} />Spill another</button></div><p className="mt-4 text-center text-[10px] text-white/25">Saved privately on this device. Nothing enters the café feed without your request and owner approval.</p>
        </motion.div>}</AnimatePresence>
      </div></div>
    </div>
    <AnimatePresence>{editing && <ReceiptEditor source={editing} cancel={() => setEditing(null)} save={(value) => { setReceipt(value); setReceiptChecked(false); setEditing(null); }} />}</AnimatePresence>
  </section>;
}

function Info({ icon: Icon, children }: { icon: typeof ShieldCheck; children: ReactNode }) {
  return <p className="flex gap-3"><Icon size={17} className="shrink-0 text-[#ff8ac5]" />{children}</p>;
}

function Bubble({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} className="flex"><div className="max-w-[85%] rounded-3xl rounded-bl-md bg-white/10 px-4 py-3 text-sm leading-6 text-white/75">{children}</div></motion.div>;
}

function PublishToFeed({ cafeId, type, tea, audio, receipt }: { cafeId: string; type: TeaType; tea: string; audio: string | null; receipt: string | null }) {
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "pending" | "error">("idle");
  const [message, setMessage] = useState("");

  async function publish() {
    if (!accepted || status === "sending") return;
    setStatus("sending");
    setMessage("");
    try {
      let audioDataUrl: string | null = null;
      if (audio) {
        const blob = await (await fetch(audio)).blob();
        if (blob.size > 12_000_000) throw new Error("This recording is too large for the café feed. You can still share it directly with your group.");
        audioDataUrl = await blobAsDataUrl(blob);
      }
      const response = await fetch("/api/tea-posts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ cafeId, category: type, text: tea, audioDataUrl, receiptDataUrl: receipt, safetyAccepted: true, publishAccepted: true }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not submit to the feed");
      setStatus("pending");
    } catch (error) {
      setMessage((error as Error).message);
      setStatus("error");
    }
  }

  if (status === "pending") return <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-4 text-center"><p className="font-black text-emerald-200">Sent for owner approval ✓</p><p className="mt-1 text-[11px] text-white/45">It will appear in the café feed only after the owner reviews it.</p></div>;
  return <div className="mt-6 rounded-2xl border border-[#ff8ac5]/20 bg-[#ff8ac5]/5 p-4"><p className="text-sm font-black">Want other customers to see this?</p><p className="mt-1 text-[11px] leading-5 text-white/40">Submit it to the moderated café feed. The owner must approve it first.</p><label className="mt-3 flex items-start gap-2 text-[11px] leading-4 text-white/55"><input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-0.5 accent-[#ff65b3]" />I consent to this tea, voice note and receipt being visible to other café customers if approved.</label><button type="button" disabled={!accepted || status === "sending"} onClick={publish} className="mt-4 w-full rounded-xl bg-[#ff65b3] px-4 py-2.5 text-xs font-black text-[#251323] disabled:opacity-35">{status === "sending" ? "Sending for review…" : "Submit to café feed"}</button>{message && <p className="mt-2 text-[11px] text-red-200">{message}</p>}</div>;
}

function ReceiptEditor({ source, save, cancel }: { source: string; save: (value: string) => void; cancel: () => void }) {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [brush, setBrush] = useState(42);
  const [ready, setReady] = useState(false);

  function resetImage() {
    const target = canvas.current;
    if (!target) return;
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 900 / image.naturalWidth, 900 / image.naturalHeight);
      target.width = Math.round(image.naturalWidth * scale);
      target.height = Math.round(image.naturalHeight * scale);
      target.getContext("2d")?.drawImage(image, 0, 0, target.width, target.height);
      setReady(true);
    };
    image.src = source;
  }

  useEffect(resetImage, [source]);

  function coordinates(event: ReactPointerEvent<HTMLCanvasElement>) {
    const target = canvas.current!;
    const box = target.getBoundingClientRect();
    return { x: (event.clientX - box.left) * target.width / box.width, y: (event.clientY - box.top) * target.height / box.height };
  }

  function start(event: ReactPointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    const context = event.currentTarget.getContext("2d");
    const point = coordinates(event);
    if (!context) return;
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(point.x + 0.1, point.y + 0.1);
    context.strokeStyle = "#111";
    context.lineWidth = brush;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();
  }

  function move(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const context = event.currentTarget.getContext("2d");
    const point = coordinates(event);
    if (!context) return;
    context.lineTo(point.x, point.y);
    context.stroke();
  }

  return <motion.div className="fixed inset-0 z-[100] overflow-y-auto bg-[#0b0710]/95 p-4 backdrop-blur-xl sm:p-7" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="mx-auto max-w-5xl"><header className="flex items-start justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-[#ff8ac5]">Privacy marker</p><h3 className="mt-2 text-3xl font-black sm:text-5xl">SCRATCH OUT THE IDENTITIES.</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">Draw over names, faces, usernames, numbers, addresses and notification previews.</p></div><button type="button" onClick={cancel} className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5"><X size={20} /></button></header><div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-3 sm:p-5"><div className="mb-4 flex items-center gap-3"><label className="text-xs font-black text-white/60">Marker size <input type="range" min="18" max="90" value={brush} onChange={(event) => setBrush(Number(event.target.value))} className="ml-2 accent-[#ff65b3]" /></label><button type="button" onClick={resetImage} className="ml-auto rounded-full border border-white/10 px-4 py-2 text-xs font-black text-white/60"><RotateCcw size={14} className="mr-1 inline" />Reset</button></div><div className="grid max-h-[65vh] place-items-center overflow-auto rounded-2xl bg-black/35 p-2"><canvas ref={canvas} onPointerDown={start} onPointerMove={move} onPointerUp={() => { drawing.current = false; }} onPointerCancel={() => { drawing.current = false; }} className="max-h-[62vh] max-w-full touch-none cursor-crosshair rounded-xl" /></div><button type="button" disabled={!ready} onClick={() => { if (canvas.current) save(canvas.current.toDataURL("image/jpeg", 0.86)); }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#ff4fa3] to-[#ff7a55] px-5 py-3.5 font-black disabled:opacity-40"><Check size={17} />Use this redacted receipt</button></div></div></motion.div>;
}
