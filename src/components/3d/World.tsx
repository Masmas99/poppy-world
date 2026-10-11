'use client';

import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, CylinderCollider, BallCollider } from '@react-three/rapier';

// Stylized 3D Tree with guaranteed solid trunk collider
export function StylizedTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const trunkRadius = 0.5 * scale;
  const colliderHeight = 2.0 * scale;

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CylinderCollider args={[colliderHeight, trunkRadius]} position={[0, colliderHeight, 0]} />

      <group scale={[scale, scale, scale]}>
        <mesh castShadow receiveShadow position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.32, 0.52, 2.4, 10]} />
          <meshStandardMaterial color="#7f5539" roughness={0.85} />
        </mesh>

        <mesh position={[0.3, 0.1, 0.3]} rotation={[0, 0.5, 0]}>
          <boxGeometry args={[0.3, 0.18, 0.7]} />
          <meshStandardMaterial color="#7f5539" roughness={0.9} />
        </mesh>
        <mesh position={[-0.3, 0.1, -0.2]} rotation={[0, -0.8, 0]}>
          <boxGeometry args={[0.28, 0.18, 0.65]} />
          <meshStandardMaterial color="#7f5539" roughness={0.9} />
        </mesh>

        <mesh castShadow receiveShadow position={[0, 3.2, 0]}>
          <sphereGeometry args={[1.5, 14, 14]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.65} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.6, 3.8, 0.35]}>
          <sphereGeometry args={[1.15, 12, 12]} />
          <meshStandardMaterial color="#40916c" roughness={0.65} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.5, 4.0, -0.3]}>
          <sphereGeometry args={[1.05, 12, 12]} />
          <meshStandardMaterial color="#52b788" roughness={0.65} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 4.5, 0.1]}>
          <sphereGeometry args={[0.9, 10, 10]} />
          <meshStandardMaterial color="#74c69d" roughness={0.6} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Stylized 3D Bush with solid ball collider
export function StylizedBush({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const colRadius = 0.75 * scale;

  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <BallCollider args={[colRadius]} position={[0, colRadius * 0.7, 0]} />

      <group scale={[scale, scale, scale]}>
        <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
          <sphereGeometry args={[0.72, 12, 12]} />
          <meshStandardMaterial color="#38b000" roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[0.42, 0.36, 0.2]}>
          <sphereGeometry args={[0.52, 10, 10]} />
          <meshStandardMaterial color="#70e000" roughness={0.7} />
        </mesh>
        <mesh castShadow receiveShadow position={[-0.35, 0.32, -0.2]}>
          <sphereGeometry args={[0.48, 10, 10]} />
          <meshStandardMaterial color="#2d6a4f" roughness={0.75} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Stylized Rock with solid collider
export function StylizedRock({
  position,
  rotation = [0, 0, 0],
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  const colRadius = 0.85 * scale;

  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
      <BallCollider args={[colRadius]} position={[0, colRadius * 0.5, 0]} />

      <group scale={[scale, scale * 0.75, scale]}>
        <mesh castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial color="#6c757d" roughness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <sphereGeometry args={[0.55, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#588157" roughness={0.9} />
        </mesh>
      </group>
    </RigidBody>
  );
}

// Wooden Fence Segment with solid cuboid collider
export function WoodenFenceSegment({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  return (
    <RigidBody type="fixed" colliders={false} position={position} rotation={rotation}>
      <CuboidCollider args={[1.5, 0.9, 0.35]} position={[0, 0.7, 0]} />

      <mesh position={[-1.2, 0.65, 0]} castShadow>
        <boxGeometry args={[0.18, 1.3, 0.18]} />
        <meshStandardMaterial color="#9c6644" roughness={0.85} />
      </mesh>
      <mesh position={[1.2, 0.65, 0]} castShadow>
        <boxGeometry args={[0.18, 1.3, 0.18]} />
        <meshStandardMaterial color="#9c6644" roughness={0.85} />
      </mesh>
      <mesh position={[-1.2, 1.38, 0]} castShadow>
        <coneGeometry args={[0.13, 0.2, 4]} />
        <meshStandardMaterial color="#7f5539" roughness={0.85} />
      </mesh>
      <mesh position={[1.2, 1.38, 0]} castShadow>
        <coneGeometry args={[0.13, 0.2, 4]} />
        <meshStandardMaterial color="#7f5539" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.45, 0]} castShadow>
        <boxGeometry args={[2.55, 0.14, 0.09]} />
        <meshStandardMaterial color="#b08968" roughness={0.85} />
      </mesh>
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[2.55, 0.14, 0.09]} />
        <meshStandardMaterial color="#b08968" roughness={0.85} />
      </mesh>
    </RigidBody>
  );
}

// Landmark 1: 3D Cozy Doghouse
export function Doghouse({ position }: { position: [number, number, number] }) {
  return (
    <RigidBody type="fixed" colliders={false} position={position}>
      <CuboidCollider args={[1.4, 1.3, 1.4]} position={[0, 1.3, 0]} />

      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[3.0, 0.24, 3.0]} />
        <meshStandardMaterial color="#5c3a21" roughness={0.85} />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 1.85, 2.3]} />
        <meshStandardMaterial color="#b08968" roughness={0.75} />
      </mesh>

      {[-1.15, 1.15].map((x, xi) =>
        [-1.15, 1.15].map((z, zi) => (
          <mesh key={`${xi}-${zi}`} position={[x, 1.15, z]} castShadow>
            <boxGeometry args={[0.16, 1.88, 0.16]} />
            <meshStandardMaterial color="#7f5539" roughness={0.8} />
          </mesh>
        ))
      )}

      <mesh position={[0, 0.85, 1.16]} castShadow>
        <boxGeometry args={[1.15, 1.35, 0.08]} />
        <meshStandardMaterial color="#7f5539" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 1.17]}>
        <planeGeometry args={[0.95, 1.2]} />
        <meshBasicMaterial color="#1f140e" />
      </mesh>

      <mesh position={[0, 2.45, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.3, 1.2, 4]} />
        <meshStandardMaterial color="#c1121f" roughness={0.65} />
      </mesh>

      <mesh position={[0, 1.8, 1.22]} castShadow>
        <boxGeometry args={[1.2, 0.32, 0.08]} />
        <meshStandardMaterial color="#fdf0d5" roughness={0.5} />
      </mesh>

      <mesh position={[0.95, 0.28, 1.7]} castShadow>
        <cylinderGeometry args={[0.28, 0.22, 0.16, 16]} />
        <meshStandardMaterial color="#0077b6" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.95, 0.34, 1.7]}>
        <cylinderGeometry args={[0.24, 0.24, 0.06, 16]} />
        <meshStandardMaterial color="#6b3e08" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.25, 1.6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.3, 0.85]} />
        <meshStandardMaterial color="#f72585" roughness={0.85} />
      </mesh>
    </RigidBody>
  );
}

