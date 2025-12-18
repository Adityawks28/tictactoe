import type { Board, Player } from "../types/game";

export function createEmptyBoard(): Board {
  return Array(9).fill(null);
}

export function applyMove(board: Board, index: number, player: Player): Board {
  // Pure + defensive: never mutate input
  const next = board.slice();
  next[index] = player;
  return next;
}
