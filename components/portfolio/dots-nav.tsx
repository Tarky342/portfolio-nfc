"use client";

type DotsNavProps = {
  isVisible: boolean;
  total: number;
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function DotsNav({
  isVisible,
  total,
  activeIndex,
  onSelect,
}: DotsNavProps) {
  return (
    <div
      className={`fixed bottom-7 left-1/2 z-10 flex -translate-x-1/2 gap-2 transition-opacity duration-700 md:bottom-9 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-2 rounded-full transition-all duration-300 md:h-1.5 ${
              isActive
                ? "w-6 bg-[#d4b87a]"
                : "w-2 bg-white/25 hover:bg-white/50 md:w-1.5"
            }`}
            aria-label={`Go to panel ${index + 1}`}
          />
        );
      })}
    </div>
  );
}
