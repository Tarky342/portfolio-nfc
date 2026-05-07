"use client";

type SplashProps = {
  isVisible: boolean;
  onUnlock: () => void;
};

export default function Splash({ isVisible, onUnlock }: SplashProps) {
  return (
    <button
      type="button"
      onClick={onUnlock}
      className={`fixed inset-0 z-100 flex cursor-pointer flex-col items-center justify-center bg-[#050503] transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <span className="absolute left-1/2 top-[45%] h-28 w-28 -translate-x-1/2 rounded-full border border-[#d4b87a]/30 animate-ping sm:h-35 sm:w-35" />
      <span className="absolute left-1/2 top-[45%] h-28 w-28 -translate-x-1/2 rounded-full border border-[#d4b87a]/20 animate-ping [animation-delay:1s] sm:h-35 sm:w-35" />
      <span className="absolute left-1/2 top-[45%] h-28 w-28 -translate-x-1/2 rounded-full border border-[#d4b87a]/10 animate-ping [animation-delay:2s] sm:h-35 sm:w-35" />

      <span className="relative z-10 h-40 w-64 animate-[float_4s_ease-in-out_infinite] rounded-sm border border-white/10 bg-linear-to-br from-[#111] to-[#1b1b18] shadow-2xl sm:h-52 sm:w-86" />

      <span className="absolute bottom-10 font-mono text-[9px] uppercase tracking-[0.25em] text-[#d4b87a]/60 animate-pulse sm:bottom-12 sm:text-[10px]">
        tap to unlock
      </span>
    </button>
  );
}
