'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeDCharacterProps {
  shoulderHeight: number;
  isRunning: boolean;
  phaseDuration: number;
}

export function ThreeDCharacter({ shoulderHeight, isRunning, phaseDuration }: ThreeDCharacterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterRef = useRef<THREE.Group | null>(null);
  const shouldersRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;

    try {
      // Scene setup
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf8fafb);
      sceneRef.current = scene;

      // Camera setup
      camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
      camera.position.z = 2;
      cameraRef.current = camera;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      containerRef.current.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (error) {
      console.log('WebGL not supported, using fallback');
      setWebglSupported(false);
      return;
    }

    if (!scene || !camera || !renderer) return;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Create character group
    const character = new THREE.Group();
    characterRef.current = character;
    scene.add(character);

    // Head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xf4a460 }); // Skin tone
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.2;
    head.castShadow = true;
    character.add(head);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.3, 0.8, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4f8ff7 }); // Blue shirt
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.3;
    body.castShadow = true;
    character.add(body);

    // Shoulders group (for animation)
    const shoulders = new THREE.Group();
    shouldersRef.current = shoulders;
    shoulders.position.y = 0.7;
    character.add(shoulders);

    // Left shoulder
    const leftShoulderGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const shoulderMaterial = new THREE.MeshPhongMaterial({ color: 0x64b5f6 }); // Lighter blue
    const leftShoulder = new THREE.Mesh(leftShoulderGeometry, shoulderMaterial);
    leftShoulder.position.x = -0.35;
    leftShoulder.castShadow = true;
    shoulders.add(leftShoulder);

    // Right shoulder
    const rightShoulder = new THREE.Mesh(leftShoulderGeometry, shoulderMaterial);
    rightShoulder.position.x = 0.35;
    rightShoulder.castShadow = true;
    shoulders.add(rightShoulder);

    // Left arm
    const armGeometry = new THREE.CylinderGeometry(0.08, 0.06, 0.7, 16);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xf4a460 }); // Skin tone
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.x = -0.4;
    leftArm.position.y = -0.3;
    leftArm.castShadow = true;
    shoulders.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.x = 0.4;
    rightArm.position.y = -0.3;
    rightArm.castShadow = true;
    shoulders.add(rightArm);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate character slightly for better view
      character.rotation.y = Math.sin(Date.now() * 0.0001) * 0.15;

      // Update shoulder height based on animation prop
      if (shouldersRef.current) {
        shouldersRef.current.position.y = 0.7 + shoulderHeight * 0.15; // Scale the movement
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer?.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, [shoulderHeight]);

  // Update shoulder height
  useEffect(() => {
    if (shouldersRef.current) {
      shouldersRef.current.position.y = 0.7 + shoulderHeight * 0.15;
    }
  }, [shoulderHeight]);

  if (!webglSupported) {
    return (
      <div style={{ width: '100%', height: '320px' }} className="flex items-center justify-center bg-gradient-to-b from-blue-50 to-cyan-50">
        <div className="text-center">
          <p className="text-gray-600 font-medium">3D Character Loading...</p>
          <p className="text-sm text-gray-500 mt-2">Your browser will render the animation when you run the exercise</p>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} style={{ width: '100%', height: '320px' }} />;
}
