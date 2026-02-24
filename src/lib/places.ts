import fallback from "@/data/fallback-places.json";
import type { Place } from "./types";
import { clampDescription, dedupePlaces } from "./utils";

const fallbackData = fallback as Record<string, Place[]>;

async function withRetry<T>(fn: () => Promise<T>, retries = 2): Promise<T> {
  let err: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e) {
      err = e;
      await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw err;
}

export function getSeedPlace(iso2: string): Place[] {
  return (fallbackData[iso2] || []).slice(0, 1);
}

export async function fetchWikidataPlaces(iso2: string, signal: AbortSignal): Promise<Place[]> {
  const query = `SELECT ?item ?itemLabel ?coord ?image ?desc WHERE {
  ?item wdt:P31/wdt:P279* wd:Q570116;
        wdt:P17 ?country;
        wdt:P625 ?coord.
  ?country wdt:P297 "${iso2}".
  OPTIONAL { ?item wdt:P18 ?image. }
  OPTIONAL { ?item schema:description ?desc FILTER (lang(?desc) = "nl" || lang(?desc) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "nl,en". }
} LIMIT 35`;
  const url = `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(query)}`;
  const response = await withRetry(() => fetch(url, { headers: { Accept: "application/sparql-results+json" }, signal }));
  if (!response.ok) throw new Error("Wikidata niet bereikbaar");
  const json = await response.json();
  const parsed: Place[] = (json.results.bindings as Array<Record<string, { value: string }>>).map((row, idx) => {
    const [lat, lng] = row.coord.value.replace("Point(", "").replace(")", "").split(" ").map(Number).reverse();
    return {
      id: `${iso2}-${idx}`,
      name: row.itemLabel?.value || "Onbekende plek",
      description: clampDescription(row.desc?.value || "Populaire locatie in dit land."),
      lat,
      lng,
      image: row.image?.value,
      source: "Wikidata",
      type: "attraction"
    };
  });
  return parsed.filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
}

export async function getPlacesMerged(iso2: string, signal: AbortSignal): Promise<Place[]> {
  const local = fallbackData[iso2] || [];
  try {
    const wiki = await fetchWikidataPlaces(iso2, signal);
    return dedupePlaces([...local, ...wiki]).slice(0, 60);
  } catch {
    return local;
  }
}
