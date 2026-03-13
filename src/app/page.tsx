"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { ModelData, ViewMode } from "@/types";
import { loadModels, saveModel } from "@/lib/firestore";
import ViewToggle from "@/components/ViewToggle";
import RotationEditor from "@/components/RotationEditor";

const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export default function Home() {
  const [models, setModels] = useState<ModelData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels()
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
        setLoading(false);
      });
  }, []);

  const handlePositionChange = useCallback(
    (id: string, position: [number, number, number]) => {
      setModels((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const updated = { ...m, position };
            saveModel(updated);
            return updated;
          }
          return m;
        })
      );
    },
    []
  );

  const handleRotationChange = useCallback(
    (rotation: [number, number, number]) => {
      if (!selectedId) return;

      setModels((prev) =>
        prev.map((m) => {
          if (m.id === selectedId) {
            const updated = { ...m, rotation };
            saveModel(updated);
            return updated;
          }
          return m;
        })
      );
    },
    [selectedId]
  );

  const selectedModel = models.find((m) => m.id === selectedId) || null;

  if (loading) {
    return (
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          fontSize: 16,
        }}
      >
        Loading models...
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: "#0a0a0a",
        overflow: "hidden",
      }}
    >
      <ViewToggle viewMode={viewMode} onToggle={setViewMode} />

      <Scene
        models={models}
        selectedId={selectedId}
        viewMode={viewMode}
        onSelect={setSelectedId}
        onPositionChange={handlePositionChange}
      />

      <RotationEditor
        model={selectedModel}
        onRotationChange={handleRotationChange}
      />
    </div>
  );
}