'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, RapierRigidBody, CapsuleCollider } from '@react-three/rapier';
import { useGameStore } from '@/store/useGameStore';
import { DogCharacter } from './DogCharacter';
import { soundManager } from '@/utils/soundManager';

interface DogControllerProps {
  onPositionUpdate?: (pos: THREE.Vector3) => void;
}

const POND_CENTER = new THREE.Vector2(-14, 12);
const POND_RADIUS = 4.8;

export function DogController({ onPositionUpdate }: DogControllerProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const characterGroupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const gameState = useGameStore((s) => s.gameState);
  const animationState = useGameStore((s) => s.animationState);
  const setAnimationState = useGameStore((s) => s.setAnimationState);
  const customization = useGameStore((s) => s.customization);
  const bark = useGameStore((s) => s.bark);
  const interact = useGameStore((s) => s.interact);

  const keys = useRef<{ [key: string]: boolean }>({});
  const prevSpaceState = useRef<boolean>(false);
  const canJumpRef = useRef<boolean>(true);
  const jumpCooldownRef = useRef<number>(0);
  const footstepTimer = useRef<number>(0);
  const splashTimer = useRef<number>(0);
  const currentRotation = useRef<number>(0);
  const targetRotation = useRef<number>(0);
  const [currentSpeed, setCurrentSpeed] = useState<number>(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      const code = e.code;
      keys.current[code] = true;

      if (code === 'KeyQ') {
        bark();
      } else if (code === 'KeyE') {
        interact();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, bark, interact]);

  useFrame((state, delta) => {
    if (gameState !== 'playing' || !rigidBodyRef.current) return;

    const rb = rigidBodyRef.current;
    const translation = rb.translation();
    const currentLinvel = rb.linvel();
    const dogPos = new THREE.Vector3(translation.x, translation.y, translation.z);

    if (onPositionUpdate) {
      onPositionUpdate(dogPos);
    }

    // Safety fallback
    if (translation.y < -6) {
      rb.setTranslation({ x: 0, y: 1.5, z: 0 }, true);
      rb.setLinvel({ x: 0, y: 0, z: 0 }, true);
      return;
    }

    // Decrement jump cooldown
    if (jumpCooldownRef.current > 0) {
      jumpCooldownRef.current -= delta;
    }

    // Detect water / swimming zone (Pond)
    const distToPond = new THREE.Vector2(translation.x - POND_CENTER.x, translation.z - POND_CENTER.y).length();
    const isInWater = distToPond < POND_RADIUS;

    // Accurate ground detection: only grounded when vertical velocity is near zero and cooldown expired
    const isTouchingGround = Math.abs(currentLinvel.y) < 0.15 && jumpCooldownRef.current <= 0;
    if (isTouchingGround || isInWater) {
      canJumpRef.current = true;
    }

    const mobileInput = useGameStore.getState().mobileInput;

    let inputForward = 0;
    let inputRight = 0;

    if (keys.current['KeyW'] || keys.current['ArrowUp']) inputForward += 1;
    if (keys.current['KeyS'] || keys.current['ArrowDown']) inputForward -= 1;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) inputRight += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) inputRight -= 1;

    // Mobile joystick
    if (Math.abs(mobileInput.moveY) > 0.1) inputForward -= mobileInput.moveY;
    if (Math.abs(mobileInput.moveX) > 0.1) inputRight += mobileInput.moveX;

    const isSprinting = (keys.current['ShiftLeft'] || keys.current['ShiftRight'] || mobileInput.sprint) && inputForward > 0 && !isInWater;

    // Single-trigger jump check: Space was not pressed last frame, or mobile button tap
    const spaceIsPressed = !!keys.current['Space'] || !!mobileInput.jump;
    const spaceJustPressed = spaceIsPressed && !prevSpaceState.current;
    prevSpaceState.current = spaceIsPressed;

    const wantsToJump = spaceJustPressed && canJumpRef.current;

    // Camera relative directions (Correct right vector: cross(forward, up))
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    camForward.y = 0;
    camForward.normalize();

    const camRight = new THREE.Vector3().crossVectors(camForward, new THREE.Vector3(0, 1, 0)).normalize();

    const moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(camForward, inputForward);
    moveDirection.addScaledVector(camRight, inputRight);

    const hasInput = moveDirection.lengthSq() > 0.01;
    if (hasInput && animationState === 'sleeping') {
      setAnimationState('walking');
      useGameStore.setState({ feedbackMessage: 'Your puppy woke up.' });
    }

    let targetSpeed = 0;
    if (hasInput) {
      moveDirection.normalize();
      if (isInWater) {
        targetSpeed = 3.6; // Gentle swimming speed
      } else {
        targetSpeed = isSprinting ? 9.2 : 5.0;
      }
    }

    const newVelX = moveDirection.x * targetSpeed;
    const newVelZ = moveDirection.z * targetSpeed;

    let newVelY = currentLinvel.y;

    if (isInWater) {
      // Buoyancy: Dog floats at water level (y ~ 0.05)
      const waterSurfaceY = 0.08;
      const depth = waterSurfaceY - translation.y;
      if (depth > 0) {
        // Upward buoyant force push
        newVelY = Math.min(3.5, depth * 14 + 1.2);
      } else {
        newVelY = depth * 4;
      }

      // Water paddling splash sound
      if (hasInput) {
        splashTimer.current += delta * 6;
        if (splashTimer.current > Math.PI) {
          splashTimer.current = 0;
          soundManager.playSplash();
        }
      }
    }

    // Trigger jump (ONLY ONCE per press, with cooldown)
    if (wantsToJump) {
      canJumpRef.current = false;
      jumpCooldownRef.current = 0.45; // Cooldown prevents multi-jumping at apex
      newVelY = isInWater ? 6.5 : 7.2;
      soundManager.playJump();
      setAnimationState('jumping');
    }

    rb.setLinvel({ x: newVelX, y: newVelY, z: newVelZ }, true);

    // Rotate towards movement direction
    if (hasInput) {
      targetRotation.current = Math.atan2(moveDirection.x, moveDirection.z);
      let diff = targetRotation.current - currentRotation.current;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      currentRotation.current += diff * Math.min(1, delta * 15);

      if (characterGroupRef.current) {
        characterGroupRef.current.rotation.y = currentRotation.current;
      }
    }

    // Footstep audio on land
    if (hasInput && isTouchingGround && !isInWater) {
      footstepTimer.current += delta * (isSprinting ? 18 : 11);
      if (footstepTimer.current > Math.PI) {
        footstepTimer.current = 0;
        soundManager.playFootstep();
      }
    } else {
      footstepTimer.current = 0;
    }

    // State machine
    if (
      animationState !== 'barking' &&
      animationState !== 'sniffing' &&
      animationState !== 'eating' &&
      animationState !== 'sleeping'
    ) {
      if (isInWater) {
        setAnimationState('swimming');
      } else if (!isTouchingGround && jumpCooldownRef.current > 0.1) {
        if (currentLinvel.y > 0.5) {
          setAnimationState('jumping');
        } else {
          setAnimationState('falling');
        }
      } else if (hasInput) {
        if (isSprinting) {
          setAnimationState('sprinting');
        } else if (targetSpeed > 4) {
          setAnimationState('running');
        } else {
          setAnimationState('walking');
        }
      } else {
        setAnimationState('idle');
      }
    }

    setCurrentSpeed(targetSpeed);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 0.4, 0]}
      type="dynamic"
      mass={15}
      friction={0.8}
      restitution={0}
      linearDamping={1.2}
      angularDamping={5}
      ccd
      lockRotations
      enabledRotations={[false, false, false]}
    >
      {/* The rigid body starts at y=0.4, so this centered collider rests at ground level. */}
      <CapsuleCollider args={[0.18, 0.22]} />

      <group ref={characterGroupRef}>
        <DogCharacter
          animationState={animationState}
          speed={currentSpeed}
          customization={customization}
        />
      </group>
    </RigidBody>
  );
}
