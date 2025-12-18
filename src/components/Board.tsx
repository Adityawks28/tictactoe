import type { Board as BoardType } from "../types/game";
import { Cell } from "./Cell";

type BoardProps = {
  board: BoardType;
  onCellClick: (index: number) => void;
  disabled?: boolean;
  winningLine?: [number, number, number] | null;
  lastMove?: number | null;
};

export function Board({
  board,
  onCellClick,
  disabled = false,
  winningLine = null,
  lastMove = null,
}: BoardProps) {
  const winSet = new Set<number>(winningLine ?? []);

  return (
    <div className="board">
      {board.map((value, idx) => (
        <Cell
          key={idx}
          value={value}
          onClick={() => onCellClick(idx)}
          disabled={disabled}
          highlightWin={winSet.has(idx)}
          highlightLast={lastMove === idx}
        />
      ))}
    </div>
  );
}
