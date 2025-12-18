import type { CellValue } from "../types/game";
import { X, Circle } from "lucide-react";

type CellProps = {
  value: CellValue;
  onClick: () => void;
  disabled?: boolean;
  highlightWin?: boolean;
  highlightLast?: boolean;
};

export function Cell({
  value,
  onClick,
  disabled = false,
  highlightWin = false,
  highlightLast = false,
}: CellProps) {
  const className = [
    "cell",
    highlightWin ? "cell--win" : "",
    !highlightWin && highlightLast ? "cell--last" : "",
    value === "X" ? "cell--x" : "",
    value === "O" ? "cell--o" : "",
  ].join(" ");

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={value ? `Cell ${value}` : "Empty cell"}
    >
      {/* Icon layer (animate on appear) */}
      {value === "X" && <X className="mark mark--pop" />}
      {value === "O" && <Circle className="mark mark--pop" />}
    </button>
  );
}
