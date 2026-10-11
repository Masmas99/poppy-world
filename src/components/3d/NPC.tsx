'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';

interface NPCProps {
  dogPosition: THREE.Vector3;
  position: [number, number, number];
}

export function BarnabyTheCat({ dogPosition, position }: NPCProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  const setInteractionPrompt = useGameStore((s) => s.setInteractionPrompt);
  const isNear = useRef<boolean>(false);

  const talkWithBarnaby = () => {
    useGameStore.setState({
      feedbackMessage: 'Barnaby: "Meow! Bark at me with [Q] and I will give you a shiny reward!"',
    });
  };

  useFrame((state, delta) => {
    if (!groupRef.current || !headRef.current || !tailRef.current) return;

    const t = state.clock.getElapsedTime();
    tailRef.current.rotation.z = Math.sin(t * 3.0) * 0.4;

    const catWorldPos = new THREE.Vector3(position[0], position[1], position[2]);
    const dist = dogPosition.distanceTo(catWorldPos);

    if (dist < 3.8) {
      const targetDir = new THREE.Vector3().subVectors(dogPosition, catWorldPos);
      const angle = Math.atan2(targetDir.x, targetDir.z);
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, angle - groupRef.current.rotation.y, delta * 5);

      if (!isNear.current) {
        isNear.current = true;
        setInteractionPrompt('Tap ACT / Press [E] to talk with Barnaby; tap BARK / [Q] to greet', talkWithBarnaby);
      }
    } else {
      headRef.current.rotation.y = THREE.MathUtils.lerp(headRef.current.rotation.y, 0, delta * 3);
      if (isNear.current) {
        isNear.current = false;
        const curPrompt = useGameStore.getState().interactionPrompt;
        if (curPrompt?.includes('Barnaby')) {
          setInteractionPrompt(null);
        }
      }
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Wooden Bench with solid collider */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[0.95, 0.45, 0.45]} position={[0, 0.4, 0]} />

        {/* Bench seat */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.09, 0.75]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
        </mesh>
        {/* Bench legs */}
        <mesh position={[-0.7, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        <mesh position={[0.7, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshStandardMaterial color="#5c3a21" />
        </mesh>
        {/* Bench backrest */}
        <mesh position={[0, 0.7, -0.32]} castShadow>
          <boxGeometry args={[1.7, 0.4, 0.08]} />
          <meshStandardMaterial color="#8b5a2b" roughness={0.8} />
        </mesh>
      </RigidBody>

      {/* Barnaby the Cat */}
      <group position={[0, 0.46, 0]}>
        {/* Cat Body */}
        <mesh castShadow position={[0, 0.2, 0]}>
          <capsuleGeometry args={[0.2, 0.26, 8, 12]} />
          <meshStandardMaterial color="#343a40" roughness={0.65} />
        </mesh>

        {/* Cat Head */}
        <group ref={headRef} position={[0, 0.5, 0.08]}>
          <mesh castShadow>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color="#343a40" roughness={0.65} />
          </mesh>

          {/* Ears */}
          <mesh position={[-0.12, 0.18, 0]} rotation={[0, 0, 0.2]}>
            <coneGeometry args={[0.08, 0.16, 6]} />
            <meshStandardMaterial color="#212529" roughness={0.7} />
          </mesh>
          <mesh position={[0.12, 0.18, 0]} rotation={[0, 0, -0.2]}>
            <coneGeometry args={[0.08, 0.16, 6]} />
            <meshStandardMaterial color="#212529" roughness={0.7} />
          </mesh>

          {/* Emerald Eyes */}
          <mesh position={[-0.08, 0.04, 0.18]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#06d6a0" roughness={0.2} emissive="#06d6a0" emissiveIntensity={0.3} />
          </mesh>
          <mesh position={[0.08, 0.04, 0.18]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#06d6a0" roughness={0.2} emissive="#06d6a0" emissiveIntensity={0.3} />
          </mesh>

          {/* Nose */}
          <mesh position={[0, -0.02, 0.22]}>
            <coneGeometry args={[0.02, 0.03, 4]} />
            <meshStandardMaterial color="#ffb4a2" roughness={0.4} />
          </mesh>
        </group>

        {/* Tail */}
        <group ref={tailRef} position={[0, 0.1, -0.2]}>
          <mesh position={[0, 0.18, -0.1]} rotation={[-0.4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.38, 8]} />
            <meshStandardMaterial color="#212529" roughness={0.7} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
