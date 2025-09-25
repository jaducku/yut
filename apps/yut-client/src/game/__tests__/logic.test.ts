import { describe, expect, it } from "vitest";
import { getSteps, hasExtraTurn, initialPieces, rollYut, type ThrowResult } from "../logic";

function createGenerator(sequence: number[]): () => number {
  let index = 0;
  return () => {
    const value = sequence[index] ?? 0;
    index += 1;
    return value;
  };
}

describe("throw resolution", () => {
  const expectations: Record<ThrowResult, { steps: number; extra: boolean; pattern: number[] }> = {
    do: { steps: 1, extra: false, pattern: [1, 0, 0, 0] },
    gae: { steps: 2, extra: false, pattern: [1, 1, 0, 0] },
    geol: { steps: 3, extra: false, pattern: [1, 1, 1, 0] },
    yut: { steps: 4, extra: true, pattern: [1, 1, 1, 1] },
    mo: { steps: 5, extra: true, pattern: [0, 0, 0, 0] }
  };

  it("matches movement table", () => {
    Object.entries(expectations).forEach(([result, value]) => {
      expect(getSteps(result as ThrowResult)).toBe(value.steps);
      expect(hasExtraTurn(result as ThrowResult)).toBe(value.extra);
    });
  });

  it("simulates deterministic stick throws", () => {
    Object.entries(expectations).forEach(([result, value]) => {
      const outcome = rollYut(createGenerator(value.pattern));
      expect(outcome.result).toBe(result);
      expect(outcome.steps).toBe(value.steps);
      expect(outcome.extraTurn).toBe(value.extra);
      expect(outcome.sticks).toEqual(value.pattern);
    });
  });
});

describe("piece initialization", () => {
  it("creates four fresh pieces", () => {
    const pieces = initialPieces();
    expect(pieces).toHaveLength(4);
    pieces.forEach((piece, index) => {
      expect(piece.id).toBe(`piece-${index + 1}`);
      expect(piece.position).toBe(0);
      expect(piece.stackedWith).toEqual([]);
      expect(piece.isHome).toBe(false);
    });
  });
});
