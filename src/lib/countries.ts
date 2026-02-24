import Fuse from "fuse.js";
import countries from "@/data/countries.json";
import type { Country } from "./types";

const countryList = countries as Country[];
const fuse = new Fuse(countryList, { keys: ["name", "iso2"], threshold: 0.3 });

export const countriesByIso = new Map(countryList.map((c) => [c.iso2, c]));

export function findCountry(query: string): Country[] {
  if (query.trim().length < 3) return [];
  return fuse.search(query).map((r) => r.item);
}

export function randomCountry(): Country {
  return countryList[Math.floor(Math.random() * countryList.length)];
}
