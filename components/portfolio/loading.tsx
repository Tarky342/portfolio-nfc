"use client";

type LoadingProps = {
  isVisible: boolean;
  progress: number;
};

export default function Loading({ isVisible, progress }: LoadingProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 z-90 flex items-center justify-center bg-[#050503] transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="w-40 md:w-50">
        <div className="mb-3 text-center font-mono text-[9px] uppercase tracking-[0.3em] text-[#d4b87a]/60">
          loading portfolio
        </div>
        <div className="h-px overflow-hidden bg-[#d4b87a]/20">
          <div
            className="h-full bg-[#d4b87a] transition-[width] duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
