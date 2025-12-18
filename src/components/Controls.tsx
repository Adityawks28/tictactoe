import type { Difficulty, GameMode, GameResult, Side } from "../types/game";

type ControlsProps = {
  result: GameResult;
  mode: GameMode;
  difficulty: Difficulty;
  humanSide: Side; // X or O in HvAI
  isThinking: boolean;

  canUndo: boolean;
  canRedo: boolean;

  onUndo: () => void;
  onRedo: () => void;

  onReset: () => void;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (d: Difficulty) => void;
  onHumanSideChange: (s: Side) => void;
};

export function Controls({
  result,
  mode,
  difficulty,
  humanSide,
  isThinking,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onModeChange,
  onDifficultyChange,
  onHumanSideChange,
}: ControlsProps) {
  let text = "";
  if (result.kind === "IN_PROGRESS") text = `Turn: ${result.nextTurn}`;
  if (result.kind === "WIN") text = `Winner: ${result.winner}`;
  if (result.kind === "DRAW") text = "Draw!";

  const aiSide = humanSide === "X" ? "O" : "X";

  return (
    <div className="controls">
      <p className="status">
        {text}
        {isThinking ? " · AI thinking…" : ""}
      </p>

      <div className="controlRow">
        <button className="btn" onClick={onUndo} disabled={!canUndo || isThinking}>
          Undo
        </button>
        <button className="btn" onClick={onRedo} disabled={!canRedo || isThinking}>
          Redo
        </button>
        <button className="btn btn--primary" onClick={onReset}>
          Reset
        </button>
      </div>

      <div className="controlGrid">
        <label className="label">
          Mode
          <select value={mode} onChange={(e) => onModeChange(e.target.value as GameMode)}>
            <option value="HUMAN_VS_AI">Human vs AI</option>
            <option value="HUMAN_VS_HUMAN">Human vs Human</option>
          </select>
        </label>

        <label className="label">
          Difficulty
          <select
            value={difficulty}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            disabled={mode !== "HUMAN_VS_AI"}
          >
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard (Unbeatable)</option>
          </select>
        </label>

        <label className="label">
          You play
          <select
            value={humanSide}
            onChange={(e) => onHumanSideChange(e.target.value as Side)}
            disabled={mode !== "HUMAN_VS_AI"}
            title={mode !== "HUMAN_VS_AI" ? "Side selection applies only vs AI" : ""}
          >
            <option value="X">X (go first)</option>
            <option value="O">O (go second)</option>
          </select>
        </label>
      </div>

      <p className="hint">
        {mode === "HUMAN_VS_AI"
          ? `You: ${humanSide} · AI: ${aiSide}`
          : "Human vs Human mode"}
      </p>
    </div>
  );
}
