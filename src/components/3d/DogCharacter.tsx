'use client';

import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DogAnimationState, DogCustomization } from '@/types/game';

interface DogCharacterProps {
  animationState: DogAnimationState;
  speed: number;
  customization: DogCustomization;
}

export function ProceduralCorgi({
  animationState,
  speed,
  customization,
}: {
  animationState: DogAnimationState;
  speed: number;
  customization: DogCustomization;
}) {
  const rootRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const mouthRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const earLRef = useRef<THREE.Group>(null);
  const earRRef = useRef<THREE.Group>(null);
  const shadowRef = useRef<THREE.Mesh>(null);

  const legFLRef = useRef<THREE.Group>(null);
  const legFRRef = useRef<THREE.Group>(null);
  const legBLRef = useRef<THREE.Group>(null);
  const legBRRef = useRef<THREE.Group>(null);

  const colors = useMemo(() => {
    let furPrimary = '#d97724'; // Classic golden corgi
    let furSecondary = '#fdfbf7'; // Creamy white underbelly & paws
    if (customization.furTone === 'chocolate') {
      furPrimary = '#633d1f';
    } else if (customization.furTone === 'husky_gray') {
      furPrimary = '#475569';
    }

    return {
      primary: furPrimary,
      secondary: furSecondary,
      nose: '#18181b',
      eyes: '#09090b',
      collar: customization.collarColor || '#e63946',
      tag: '#eab308',
      tongue: '#fb7185',
      innerEar: '#fca5a5',
      pawPad: '#27272a',
    };
  }, [customization]);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!rootRef.current || !bodyRef.current || !headRef.current || !tailRef.current) return;

    const isMoving = animationState === 'walking' || animationState === 'running' || animationState === 'sprinting';
    const isSprinting = animationState === 'sprinting';
    const isJumping = animationState === 'jumping' || animationState === 'falling';
    const isBarking = animationState === 'barking';
    const isSniffing = animationState === 'sniffing';
    const isSitting = animationState === 'sitting';
    const isSwimming = animationState === 'swimming';

    const animSpeed = isSprinting ? 22 : isMoving ? 14 : 3;

    // --- LEGS ANIMATION ---
    if (isSwimming) {
      // Doggy paddle swimming stroke
      const swimCycle = Math.sin(time * 16);
      if (legFLRef.current) legFLRef.current.rotation.x = swimCycle * 0.75;
      if (legFRRef.current) legFRRef.current.rotation.x = -swimCycle * 0.75;
      if (legBLRef.current) legBLRef.current.rotation.x = Math.sin(time * 16 + 1.2) * 0.55;
      if (legBRRef.current) legBRRef.current.rotation.x = -Math.sin(time * 16 + 1.2) * 0.55;
    } else if (isJumping) {
      if (legFLRef.current) legFLRef.current.rotation.x = THREE.MathUtils.lerp(legFLRef.current.rotation.x, -0.65, 0.2);
      if (legFRRef.current) legFRRef.current.rotation.x = THREE.MathUtils.lerp(legFRRef.current.rotation.x, -0.65, 0.2);
      if (legBLRef.current) legBLRef.current.rotation.x = THREE.MathUtils.lerp(legBLRef.current.rotation.x, 0.75, 0.2);
      if (legBRRef.current) legBRRef.current.rotation.x = THREE.MathUtils.lerp(legBRRef.current.rotation.x, 0.75, 0.2);
    } else if (isSitting) {
      if (legFLRef.current) legFLRef.current.rotation.x = THREE.MathUtils.lerp(legFLRef.current.rotation.x, 0, 0.2);
      if (legFRRef.current) legFRRef.current.rotation.x = THREE.MathUtils.lerp(legFRRef.current.rotation.x, 0, 0.2);
      if (legBLRef.current) legBLRef.current.rotation.x = THREE.MathUtils.lerp(legBLRef.current.rotation.x, -1.1, 0.2);
      if (legBRRef.current) legBRRef.current.rotation.x = THREE.MathUtils.lerp(legBRRef.current.rotation.x, -1.1, 0.2);
    } else if (isMoving) {
      const legCycle = Math.sin(time * animSpeed);
      const amp = isSprinting ? 0.85 : 0.55;

      if (legFLRef.current) legFLRef.current.rotation.x = legCycle * amp;
      if (legFRRef.current) legFRRef.current.rotation.x = -legCycle * amp;
      if (legBLRef.current) legBLRef.current.rotation.x = -legCycle * amp;
      if (legBRRef.current) legBRRef.current.rotation.x = legCycle * amp;
    } else {
      const neutralLerp = 0.25;
      if (legFLRef.current) legFLRef.current.rotation.x = THREE.MathUtils.lerp(legFLRef.current.rotation.x, 0, neutralLerp);
      if (legFRRef.current) legFRRef.current.rotation.x = THREE.MathUtils.lerp(legFRRef.current.rotation.x, 0, neutralLerp);
      if (legBLRef.current) legBLRef.current.rotation.x = THREE.MathUtils.lerp(legBLRef.current.rotation.x, 0, neutralLerp);
      if (legBRRef.current) legBRRef.current.rotation.x = THREE.MathUtils.lerp(legBRRef.current.rotation.x, 0, neutralLerp);
    }

    // --- BODY POSITION & BREATHING ---
    // Base standing y = 0.38 so paws touch y = 0.00
    if (isSwimming) {
      // Floating buoyantly on water
      bodyRef.current.position.y = 0.22 + Math.sin(time * 4) * 0.025;
      bodyRef.current.rotation.x = -0.2; // Tilted slightly upwards
      bodyRef.current.rotation.z = Math.sin(time * 4) * 0.05;
    } else if (isMoving) {
      const bobAmp = isSprinting ? 0.06 : 0.035;
      bodyRef.current.position.y = 0.38 + Math.abs(Math.sin(time * (animSpeed * 0.5))) * bobAmp;
      bodyRef.current.rotation.z = Math.sin(time * (animSpeed * 0.5)) * (isSprinting ? 0.08 : 0.04);
      bodyRef.current.rotation.x = isSprinting ? 0.12 : 0.05;
    } else if (isSitting) {
      bodyRef.current.position.y = THREE.MathUtils.lerp(bodyRef.current.position.y, 0.26, 0.15);
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, -0.38, 0.15);
    } else {
      // Idle breathing
      bodyRef.current.position.y = 0.38 + Math.sin(time * 2.5) * 0.012;
      bodyRef.current.rotation.x = THREE.MathUtils.lerp(bodyRef.current.rotation.x, 0, 0.1);
      bodyRef.current.rotation.z = THREE.MathUtils.lerp(bodyRef.current.rotation.z, 0, 0.1);
    }

    // --- TAIL WAG ---
    if (isSwimming) {
      tailRef.current.rotation.y = Math.sin(time * 10) * 0.45;
      tailRef.current.rotation.x = 0.25;
    } else if (isBarking) {
      tailRef.current.rotation.y = Math.sin(time * 30) * 0.7;
      tailRef.current.rotation.x = 0.6;
    } else if (isMoving) {
      tailRef.current.rotation.y = Math.sin(time * (animSpeed * 0.8)) * 0.45;
      tailRef.current.rotation.x = 0.4;
    } else {
      tailRef.current.rotation.y = Math.sin(time * 4) * 0.25;
      tailRef.current.rotation.x = 0.35;
    }

    // --- HEAD & SNOUT ---
    if (isSwimming) {
      headRef.current.rotation.x = -0.22; // Head held proudly high above water
      headRef.current.position.y = 0.42;
      if (mouthRef.current) mouthRef.current.rotation.x = 0;
    } else if (isBarking) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, -0.35, 0.3);
      if (mouthRef.current) mouthRef.current.rotation.x = THREE.MathUtils.lerp(mouthRef.current.rotation.x, 0.35, 0.3);
      if (earLRef.current) earLRef.current.rotation.z = 0.2 + Math.sin(time * 25) * 0.1;
      if (earRRef.current) earRRef.current.rotation.z = -0.2 - Math.sin(time * 25) * 0.1;
    } else if (isSniffing) {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0.45, 0.2);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 0.2, 0.2);
      if (mouthRef.current) mouthRef.current.rotation.x = 0;
    } else {
      headRef.current.rotation.x = THREE.MathUtils.lerp(headRef.current.rotation.x, 0, 0.15);
      headRef.current.position.y = THREE.MathUtils.lerp(headRef.current.position.y, 0.36, 0.15);
      if (mouthRef.current) mouthRef.current.rotation.x = 0;

      if (earLRef.current) earLRef.current.rotation.z = 0.18 + (isMoving ? Math.sin(time * 15) * 0.08 : 0);
      if (earRRef.current) earRRef.current.rotation.z = -0.18 - (isMoving ? Math.sin(time * 15) * 0.08 : 0);
    }

    // --- CONTACT BLOB SHADOW ---
    if (shadowRef.current) {
      const shadowScale = isJumping ? 0.7 : isSprinting ? 1.1 : 1.0;
      shadowRef.current.scale.set(shadowScale, shadowScale, shadowScale);
    }
  });

  return (
    <group ref={rootRef} dispose={null}>
      {/* GROUND CONTACT BLOB SHADOW */}
      <mesh ref={shadowRef} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshBasicMaterial color="#1b4332" transparent opacity={0.35} depthWrite={false} />
      </mesh>

      {/* MAIN BODY RIG (Pivot y = 0.38 so paws reach y = 0.00 exactly) */}
      <group ref={bodyRef} position={[0, 0.38, 0]}>
        {/* Main Torso (Smooth Rounded Corgi Loaf) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.22, 0.42, 14, 18]} />
          <meshStandardMaterial color={colors.primary} roughness={0.6} />
        </mesh>

        {/* White Chest & Underbelly Patch */}
        <mesh position={[0, -0.06, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <capsuleGeometry args={[0.18, 0.38, 12, 16]} />
          <meshStandardMaterial color={colors.secondary} roughness={0.6} />
        </mesh>

        {/* Fluffy Chest Mane Bib */}
        <mesh position={[0, 0.05, 0.34]} castShadow>
          <sphereGeometry args={[0.2, 14, 14]} />
          <meshStandardMaterial color={colors.secondary} roughness={0.6} />
        </mesh>

        {/* 3D Collar & Gold Medal */}
        <group position={[0, 0.12, 0.32]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.22, 0.038, 12, 24]} />
            <meshStandardMaterial color={colors.collar} roughness={0.3} metalness={0.25} />
          </mesh>
          <mesh position={[0, -0.19, 0.05]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
            <meshStandardMaterial color={colors.tag} roughness={0.2} metalness={0.9} />
          </mesh>
        </group>

        {/* Perky Corgi Tail */}
        <group ref={tailRef} position={[0, 0.12, -0.42]}>
          <mesh position={[0, 0.09, -0.07]} rotation={[0.4, 0, 0]} castShadow>
            <coneGeometry args={[0.09, 0.26, 14]} />
            <meshStandardMaterial color={colors.primary} roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.18, -0.12]}>
            <sphereGeometry args={[0.075, 12, 12]} />
            <meshStandardMaterial color={colors.secondary} roughness={0.6} />
          </mesh>
        </group>

        {/* HEAD ASSEMBLY (Rounded & Cute) */}
        <group ref={headRef} position={[0, 0.35, 0.35]}>
          {/* Main Skull */}
          <mesh castShadow position={[0, 0, 0]}>
            <sphereGeometry args={[0.23, 18, 18]} />
            <meshStandardMaterial color={colors.primary} roughness={0.6} />
          </mesh>

          {/* Left & Right Cute Cheeks */}
          <mesh position={[-0.14, -0.06, 0.08]} castShadow>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.6} />
          </mesh>
          <mesh position={[0.14, -0.06, 0.08]} castShadow>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.6} />
          </mesh>

          {/* White Forehead Blaze */}
          <mesh position={[0, 0.06, 0.14]}>
            <capsuleGeometry args={[0.06, 0.16, 10, 12]} />
            <meshStandardMaterial color={colors.secondary} roughness={0.6} />
          </mesh>

          {/* Rounded Muzzle / Snout */}
          <mesh castShadow position={[0, -0.06, 0.22]} rotation={[Math.PI / 2, 0, 0]}>
            <capsuleGeometry args={[0.11, 0.14, 14, 14]} />
            <meshStandardMaterial color={colors.secondary} roughness={0.6} />
          </mesh>

          {/* 3D Black Wet Nose */}
          <mesh position={[0, 0.015, 0.34]}>
            <sphereGeometry args={[0.048, 14, 14]} />
            <meshStandardMaterial color={colors.nose} roughness={0.15} metalness={0.15} />
          </mesh>

          {/* Lower Jaw & Mouth for barking */}
          <group ref={mouthRef} position={[0, -0.12, 0.19]}>
            <mesh position={[0, -0.02, 0.04]}>
              <boxGeometry args={[0.16, 0.05, 0.14]} />
              <meshStandardMaterial color={colors.secondary} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.015, 0.05]}>
              <boxGeometry args={[0.08, 0.025, 0.09]} />
              <meshStandardMaterial color={colors.tongue} roughness={0.4} />
            </mesh>
          </group>

          {/* 3D Eyes with Specular Sparkle */}
          {/* Left Eye */}
          <group position={[-0.12, 0.05, 0.17]}>
            <mesh>
              <sphereGeometry args={[0.042, 16, 16]} />
              <meshStandardMaterial color={colors.eyes} roughness={0.1} metalness={0.5} />
            </mesh>
            <mesh position={[-0.01, 0.015, 0.033]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Right Eye */}
          <group position={[0.12, 0.05, 0.17]}>
            <mesh>
              <sphereGeometry args={[0.042, 16, 16]} />
              <meshStandardMaterial color={colors.eyes} roughness={0.1} metalness={0.5} />
            </mesh>
            <mesh position={[0.01, 0.015, 0.033]}>
              <sphereGeometry args={[0.014, 8, 8]} />
              <meshBasicMaterial color="#ffffff" />
            </mesh>
          </group>

          {/* Large Pointy Corgi Ears with Depth */}
          {/* Left Ear */}
          <group ref={earLRef} position={[-0.16, 0.18, -0.04]} rotation={[0.1, 0, 0.22]}>
            <mesh castShadow position={[0, 0.15, 0]}>
              <coneGeometry args={[0.1, 0.3, 14]} />
              <meshStandardMaterial color={colors.primary} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.13, 0.028]} rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[0.11, 0.2]} />
              <meshStandardMaterial color={colors.innerEar} roughness={0.7} />
            </mesh>
          </group>

          {/* Right Ear */}
          <group ref={earRRef} position={[0.16, 0.18, -0.04]} rotation={[0.1, 0, -0.22]}>
            <mesh castShadow position={[0, 0.15, 0]}>
              <coneGeometry args={[0.1, 0.3, 14]} />
              <meshStandardMaterial color={colors.primary} roughness={0.6} />
            </mesh>
            <mesh position={[0, 0.13, 0.028]} rotation={[-0.1, 0, 0]}>
              <planeGeometry args={[0.11, 0.2]} />
              <meshStandardMaterial color={colors.innerEar} roughness={0.7} />
            </mesh>
          </group>
        </group>

        {/* 4 LEGS WITH WHITE PAWS & PAW PADS */}
        {/* Front Left Leg */}
        <group ref={legFLRef} position={[-0.18, -0.15, 0.24]}>
          <mesh castShadow position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.065, 0.06, 0.22, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.65} />
          </mesh>
          {/* Paw touching ground (y = -0.23 relative to leg pivot = 0.38 - 0.15 - 0.23 = 0.00!) */}
          <group position={[0, -0.21, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color={colors.secondary} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.04, 8]} />
              <meshBasicMaterial color={colors.pawPad} />
            </mesh>
          </group>
        </group>

        {/* Front Right Leg */}
        <group ref={legFRRef} position={[0.18, -0.15, 0.24]}>
          <mesh castShadow position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.065, 0.06, 0.22, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.65} />
          </mesh>
          <group position={[0, -0.21, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color={colors.secondary} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.04, 8]} />
              <meshBasicMaterial color={colors.pawPad} />
            </mesh>
          </group>
        </group>

        {/* Back Left Leg */}
        <group ref={legBLRef} position={[-0.18, -0.15, -0.24]}>
          <mesh castShadow position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.22, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.65} />
          </mesh>
          <group position={[0, -0.21, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color={colors.secondary} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.04, 8]} />
              <meshBasicMaterial color={colors.pawPad} />
            </mesh>
          </group>
        </group>

        {/* Back Right Leg */}
        <group ref={legBRRef} position={[0.18, -0.15, -0.24]}>
          <mesh castShadow position={[0, -0.11, 0]}>
            <cylinderGeometry args={[0.075, 0.065, 0.22, 12]} />
            <meshStandardMaterial color={colors.primary} roughness={0.65} />
          </mesh>
          <group position={[0, -0.21, 0.02]}>
            <mesh castShadow>
              <sphereGeometry args={[0.065, 12, 12]} />
              <meshStandardMaterial color={colors.secondary} roughness={0.65} />
            </mesh>
            <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <circleGeometry args={[0.04, 8]} />
              <meshBasicMaterial color={colors.pawPad} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

export function DogCharacter({ animationState, speed, customization }: DogCharacterProps) {
  return <ProceduralCorgi animationState={animationState} speed={speed} customization={customization} />;
}
