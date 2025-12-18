import type { Board, GameResult, Player, WinnerInfo } from "../types/game";

const LINES: [number, number, number][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // cols
  [0, 4, 8],
  [2, 4, 6], // diagonals
];

export function getWinnerInfo(board: Board): WinnerInfo {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v !== null && v === board[b] && v === board[c]) {
      return { winner: v, line: [a, b, c] };
    }
  }
  return null;
}

// Keep this for AI code that expects winner only (optional convenience)
export function calculateWinner(board: Board): Player | null {
  return getWinnerInfo(board)?.winner ?? null;
}

export function isDraw(board: Board): boolean {
  return calculateWinner(board) === null && board.every((c) => c !== null);
}

export function isLegalMove(board: Board, index: number): boolean {
  return index >= 0 && index < 9 && board[index] === null;
}

export function getAvailableMoves(board: Board): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) if (board[i] === null) moves.push(i);
  return moves;
}

export function evaluateGame(board: Board, nextTurn: Player): GameResult {
  const info = getWinnerInfo(board);
  if (info) return { kind: "WIN", winner: info.winner, line: info.line };
  if (isDraw(board)) return { kind: "DRAW" };
  return { kind: "IN_PROGRESS", nextTurn };
}
