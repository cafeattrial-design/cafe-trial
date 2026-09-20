"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronRight, Clock3, Flame, Gamepad2, MessageCirclePlus, Minus, Plus, RotateCcw, Send, ShieldCheck, Sparkles, Trophy, Users, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { partyGames, type PartyGame } from "@/lib/partyGames";

function randomIndex(length: number, current: number) {
  if (length < 2) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === current) next = Math.floor(Math.random() * length);
  return next;
}

function wheelSegments(minimum: number, maximum: number) {
  return Array.from({ length: 8 }, (_, index) => Math.round(minimum + (maximum - minimum) * index / 7));
}
type ArcadeMode = "solo" | "group";
type RewardStage = "play" | "score" | "wheel" | "result";
type CustomQuestion = { id: string; gameId: string; text: string };

function anonymizeQuestion(value: string) {
  return value.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, "someone").replace(/\b(?:named|called)\s+[A-Z][a-z]+\b/gi, "called someone").replace(/@[\w.]+/g, "@anonymous").replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/g, "[email removed]").replace(/(?:\+?\d[\d\s-]{7,}\d)/g, "[number removed]").replace(/https?:\/\/\S+/g, "[link removed]").trim();
}

export default function TableGames({ cafeId }: { cafeId: string }) {
  const [mode, setMode] = useState<ArcadeMode>("group");
  const [selected, setSelected] = useState<PartyGame | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [leftVotes, setLeftVotes] = useState(0);
  const [rightVotes, setRightVotes] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [points, setPoints] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const [timerOn, setTimerOn] = useState(false);
  const [players, setPlayers] = useState(4);
  const [roles, setRoles] = useState<{ word: string; imposter: number } | null>(null);
  const [playerTurn, setPlayerTurn] = useState(0);
  const [roleVisible, setRoleVisible] = useState(false);
  const [discussion, setDiscussion] = useState(false);
  const [imposterRevealed, setImposterRevealed] = useState(false);
  const [rewardStage, setRewardStage] = useState<RewardStage>("play");
  const [arcadeDiscount, setArcadeDiscount] = useState<number | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [rewardRange, setRewardRange] = useState({ min: 5, max: 20 });
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [contributeOpen, setContributeOpen] = useState(false);
  const [questionForm, setQuestionForm] = useState({ gameId: "most-likely", text: "" });
  const [questionAdded, setQuestionAdded] = useState(false);

  const games = useMemo(() => partyGames.map((game) => ({ ...game, prompts: [...customQuestions.filter((question) => question.gameId === game.id).map((question) => question.text), ...game.prompts] })), [customQuestions]);
  const arcadeWheel = useMemo(() => wheelSegments(rewardRange.min, rewardRange.max), [rewardRange]);

  useEffect(() => {
    try { setCustomQuestions(JSON.parse(localStorage.getItem(`arcade-prompts:${cafeId}`) || "[]")); } catch { setCustomQuestions([]); }
  }, [cafeId]);

  useEffect(() => {
    fetch("/api/games/config?cafeId=" + encodeURIComponent(cafeId))
      .then((response) => response.ok ? response.json() : null)
      .then((data) => {
        if (!data?.config) return;
        const min = Math.max(0, Math.min(80, Number(data.config.minDiscountPercentage ?? 5)));
        const max = Math.max(min, Math.min(80, Number(data.config.maxDiscountPercentage ?? 20)));
        setRewardRange({ min, max });
      })
      .catch(() => undefined);
  }, [cafeId]);

  useEffect(() => {
    if (!timerOn || seconds <= 0) return;
    const timer = window.setTimeout(() => setSeconds((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, timerOn]);

  useEffect(() => { if (seconds === 0) setTimerOn(false); }, [seconds]);

  const prompt = selected?.prompts[promptIndex] || "";
  const choices = useMemo(() => prompt.split("|"), [prompt]);

  function openGame(game: PartyGame) {
    setSelected(game); setPromptIndex(Math.floor(Math.random() * game.prompts.length));
    setLeftVotes(0); setRightVotes(0); setRevealed(false); setPoints(0); setRounds(0);
    setSeconds(30); setTimerOn(false); setRoles(null); setDiscussion(false); setImposterRevealed(false); setRewardStage("play"); setArcadeDiscount(null);
  }

  function nextPrompt(earned: unknown = true) {
    if (!selected) return;
    const completed = rounds + 1;
    const gainedPoint = typeof earned === "boolean" ? earned : true;
    if (gainedPoint) setPoints((value) => value + 1);
    setRounds(completed);
    if (completed >= 5) { setRewardStage("score"); return; }
    setPromptIndex((current) => randomIndex(selected.prompts.length, current));
    setLeftVotes(0); setRightVotes(0); setRevealed(false); setSeconds(30); setTimerOn(false);
  }

  function spinArcadeWheel() {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    const scoreFloor = Math.round(rewardRange.min + (rewardRange.max - rewardRange.min) * Math.min(points, 5) / 5 * 0.35);
    const eligible = arcadeWheel.map((value, index) => ({ value, index })).filter((item) => item.value >= scoreFloor);
    const winner = eligible[Math.floor(Math.random() * eligible.length)] || { value: rewardRange.min, index: 0 };
    setWheelRotation((value) => value + 1800 + (360 - winner.index * 45 - 22.5));
    window.setTimeout(() => {
      setArcadeDiscount(winner.value); setWheelSpinning(false); setRewardStage("result");
      let previous = 0;
      try { previous = Number(JSON.parse(localStorage.getItem(`tea-reward:${cafeId}`) || "{}").discount || 0); } catch { previous = 0; }
      localStorage.setItem(`tea-reward:${cafeId}`, JSON.stringify({ discount: Math.max(previous, winner.value), source: "table-arcade", score: points, earnedAt: new Date().toISOString() }));
    }, 3300);
  }

  function startImposter() {
    if (!selected) return;
    setRoles({ word: selected.prompts[Math.floor(Math.random() * selected.prompts.length)], imposter: Math.floor(Math.random() * players) });
    setPlayerTurn(0); setRoleVisible(false); setDiscussion(false); setImposterRevealed(false);
  }

  function hideAndPass() {
    setRoleVisible(false);
    if (playerTurn === players - 1) { setDiscussion(true); setSeconds(90); }
    else setPlayerTurn((turn) => turn + 1);
  }

  function submitQuestion(event: FormEvent) {
    event.preventDefault();
    const clean = anonymizeQuestion(questionForm.text);
    if (clean.length < 12) return;
    const entry = { id: `table-${Date.now()}`, gameId: questionForm.gameId, text: clean };
    const next = [entry, ...customQuestions].slice(0, 60);
    setCustomQuestions(next);
    localStorage.setItem(`arcade-prompts:${cafeId}`, JSON.stringify(next));
    setQuestionForm((form) => ({ ...form, text: "" })); setQuestionAdded(true);
  }

  return <section id="table-arcade" className="scroll-mt-24">
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#a02618]"><Sparkles size={15} /> While the kitchen cooks</p><h2 className="mt-2 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">THE TABLE ARCADE</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">Eight zero-download games made for one phone and the whole group. Pick chaos, pass the phone and keep playing until the food lands.</p></div><div className="rounded-full border border-[#ead8c5] bg-white px-4 py-2 text-xs font-black text-[#a02618]"><Users className="mr-2 inline" size={15} /> 2–10 players</div></div>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div className="flex w-fit rounded-2xl border border-[#ead8c5] bg-white p-1 shadow-sm"><button onClick={() => setMode("solo")} className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${mode === "solo" ? "bg-slate-950 text-white" : "text-slate-500"}`}>👤 Solo</button><button onClick={() => setMode("group")} className={`rounded-xl px-5 py-2.5 text-sm font-black transition ${mode === "group" ? "bg-slate-950 text-white" : "text-slate-500"}`}>👥 Group</button></div><button onClick={() => { setContributeOpen(true); setQuestionAdded(false); }} className="inline-flex items-center gap-2 rounded-2xl bg-[#a02618] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-950/10 transition hover:-translate-y-0.5"><MessageCirclePlus size={18} /> Add your secret question</button></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{games.filter((game) => mode === "group" || game.kind !== "imposter").map((game, index) => <motion.button key={game.id} onClick={() => openGame(game)} className="group relative min-h-48 overflow-hidden rounded-3xl p-5 text-left text-white shadow-lg" style={{ background: `linear-gradient(145deg, ${game.accent}, #17130f 115%)` }} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.035 }} whileHover={{ y: -5 }}>
      <span className="text-4xl">{game.emoji}</span><span className="absolute right-4 top-4 rounded-full bg-black/20 px-2 py-1 text-[9px] font-black uppercase tracking-wider">Quick play</span><h3 className="mt-7 text-2xl font-black leading-none">{game.title}</h3><p className="mt-2 text-xs leading-5 text-white/65">{game.tagline}</p><span className="absolute bottom-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-white text-slate-950 transition group-hover:translate-x-1"><ChevronRight size={17} /></span>
    </motion.button>)}</div>

    <AnimatePresence>{contributeOpen && <motion.div className="fixed inset-0 z-[95] grid place-items-center overflow-y-auto bg-[#17130f]/90 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) setContributeOpen(false); }}>
      <motion.div className="my-auto w-full max-w-xl overflow-hidden rounded-[2rem] bg-[#fff8ef] shadow-2xl" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}>
        <header className="relative bg-gradient-to-br from-[#8f315a] via-[#c74369] to-[#ef8a59] p-6 text-white sm:p-8">
          <button type="button" onClick={() => setContributeOpen(false)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/20 hover:bg-black/30" aria-label="Close"><X size={18} /></button>
          <MessageCirclePlus size={32} /><p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/65">Anonymous table drop</p><h3 className="mt-1 text-3xl font-black tracking-tight">Create your own chaos.</h3><p className="mt-2 max-w-md text-sm leading-6 text-white/75">Add the question your group will never see coming. It joins the selected game on this device.</p>
        </header>
        {questionAdded ? <div className="p-7 text-center sm:p-9">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={30} /></span><h4 className="mt-5 text-2xl font-black text-[#2b2118]">Your question is in the deck.</h4><p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#755e4a]">It was anonymized and saved only on this device. Ready to watch the table react?</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => { const target = games.find((game) => game.id === questionForm.gameId); setContributeOpen(false); if (target) openGame(target); }} className="rounded-2xl bg-[#8f315a] px-5 py-3 text-sm font-black text-white shadow-lg hover:bg-[#742447]">Play it now</button><button type="button" onClick={() => setQuestionAdded(false)} className="rounded-2xl border border-[#dbc5b1] bg-white px-5 py-3 text-sm font-black text-[#503d2d] hover:bg-[#fff4e7]">Add another</button></div>
        </div> : <form onSubmit={submitQuestion} className="space-y-5 p-6 sm:p-8">
          <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-left"><ShieldCheck className="mt-0.5 shrink-0 text-amber-700" size={22} /><p className="text-xs font-semibold leading-5 text-amber-950">Fun secrets only. Use roles, not real names. No private contact details, intimate information, bullying, criminal accusations or questions designed to humiliate one person.</p></div>
          <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#755e4a]">Add it to</span><select value={questionForm.gameId} onChange={(event) => setQuestionForm((form) => ({ ...form, gameId: event.target.value }))} className="w-full rounded-2xl border border-[#dbc5b1] bg-white px-4 py-3 text-sm font-bold text-[#392b20] outline-none focus:border-[#b13c62]">{partyGames.filter((game) => game.kind === "prompt" || game.kind === "hot" || game.kind === "caption").map((game) => <option key={game.id} value={game.id}>{game.emoji} {game.title}</option>)}</select></label>
          <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-[#755e4a]">Your question or prompt</span><textarea required minLength={12} maxLength={220} value={questionForm.text} onChange={(event) => setQuestionForm((form) => ({ ...form, text: event.target.value }))} placeholder="Example: Who here would accidentally expose the group chat first — and why?" className="min-h-32 w-full resize-none rounded-2xl border border-[#dbc5b1] bg-white px-4 py-3 text-sm leading-6 text-[#392b20] outline-none placeholder:text-[#a89380] focus:border-[#b13c62]"/><span className="mt-1 block text-right text-[10px] font-bold text-[#9b826c]">{questionForm.text.length}/220</span></label>
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4"><input required type="checkbox" className="mt-1 h-4 w-4 accent-[#8f315a]"/><span className="text-xs font-semibold leading-5 text-[#604b39]">I confirm this does not identify, target or expose private information about a real person.</span></label>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#8f315a] px-5 py-3.5 text-sm font-black text-white shadow-lg hover:bg-[#742447]"><Send size={17} /> Anonymize & add to game</button>
        </form>}
      </motion.div>
    </motion.div>}</AnimatePresence>

    <AnimatePresence>{selected && <motion.div className="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-[#17130f]/90 p-4 backdrop-blur-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.currentTarget === event.target) setSelected(null); }}>
      <motion.div className="my-auto w-full max-w-2xl overflow-hidden rounded-[2rem] bg-[#fff8ef] shadow-2xl" initial={{ scale: 0.94, y: 20 }} animate={{ scale: 1, y: 0 }}>
        <header className="relative p-6 text-white sm:p-8" style={{ background: `linear-gradient(130deg, ${selected.accent}, #17130f)` }}><button onClick={() => setSelected(null)} className="absolute right-5 top-5 grid h-10 w-10 place-items-center rounded-full bg-black/20 hover:bg-black/30"><X size={18} /></button><span className="text-4xl">{selected.emoji}</span><p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-white/55">Table game</p><h3 className="mt-1 text-4xl font-black tracking-tight">{selected.title}</h3><p className="mt-3 max-w-xl text-sm leading-6 text-white/70">{selected.rule}</p></header>
        <div className="p-5 sm:p-8">
          {rewardStage !== "play" ? <ArcadeReward stage={rewardStage} points={points} discount={arcadeDiscount} rotation={wheelRotation} spinning={wheelSpinning} wheel={arcadeWheel} range={rewardRange} spin={() => { setRewardStage("wheel"); window.setTimeout(spinArcadeWheel, 80); }} replay={() => openGame(selected)} /> : selected.kind === "imposter" ? <ImposterGame players={players} setPlayers={setPlayers} roles={roles} playerTurn={playerTurn} roleVisible={roleVisible} discussion={discussion} imposterRevealed={imposterRevealed} seconds={seconds} timerOn={timerOn} start={startImposter} show={() => setRoleVisible(true)} pass={hideAndPass} startTimer={() => setTimerOn(true)} reveal={() => setImposterRevealed(true)} complete={() => { setRoles(null); nextPrompt(true); }} /> : <>
            <div className="rounded-3xl border border-[#ead8c5] bg-white p-6 text-center shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Round {rounds + 1} • {selected.prompts.length} prompts</p>
              {selected.kind === "decode" ? <><p className="mt-6 text-6xl tracking-widest">{choices[0]}</p>{revealed ? <motion.p initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-5 text-3xl font-black" style={{ color: selected.accent }}>{choices[1]}</motion.p> : <button onClick={() => setRevealed(true)} className="mt-6 rounded-full bg-slate-950 px-6 py-3 font-black text-white">Reveal answer</button>}</> : selected.kind === "caption" ? <><p className="mt-5 text-xs font-black uppercase tracking-wider" style={{ color: selected.accent }}>Caption this imaginary photo</p><p className="mx-auto mt-3 max-w-lg text-3xl font-black leading-tight">{prompt}</p><div className={`mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full border-4 text-2xl font-black ${seconds <= 5 ? "border-red-500 text-red-500" : "border-slate-900"}`}>{seconds}</div><button onClick={() => setTimerOn((value) => !value)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-2.5 text-sm font-black text-white"><Clock3 size={16} /> {timerOn ? "Pause" : seconds === 0 ? "Time!" : "Start timer"}</button></> : selected.kind === "choice" ? <ChoiceVote single={mode === "solo"} left={choices[0]} right={choices[1]} leftVotes={leftVotes} rightVotes={rightVotes} setLeft={setLeftVotes} setRight={setRightVotes} accent={selected.accent} /> : selected.kind === "hot" ? <><p className="mx-auto mt-5 max-w-lg text-3xl font-black leading-tight">“{prompt}”</p><ChoiceVote single={mode === "solo"} left={selected.id === "red-green" ? "🚩 Red flag" : "Agree"} right={selected.id === "red-green" ? "✅ Green flag" : "Disagree"} leftVotes={leftVotes} rightVotes={rightVotes} setLeft={setLeftVotes} setRight={setRightVotes} accent={selected.accent} /></> : <><p className="mx-auto mt-7 max-w-lg text-3xl font-black leading-tight">{prompt}</p><p className="mt-6 text-xs font-bold text-slate-400">{mode === "solo" ? "Lock your answer, then imagine the group-chat debate." : "Count to three—then point. No changing your answer."}</p></>}
            </div>
            {selected.kind === "decode" && revealed && <div className="mt-4 grid grid-cols-2 gap-3"><button onClick={() => nextPrompt(true)} className="rounded-2xl bg-emerald-600 px-4 py-3 font-black text-white"><Check className="mr-2 inline" size={17} /> Got it</button><button onClick={() => nextPrompt(false)} className="rounded-2xl bg-slate-200 px-4 py-3 font-black text-slate-700">Missed it</button></div>}
            <div className="mt-5 flex items-center justify-between gap-3"><p className="text-xs font-bold text-slate-400">{selected.kind === "decode" ? `Table score: ${points}` : `${leftVotes + rightVotes} votes this round`}</p><button onClick={nextPrompt} className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-black text-white" style={{ backgroundColor: selected.accent }}>Next round <ChevronRight size={16} /></button></div>
          </>}
        </div>
      </motion.div>
    </motion.div>}</AnimatePresence>
  </section>;
}

function ChoiceVote({ left, right, leftVotes, rightVotes, setLeft, setRight, accent, single }: { left: string; right: string; leftVotes: number; rightVotes: number; setLeft: (value: number) => void; setRight: (value: number) => void; accent: string; single: boolean }) {
  const total = leftVotes + rightVotes;
  return <div className="mt-6 grid grid-cols-2 gap-3"><button onClick={() => { setLeft(single ? 1 : leftVotes + 1); if (single) setRight(0); }} className="relative min-h-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 font-black"><span className="relative z-10">{left}</span>{total > 0 && <span className="relative z-10 mt-2 block text-2xl" style={{ color: accent }}>{single ? leftVotes ? "✓" : "" : leftVotes}</span>}<span className="absolute inset-x-0 bottom-0 bg-black/5 transition-all" style={{ height: total ? `${leftVotes / total * 100}%` : "0%" }} /></button><button onClick={() => { setRight(single ? 1 : rightVotes + 1); if (single) setLeft(0); }} className="relative min-h-28 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 font-black"><span className="relative z-10">{right}</span>{total > 0 && <span className="relative z-10 mt-2 block text-2xl" style={{ color: accent }}>{single ? rightVotes ? "✓" : "" : rightVotes}</span>}<span className="absolute inset-x-0 bottom-0 bg-black/5 transition-all" style={{ height: total ? `${rightVotes / total * 100}%` : "0%" }} /></button></div>;
}

function ImposterGame(props: { players: number; setPlayers: (n: number) => void; roles: { word: string; imposter: number } | null; playerTurn: number; roleVisible: boolean; discussion: boolean; imposterRevealed: boolean; seconds: number; timerOn: boolean; start: () => void; show: () => void; pass: () => void; startTimer: () => void; reveal: () => void; complete: () => void }) {
  const { players, setPlayers, roles, playerTurn, roleVisible, discussion, imposterRevealed, seconds, timerOn, start, show, pass, startTimer, reveal, complete } = props;
  if (!roles) return <div className="text-center"><Gamepad2 className="mx-auto text-indigo-600" size={44} /><h4 className="mt-4 text-2xl font-black">How many players?</h4><div className="mx-auto mt-5 flex w-fit items-center gap-5"><button onClick={() => setPlayers(Math.max(3, players - 1))} className="grid h-11 w-11 place-items-center rounded-full border bg-white"><Minus /></button><span className="text-4xl font-black">{players}</span><button onClick={() => setPlayers(Math.min(10, players + 1))} className="grid h-11 w-11 place-items-center rounded-full border bg-white"><Plus /></button></div><button onClick={start} className="mt-7 rounded-full bg-indigo-600 px-7 py-3 font-black text-white">Deal secret roles</button></div>;
  if (!discussion) return <div className="text-center"><p className="text-xs font-black uppercase tracking-wider text-indigo-600">Pass phone to</p><h4 className="mt-2 text-4xl font-black">Player {playerTurn + 1}</h4>{roleVisible ? <motion.div initial={{ rotateY: 90 }} animate={{ rotateY: 0 }} className={`mt-6 rounded-3xl p-8 text-white ${playerTurn === roles.imposter ? "bg-red-500" : "bg-indigo-600"}`}><p className="text-xs font-black uppercase tracking-wider text-white/60">Your secret role</p><p className="mt-3 text-4xl font-black">{playerTurn === roles.imposter ? "IMPOSTER" : roles.word}</p><p className="mt-3 text-xs text-white/70">{playerTurn === roles.imposter ? "Blend in. You do not know the word." : "Describe it without saying the word."}</p></motion.div> : <button onClick={show} className="mt-8 rounded-full bg-slate-950 px-7 py-3 font-black text-white">Hold to reveal role</button>}{roleVisible && <button onClick={pass} className="mt-5 block w-full rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black">Hide & pass phone</button>}</div>;
  return <div className="text-center"><Flame className="mx-auto text-indigo-600" size={42} /><h4 className="mt-3 text-3xl font-black">Describe. Suspect. Vote.</h4><p className="mt-2 text-sm text-slate-500">Go around once. One word each—nothing too obvious.</p><div className="mx-auto mt-6 grid h-24 w-24 place-items-center rounded-full border-4 border-indigo-600 text-3xl font-black">{seconds}</div>{!timerOn && seconds === 90 && <button onClick={startTimer} className="mt-5 rounded-full bg-indigo-600 px-6 py-3 font-black text-white">Start 90 seconds</button>}{(seconds === 0 || imposterRevealed) && <div className="mt-5 rounded-3xl bg-red-50 p-6"><p className="text-xs font-black uppercase tracking-wider text-red-500">The imposter was</p><p className="mt-2 text-4xl font-black text-red-600">Player {roles.imposter + 1}</p><p className="mt-2 text-sm text-slate-500">Secret word: <strong>{roles.word}</strong></p><button onClick={complete} className="mt-4 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-black text-white">Complete round</button></div>}{!imposterRevealed && <button onClick={reveal} className="mt-5 rounded-full border border-red-200 px-5 py-2 text-sm font-black text-red-600">Reveal imposter</button>}</div>;
}

function ArcadeReward({ stage, points, discount, rotation, spinning, wheel, range, spin, replay }: { stage: RewardStage; points: number; discount: number | null; rotation: number; spinning: boolean; wheel: number[]; range: { min: number; max: number }; spin: () => void; replay: () => void }) {
  if (stage === "score") return <motion.div className="py-8 text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}><Trophy className="mx-auto text-amber-500" size={54} /><p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Five rounds complete</p><h4 className="mt-2 text-5xl font-black">{points}/5</h4><p className="mt-2 text-sm text-slate-500">{points >= 5 ? "Flawless. The table understood the assignment." : points >= 3 ? "Solid run. Your luck floor just improved." : "Chaos counts. You still unlocked a spin."}</p><button onClick={spin} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a02618] px-7 py-3.5 font-black text-white">Try your luck <Sparkles size={17} /></button></motion.div>;
  if (stage === "wheel") return <div className="py-4 text-center"><p className="text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">Owner range • {range.min}% to {range.max}%</p><h4 className="mt-2 text-3xl font-black">Your discount is spinning</h4><div className="relative mx-auto mt-8 h-64 w-64"><div className="absolute left-1/2 top-[-12px] z-10 -translate-x-1/2 border-x-[12px] border-t-[22px] border-x-transparent border-t-slate-950" /><div className="tea-wheel relative h-64 w-64 rounded-full border-[9px] border-slate-950 shadow-2xl" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 3.2s cubic-bezier(.12,.74,.13,1)" : "none" }}>{wheel.map((value, index) => <span key={`${value}-${index}`} className="absolute left-1/2 top-1/2 text-xs font-black text-white" style={{ transform: `translate(-50%, -50%) rotate(${index * 45 + 22.5}deg) translateY(-94px) rotate(-${index * 45 + 22.5}deg)` }}>{value}%</span>)}<div className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-slate-950 text-[10px] font-black text-white">PLAY</div></div></div></div>;
  return <motion.div className="py-8 text-center" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-amber-100"><Trophy className="text-amber-600" size={36} /></div><p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-[#a02618]">Arcade reward won</p><h4 className="mt-2 text-6xl font-black">{discount}% OFF</h4><p className="mt-3 text-sm text-slate-500">Saved to the same café reward slot as Spill the Tea.</p><button onClick={replay} className="mt-7 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-black text-white"><RotateCcw size={17} /> Play another five</button></motion.div>;
}
