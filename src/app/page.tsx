"use client";

import Link from "next/link";
import { useMemo } from "react";
import countries from "@/data/countries.json";

export default function HomePage() {
  const trending = useMemo(() => {
    if (typeof window === "undefined") return [] as Array<[string, number]>;
    const counts = JSON.parse(localStorage.getItem("we_trending") || "{}");
    return Object.entries(counts).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5) as Array<[string, number]>;
  }, []);

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="text-4xl font-bold">WereldExplorer</h1>
      <p className="mt-2 text-slate-300">Ontdek mooie plekken wereldwijd. Geen accounts, alleen lokale sessie en lokale cache.</p>
      <Link href="/explore" className="mt-6 inline-flex h-11 items-center rounded bg-cyan-500 px-6 font-semibold text-slate-950">Start met verkennen</Link>
      <section className="mt-8 rounded-xl bg-slate-900 p-4">
        <h2 className="text-xl font-semibold">Trending plekken</h2>
        {!trending.length && <p className="text-sm text-slate-300">Nog geen trends. Verken landen om deze lijst te vullen.</p>}
        <ul className="mt-2 space-y-2 text-sm">
          {trending.map(([iso, c]) => {
            const name = (countries as any[]).find((x) => x.iso2 === iso)?.name || iso;
            return <li key={iso}>{name}: {c} views</li>;
          })}
        </ul>
      </section>
    </main>
  );
}
