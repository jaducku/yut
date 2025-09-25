import { useEffect, useState } from "react";

export type RendererKind = "webgpu" | "webgl2";

export interface RendererInfo {
  preferred: RendererKind;
  supported: RendererKind[];
}

export function detectRenderer(): RendererInfo {
  const supported: RendererKind[] = [];
  if (typeof navigator !== "undefined" && "gpu" in navigator) {
    supported.push("webgpu");
  }
  if (typeof document !== "undefined") {
    const canvas = document.createElement("canvas");
    const gl2 = canvas.getContext("webgl2");
    if (gl2) {
      supported.push("webgl2");
    }
    canvas.remove();
  }
  if (supported.length === 0) {
    supported.push("webgl2");
  }
  return {
    preferred: supported[0] ?? "webgl2",
    supported
  };
}

export function useRendererInfo(): RendererInfo {
  const [info, setInfo] = useState<RendererInfo>(() => ({
    preferred: "webgl2",
    supported: ["webgl2"]
  }));

  useEffect(() => {
    setInfo(detectRenderer());
  }, []);

  return info;
}
