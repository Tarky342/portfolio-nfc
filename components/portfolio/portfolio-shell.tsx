"use client";

import CanvasStage from "@/components/portfolio/canvas-stage";
import DotsNav from "@/components/portfolio/dots-nav";
import Hud from "@/components/portfolio/hud";
import Loading from "@/components/portfolio/loading";
import Overlay from "@/components/portfolio/overlay";
import PanelLabel from "@/components/portfolio/panel-label";
import Splash from "@/components/portfolio/splash";
import type { GalleryHud, GalleryPanel } from "@/components/portfolio/types";
import { useEffect, useMemo, useRef, useState } from "react";

type PortfolioShellProps = {
  panels: GalleryPanel[];
  hud: GalleryHud;
  splashImageUrl: string;
};

export default function PortfolioShell({
  panels,
  hud,
  splashImageUrl,
}: PortfolioShellProps) {
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [jumpIndex, setJumpIndex] = useState<number | null>(null);
  const [overlayIndex, setOverlayIndex] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const progressRef = useRef(0);

  const activePanel: GalleryPanel | null = useMemo(() => {
    if (!panels.length) return null;
    return panels[Math.min(activeIndex, panels.length - 1)];
  }, [activeIndex, panels]);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth <= 768);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    if (!loading) return;

    progressRef.current = 0;
    setProgress(0);

    const interval = window.setInterval(() => {
      progressRef.current = Math.min(
        100,
        progressRef.current + 1.5 + Math.random() * 2,
      );
      setProgress(progressRef.current);

      if (progressRef.current >= 100) {
        window.clearInterval(interval);
        window.setTimeout(() => {
          setLoading(false);
          setReady(true);
        }, 400);
      }
    }, 40);

    return () => window.clearInterval(interval);
  }, [loading]);

  const handleUnlock = () => {
    if (unlocked) return;
    setFlash(true);
    window.setTimeout(() => setFlash(false), 120);
    window.setTimeout(() => {
      setUnlocked(true);
      setLoading(true);
    }, 300);
  };

  const handleSelectPanel = (index: number) => {
    setActiveIndex(index);
  };

  const handleJumpToIndex = (index: number) => {
    setActiveIndex(index);
    setJumpIndex(index);
  };

  const handleOpenOverlay = (index: number) => {
    setOverlayIndex(index);
  };

  const handleCloseOverlay = () => {
    setOverlayIndex(null);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#050503] text-[#f7f6f2]">
      <div
        id="scan-flash"
        className={`pointer-events-none fixed inset-0 z-200 bg-[#d4b87a] transition-opacity duration-100 ${
          flash ? "opacity-100" : "opacity-0"
        }`}
      />

      <Splash
        isVisible={!unlocked}
        onUnlock={handleUnlock}
        imageUrl={splashImageUrl}
      />
      <Loading isVisible={loading} progress={progress} />

      <section className="relative min-h-screen">
        <CanvasStage
          panels={panels}
          isReady={ready}
          isMobile={isMobile}
          activeIndex={activeIndex}
          jumpIndex={jumpIndex}
          onActiveIndexChange={handleSelectPanel}
          onSelectPanel={handleOpenOverlay}
          onJumpComplete={() => setJumpIndex(null)}
          isFrozen={overlayIndex !== null}
        />
        <Hud isVisible={ready} hud={hud} />
        {activePanel ? (
          <>
            <PanelLabel
              isVisible={ready}
              isMobile={isMobile}
              activeIndex={activeIndex}
              total={panels.length}
              panel={activePanel}
            />
            <DotsNav
              isVisible={ready}
              activeIndex={activeIndex}
              total={panels.length}
              onSelect={handleJumpToIndex}
            />
          </>
        ) : null}
      </section>

      <Overlay
        isOpen={overlayIndex !== null}
        panel={overlayIndex !== null ? panels[overlayIndex] : null}
        onClose={handleCloseOverlay}
      />
    </main>
  );
}