// Landmark 2: 3D Windmill with gentle, effortlessly climbable hill & ramp
export function Windmill({ position }: { position: [number, number, number] }) {
  const sailsRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (sailsRef.current) {
      sailsRef.current.rotation.z += delta * 0.85;
    }
  });

  return (
    <group position={position}>
      {/*
        SMOOTH WINDMILL HILL & RAMP COLLIDERS:
        Includes a gentle inclined ramp path (slope < 6 degrees)
        so the puppy walks up smoothly like a regular garden path!
      */}
      <RigidBody type="fixed" colliders={false}>
        {/* Main top plateau */}
        <CylinderCollider args={[0.5, 6.8]} position={[0, 0.5, 0]} />
        {/* Gentle outer mound base */}
        <CylinderCollider args={[0.2, 13.5]} position={[0, 0.2, 0]} />
        {/* Smooth gentle entrance ramp leading up from the stone path */}
        <CuboidCollider args={[2.5, 0.2, 5.0]} position={[0, 0.5, 5.5]} rotation={[-0.1, 0, 0]} />
        {/* Solid Windmill Tower Center */}
        <CylinderCollider args={[4.2, 2.0]} position={[0, 4.5, 0]} />
      </RigidBody>

      {/* Gentle Visual Hill Mesh (height only 1.0m, very easy slope) */}
      <mesh receiveShadow position={[0, 0.5, 0]}>
        <cylinderGeometry args={[6.8, 14, 1.0, 24]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.8} />
      </mesh>

      {/* Windmill Tower Structure (standing on plateau at y = 1.0) */}
      <group position={[0, 1.0, 0]}>
        {/* Stone Foundation Ring */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[2.4, 2.6, 1.0, 14]} />
          <meshStandardMaterial color="#495057" roughness={0.85} flatShading />
        </mesh>

        {/* Timber/Plaster Conical Tower */}
        <mesh position={[0, 4.0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.5, 2.3, 6.8, 14]} />
          <meshStandardMaterial color="#f8f9fa" roughness={0.8} />
        </mesh>

        {/* Timber framing bands */}
        <mesh position={[0, 2.5, 0]}>
          <cylinderGeometry args={[2.08, 2.08, 0.16, 14]} />
          <meshStandardMaterial color="#7f5539" roughness={0.85} />
        </mesh>
        <mesh position={[0, 5.2, 0]}>
          <cylinderGeometry args={[1.68, 1.68, 0.16, 14]} />
          <meshStandardMaterial color="#7f5539" roughness={0.85} />
        </mesh>

        {/* Terracotta Dome Cap */}
        <mesh position={[0, 7.6, 0]} castShadow>
          <sphereGeometry args={[1.6, 14, 14, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
          <meshStandardMaterial color="#e07a5f" roughness={0.65} />
        </mesh>

        {/* Rotating Sails Hub */}
        <group position={[0, 7.0, 1.7]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.5, 12]} />
            <meshStandardMaterial color="#343a40" roughness={0.4} />
          </mesh>

          <group ref={sailsRef}>
            {[0, 1, 2, 3].map((i) => (
              <group key={i} rotation={[0, 0, (i * Math.PI) / 2]}>
                <mesh position={[0, 2.2, 0]} castShadow>
                  <boxGeometry args={[0.09, 4.4, 0.09]} />
                  <meshStandardMaterial color="#81b29a" roughness={0.8} />
                </mesh>
                <mesh position={[0.32, 2.4, 0]} castShadow>
                  <planeGeometry args={[0.55, 3.8]} />
                  <meshStandardMaterial color="#ffffff" roughness={0.9} side={THREE.DoubleSide} />
                </mesh>
              </group>
            ))}
          </group>
        </group>
      </group>
    </group>
  );
}

