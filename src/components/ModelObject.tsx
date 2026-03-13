"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { ModelData } from "@/types";

interface ModelObjectProps {
  modelData: ModelData;
  isSelected: boolean;
  onSelect: () => void;
  onPositionChange: (position: [number, number, number]) => void;
  floorPlane: THREE.Plane;
}

export default function ModelObject({
  modelData,
  isSelected,
  onSelect,
  onPositionChange,
  floorPlane,
}: ModelObjectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(modelData.path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);
  const { camera, gl } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef(new THREE.Vector3());

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(...modelData.position);
      groupRef.current.rotation.set(...modelData.rotation);
    }
  }, [modelData.position, modelData.rotation]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);

    const intersectPoint = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(floorPlane, intersectPoint);

    if (groupRef.current) {
      dragOffset.current.copy(groupRef.current.position).sub(intersectPoint);
    }

    gl.domElement.style.cursor = "grabbing";
  };

  const handlePointerUp = () => {
    if (isDragging && groupRef.current) {
      setIsDragging(false);
      gl.domElement.style.cursor = "auto";
      const pos = groupRef.current.position;
      onPositionChange([pos.x, pos.y, pos.z]);
    }
  };

  const handlePointerMove = (e: any) => {
    if (!isDragging || !groupRef.current) return;

    const intersectPoint = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rect = gl.domElement.getBoundingClientRect();
    mouse.x = ((e.nativeEvent.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.nativeEvent.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(floorPlane, intersectPoint);

    intersectPoint.add(dragOffset.current);
    groupRef.current.position.x = intersectPoint.x;
    groupRef.current.position.z = intersectPoint.z;
  };

  return (
    <group
      ref={groupRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
    >
      <primitive object={clonedScene} />
      {isSelected && (
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.2, 1.2, 1.2]} />
          <meshBasicMaterial
            color="#4f9eff"
            wireframe
            transparent
            opacity={0.5}
          />
        </mesh>
      )}
    </group>
  );
}