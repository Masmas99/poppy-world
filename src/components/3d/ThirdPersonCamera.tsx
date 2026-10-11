'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from '@/store/useGameStore';

interface ThirdPersonCameraProps {
  targetPosition: THREE.Vector3;
}

export function ThirdPersonCamera({ targetPosition }: ThirdPersonCameraProps) {
  const { camera, gl, scene } = useThree();
  const gameState = useGameStore((s) => s.gameState);
  const sensitivity = useGameStore((s) => s.settings.cameraSensitivity);

  // Spherical camera orbit angles
  const yaw = useRef<number>(0); // Horizontal angle
  const pitch = useRef<number>(0.32); // Vertical angle (in radians)
  const distance = useRef<number>(4.8); // Ideal distance behind puppy
  const smoothedTarget = useRef<THREE.Vector3>(new THREE.Vector3(0, 1, 0));
  const cameraRay = useRef(new THREE.Raycaster());
  const cameraDirection = useRef(new THREE.Vector3());
  const isDragging = useRef<boolean>(false);
  const prevMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Mouse & Touch Orbit Controls
  useEffect(() => {
    const canvas = gl.domElement;

    const onMouseDown = (e: MouseEvent) => {
      // Only drag if left or right click
      if (e.button === 0 || e.button === 2) {
        isDragging.current = true;
        prevMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || gameState !== 'playing') return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      const factor = 0.0035 * sensitivity;
      yaw.current -= dx * factor;
      pitch.current += dy * factor;

      // Pitch clamps: avoid flipping under ground or directly overhead
      pitch.current = Math.max(0.08, Math.min(Math.PI / 2.3, pitch.current));
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      if (gameState !== 'playing') return;
      distance.current = Math.max(2.8, Math.min(7.5, distance.current + e.deltaY * 0.003));
    };

    // Touch controls for camera rotation on non-joystick areas
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        // If touch is on right half of screen, use for camera
        if (touch.clientX > window.innerWidth * 0.35) {
          touchStartX = touch.clientX;
          touchStartY = touch.clientY;
        }
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (gameState !== 'playing' || e.touches.length !== 1) return;
      const touch = e.touches[0];
      if (touch.clientX > window.innerWidth * 0.35) {
        const dx = touch.clientX - touchStartX;
        const dy = touch.clientY - touchStartY;
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;

        const factor = 0.0045 * sensitivity;
        yaw.current -= dx * factor;
        pitch.current += dy * factor;
        pitch.current = Math.max(0.08, Math.min(Math.PI / 2.3, pitch.current));
      }
    };

    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: true });

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
    };
  }, [gl, gameState, sensitivity]);

  useFrame((state, delta) => {
    if (!targetPosition) return;

    // Smoothly follow dog position with dampening (especially on Y to absorb jumps)
    smoothedTarget.current.x = THREE.MathUtils.lerp(smoothedTarget.current.x, targetPosition.x, delta * 8);
    smoothedTarget.current.y = THREE.MathUtils.lerp(smoothedTarget.current.y, targetPosition.y + 0.65, delta * 6);
    smoothedTarget.current.z = THREE.MathUtils.lerp(smoothedTarget.current.z, targetPosition.z, delta * 8);

    // Calculate desired camera position using spherical coordinates
    const curDist = distance.current;
    const curPitch = pitch.current;
    const curYaw = yaw.current;

    const offsetX = curDist * Math.sin(curYaw) * Math.cos(curPitch);
    const offsetY = curDist * Math.sin(curPitch);
    const offsetZ = curDist * Math.cos(curYaw) * Math.cos(curPitch);

    const desiredCamPos = new THREE.Vector3(
      smoothedTarget.current.x + offsetX,
      Math.max(0.4, smoothedTarget.current.y + offsetY), // Ensure camera doesn't dip under ground
      smoothedTarget.current.z + offsetZ
    );

    // Keep terrain between the puppy and camera from hiding the character.
    cameraDirection.current.copy(desiredCamPos).sub(smoothedTarget.current);
    const cameraDistance = cameraDirection.current.length();
    cameraDirection.current.normalize();
    cameraRay.current.set(smoothedTarget.current, cameraDirection.current);
    cameraRay.current.near = 0.15;
    cameraRay.current.far = cameraDistance;
    const terrain = [
      scene.getObjectByName('world-ground'),
      scene.getObjectByName('windmill-hill'),
    ].filter((object): object is THREE.Object3D => object !== undefined);
    const obstruction = cameraRay.current.intersectObjects(terrain, false)[0];
    if (obstruction) {
      desiredCamPos.copy(smoothedTarget.current).addScaledVector(
        cameraDirection.current,
        Math.max(0.5, obstruction.distance - 0.25)
      );
    }

    // Keep the camera above the global ground plane.
    if (desiredCamPos.y < 0.5) {
      desiredCamPos.y = 0.5;
    }

    // Smoothly move camera
    camera.position.lerp(desiredCamPos, delta * 10);
    camera.lookAt(smoothedTarget.current);
  });

  return null;
}
