"use client";

import type { GalleryPanel } from "@/components/portfolio/types";
import { AnimatePresence, motion } from "motion/react";

type OverlayProps = {
  isOpen: boolean;
  panel: GalleryPanel | null;
  onClose: () => void;
};

export default function Overlay({ isOpen, panel, onClose }: OverlayProps) {
  return (
    <AnimatePresence>
      {isOpen && panel ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          onClick={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            className="relative max-h-[88vh] w-[min(520px,90vw)] overflow-y-auto border border-[#d4b87a]/20 bg-[#0e0e09] p-6 md:p-12"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[#d4b87a]/60 transition-colors hover:text-[#d4b87a]"
            >
              close
            </button>

            <div className="mb-4 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d4b87a]">
              {panel.tag}
            </div>

            <h2 className="mb-3 font-serif text-2xl font-light md:text-4xl">
              {panel.title}
            </h2>

            <p className="mb-8 font-serif text-[14px] leading-7 text-white/60 md:text-[15px]">
              {panel.description}
            </p>

            <div className="mb-8 flex flex-wrap gap-3">
              {panel.chips.map((chip) => (
                <span
                  key={chip}
                  className="border border-[#d4b87a]/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.15em] text-[#d4b87a]/80"
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {panel.cta.map((cta) => (
                <a
                  key={cta.label}
                  href={cta.href}
                  className={
                    cta.primary
                      ? "bg-[#d4b87a] px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black"
                      : "border border-white/15 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60"
                  }
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
