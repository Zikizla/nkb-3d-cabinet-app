"use client";

import { Suspense, useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ModelData, ViewMode } from "@/types";

interface SceneProps {
  models: ModelData[];
  selectedId: string | null;
  viewMode: ViewMode;
  onSelect: (id: string) => void;
  onPositionChange: (id: string, position: [number, number, number]) => void;
}

interface ModelProps {
  modelData: ModelData;
  allModels: ModelData[];
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (position: [number, number, number]) => void;
  orbitControlsRef: React.RefObject<any>;
}

function Model({
  modelData,
  allModels,
  isSelected,
  onSelect,
  onPositionChange,
  orbitControlsRef,
}: ModelProps) {
  const { scene } = useGLTF(modelData.path);
  const groupRef = useRef<THREE.Group>(null);
  const { camera, gl } = useThree();
  const isDragging = useRef(false);
  const dragOffset = useRef(new THREE.Vector3());
  const floorPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), []);
  const autoScale = useRef<number>(1);


  const { cloned, scale } = useMemo(() => {
    const cloned = scene.clone(true);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim > 0 ? 2 / maxDim : 1;
    return { cloned, scale };
  }, [scene]);

  useEffect(() => {
    autoScale.current = scale;
  }, [scale]);


  useEffect(() => {
    if (groupRef.current) {

      groupRef.current.position.set(0, 0, 0);
      groupRef.current.scale.set(scale, scale, scale);
      groupRef.current.rotation.set(...modelData.rotation);

      groupRef.current.updateMatrixWorld(true);
      const scaledBox = new THREE.Box3().setFromObject(groupRef.current);
      
      groupRef.current.position.set(
        modelData.position[0],
        -scaledBox.min.y,
        modelData.position[2]
      );
    }
  }, [modelData.position, modelData.rotation, scale]);

  const getIntersectPoint = (e: any) => {
    const rect = gl.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const point = new THREE.Vector3();
    raycaster.ray.intersectPlane(floorPlane, point);
    return point;
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect();
    isDragging.current = true;

    const point = getIntersectPoint(e);
    if (groupRef.current) {
      dragOffset.current.set(
        groupRef.current.position.x - point.x,
        0,
        groupRef.current.position.z - point.z
      );
    }

    if (orbitControlsRef.current) {
      orbitControlsRef.current.enabled = false;
    }

    gl.domElement.style.cursor = "grabbing";

    const handleMove = (moveEvent: PointerEvent) => {
      if (!isDragging.current || !groupRef.current) return;
      const point = getIntersectPoint(moveEvent);

      const boundary = 9;
      const newX = Math.max(-boundary, Math.min(boundary, point.x + dragOffset.current.x));
      const newZ = Math.max(-boundary, Math.min(boundary, point.z + dragOffset.current.z));

    
      const modelSize = 2; 
      const minDistance = modelSize * 1.1; 

      const otherModels = allModels.filter((m) => m.id !== modelData.id);
      let blocked = false;

      for (const other of otherModels) {
        const dx = newX - other.position[0];
        const dz = newZ - other.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);

        if (distance < minDistance) {
          blocked = true;
          break;
        }
      }

      if (!blocked) {
        groupRef.current.position.x = newX;
        groupRef.current.position.z = newZ;
      }
    };

    const handleUp = () => {
      isDragging.current = false;
      gl.domElement.style.cursor = "auto";

      if (orbitControlsRef.current) {
        orbitControlsRef.current.enabled = true;
      }

      if (groupRef.current) {
        onPositionChange([
          groupRef.current.position.x,
          groupRef.current.position.y,
          groupRef.current.position.z,
        ]);
      }

      gl.domElement.removeEventListener("pointermove", handleMove);
      gl.domElement.removeEventListener("pointerup", handleUp);
    };

    gl.domElement.addEventListener("pointermove", handleMove);
    gl.domElement.addEventListener("pointerup", handleUp);
  };

  return (
    <group ref={groupRef} onPointerDown={handlePointerDown}>
      <primitive object={cloned} />
      {isSelected && (
        <mesh position={[0, 0.6 / autoScale.current, 0]}>
          <boxGeometry
            args={[
              2 / autoScale.current,
              1.5 / autoScale.current,
              2 / autoScale.current,
            ]}
          />
          <meshBasicMaterial
            color="#4f9eff"
            wireframe
            transparent
            opacity={0.4}
          />
        </mesh>
      )}
    </group>
  );
}

function CameraController({
  viewMode,
  controlsRef,
}: {
  viewMode: ViewMode;
  controlsRef: React.RefObject<any>;
}) {
  useEffect(() => {
    if (!controlsRef.current) return;
    const controls = controlsRef.current;
    const camera = controls.object;

    if (viewMode === "2d") {
      camera.position.set(0, 12, 0.01);
      camera.lookAt(0, 0, 0);
      controls.maxPolarAngle = 0;
      controls.minPolarAngle = 0;
    } else {
      camera.position.set(6, 6, 6);
      camera.lookAt(0, 0, 0);
      controls.maxPolarAngle = Math.PI / 2;
      controls.minPolarAngle = 0;
    }
    controls.update();
  }, [viewMode, controlsRef]);

  return (
    <OrbitControls
      ref={controlsRef}
      enableRotate={viewMode === "3d"}
      enablePan={true}
      enableZoom={true}
      mouseButtons={{
        LEFT: viewMode === "3d" ? THREE.MOUSE.ROTATE : THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN,
      }}
    />
  );
}

function LoadingFallback() {
  return (
    <mesh position={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function SceneContent({
  models,
  selectedId,
  viewMode,
  onSelect,
  onPositionChange,
}: SceneProps) {
  const orbitControlsRef = useRef<any>(null);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <gridHelper args={[20, 20, "#333", "#2a2a2a"]} />

      <Suspense fallback={<LoadingFallback />}>
        {models.map((model) => (
          <Model
            key={model.id}
            modelData={model}
            allModels={models}
            isSelected={selectedId === model.id}
            onSelect={() => onSelect(model.id)}
            onPositionChange={(pos) => onPositionChange(model.id, pos)}
            orbitControlsRef={orbitControlsRef}
          />
        ))}
      </Suspense>

      <CameraController viewMode={viewMode} controlsRef={orbitControlsRef} />
    </>
  );
}

export default function Scene(props: SceneProps) {
  return (
    <Canvas
      camera={{ position: [6, 6, 6], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
      onPointerMissed={() => props.onSelect("")}
    >
      <SceneContent {...props} />
    </Canvas>
  );
}