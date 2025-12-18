export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameMode = "HUMAN_VS_HUMAN" | "HUMAN_VS_AI";
export type Difficulty = "MEDIUM" | "HARD";
export type Side = Player;

export type StepState = {
  board: Board;
  lastMove: number | null;
};

export type WinnerInfo =
  | { winner: Player; line: [number, number, number] }
  | null;

export type GameResult =
  | { kind: "IN_PROGRESS"; nextTurn: Player }
  | { kind: "WIN"; winner: Player; line: [number, number, number] }
  | { kind: "DRAW" };
