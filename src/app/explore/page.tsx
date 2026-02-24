import { Suspense } from "react";
import ExploreClient from "./ExploreClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-4">Loading…</div>}>
      <ExploreClient />
    </Suspense>
  );
}
