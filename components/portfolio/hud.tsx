"use client";

type HudProps = {
  isVisible: boolean;
  hud: {
    name: string;
    subtitle: string;
    hint: string;
  };
};

export default function Hud({ isVisible, hud }: HudProps) {
  return (
    <div
      className={`fixed left-0 right-0 top-0 z-10 flex items-start justify-between px-5 py-5 transition-opacity duration-700 md:px-8 md:py-7 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div>
        <h1 className="font-serif text-[17px] font-light tracking-wide md:text-2xl">
          {hud.name}
        </h1>
        <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.2em] text-[#d4b87a] md:text-[9px]">
          {hud.subtitle}
        </p>
      </div>

      <p className="pt-1 text-right font-mono text-[8px] uppercase tracking-[0.15em] text-white/30 md:text-[9px]">
        {hud.hint.split("\n").map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
    </div>
  );
}
