import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import { ModelData } from "@/types";

const COLLECTION = "models";

export const defaultModels: ModelData[] = [
  {
    id: "model1",
    name: "Cabinet 1",
    path: "/models/model1.glb",
    position: [-3, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
  {
    id: "model2",
    name: "Cabinet 2",
    path: "/models/model2.glb",
    position: [3, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
  },
];

export async function loadModels(): Promise<ModelData[]> {
  const models: ModelData[] = [];

  for (const defaultModel of defaultModels) {
    const docRef = doc(db, COLLECTION, defaultModel.id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      models.push(docSnap.data() as ModelData);
    } else {
      await setDoc(docRef, defaultModel);
      models.push(defaultModel);
    }
  }

  return models;
}

export async function saveModel(model: ModelData): Promise<void> {
  const docRef = doc(db, COLLECTION, model.id);
  await setDoc(docRef, model);
}