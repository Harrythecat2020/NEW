import { del, get, set } from "idb-keyval";
import type { CachedCountry } from "./types";

const TTL_MS = 1000 * 60 * 60 * 24 * 30;

export async function getCachedCountry(iso2: string): Promise<CachedCountry | null> {
  const value = await get<CachedCountry>(`country:${iso2}`);
  if (!value) return null;
  if (Date.now() - value.updatedAt > TTL_MS) {
    await del(`country:${iso2}`);
    return null;
  }
  return value;
}

export async function setCachedCountry(iso2: string, places: CachedCountry["places"]) {
  await set(`country:${iso2}`, { updatedAt: Date.now(), places });
}

export const CACHE_TTL_MS = TTL_MS;
