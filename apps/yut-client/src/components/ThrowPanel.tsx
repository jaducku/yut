import type { RendererInfo } from "../renderer/createRenderer";
import { getSteps, type ThrowResult } from "../game/logic";
import { useGameStore } from "../game/store";

interface ThrowPanelProps {
  rendererInfo: RendererInfo;
}

const resultLabel: Record<ThrowResult, string> = {
  do: "도",
  gae: "개",
  geol: "걸",
  yut: "윷",
  mo: "모"
};

function formatSticks(sticks: number[]): string {
  return sticks.map((value) => (value === 1 ? "○" : "●")).join(" ");
}

function ThrowPanel({ rendererInfo }: ThrowPanelProps) {
  const {
    currentPlayer,
    isRolling,
    lastOutcome,
    pendingThrows,
    history,
    roll,
    consumeThrow,
    endTurn,
    reset
  } = useGameStore();

  return (
    <div>
      <h2>턴 제어</h2>
      <p>
        현재 플레이어: <strong>{currentPlayer.toUpperCase()}</strong>
      </p>
      <button onClick={roll} disabled={isRolling} style={{ width: "100%" }}>
        {isRolling ? "계산 중..." : "윷 던지기"}
      </button>
      <button
        onClick={endTurn}
        disabled={pendingThrows.length > 0}
        style={{ width: "100%", marginTop: "0.75rem", background: "#22d3ee" }}
      >
        턴 종료
      </button>
      <button
        onClick={reset}
        style={{ width: "100%", marginTop: "0.75rem", background: "#f87171", color: "#0f172a" }}
      >
        게임 리셋
      </button>

      <section style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>대기 중인 이동</h3>
        {pendingThrows.length === 0 ? (
          <p style={{ opacity: 0.8 }}>아직 이동해야 할 말이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
            {pendingThrows.map((outcome, index) => (
              <li
                key={`${outcome.result}-${index}`}
                style={{
                  background: "rgba(15, 23, 42, 0.65)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem",
                  border: "1px solid rgba(148, 163, 184, 0.25)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{resultLabel[outcome.result]}</strong>
                    <span style={{ marginLeft: "0.25rem", opacity: 0.7 }}>
                      ({getSteps(outcome.result)}칸 / {outcome.extraTurn ? "추가 턴" : "일반"})
                    </span>
                    <div style={{ fontFamily: "monospace", marginTop: "0.25rem", fontSize: "0.9rem" }}>
                      {formatSticks(outcome.sticks)}
                    </div>
                  </div>
                  <button
                    style={{ background: "rgba(129, 140, 248, 0.35)", color: "#e0e7ff" }}
                    onClick={() => consumeThrow(index)}
                  >
                    소모
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>최근 던지기 기록</h3>
        {history.length === 0 ? (
          <p style={{ opacity: 0.8 }}>기록이 없습니다.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.5rem" }}>
            {history.map((entry) => (
              <li
                key={entry.id}
                style={{
                  background: "rgba(15, 23, 42, 0.45)",
                  borderRadius: "0.75rem",
                  padding: "0.75rem"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    <strong>{resultLabel[entry.result]}</strong> · {entry.steps}칸 · {entry.player.toUpperCase()}
                  </span>
                  <span style={{ fontFamily: "monospace", opacity: 0.7 }}>
                    {formatSticks(entry.sticks)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {lastOutcome ? (
        <section style={{ marginTop: "1.5rem" }}>
          <h3 style={{ marginTop: 0 }}>가장 최근 결과</h3>
          <p>
            <strong>{resultLabel[lastOutcome.result]}</strong> → {lastOutcome.steps}칸 이동
            {lastOutcome.extraTurn ? " + 추가 턴" : ""}
          </p>
        </section>
      ) : null}

      <section style={{ marginTop: "1.5rem" }}>
        <h3 style={{ marginTop: 0 }}>렌더러 상태</h3>
        <p>
          우선 순위: <strong>{rendererInfo.preferred.toUpperCase()}</strong>
          <br />지원 목록: {rendererInfo.supported.map((item) => item.toUpperCase()).join(", ")}
        </p>
        <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
          추후 WebGPU가 안정화되면 커스텀 렌더러 팩토리를 도입해 자동 폴백을 구현합니다.
        </p>
      </section>
    </div>
  );
}

export default ThrowPanel;
