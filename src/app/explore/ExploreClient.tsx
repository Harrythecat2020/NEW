"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useExplorerStore } from "@/store/explorer";
import { GlobeExplorer } from "@/components/GlobeExplorer";

export default function ExploreClient() {
  const sp = useSearchParams();
  const { loadCountry, setCamera } = useExplorerStore();

  useEffect(() => {
    const country = sp.get("country");
    const lat = sp.get("lat");
    const lng = sp.get("lng");
    const alt = sp.get("alt");

    if (country) loadCountry(country);

    if (lat && lng && alt) {
      setCamera({
        lat: Number(lat),
        lng: Number(lng),
        altitude: Number(alt),
      });
    }
  }, [sp, loadCountry, setCamera]);

  return <GlobeExplorer />;
}
