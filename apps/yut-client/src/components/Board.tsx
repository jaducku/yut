import { memo, useMemo } from "react";
import { Line, Text } from "@react-three/drei";
import { createDefaultBoardLayout, type NodeTag } from "../game/board";

const tileRadius = 0.2;

function nodeColor(tags: NodeTag[]): string {
  if (tags.includes("start")) {
    return "#facc15";
  }
  if (tags.includes("center")) {
    return "#f97316";
  }
  if (tags.includes("corner")) {
    return "#38bdf8";
  }
  if (tags.includes("shortcut")) {
    return "#818cf8";
  }
  return "#cbd5f5";
}

const Board = memo(function Board() {
  const layout = useMemo(() => createDefaultBoardLayout(), []);
  const lines = useMemo(
    () =>
      layout.paths.map((path) => ({
        id: path.id,
        points: path.sequence.map((nodeId) => layout.nodeMap[nodeId].position)
      })),
    [layout]
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.065, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#1f2937" roughness={0.7} metalness={0.05} />
      </mesh>
      <gridHelper args={[8, 8, "#1e293b", "#1e293b"]} position={[0, -0.06, 0]} />
      {lines.map((line) => (
        <Line
          key={line.id}
          points={line.points}
          color={line.id.startsWith("diag") ? "#38bdf8" : "#94a3b8"}
          lineWidth={2}
          dashed={line.id.startsWith("diag")}
        />
      ))}
      {layout.nodes.map((node) => (
        <group key={node.id} position={node.position}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[tileRadius, tileRadius, 0.12, 32]} />
            <meshStandardMaterial
              color={nodeColor(node.tags)}
              roughness={0.35}
              metalness={0.2}
              emissive={node.tags.includes("center") ? "#fb923c" : "black"}
              emissiveIntensity={node.tags.includes("center") ? 0.12 : 0}
            />
          </mesh>
          {node.tags.includes("start") ? (
            <Text position={[0, 0.2, 0]} fontSize={0.28} color="#0f172a" anchorX="center" anchorY="middle">
              START
            </Text>
          ) : null}
        </group>
      ))}
    </group>
  );
});

export default Board;
