"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_SHARED_PASSWORD || "wereld";
    if (pw === expected) {
      document.cookie = "we_session=1; path=/; max-age=86400";
      localStorage.setItem("we_session", "1");
      router.push("/");
      return;
    }
    setError("Onjuist wachtwoord. Probeer opnieuw.");
  };

  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-md rounded-xl bg-slate-900 p-6 shadow-lg">
      <h1 className="mb-2 text-2xl font-bold">WereldExplorer login</h1>
      <p className="mb-4 text-sm text-slate-300">Lokale sessie zonder accounts. Deel het gezamenlijke wachtwoord intern.</p>
      <label className="mb-2 block text-sm" htmlFor="pw">Wachtwoord</label>
      <input id="pw" aria-label="Wachtwoord" value={pw} onChange={(e) => setPw(e.target.value)} type="password" className="h-11 w-full rounded border border-slate-700 bg-slate-950 px-3" />
      {error && <p className="mt-2 text-sm text-rose-300">{error}</p>}
      <button className="mt-4 h-11 w-full rounded bg-cyan-500 font-semibold text-slate-950">Inloggen</button>
    </form>
  );
}
