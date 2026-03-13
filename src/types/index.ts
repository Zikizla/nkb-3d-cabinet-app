export interface ModelData {
  id: string;
  name: string;
  path: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export type ViewMode = "3d" | "2d";