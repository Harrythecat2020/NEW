"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GlobeExplorer } from "@/components/GlobeExplorer";
import { useExplorerStore } from "@/store/explorer";

export default function ExplorePage() {
  const params = useSearchParams();
  const { loadCountry, setCamera } = useExplorerStore();

  useEffect(() => {
    const c = params.get("country");
    const lat = Number(params.get("lat"));
    const lng = Number(params.get("lng"));
    const alt = Number(params.get("alt"));
    if (c) loadCountry(c);
    if (Number.isFinite(lat) && Number.isFinite(lng) && Number.isFinite(alt)) setCamera({ lat, lng, altitude: alt });
  }, [params, loadCountry, setCamera]);

  return <GlobeExplorer />;
}
