import type { Place } from "./types";

export function clampDescription(input: string): string {
  return input.length <= 200 ? input : `${input.slice(0, 197)}...`;
}

export function dedupePlaces(places: Place[]): Place[] {
  const byNameCoord = new Map<string, Place>();
  for (const p of places) {
    const key = `${p.name.toLowerCase()}-${p.lat.toFixed(2)}-${p.lng.toFixed(2)}`;
    if (!byNameCoord.has(key)) byNameCoord.set(key, p);
  }
  return [...byNameCoord.values()];
}
