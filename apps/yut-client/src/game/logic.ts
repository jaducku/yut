import { z } from "zod";

export const throwResultSchema = z.enum(["do", "gae", "geol", "yut", "mo"]);

export type ThrowResult = z.infer<typeof throwResultSchema>;

export interface ThrowOutcome {
  result: ThrowResult;
  sticks: number[];
  steps: number;
  extraTurn: boolean;
}

const THROW_TABLE: Record<ThrowResult, { steps: number; extraTurn: boolean }> = {
  do: { steps: 1, extraTurn: false },
  gae: { steps: 2, extraTurn: false },
  geol: { steps: 3, extraTurn: false },
  yut: { steps: 4, extraTurn: true },
  mo: { steps: 5, extraTurn: true }
};

function translateStickSum(sum: number): ThrowResult {
  switch (sum) {
    case 0:
      return "mo";
    case 1:
      return "do";
    case 2:
      return "gae";
    case 3:
      return "geol";
    case 4:
      return "yut";
    default:
      throw new Error(`Invalid stick sum: ${sum}`);
  }
}

export function getSteps(result: ThrowResult): number {
  return THROW_TABLE[result].steps;
}

export function hasExtraTurn(result: ThrowResult): boolean {
  return THROW_TABLE[result].extraTurn;
}

export function rollYut(random: () => number = Math.random): ThrowOutcome {
  const sticks = Array.from({ length: 4 }, () => (random() < 0.5 ? 0 : 1));
  const sum = sticks.reduce((acc, value) => acc + value, 0);
  const result = translateStickSum(sum);
  return {
    result,
    sticks,
    steps: getSteps(result),
    extraTurn: hasExtraTurn(result)
  };
}

export interface PieceState {
  id: string;
  position: number;
  stackedWith: string[];
  isHome: boolean;
}

export const initialPieces = (): PieceState[] =>
  Array.from({ length: 4 }, (_, index) => ({
    id: `piece-${index + 1}`,
    position: 0,
    stackedWith: [],
    isHome: false
  }));
