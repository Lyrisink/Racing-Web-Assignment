export default function PrimaryVitals({ speed, rpm, redlineRpm, criticalRpm }) {
  const rpmColorClass =
    rpm > criticalRpm
      ? "text-critical"
      : rpm > redlineRpm
      ? "text-warning"
      : "text-primary";

  return (
    <div className="flex items-center justify-between gap-6 px-4 py-4 bg-surface rounded">
      {/* Speed */}
      <div className="flex flex-col items-center">
        <span className="font-mono text-5xl font-bold text-text-primary leading-none">
          {speed}
        </span>
        <span className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase">
          Speed (km/h)
        </span>
      </div>

      {/* RPM */}
      <div className="flex flex-col items-center">
        <span
          className={`font-mono text-5xl font-bold leading-none transition-colors ${rpmColorClass}`}
        >
          {rpm}
        </span>
        <span className="mt-1 font-mono text-xs tracking-wider text-text-secondary uppercase">
          RPM
        </span>
      </div>
    </div>
  );
}
