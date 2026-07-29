// Reusable vertical meter bar — used for both THROTTLE and BRAKE.
// Fill grows from the bottom up as `value` increases (0-100).
export default function MeterBar({ label, value, colorClass = "bg-primary" }) {
  const clamped = Math.max(0, Math.min(100, value));

  // Intensity effect: regardless of the base colorClass, the bar shifts
  // toward warning/critical tones as the value climbs (useful for brake
  // pressure especially, but works fine for throttle too).
  let fillClass = colorClass;
  if (clamped >= 85) {
    fillClass = "bg-critical";
  } else if (clamped >= 60) {
    fillClass = "bg-warning";
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-6 h-32 bg-surface rounded overflow-hidden border border-text-secondary/20">
        <div
          className={`absolute bottom-0 left-0 w-full rounded transition-[height,background-color] duration-300 ease-out ${fillClass}`}
          style={{ height: `${clamped}%` }}
        />
      </div>
      <span className="font-mono text-xs tracking-wider text-text-secondary uppercase">
        {label}
      </span>
      <span className="font-mono text-sm font-bold text-text-primary -mt-1">
        {Math.round(clamped)}
      </span>
    </div>
  );
}
