"use client";

import { create } from "zustand";
import type { Place } from "@/lib/types";
import { getCachedCountry, setCachedCountry } from "@/lib/cache";
import { getPlacesMerged, getSeedPlace } from "@/lib/places";

type Camera = { lat: number; lng: number; altitude: number };

type ExplorerState = {
  countryIso?: string;
  places: Place[];
  loading: boolean;
  error?: string;
  selectedPlace?: string;
  panelOpen: boolean;
  pinsVisible: boolean;
  camera: Camera;
  lastLoadMs?: number;
  loadCountry: (iso2: string) => Promise<void>;
  retry: () => Promise<void>;
  setSelectedPlace: (id?: string) => void;
  togglePanel: () => void;
  removePins: () => void;
  resetView: () => void;
  setCamera: (cam: Camera) => void;
};

let abortController: AbortController | undefined;

export const useExplorerStore = create<ExplorerState>((set, get) => ({
  places: [],
  loading: false,
  panelOpen: true,
  pinsVisible: true,
  camera: { lat: 20, lng: 0, altitude: 2.2 },
  async loadCountry(iso2: string) {
    abortController?.abort();
    abortController = new AbortController();
    const started = performance.now();
    set({ countryIso: iso2, loading: true, error: undefined, pinsVisible: true, places: getSeedPlace(iso2), selectedPlace: undefined });

    const cached = await getCachedCountry(iso2);
    if (cached) {
      set({ places: cached.places, loading: false, lastLoadMs: performance.now() - started });
      return;
    }

    try {
      const merged = await getPlacesMerged(iso2, abortController.signal);
      set({
        places: merged,
        loading: false,
        error: merged.length ? undefined : "Geen resultaten. Probeer een ander land of reset filters.",
        lastLoadMs: performance.now() - started
      });
      await setCachedCountry(iso2, merged);
      const trend = JSON.parse(localStorage.getItem("we_trending") || "{}");
      trend[iso2] = (trend[iso2] || 0) + 1;
      localStorage.setItem("we_trending", JSON.stringify(trend));
    } catch {
      if (!abortController.signal.aborted) set({ loading: false, error: "Laden mislukt. Controleer je verbinding en probeer opnieuw." });
    }
  },
  async retry() {
    const iso = get().countryIso;
    if (iso) await get().loadCountry(iso);
  },
  setSelectedPlace(id) {
    set({ selectedPlace: id });
  },
  togglePanel() {
    set((s) => ({ panelOpen: !s.panelOpen }));
  },
  removePins() {
    set({ pinsVisible: false });
  },
  resetView() {
    set({ camera: { lat: 20, lng: 0, altitude: 2.2 } });
  },
  setCamera(cam) {
    set({ camera: cam });
  }
}));