// Landmark 3: 3D Pond with real swimming support
export function Pond({ position }: { position: [number, number, number] }) {
  const waterRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (waterRef.current) {
      const t = state.clock.getElapsedTime();
      waterRef.current.position.y = 0.08 + Math.sin(t * 1.5) * 0.015;
    }
  });

  return (
    <group position={position}>
      {/*
        Pond basin collider: placed below water surface (y = -0.5)
        so the dog can enter and swim freely without being blocked,
        while preventing falling through the world!
      */}
      <RigidBody type="fixed" colliders={false}>
        <CylinderCollider args={[0.3, 4.8]} position={[0, -0.4, 0]} />
      </RigidBody>

      {/* Water Surface */}
      <mesh ref={waterRef} position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5.0, 28]} />
        <meshStandardMaterial
          color="#00b4d8"
          roughness={0.08}
          metalness={0.25}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* 3D Floating Lily Pads */}
      {[
        [-1.8, 0.09, 1.2],
        [1.5, 0.09, -1.8],
        [-0.8, 0.09, -2.2],
        [2.2, 0.09, 1.4],
      ].map((p, idx) => (
        <group key={idx} position={[p[0], p[1], p[2]]}>
          <mesh rotation={[-Math.PI / 2, 0, idx * 1.2]}>
            <circleGeometry args={[0.45, 12, 0, Math.PI * 1.8]} />
            <meshStandardMaterial color="#38b000" roughness={0.6} side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <coneGeometry args={[0.1, 0.12, 6]} />
            <meshStandardMaterial color="#ff70a6" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* Rim Rocks with gaps for easy shore entry */}
      {[0, 1, 3, 4, 5, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        const rad = 5.2 + Math.sin(i * 2) * 0.3;
        return (
          <StylizedRock
            key={i}
            position={[Math.cos(angle) * rad, 0.3, Math.sin(angle) * rad]}
            scale={0.85 + (i % 3) * 0.25}
          />
        );
      })}
    </group>
  );
}

