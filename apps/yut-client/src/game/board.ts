import type { Vector3Tuple } from "three";

export type NodeTag = "start" | "corner" | "center" | "shortcut";

export interface BoardNode {
  id: string;
  position: Vector3Tuple;
  tags: NodeTag[];
}

export interface BoardPath {
  id: string;
  sequence: string[];
}

export interface BoardLayout {
  nodes: BoardNode[];
  nodeMap: Record<string, BoardNode>;
  paths: BoardPath[];
}

const STEP = 1.1;

function node(
  id: string,
  coords: [number, number],
  tags: NodeTag[] = []
): BoardNode {
  return {
    id,
    position: [coords[0] * STEP, 0, coords[1] * STEP],
    tags
  };
}

export function createDefaultBoardLayout(): BoardLayout {
  const nodes: BoardNode[] = [
    node("start", [-2, -2], ["start", "corner"]),
    node("outer-1", [-1, -2]),
    node("outer-2", [0, -2]),
    node("outer-3", [1, -2]),
    node("outer-4", [2, -2], ["corner"]),
    node("outer-5", [2, -1]),
    node("outer-6", [2, 0]),
    node("outer-7", [2, 1]),
    node("outer-8", [2, 2], ["corner"]),
    node("outer-9", [1, 2]),
    node("outer-10", [0, 2]),
    node("outer-11", [-1, 2]),
    node("outer-12", [-2, 2], ["corner"]),
    node("outer-13", [-2, 1]),
    node("outer-14", [-2, 0]),
    node("outer-15", [-2, -1]),
    node("mid-south", [0, -1]),
    node("mid-north", [0, 1]),
    node("mid-west", [-1, 0]),
    node("mid-east", [1, 0]),
    node("diag-sw-1", [-1, -1], ["shortcut"]),
    node("diag-sw-2", [-0.5, -0.5], ["shortcut"]),
    node("center", [0, 0], ["center", "shortcut"]),
    node("diag-ne-2", [0.5, 0.5], ["shortcut"]),
    node("diag-ne-1", [1, 1], ["shortcut"]),
    node("diag-nw-1", [-1, 1], ["shortcut"]),
    node("diag-nw-2", [-0.5, 0.5], ["shortcut"]),
    node("diag-se-2", [0.5, -0.5], ["shortcut"]),
    node("diag-se-1", [1, -1], ["shortcut"])
  ];

  const nodeMap = Object.fromEntries(nodes.map((entry) => [entry.id, entry]));

  const paths: BoardPath[] = [
    {
      id: "outer",
      sequence: [
        "start",
        "outer-1",
        "outer-2",
        "outer-3",
        "outer-4",
        "outer-5",
        "outer-6",
        "outer-7",
        "outer-8",
        "outer-9",
        "outer-10",
        "outer-11",
        "outer-12",
        "outer-13",
        "outer-14",
        "outer-15"
      ]
    },
    {
      id: "cross-vertical",
      sequence: ["mid-south", "center", "mid-north"]
    },
    {
      id: "cross-horizontal",
      sequence: ["mid-west", "center", "mid-east"]
    },
    {
      id: "diag-sw-ne",
      sequence: ["start", "diag-sw-1", "diag-sw-2", "center", "diag-ne-2", "diag-ne-1", "outer-8"]
    },
    {
      id: "diag-se-nw",
      sequence: ["outer-4", "diag-se-1", "diag-se-2", "center", "diag-nw-2", "diag-nw-1", "outer-12"]
    }
  ];

  return {
    nodes,
    nodeMap,
    paths
  };
}
