export type Player = "X" | "O";
export type CellValue = Player | null;
export type Board = CellValue[];

export type GameMode = "HUMAN_VS_HUMAN" | "HUMAN_VS_AI";
export type Difficulty = "MEDIUM" | "HARD";

/** Human chooses which mark they play in HvAI */
export type Side = Player;

/** Each history step stores the board snapshot + last move index */
export type StepState = {
  board: Board;
  lastMove: number | null;
};

export type GameResult =
  | { kind: "IN_PROGRESS"; nextTurn: Player }
  | { kind: "WIN"; winner: Player; line: [number, number, number] }
  | { kind: "DRAW" };
