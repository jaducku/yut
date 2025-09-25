import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { initialPieces, rollYut, type PieceState, type ThrowOutcome } from "./logic";

export type PlayerColor = "blue" | "red";

export interface ThrowHistoryEntry extends ThrowOutcome {
  id: string;
  player: PlayerColor;
  timestamp: number;
}

export interface GameState {
  currentPlayer: PlayerColor;
  pendingThrows: ThrowOutcome[];
  history: ThrowHistoryEntry[];
  pieces: Record<PlayerColor, PieceState[]>;
  isRolling: boolean;
  lastOutcome?: ThrowOutcome;
  roll: () => void;
  consumeThrow: (index: number) => void;
  endTurn: () => void;
  reset: () => void;
}

const players: PlayerColor[] = ["blue", "red"];

function nextPlayer(current: PlayerColor): PlayerColor {
  const nextIndex = (players.indexOf(current) + 1) % players.length;
  return players[nextIndex];
}

export const useGameStore = create<GameState>((set, get) => ({
  currentPlayer: "blue",
  pendingThrows: [],
  history: [],
  pieces: {
    blue: initialPieces(),
    red: initialPieces()
  },
  isRolling: false,
  lastOutcome: undefined,
  roll: () => {
    const { currentPlayer, pendingThrows } = get();
    if (pendingThrows.length >= 3) {
      return; // prevent spamming without resolving moves
    }
    set({ isRolling: true });
    const outcome = rollYut();
    set((state) => ({
      isRolling: false,
      pendingThrows: [...state.pendingThrows, outcome],
      lastOutcome: outcome,
      history: [
        {
          ...outcome,
          id: nanoid(),
          player: currentPlayer,
          timestamp: Date.now()
        },
        ...state.history
      ].slice(0, 12)
    }));
  },
  consumeThrow: (index: number) => {
    set((state) => {
      const updated = state.pendingThrows.filter((_, i) => i !== index);
      return {
        pendingThrows: updated
      };
    });
  },
  endTurn: () => {
    const { pendingThrows } = get();
    if (pendingThrows.length > 0) {
      return;
    }
    set((state) => ({
      currentPlayer: nextPlayer(state.currentPlayer),
      lastOutcome: undefined
    }));
  },
  reset: () => {
    set({
      currentPlayer: "blue",
      pendingThrows: [],
      history: [],
      pieces: {
        blue: initialPieces(),
        red: initialPieces()
      },
      lastOutcome: undefined,
      isRolling: false
    });
  }
}));