// Instanced flowers
export function InstancedFlowers({ count = 180 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const flowerData = useMemo(() => {
    const dummy = new THREE.Object3D();
    const positions: [number, number, number][] = [];
    const colors: THREE.Color[] = [];
    const colorPalette = [
      new THREE.Color('#ff0054'),
      new THREE.Color('#ffd166'),
      new THREE.Color('#4cc9f0'),
      new THREE.Color('#ffffff'),
      new THREE.Color('#9b5de5'),
    ];

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      positions.push([x, 0.16, z]);
      colors.push(colorPalette[Math.floor(Math.random() * colorPalette.length)]);
    }

    return { dummy, positions, colors };
  }, [count]);

  React.useEffect(() => {
    if (!meshRef.current) return;
    const { dummy, positions, colors } = flowerData;

    positions.forEach((pos, idx) => {
      dummy.position.set(pos[0], pos[1], pos[2]);
      const s = 0.28 + Math.random() * 0.18;
      dummy.scale.set(s, s * 1.4, s);
      dummy.rotation.y = Math.random() * Math.PI * 2;
      dummy.updateMatrix();

      meshRef.current!.setMatrixAt(idx, dummy.matrix);
      meshRef.current!.setColorAt(idx, colors[idx]);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [flowerData]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <coneGeometry args={[0.3, 0.42, 6]} />
      <meshStandardMaterial roughness={0.65} />
    </instancedMesh>
  );
}

export function World() {
  return (
    <group>
      {/* Ground plane collider */}
      <RigidBody type="fixed" colliders={false} position={[0, 0, 0]}>
        <CuboidCollider args={[45, 1, 45]} position={[0, -1, 0]} />

        <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[90, 90, 48, 48]} />
          <meshStandardMaterial color="#40916c" roughness={0.75} />
        </mesh>
      </RigidBody>

      {/* Pathways */}
      <group position={[0, 0.03, 0]}>
        {[
          [0, 0, 1.8],
          [0.3, 0, 3.2],
          [-0.2, 0, 4.6],
          [0.6, 0, 6.0],
          [1.8, 0, 7.2],
          [3.2, 0, 8.0],
          [4.8, 0, 8.4],
          [6.5, 0, 8.2],
          [8.0, 0, 7.2],
          [9.5, 0, 5.8],
          [11.2, 0, 4.0],
          [12.8, 0, 1.8],
          [14.2, 0, -0.6],
          [15.5, 0, -3.2],
          [16.2, 0.05, -6.0],
          [16.1, 0.22, -8.0],
          [16.0, 0.45, -10.0],
          [15.8, 0.72, -12.0],
          [15.5, 1.02, -14.0],
        ].map((pt, i) => (
          <mesh key={i} position={[pt[0], pt[1] + 0.03, pt[2]]} rotation={[-Math.PI / 2, 0, (i * 0.4) % Math.PI]}>
            <circleGeometry args={[0.62 + (i % 2) * 0.08, 10]} />
            <meshStandardMaterial color="#ced4da" roughness={0.85} />
          </mesh>
        ))}
      </group>

      {/* Landmarks */}
      <Doghouse position={[0, 0, -3.5]} />
      <Windmill position={[16, 0, -16]} />
      <Pond position={[-14, 0, 12]} />

      {/* Trees */}
      <StylizedTree position={[-12, 0, -10]} scale={1.2} />
      <StylizedTree position={[-16, 0, -4]} scale={1.0} />
      <StylizedTree position={[-8, 0, -16]} scale={1.3} />
      <StylizedTree position={[-20, 0, 6]} scale={1.1} />
      <StylizedTree position={[-10, 0, 22]} scale={1.2} />
      <StylizedTree position={[8, 0, -22]} scale={1.1} />
      <StylizedTree position={[22, 0, -8]} scale={1.3} />
      <StylizedTree position={[24, 0, 4]} scale={1.0} />
      <StylizedTree position={[18, 0, 16]} scale={1.2} />
      <StylizedTree position={[6, 0, 20]} scale={1.1} />
      <StylizedTree position={[-6, 0, -8]} scale={0.9} />
      <StylizedTree position={[10, 0, -10]} scale={1.0} />

      {/* Bushes */}
      <StylizedBush position={[-2.5, 0, -2.5]} scale={1.0} />
      <StylizedBush position={[2.5, 0, -2.5]} scale={1.1} />
      <StylizedBush position={[-6, 0, 4]} scale={0.9} />
      <StylizedBush position={[8, 0, 5]} scale={1.2} />
      <StylizedBush position={[14, 1.5, -11]} scale={1.1} />
      <StylizedBush position={[-10, 0, 8]} scale={1.3} />

      {/* Rocks */}
      <StylizedRock position={[-5, 0.4, -4]} scale={1.1} />
      <StylizedRock position={[6, 0.5, -3]} scale={1.3} />
      <StylizedRock position={[12, 0.6, 9]} scale={1.4} />
      <StylizedRock position={[-8, 0.5, 14]} scale={1.2} />

      {/* Fences */}
      <WoodenFenceSegment position={[-3.6, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[-3.6, 0, -3.5]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[-3.6, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[3.6, 0, -1]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[3.6, 0, -3.5]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[3.6, 0, -6]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[-1.8, 0, -7.2]} rotation={[0, 0, 0]} />
      <WoodenFenceSegment position={[1.8, 0, -7.2]} rotation={[0, 0, 0]} />

      {/* Boundary Fences */}
      <WoodenFenceSegment position={[-28, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[-28, 0, 10]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[-28, 0, -10]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[28, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[28, 0, 10]} rotation={[0, Math.PI / 2, 0]} />
      <WoodenFenceSegment position={[28, 0, -10]} rotation={[0, Math.PI / 2, 0]} />

      {/* Outer Boundary Invisible Walls */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[42, 6, 1]} position={[0, 3, 38]} />
        <CuboidCollider args={[42, 6, 1]} position={[0, 3, -38]} />
        <CuboidCollider args={[1, 6, 42]} position={[38, 3, 0]} />
        <CuboidCollider args={[1, 6, 42]} position={[-38, 3, 0]} />
      </RigidBody>

      {/* Instanced Flowers */}
      <InstancedFlowers count={180} />
    </group>
  );
}
