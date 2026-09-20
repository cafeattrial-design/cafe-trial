"use client";

import { QrCode, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function QRScannerGuide() {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <>
      {/* QR Scanner Guide Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#a02618] text-white shadow-lg hover:bg-[#8a1f12] transition"
        title="QR Scanner Help"
      >
        <QrCode size={24} />
      </button>

      {/* Modal */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-black text-slate-950">How to Use QR Scanner</h2>
              <button onClick={() => setShowGuide(false)} className="text-slate-600 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6 text-slate-700">
              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">What is QR Scanning?</h3>
                <p>
                  Each cafe table has a unique QR code. When you scan it with your phone camera, it opens the cafe menu 
                  directly in your browser - no app needed!
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">Method 1: Mobile Camera (Built-in)</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Open your phone's camera app</li>
                  <li>Point at the QR code on your table</li>
                  <li>Tap the notification that appears</li>
                  <li>It opens the cafe menu - start ordering!</li>
                </ol>
                <p className="mt-3 rounded-lg bg-blue-50 p-3 text-sm">
                  ✅ Works on: iPhone (iOS 11+), Android phones with built-in QR support
                </p>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">Method 2: QR Scanner App</h3>
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Download a free QR scanner app:
                    <ul className="ml-4 mt-1 space-y-1 list-disc">
                      <li><strong>Android:</strong> "QR Code Reader" or "Google Lens"</li>
                      <li><strong>iPhone:</strong> "QR Scanner" or use native camera</li>
                    </ul>
                  </li>
                  <li>Open the app</li>
                  <li>Scan the table QR code</li>
                  <li>Open the link and enjoy the menu!</li>
                </ol>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">Customer Features Available</h3>
                <div className="grid gap-3">
                  <div className="flex gap-3 rounded-lg bg-emerald-50 p-3">
                    <div className="text-2xl">🎮</div>
                    <div>
                      <strong>Play Games & Win Discounts</strong>
                      <p className="text-sm text-slate-600">After ordering, play lucky games to get discounts on your bill</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-emerald-50 p-3">
                    <div className="text-2xl">🔊</div>
                    <div>
                      <strong>D'TREAT Voice</strong>
                      <p className="text-sm text-slate-600">Tap the speaker icon in the header to play the original D'TREAT voice message</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-emerald-50 p-3">
                    <div className="text-2xl">📧</div>
                    <div>
                      <strong>Email Bills</strong>
                      <p className="text-sm text-slate-600">Get your bill sent to your email for record-keeping</p>
                    </div>
                  </div>
                  <div className="flex gap-3 rounded-lg bg-emerald-50 p-3">
                    <div className="text-2xl">🎁</div>
                    <div>
                      <strong>Membership Tiers</strong>
                      <p className="text-sm text-slate-600">Unlock better discounts with silver, gold, and platinum membership</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">Troubleshooting</h3>
                <div className="space-y-2">
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <strong className="text-sm">❓ QR not scanning?</strong>
                    <p className="text-sm mt-1">Make sure your camera lens is clean and you have good lighting</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <strong className="text-sm">❓ Page won't load?</strong>
                    <p className="text-sm mt-1">Check your internet connection and try scanning again</p>
                  </div>
                  <div className="rounded-lg bg-yellow-50 p-3">
                    <strong className="text-sm">❓ Want to use takeaway?</strong>
                    <p className="text-sm mt-1">Ask the counter staff for the takeaway menu link or QR code</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-lg font-bold text-[#a02618]">Sharing the QR Code</h3>
                <p className="text-sm mb-2">
                  Cafe owners can print the QR code on:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Table placemats and menus</li>
                  <li>Wall posters and signage</li>
                  <li>Receipts and promotional materials</li>
                  <li>Social media and online profiles</li>
                </ul>
              </section>

              <div className="mt-6 rounded-lg bg-[#a02618]/10 p-4">
                <p className="text-sm font-semibold text-[#a02618]">
                  💡 Tip: Save the cafe URL in your bookmarks for quick access next time!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
