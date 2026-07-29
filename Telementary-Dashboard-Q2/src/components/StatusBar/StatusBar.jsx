export default function StatusBar({
  isConnected,
  isPaused,
  onPause,
  onResume,
  onReset,
}) {
  return (
    <div className="w-full flex items-center justify-between px-4 py-3 bg-surface border-b border-primary-muted/20">
      {/* Left: connection status */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-block h-2.5 w-2.5 rounded-full ${
            isConnected ? "bg-primary" : "bg-critical"
          }`}
        />
        <span
          className={`font-mono text-sm tracking-wider ${
            isConnected ? "text-primary" : "text-critical"
          }`}
        >
          {isConnected ? "LIVE" : "SIGNAL LOST"}
        </span>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPause}
          disabled={isPaused}
          className="font-mono text-sm px-3 py-1.5 rounded border border-warning text-warning
                     hover:bg-warning/10 disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent transition-colors"
        >
          Pause
        </button>

        <button
          type="button"
          onClick={onResume}
          disabled={!isPaused}
          className="font-mono text-sm px-3 py-1.5 rounded border border-primary text-primary
                     hover:bg-primary/10 disabled:opacity-40 disabled:cursor-not-allowed
                     disabled:hover:bg-transparent transition-colors"
        >
          Resume
        </button>

        <button
          type="button"
          onClick={onReset}
          className="font-mono text-sm px-3 py-1.5 rounded border border-critical text-critical
                     hover:bg-critical/10 transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
