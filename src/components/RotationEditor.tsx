"use client";

import { ModelData } from "@/types";

interface RotationEditorProps {
  model: ModelData | null;
  onRotationChange: (rotation: [number, number, number]) => void;
}

export default function RotationEditor({
  model,
  onRotationChange,
}: RotationEditorProps) {
  if (!model) {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          background: "rgba(15, 15, 15, 0.85)",
          backdropFilter: "blur(12px)",
          borderRadius: 12,
          padding: "12px 24px",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.35)",
          fontSize: 13,
        }}
      >
        Click a model to edit its rotation
      </div>
    );
  }

  const toDeg = (rad: number) => Math.round((rad * 180) / Math.PI);
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const labels = ["X", "Y", "Z"];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        background: "rgba(15, 15, 15, 0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: 12,
        padding: "16px 24px",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      <span
        style={{
          color: "#4f9eff",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.03em",
          whiteSpace: "nowrap",
        }}
      >
        {model.name}
      </span>

      {labels.map((label, i) => (
        <div
          key={label}
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <label
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {label}
          </label>
          <input
            type="range"
            min={0}
            max={360}
            value={toDeg(model.rotation[i])}
            onChange={(e) => {
              const newRotation = [...model.rotation] as [
                number,
                number,
                number,
              ];
              newRotation[i] = toRad(Number(e.target.value));
              onRotationChange(newRotation);
            }}
            style={{
              width: 100,
              accentColor: "#4f9eff",
            }}
          />
          <span
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              fontWeight: 500,
              minWidth: 32,
            }}
          >
            {toDeg(model.rotation[i])}°
          </span>
        </div>
      ))}
    </div>
  );
}