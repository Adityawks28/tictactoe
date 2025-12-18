import { describe, it, expect } from "vitest";
import { calculateWinner, isDraw } from "../game/rules";
import type { Board } from "../types/game";

describe("rules", () => {
  it("detects row winner", () => {
    const b: Board = ["X", "X", "X", null, null, null, null, null, null];
    expect(calculateWinner(b)).toBe("X");
  });

  it("detects diagonal winner", () => {
    const b: Board = ["O", null, null, null, "O", null, null, null, "O"];
    expect(calculateWinner(b)).toBe("O");
  });

  it("detects draw", () => {
    const b: Board = ["X","O","X","X","O","O","O","X","X"];
    expect(isDraw(b)).toBe(true);
  });
});
