"use client";

import type { GalleryPanel } from "@/components/portfolio/types";
import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type CanvasStageProps = {
  panels: GalleryPanel[];
  isReady: boolean;
  isMobile: boolean;
  activeIndex: number;
  jumpIndex: number | null;
  onActiveIndexChange: (index: number) => void;
  onSelectPanel: (index: number) => void;
  onJumpComplete: () => void;
  isFrozen?: boolean;
};

type SceneConfig = {
  spacingX: number;
  panelWidth: number;
  panelHeight: number;
  camZ: number;
  wallAngleY: number;
  lerpSpeed: number;
  snapDelay: number;
};

const desktopConfig: SceneConfig = {
  spacingX: 46,
  panelWidth: 19,
  panelHeight: 11.5,
  camZ: 28,
  wallAngleY: -0.22,
  lerpSpeed: 0.065,
  snapDelay: 180,
};

const mobileConfig: SceneConfig = {
  spacingX: 32,
  panelWidth: 6,
  panelHeight: 3.6,
  camZ: 20,
  wallAngleY: -0.06,
  lerpSpeed: 0.08,
  snapDelay: 140,
};

function PanelFrame({
  panel,
  index,
  spacing,
  panelWidth,
  panelHeight,
  onSelect,
}: {
  panel: GalleryPanel;
  index: number;
  spacing: number;
  panelWidth: number;
  panelHeight: number;
  onSelect: (index: number) => void;
}) {
  const map = useTexture(panel.image);
  const framePadding = panelWidth * 0.05;
  const frameW = panelWidth + framePadding;
  const frameH = panelHeight + framePadding;

  return (
    <group position={[index * spacing, 0, 0]}>
      <mesh position={[0, 0, -0.27]}>
        <boxGeometry args={[frameW + 0.1, frameH + 0.1, 0.05]} />
        <meshStandardMaterial
          color="#d4b87a"
          metalness={0.7}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0, -0.14]}>
        <boxGeometry args={[frameW, frameH, 0.25]} />
        <meshStandardMaterial
          color="#2a241d"
          roughness={0.7}
          metalness={0.15}
        />
      </mesh>
      <mesh
        onClick={() => onSelect(index)}
        onPointerOver={() => (document.body.style.cursor = "pointer")}
        onPointerOut={() => (document.body.style.cursor = "default")}
      >
        <planeGeometry args={[panelWidth, panelHeight]} />
        <meshBasicMaterial map={map} toneMapped={false} />
      </mesh>
    </group>
  );
}

function GalleryScene({
  panels,
  config,
  activeIndex,
  onActiveIndexChange,
  onSelectPanel,
  jumpIndex,
  onJumpComplete,
  isFrozen,
}: {
  panels: GalleryPanel[];
  config: SceneConfig;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onSelectPanel: (index: number) => void;
  jumpIndex: number | null;
  onJumpComplete: () => void;
  isFrozen?: boolean;
}) {
  const galleryRef = useRef<THREE.Group>(null);
  const currentScroll = useRef(0);
  const targetScroll = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const snapTimer = useRef<number | null>(null);
  const totalWidth = panels.length * config.spacingX;

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (isFrozen) return;
      targetScroll.current += event.deltaY * 0.1;
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
      snapTimer.current = window.setTimeout(() => {
        const next = Math.round(targetScroll.current / config.spacingX);
        targetScroll.current = next * config.spacingX;
      }, config.snapDelay);
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    let touchStart = 0;
    const handleTouchStart = (event: TouchEvent) => {
      if (isFrozen) return;
      touchStart = event.touches[0].clientX;
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
    const handleTouchMove = (event: TouchEvent) => {
      if (isFrozen) return;
      const diff = touchStart - event.touches[0].clientX;
      targetScroll.current += diff * 0.55;
      touchStart = event.touches[0].clientX;
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
    const handleTouchEnd = () => {
      if (isFrozen) return;
      const next = Math.round(targetScroll.current / config.spacingX);
      targetScroll.current = next * config.spacingX;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [config, isFrozen]);

  useEffect(() => {
    if (jumpIndex === null) return;
    targetScroll.current = jumpIndex * config.spacingX;
    onJumpComplete();
  }, [config.spacingX, jumpIndex, onJumpComplete]);

  useFrame((state) => {
    const camera = state.camera as THREE.PerspectiveCamera;
    currentScroll.current +=
      (targetScroll.current - currentScroll.current) * config.lerpSpeed;

    const xMove = currentScroll.current * Math.cos(config.wallAngleY);
    const zMove = currentScroll.current * Math.sin(config.wallAngleY);
    camera.position.x = xMove;
    camera.position.z = config.camZ - zMove;

    const tiltFactor = config.wallAngleY < -0.1 ? 0.04 : 0.015;
    camera.rotation.x = mouse.current.y * tiltFactor;
    camera.rotation.y = -mouse.current.x * tiltFactor + config.wallAngleY * 0.1;

    const index =
      ((Math.round(currentScroll.current / config.spacingX) % panels.length) +
        panels.length) %
      panels.length;
    if (index !== activeIndex) onActiveIndexChange(index);

    if (galleryRef.current) {
      galleryRef.current.rotation.y = config.wallAngleY;
      galleryRef.current.position.x = config.wallAngleY < -0.1 ? 7 : 2;

      galleryRef.current.children.forEach((child, idx) => {
        const origX = idx * config.spacingX;
        const dist = currentScroll.current - origX;
        const shift = Math.round(dist / totalWidth) * totalWidth;
        child.position.x = origX + shift;
      });
    }
  });

  return (
    <group ref={galleryRef}>
      {panels.map((panel, index) => (
        <PanelFrame
          key={panel.id}
          panel={panel}
          index={index}
          spacing={config.spacingX}
          panelWidth={config.panelWidth}
          panelHeight={config.panelHeight}
          onSelect={onSelectPanel}
        />
      ))}
    </group>
  );
}

export default function CanvasStage({
  panels,
  isReady,
  isMobile,
  activeIndex,
  jumpIndex,
  onActiveIndexChange,
  onSelectPanel,
  onJumpComplete,
  isFrozen,
}: CanvasStageProps) {
  const config = useMemo(
    () => (isMobile ? mobileConfig : desktopConfig),
    [isMobile],
  );

  if (panels.length === 0) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-1 transition-opacity duration-1000 ${
        isReady ? "opacity-100" : "opacity-0"
      }`}
    >
      <Canvas
        gl={{ antialias: true }}
        dpr={[1, 2]}
        camera={{ fov: 44, position: [0, 0, config.camZ] }}
      >
        <color attach="background" args={["#0f0f0c"]} />
        <fog attach="fog" args={["#0f0f0c", 40, 160]} />
        <ambientLight intensity={0.55} />
        <directionalLight
          position={[8, 16, 12]}
          intensity={0.9}
          color="#fff2d6"
        />
        <directionalLight
          position={[-12, -8, 8]}
          intensity={0.25}
          color="#9fb4ff"
        />
        <GalleryScene
          panels={panels}
          config={config}
          activeIndex={activeIndex}
          onActiveIndexChange={onActiveIndexChange}
          onSelectPanel={onSelectPanel}
          jumpIndex={jumpIndex}
          onJumpComplete={onJumpComplete}
          isFrozen={isFrozen}
        />
      </Canvas>
    </div>
  );
}
