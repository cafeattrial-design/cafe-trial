"use client";

import { Gamepad2, Plus, RefreshCw, Settings, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { partyGames } from "@/lib/partyGames";

export default function GameSettings({ cafeSlug }: { cafeSlug: string }) {
  const [config, setConfig] = useState<any>(null);
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    gamesPerCustomerDaily: 2,
    minDiscountPercentage: 5,
    maxDiscountPercentage: 30,
    maxDiscountValue: 5000,
    basicTierMultiplier: 1.0,
    silverTierMultiplier: 1.5,
    goldTierMultiplier: 2.0,
    platinumTierMultiplier: 3.0
  });
  const [newGame, setNewGame] = useState({
    name: "",
    description: "",
    gameType: "wheel"
  });

  useEffect(() => {
    loadData();
  }, [cafeSlug]);

  async function loadData() {
    setLoading(true);
    try {
      const [configRes, gamesRes] = await Promise.all([
        fetch("/api/owner/game-config"),
        fetch("/api/owner/games")
      ]);

      if (configRes.ok) {
        const data = await configRes.json();
        setConfig(data.config);
        setFormData({
          gamesPerCustomerDaily: data.config.gamesPerCustomerDaily,
          minDiscountPercentage: data.config.minDiscountPercentage ?? 5,
          maxDiscountPercentage: data.config.maxDiscountPercentage,
          maxDiscountValue: data.config.maxDiscountValue,
          basicTierMultiplier: data.config.basicTierMultiplier,
          silverTierMultiplier: data.config.silverTierMultiplier,
          goldTierMultiplier: data.config.goldTierMultiplier,
          platinumTierMultiplier: data.config.platinumTierMultiplier
        });
      }

      if (gamesRes.ok) {
        const data = await gamesRes.json();
        setGames(data.games || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateConfig() {
    try {
      const res = await fetch("/api/owner/game-config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        alert("Game configuration updated!");
        loadData();
      } else {
        alert("Failed to update configuration");
      }
    } catch (error) {
      console.error("Error updating config:", error);
      alert("Error updating configuration");
    }
  }

  async function createGame() {
    if (!newGame.name.trim()) {
      alert("Please enter a game name");
      return;
    }

    try {
      const res = await fetch("/api/owner/games", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(newGame)
      });

      if (res.ok) {
        alert("Game created!");
        setNewGame({ name: "", description: "", gameType: "wheel" });
        loadData();
      } else {
        alert("Failed to create game");
      }
    } catch (error) {
      console.error("Error creating game:", error);
      alert("Error creating game");
    }
  }

  async function deleteGame(gameId: string) {
    if (!confirm("Delete this game?")) return;

    try {
      const res = await fetch("/api/owner/games", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gameId })
      });

      if (res.ok) {
        alert("Game deleted!");
        loadData();
      } else {
        alert("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
      alert("Error deleting game");
    }
  }

  return (
    <div className="space-y-6">
      {/* Game Configuration Section */}
      <div className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-[0_22px_55px_rgba(31,41,51,0.08)]">
        <div className="mb-4 flex items-center gap-3">
          <Settings className="text-[#a02618]" size={24} />
          <h2 className="text-2xl font-black uppercase tracking-tight">Game Configuration</h2>
          <button
            onClick={loadData}
            className="ml-auto tool-button"
            aria-label="Refresh"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {config && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Games per customer per day</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.gamesPerCustomerDaily}
                onChange={(e) =>
                  setFormData({ ...formData, gamesPerCustomerDaily: parseInt(e.target.value) || 1 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Minimum winning discount (%)</label>
              <input
                type="number"
                min="0"
                max="80"
                value={formData.minDiscountPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, minDiscountPercentage: Math.min(80, Math.max(0, parseInt(e.target.value) || 0)) })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
              <p className="mt-1 text-xs text-slate-500">Every win will be at least this percentage.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Maximum winning discount (%)</label>
              <input
                type="number"
                min="0"
                max="80"
                value={formData.maxDiscountPercentage}
                onChange={(e) =>
                  setFormData({ ...formData, maxDiscountPercentage: Math.min(80, Math.max(formData.minDiscountPercentage, parseInt(e.target.value) || 30)) })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
              <p className="mt-1 text-xs text-slate-500">Every win will stay inside this range.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Max discount value (in paise)</label>
              <input
                type="number"
                min="100"
                value={formData.maxDiscountValue}
                onChange={(e) =>
                  setFormData({ ...formData, maxDiscountValue: parseInt(e.target.value) || 5000 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
              <p className="mt-1 text-xs text-slate-500">₹{(formData.maxDiscountValue / 100).toFixed(2)}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Basic tier multiplier</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.basicTierMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, basicTierMultiplier: parseFloat(e.target.value) || 1 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Silver tier multiplier</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.silverTierMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, silverTierMultiplier: parseFloat(e.target.value) || 1.5 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Gold tier multiplier</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.goldTierMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, goldTierMultiplier: parseFloat(e.target.value) || 2 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">Platinum tier multiplier</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={formData.platinumTierMultiplier}
                onChange={(e) =>
                  setFormData({ ...formData, platinumTierMultiplier: parseFloat(e.target.value) || 3 })
                }
                className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
              />
            </div>
          </div>
        )}

        <div className="mt-5 rounded-2xl bg-[#fff8ef] p-4">
          <div className="flex items-center justify-between text-sm font-black"><span>Wheel discount range</span><span className="text-[#a02618]">{formData.minDiscountPercentage}% – {formData.maxDiscountPercentage}%</span></div>
          <div className="relative mt-4 h-2 rounded-full bg-[#ead8c5]"><div className="absolute h-2 rounded-full bg-gradient-to-r from-[#e98133] to-[#a02618]" style={{ left: formData.minDiscountPercentage / 80 * 100 + "%", right: 100 - formData.maxDiscountPercentage / 80 * 100 + "%" }} /></div>
          <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400"><span>0%</span><span>Every wheel result stays inside your saved range</span><span>80%</span></div>
        </div>

        <button
          onClick={updateConfig}
          disabled={loading}
          className="mt-6 rounded-lg bg-[#a02618] px-6 py-3 font-bold text-white hover:bg-[#8a1f12]"
        >
          Save Configuration
        </button>
      </div>

      {/* Games Management Section */}
      <div className="rounded-3xl border border-[#ead8c5] bg-white p-5 shadow-[0_22px_55px_rgba(31,41,51,0.08)]">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gamepad2 className="text-[#a02618]" size={24} />
            <h2 className="text-2xl font-black uppercase tracking-tight">Games</h2>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 rounded-lg bg-[#a02618] px-4 py-2 font-bold text-white hover:bg-[#8a1f12]"
          >
            <Plus size={18} />
            New Game
          </button>
        </div>

        {/* Create Game Form */}
        {showForm && (
          <div className="mb-6 rounded-2xl bg-[#fff8ef] p-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Game Name</label>
                <input
                  type="text"
                  value={newGame.name}
                  onChange={(e) => setNewGame({ ...newGame, name: e.target.value })}
                  placeholder="e.g., Lucky Wheel"
                  className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Game Type</label>
                <select
                  value={newGame.gameType}
                  onChange={(e) => setNewGame({ ...newGame, gameType: e.target.value })}
                  className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
                >
                  <option value="wheel">Wheel</option>
                  <option value="dice">Dice</option>
                  <option value="cards">Cards</option>
                  <option value="spin">Spin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700">Description</label>
                <input
                  type="text"
                  value={newGame.description}
                  onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
                  placeholder="Game description"
                  className="mt-2 w-full rounded-lg border border-[#ead8c5] px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={createGame}
                className="rounded-lg bg-[#a02618] px-4 py-2 font-bold text-white hover:bg-[#8a1f12]"
              >
                Create Game
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg border border-[#ead8c5] px-4 py-2 font-bold hover:bg-[#fff8ef]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="mb-7">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-[#a02618]">Built-in live arcade • {partyGames.length} games</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{partyGames.map((game) => <div key={game.id} className="rounded-2xl p-4 text-white shadow-sm" style={{ background: "linear-gradient(145deg, " + game.accent + ", #251c17)" }}><span className="text-2xl">{game.emoji}</span><h3 className="mt-3 font-black">{game.title}</h3><p className="mt-1 text-xs leading-5 text-white/65">{game.tagline}</p><span className="mt-3 inline-block rounded-full bg-white/15 px-2 py-1 text-[9px] font-black uppercase">Active</span></div>)}</div>
        </div>

        <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500">Optional custom database games</p>
        {/* Games List */}
        <div className="grid gap-3">
          {games.length === 0 ? (
            <p className="rounded-2xl bg-[#fff8ef] p-4 text-slate-500">No extra custom games yet. The built-in arcade games above are already live.</p>
          ) : (
            games.map((game) => (
              <div key={game.id} className="flex items-start justify-between rounded-2xl bg-[#fff8ef] p-4">
                <div>
                  <h3 className="font-bold text-slate-900">{game.name}</h3>
                  <p className="text-sm text-slate-600">{game.description}</p>
                  <p className="text-xs text-slate-500">Type: {game.gameType} • Played: {game._count?.plays || 0} times</p>
                </div>
                <button
                  onClick={() => deleteGame(game.id)}
                  className="text-[#a02618] hover:text-red-700"
                  title="Delete game"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
