"use client";

import type { GalleryPanel } from "@/components/portfolio/types";

type PanelLabelProps = {
  isVisible: boolean;
  isMobile: boolean;
  activeIndex: number;
  total: number;
  panel: GalleryPanel;
};

export default function PanelLabel({
  isVisible,
  isMobile,
  activeIndex,
  total,
  panel,
}: PanelLabelProps) {
  const label = `${String(activeIndex + 1).padStart(2, "0")} / ${String(
    total,
  ).padStart(2, "0")}`;

  return (
    <>
      <div
        className={`fixed bottom-18 left-8 z-10 hidden transition-opacity duration-300 md:block ${
          isVisible && !isMobile ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[#d4b87a]">
          {label}
        </div>
        <div className="font-serif text-[28px] font-light tracking-[0.04em]">
          {panel.title}
        </div>
        <p className="mt-3 max-w-65 font-serif text-[13px] leading-6 text-white/50">
          {panel.short}
        </p>
      </div>

      <div
        className={`fixed left-0 top-1/2 z-10 block -translate-y-1/2 transition-opacity duration-300 md:hidden ${
          isVisible && isMobile ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="min-w-20 rounded-r-md border-r border-[#d4b87a]/20 bg-white/4 px-4 py-5 backdrop-blur-md">
          <div className="mb-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#d4b87a]">
            {label}
          </div>
          <div className="max-w-13 break-all font-serif text-xl font-light leading-tight">
            {panel.title}
          </div>
        </div>
      </div>
    </>
  );
}
