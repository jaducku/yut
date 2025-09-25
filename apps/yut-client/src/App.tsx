import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import Board from "./components/Board";
import ThrowPanel from "./components/ThrowPanel";
import { useRendererInfo } from "./renderer/createRenderer";

function App() {
  const rendererInfo = useRendererInfo();

  return (
    <>
      <header className="panel" style={{ margin: "1rem", marginBottom: 0 }}>
        <h1>3D 윷놀이 프로토타입</h1>
        <p>
          윷 던지기, 말 이동, 지름길 분기 등 핵심 규칙을 웹에서 시뮬레이션하기 위한
          초기 실험 버전입니다. UI/UX와 멀티플레이 로직은 후속 단계에서 확장합니다.
        </p>
        <small>
          선택된 렌더러: <strong>{rendererInfo.preferred.toUpperCase()}</strong> · 지원:
          {" "}
          {rendererInfo.supported.map((item) => item.toUpperCase()).join(", ")}
        </small>
      </header>
      <main>
        <section className="panel board-container">
          <Canvas shadows camera={{ position: [7, 7, 7], fov: 50 }}>
            <color attach="background" args={["#0b1120"]} />
            <ambientLight intensity={0.45} />
            <directionalLight
              castShadow
              position={[6, 10, 4]}
              intensity={1.1}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <Suspense fallback={null}>
              <Board />
              <Environment preset="warehouse" />
            </Suspense>
            <OrbitControls maxPolarAngle={Math.PI / 2.2} minDistance={6} maxDistance={16} />
          </Canvas>
        </section>
        <aside className="panel">
          <ThrowPanel rendererInfo={rendererInfo} />
        </aside>
      </main>
    </>
  );
}

export default App;
