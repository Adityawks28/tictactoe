import type { Board, Player } from "../types/game";
import { calculateWinner, getAvailableMoves, isDraw } from "../game/rules";

type Score = number;

function opponent(p: Player): Player {
  return p === "X" ? "O" : "X";
}

function applyMoveLocal(board: Board, index: number, player: Player): Board {
  const next = board.slice();
  next[index] = player;
  return next;
}

function alphabetaScore(
  board: Board,
  current: Player,
  aiPlayer: Player,
  depth: number,
  depthLimit: number | null,
  alpha: number,
  beta: number
): Score {
  const winner = calculateWinner(board);
  if (winner === aiPlayer) return 10 - depth;
  if (winner === opponent(aiPlayer)) return -10 + depth;
  if (isDraw(board)) return 0;

  if (depthLimit !== null && depth >= depthLimit) return 0;

  const moves = getAvailableMoves(board);
  const isMaximizing = current === aiPlayer;

  if (isMaximizing) {
    let best = -Infinity;
    for (const m of moves) {
      const nextBoard = applyMoveLocal(board, m, current);
      const score = alphabetaScore(
        nextBoard,
        opponent(current),
        aiPlayer,
        depth + 1,
        depthLimit,
        alpha,
        beta
      );
      best = Math.max(best, score);
      alpha = Math.max(alpha, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  } else {
    let best = Infinity;
    for (const m of moves) {
      const nextBoard = applyMoveLocal(board, m, current);
      const score = alphabetaScore(
        nextBoard,
        opponent(current),
        aiPlayer,
        depth + 1,
        depthLimit,
        alpha,
        beta
      );
      best = Math.min(best, score);
      beta = Math.min(beta, best);
      if (beta <= alpha) break; // prune
    }
    return best;
  }
}

export function minimaxBestMove(
  board: Board,
  aiPlayer: Player,
  depthLimit: number | null
): number | null {
  const moves = getAvailableMoves(board);
  if (moves.length === 0) return null;

  let bestMove: number | null = null;
  let bestScore = -Infinity;

  for (const m of moves) {
    const nextBoard = applyMoveLocal(board, m, aiPlayer);
    const score = alphabetaScore(
      nextBoard,
      opponent(aiPlayer),
      aiPlayer,
      1,
      depthLimit,
      -Infinity,
      Infinity
    );

    if (score > bestScore) {
      bestScore = score;
      bestMove = m;
    }
  }

  return bestMove;
}
