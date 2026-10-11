'use client';

import React, { useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { Sky } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { DogController } from './DogController';
import { ThirdPersonCamera } from './ThirdPersonCamera';
import { World } from './World';
import { Collectibles } from './Collectibles';
import { BallInteraction } from './BallInteraction';
import { BarnabyTheCat } from './NPC';

export function GameCanvas() {
  const [dogPos, setDogPos] = useState<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0));
  const graphicsQuality = useGameStore((s) => s.settings.graphicsQuality);

  const shadowMapSize = graphicsQuality === 'high' ? 2048 : graphicsQuality === 'medium' ? 1024 : 512;
  const castShadows = graphicsQuality !== 'low';

  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, overflow: 'hidden' }}>
      <Canvas
        shadows={castShadows}
        camera={{ position: [0, 3.5, 5], fov: 55 }}
        gl={{ antialias: graphicsQuality !== 'low', powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['#a2d2ff']} />
        <fog attach="fog" args={['#d8f3dc', 28, 85]} />

        {/* --- 3D LIGHTING & AMBIENCE --- */}
        {/* Soft Ambient Fill */}
        <ambientLight intensity={0.65} color="#ffffff" />

        {/* Warm Golden Sunlight */}
        <directionalLight
          position={[28, 38, 22]}
          intensity={1.35}
          castShadow={castShadows}
          shadow-mapSize-width={shadowMapSize}
          shadow-mapSize-height={shadowMapSize}
          shadow-camera-near={0.5}
          shadow-camera-far={90}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-bias={-0.0002}
          color="#fff8e7"
        />

        {/* Soft Rim Light (Opposite side for 3D depth and edge highlights) */}
        <directionalLight position={[-25, 20, -25]} intensity={0.4} color="#bde0fe" />

        {/* Ground Green Bounce Fill */}
        <hemisphereLight args={['#bde0fe', '#52b788', 0.45]} />

        {/* Atmospheric Sky */}
        <Sky
          distance={450000}
          sunPosition={[28, 38, 22]}
          inclination={0.55}
          azimuth={0.25}
          turbidity={5}
          rayleigh={0.6}
        />

        <Suspense fallback={null}>
          <Physics gravity={[0, -20, 0]} timeStep="vary">
            <World dogPosition={dogPos} />
            <DogController onPositionUpdate={setDogPos} />
            <Collectibles dogPosition={dogPos} />
            <BallInteraction dogPosition={dogPos} />
            <BarnabyTheCat dogPosition={dogPos} position={[14, 1.0, -13]} />
          </Physics>

          <ThirdPersonCamera targetPosition={dogPos} />
        </Suspense>
      </Canvas>
    </div>
  );
}
