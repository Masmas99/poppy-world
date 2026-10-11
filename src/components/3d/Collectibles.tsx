'use client';

import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';

interface CollectiblesProps {
  dogPosition: THREE.Vector3;
}

// Stylized 3D Golden Bone with orbiting particles
function BoneMesh({ position, id, dogPosition }: { position: [number, number, number]; id: string; dogPosition: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  const orbiterRef = useRef<THREE.Group>(null);
  const collectBone = useGameStore((s) => s.collectBone);
  const isCollected = useGameStore((s) => s.collectedBoneIds.includes(id));

  useFrame((state, delta) => {
    if (isCollected || !groupRef.current) return;

    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 2.2;
    groupRef.current.position.y = position[1] + Math.sin(t * 3.5 + position[0]) * 0.14;

    if (auraRef.current) {
      auraRef.current.rotation.z -= delta * 1.5;
    }
    if (orbiterRef.current) {
      orbiterRef.current.rotation.y += delta * 4;
    }

    const boneWorldPos = new THREE.Vector3(position[0], groupRef.current.position.y, position[2]);
    const dist = dogPosition.distanceTo(boneWorldPos);

    if (dist < 1.7) {
      collectBone(id);
    }
  });

  if (isCollected) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Central bone shaft */}
      <mesh castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.65, 14]} />
        <meshStandardMaterial
          color="#ffea00"
          roughness={0.25}
          metalness={0.3}
          emissive="#ffd60a"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Top dual knobs */}
      <mesh position={[-0.085, 0.32, 0]}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshStandardMaterial color="#ffea00" roughness={0.25} metalness={0.3} emissive="#ffd60a" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.085, 0.32, 0]}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshStandardMaterial color="#ffea00" roughness={0.25} metalness={0.3} emissive="#ffd60a" emissiveIntensity={0.25} />
      </mesh>

      {/* Bottom dual knobs */}
      <mesh position={[-0.085, -0.32, 0]}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshStandardMaterial color="#ffea00" roughness={0.25} metalness={0.3} emissive="#ffd60a" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[0.085, -0.32, 0]}>
        <sphereGeometry args={[0.095, 12, 12]} />
        <meshStandardMaterial color="#ffea00" roughness={0.25} metalness={0.3} emissive="#ffd60a" emissiveIntensity={0.25} />
      </mesh>

      {/* Orbiting Sparkle Star */}
      <group ref={orbiterRef}>
        <mesh position={[0.38, 0, 0]}>
          <octahedronGeometry args={[0.06]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Golden Aura Ring */}
      <mesh ref={auraRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.36, 0.46, 18]} />
        <meshBasicMaterial color="#ffc300" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// Stylized 3D Golden Coin with relief rim
function CoinMesh({ position, id, dogPosition }: { position: [number, number, number]; id: string; dogPosition: THREE.Vector3 }) {
  const groupRef = useRef<THREE.Group>(null);
  const collectCoin = useGameStore((s) => s.collectCoin);
  const isCollected = useGameStore((s) => s.collectedCoinIds.includes(id));

  useFrame((state, delta) => {
    if (isCollected || !groupRef.current) return;

    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y += delta * 3.6;
    groupRef.current.position.y = position[1] + Math.sin(t * 4.2 + position[2]) * 0.12;

    const coinWorldPos = new THREE.Vector3(position[0], groupRef.current.position.y, position[2]);
    const dist = dogPosition.distanceTo(coinWorldPos);

    if (dist < 1.6) {
      collectCoin(id);
    }
  });

  if (isCollected) return null;

  return (
    <group ref={groupRef} position={position}>
      {/* Outer Coin Body */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.24, 0.24, 0.065, 18]} />
        <meshStandardMaterial
          color="#ffb703"
          roughness={0.2}
          metalness={0.85}
          emissive="#fb8500"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Embossed inner ridge */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.075, 16]} />
        <meshStandardMaterial
          color="#ffc300"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>
    </group>
  );
}

const BONES_CONFIG: { id: string; pos: [number, number, number] }[] = [
  { id: 'bone_1', pos: [0, 0.75, 1.5] },
  { id: 'bone_2', pos: [6, 0.75, 8] },
  { id: 'bone_3', pos: [16, 2.2, -12] },
  { id: 'bone_4', pos: [-11, 0.75, 8] },
  { id: 'bone_5', pos: [-12, 0.75, -10] },
  { id: 'bone_6', pos: [20, 0.75, 8] },
  { id: 'bone_7', pos: [-5, 1.1, -4] },
];

const COINS_CONFIG: { id: string; pos: [number, number, number] }[] = [
  { id: 'coin_1', pos: [2, 0.6, 4] },
  { id: 'coin_2', pos: [-3, 0.6, 2] },
  { id: 'coin_3', pos: [12, 0.6, 5] },
  { id: 'coin_4', pos: [-15, 0.6, 15] },
  { id: 'coin_5', pos: [18, 1.9, -18] },
  { id: 'coin_6', pos: [-8, 0.6, 18] },
  { id: 'coin_7', pos: [10, 0.6, -15] },
  { id: 'coin_8', pos: [-18, 0.6, -2] },
];

export function Collectibles({ dogPosition }: CollectiblesProps) {
  return (
    <group>
      {BONES_CONFIG.map((b) => (
        <BoneMesh key={b.id} id={b.id} position={b.pos} dogPosition={dogPosition} />
      ))}
      {COINS_CONFIG.map((c) => (
        <CoinMesh key={c.id} id={c.id} position={c.pos} dogPosition={dogPosition} />
      ))}
    </group>
  );
}
