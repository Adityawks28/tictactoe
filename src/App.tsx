import { useEffect, useMemo, useState } from "react";
import type { Board, Difficulty, GameMode, Player, Side, StepState } from "./types/game";
import { Board as BoardView } from "./components/Board";
import { Controls } from "./components/Controls";
import { createEmptyBoard, applyMove } from "./game/state";
import { evaluateGame, isLegalMove } from "./game/rules";
import { chooseMove } from "./ai/chooseMove";
import "./styles.css";

function nextTurnFromStep(step: number): Player {
  // Standard Tic-Tac-Toe: X always starts
  return step % 2 === 0 ? "X" : "O";
}

export default function App() {
  const [mode, setMode] = useState<GameMode>("HUMAN_VS_AI");
  const [difficulty, setDifficulty] = useState<Difficulty>("HARD");
  const [humanSide, setHumanSide] = useState<Side>("X"); // human mark in HvAI

  // History: array of snapshots; step points to current snapshot
  const [history, setHistory] = useState<StepState[]>(() => [
    { board: createEmptyBoard(), lastMove: null },
  ]);
  const [step, setStep] = useState(0);

  const [isThinking, setIsThinking] = useState(false);

  const current = history[step];
  const board: Board = current.board;
  const lastMove = current.lastMove;

  const turn: Player = nextTurnFromStep(step);

  const result = useMemo(() => evaluateGame(board, turn), [board, turn]);

  const aiSide: Player = humanSide === "X" ? "O" : "X";

  const isAITurn =
    mode === "HUMAN_VS_AI" && result.kind === "IN_PROGRESS" && turn === aiSide;

  const canUndo = step > 0;
  const canRedo = step < history.length - 1;

  function hardReset() {
    setHistory([{ board: createEmptyBoard(), lastMove: null }]);
    setStep(0);
    setIsThinking(false);
  }

  function pushStep(nextBoard: Board, moveIndex: number) {
    setHistory((prev) => {
      const truncated = prev.slice(0, step + 1); // if we were in the past, drop the future
      return [...truncated, { board: nextBoard, lastMove: moveIndex }];
    });
    setStep((s) => s + 1);
  }

  function handleCellClick(index: number) {
    if (result.kind !== "IN_PROGRESS") return;
    if (isThinking || isAITurn) return;

    // In HvAI, prevent human from playing when it's AI's mark
    if (mode === "HUMAN_VS_AI" && turn !== humanSide) return;

    if (!isLegalMove(board, index)) return;

    const nextBoard = applyMove(board, index, turn);
    pushStep(nextBoard, index);
  }

  function handleUndo() {
    if (!canUndo || isThinking) return;
    setStep((s) => Math.max(0, s - 1));
  }

  function handleRedo() {
    if (!canRedo || isThinking) return;
    setStep((s) => Math.min(history.length - 1, s + 1));
  }

  function handleModeChange(nextMode: GameMode) {
    setMode(nextMode);
    hardReset();
  }

  function handleDifficultyChange(next: Difficulty) {
    setDifficulty(next);
    hardReset();
  }

  function handleHumanSideChange(next: Side) {
    setHumanSide(next);
    hardReset(); // if human chooses O, AI(X) should start immediately
  }

  // AI turn effect
  useEffect(() => {
    if (!isAITurn) {
      // If we just left AI turn (undo/reset), ensure we’re not stuck in thinking state
      setIsThinking(false);
      return;
    }

    setIsThinking(true);

    const id = window.setTimeout(() => {
      // AI chooses move based on current board snapshot
      const move = chooseMove(board, aiSide, difficulty);

      if (move === null) {
        setIsThinking(false);
        return;
      }

      // Safety: if illegal for some reason, bail
      if (!isLegalMove(board, move)) {
        setIsThinking(false);
        return;
      }

      const nextBoard = applyMove(board, move, aiSide);
      pushStep(nextBoard, move);
      setIsThinking(false);
    }, 350);

    return () => window.clearTimeout(id);
    // IMPORTANT deps: board snapshot + difficulty + aiSide + isAITurn + step
  }, [isAITurn, board, aiSide, difficulty, step]);

  const boardDisabled = result.kind !== "IN_PROGRESS" || isThinking || isAITurn;

  return (
    <div className="page">
      <div className="card">
        <header className="header">
          <div>
            <h1 className="title">Tic Tac Toe</h1>
            <p className="subtitle">Using Minimax AI</p>
          </div>
          <div className="badge">
            {mode === "HUMAN_VS_AI" ? `Vs AI · ${difficulty}` : "2P"}
          </div>
        </header>

        <BoardView
          board={board}
          onCellClick={handleCellClick}
          disabled={boardDisabled}
          winningLine={result.kind === "WIN" ? result.line : null}
          lastMove={lastMove}
        />

        <Controls
          result={result}
          mode={mode}
          difficulty={difficulty}
          humanSide={humanSide}
          isThinking={isThinking}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onReset={hardReset}
          onModeChange={handleModeChange}
          onDifficultyChange={handleDifficultyChange}
          onHumanSideChange={handleHumanSideChange}
        />
      </div>
    </div>
  );
}
