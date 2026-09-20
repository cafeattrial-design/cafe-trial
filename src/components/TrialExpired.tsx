import type { Cafe } from "@/lib/types";

export default function TrialExpired({ cafe, status }: { cafe: Omit<Cafe, "ownerPasswordHash">; status: "expired" | "suspended" }) {
  return (
    <main className="grid min-h-screen place-items-center bg-charcoal px-6 text-paneer">
      <section className="max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-clay">{cafe.name}</p>
        <h1 className="mt-5 font-serif text-5xl leading-none md:text-7xl">
          {status === "expired" ? "Trial expired" : "Cafe access paused"}
        </h1>
        <p className="mt-6 text-paneer/70">
          This QR menu is currently unavailable. Please contact the platform owner to upgrade or restore access.
        </p>
      </section>
    </main>
  );
}
