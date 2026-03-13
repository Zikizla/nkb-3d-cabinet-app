"use client";

import { ViewMode } from "@/types";

interface ViewToggleProps {
  viewMode: ViewMode;
  onToggle: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onToggle }: ViewToggleProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        left: 16,
        zIndex: 10,
        display: "flex",
        gap: 4,
        background: "rgba(15, 15, 15, 0.85)",
        backdropFilter: "blur(12px)",
        borderRadius: 10,
        padding: 4,
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        onClick={() => onToggle("3d")}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          transition: "all 0.2s ease",
          background: viewMode === "3d" ? "#4f9eff" : "transparent",
          color: viewMode === "3d" ? "#fff" : "rgba(255,255,255,0.5)",
        }}
      >
        3D View
      </button>
      <button
        onClick={() => onToggle("2d")}
        style={{
          padding: "8px 18px",
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.02em",
          transition: "all 0.2s ease",
          background: viewMode === "2d" ? "#4f9eff" : "transparent",
          color: viewMode === "2d" ? "#fff" : "rgba(255,255,255,0.5)",
        }}
      >
        Top View
      </button>
    </div>
  );
}