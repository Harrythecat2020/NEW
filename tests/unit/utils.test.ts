import { describe, expect, it } from "vitest";
import { clampDescription, dedupePlaces } from "@/lib/utils";

describe("utils", () => {
  it("clamps descriptions", () => {
    expect(clampDescription("a".repeat(205)).length).toBe(200);
  });

  it("dedupes by name and coord", () => {
    const result = dedupePlaces([
      { id: "1", name: "A", description: "d", lat: 1.11, lng: 2.22 },
      { id: "2", name: "A", description: "d", lat: 1.12, lng: 2.23 }
    ]);
    expect(result.length).toBe(1);
  });
});
