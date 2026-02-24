"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import countriesGeo from "@/data/countries-geo.json";
import { useExplorerStore } from "@/store/explorer";
import { countriesByIso, findCountry, randomCountry } from "@/lib/countries";
import { FixedSizeList as List } from "react-window";

const Globe = dynamic(() => import("react-globe.gl"), { ssr: false, loading: () => <div className="h-[70vh] w-full animate-pulse rounded-xl bg-slate-800" /> });

export function GlobeExplorer() {
  const ref = useRef<any>(null);
  const [q, setQ] = useState("");
  const results = useMemo(() => findCountry(q), [q]);
  const { places, panelOpen, loading, error, selectedPlace, pinsVisible, camera, countryIso, lastLoadMs } = useExplorerStore();
  const { loadCountry, setSelectedPlace, togglePanel, removePins, resetView, retry, setCamera } = useExplorerStore();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "p") togglePanel();
      if (e.key.toLowerCase() === "r") resetView();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePanel, resetView]);

  useEffect(() => {
    ref.current?.pointOfView({ lat: camera.lat, lng: camera.lng, altitude: camera.altitude }, 700);
  }, [camera]);

  const copyLink = async () => {
    const url = `${location.origin}/explore?country=${countryIso || ""}&lat=${camera.lat}&lng=${camera.lng}&alt=${camera.altitude}`;
    await navigator.clipboard.writeText(url);
    alert("Link gekopieerd");
  };

  return (
    <div className="flex h-screen w-full gap-2 p-2">
      <main className="relative flex-1 rounded-xl bg-slate-900 p-2">
        <div className="mb-2 flex flex-wrap gap-2 text-sm">
          <input aria-label="Zoek land" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Zoek land (min 3 tekens)" className="h-11 min-w-56 rounded border border-slate-700 bg-slate-950 px-3" />
          {results.slice(0, 5).map((r) => <button className="h-11 rounded bg-slate-700 px-3" key={r.iso2} onClick={() => loadCountry(r.iso2)}>{r.name}</button>)}
          {q.length >= 3 && !results.length && <p className="self-center text-amber-200">Geen land gevonden. Controleer spelling of probeer een ander deel van de naam.</p>}
        </div>
        <p className="mb-1 text-xs text-slate-300">Sleep om te draaien, knijp om te zoomen, klik land of pin voor details.</p>
        <p className="mb-2 text-xs text-slate-300">Sneltoetsen: P = paneel, R = reset weergave.</p>
        <div className="grid grid-cols-2 gap-2 md:flex">
          <button aria-label="Paneel tonen/verbergen" className="h-11 min-w-11 rounded bg-cyan-500 px-3 text-slate-950" onClick={togglePanel}>Paneel</button>
          <button aria-label="Willekeurig land" className="h-11 min-w-11 rounded bg-cyan-500 px-3 text-slate-950" onClick={() => loadCountry(randomCountry().iso2)}>Random</button>
          <button aria-label="Verwijder pins" className="h-11 min-w-11 rounded bg-cyan-500 px-3 text-slate-950" onClick={removePins}>Remove pins</button>
          <button aria-label="Reset globe" className="h-11 min-w-11 rounded bg-cyan-500 px-3 text-slate-950" onClick={resetView}>Reset</button>
          <button aria-label="Kopieer share link" className="h-11 min-w-11 rounded bg-cyan-500 px-3 text-slate-950" onClick={copyLink}>Share</button>
        </div>
        <div className="mt-2 h-[70vh] min-h-[420px] overflow-hidden rounded-xl" data-testid="globe-wrap">
          <Globe
            ref={ref}
            globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
            polygonsData={(countriesGeo as any).features}
            polygonAltitude={0.008}
            polygonCapColor={(d: any) => d.properties.iso_a2 === countryIso ? "#06b6d4" : "rgba(255,255,255,0.2)"}
            onPolygonClick={(d: any) => loadCountry(d.properties.iso_a2)}
            pointsData={pinsVisible ? places : []}
            pointLat="lat"
            pointLng="lng"
            pointAltitude={0.03}
            pointRadius={0.22}
            pointColor={(d: any) => d.id === selectedPlace ? "#f43f5e" : "#22d3ee"}
            onPointClick={(d: any) => {
              setSelectedPlace(d.id);
              setCamera({ lat: d.lat, lng: d.lng, altitude: 1 });
            }}
            onZoom={(pov: any) => setCamera({ lat: pov.lat, lng: pov.lng, altitude: pov.altitude })}
          />
        </div>
      </main>
      <aside className={`${panelOpen ? "w-[360px]" : "w-0"} overflow-hidden rounded-xl bg-slate-900 transition-all`}>
        <div className="h-full p-3">
          <h2 className="text-lg font-semibold">Info paneel</h2>
          <p className="text-xs text-slate-300">Cache is lokaal en verloopt automatisch na 30 dagen.</p>
          {loading && <p className="mt-2 text-cyan-300">Laden…</p>}
          {!!lastLoadMs && <p className="text-xs text-slate-400">Laadtijd: {Math.round(lastLoadMs)}ms</p>}
          {error && <div><p className="mt-2 text-rose-300">{error}</p><button className="mt-2 h-11 rounded bg-rose-500 px-4" onClick={retry}>Opnieuw</button></div>}
          {!countryIso && <p className="mt-4 text-sm">Selecteer een land op de globe om plekken te zien.</p>}
          <List height={560} width={330} itemCount={places.length} itemSize={145}>
            {({ index, style }) => {
              const p = places[index];
              return (
                <div style={style} className={`mb-2 rounded border p-2 ${selectedPlace === p.id ? "border-cyan-300" : "border-slate-700"}`}>
                  <button className="w-full text-left" onClick={() => { setSelectedPlace(p.id); setCamera({ lat: p.lat, lng: p.lng, altitude: 1 }); }}>
                    <h3 className="font-semibold">{p.name}</h3>
                    <p className="text-xs">{p.description.slice(0, 200)}</p>
                    <p className="text-xs text-slate-400">{p.lat.toFixed(3)}, {p.lng.toFixed(3)}</p>
                  </button>
                  {p.image ? <img src={p.image} alt={p.name} className="mt-1 h-16 w-full rounded object-cover"/> : <div className="mt-1 flex h-16 items-center justify-center rounded bg-slate-800 text-xs">Geen afbeelding beschikbaar</div>}
                  <div className="mt-1 flex justify-between text-xs">
                    <span>{p.source || "Bron onbekend"}</span>
                    <a className="underline" target="_blank" href={`https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lng}#map=5/${p.lat}/${p.lng}`}>Kaart</a>
                  </div>
                </div>
              );
            }}
          </List>
        </div>
      </aside>
    </div>
  );
}
