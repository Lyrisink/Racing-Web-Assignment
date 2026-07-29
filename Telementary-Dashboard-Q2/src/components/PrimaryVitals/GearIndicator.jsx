// Vertical equalizer-style gear indicator.
// Segments from the bottom up to `currentGear` are lit; the rest are dim.
export default function GearIndicator({ currentGear, maxGear = 5 }) {
  // Bottom-to-top order: [1, 2, 3, ..., maxGear]. Combined with
  // flex-col-reverse, gear 1 renders at the bottom, maxGear at the top.
  const segments = Array.from({ length: maxGear }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-col-reverse gap-1">
        {segments.map((gearNum) => {
          const lit = gearNum <= currentGear;
          return (
            <div
              key={gearNum}
              className={`w-8 h-3 rounded-sm transition-colors duration-200 ${
                lit ? "bg-primary" : "bg-surface border border-text-secondary/30"
              }`}
            />
          );
        })}
      </div>
      <span className="font-mono text-xs tracking-wider text-text-secondary uppercase">
        Gear
      </span>
      <span className="font-mono text-2xl font-bold text-text-primary -mt-1">
        {currentGear}
      </span>
    </div>
  );
}
