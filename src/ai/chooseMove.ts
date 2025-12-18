import type { Board, Difficulty, Player } from "../types/game";
import { getAvailableMoves } from "../game/rules";
import { minimaxBestMove } from "./minimax";

/**
 * AI move chooser.
 * - HARD: full minimax (unbeatable)
 * - MEDIUM: depth-limited + small randomness
 */
export function chooseMove(
  board: Board,
  aiPlayer: Player,
  difficulty: Difficulty
): number | null {
  if (difficulty === "HARD") {
    return minimaxBestMove(board, aiPlayer, null);
  }

  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;

  if (Math.random() < 0.2) {
    return moves[Math.floor(Math.random() * moves.length)];
  }

  return minimaxBestMove(board, aiPlayer, 2);
}
