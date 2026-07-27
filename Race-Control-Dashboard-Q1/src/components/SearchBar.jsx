export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search name or team..."
        className="w-full px-3.5 py-2 bg-race-bg border border-race-border rounded-lg text-race-text placeholder-race-muted text-xs font-medium focus:outline-none focus:border-race-red focus:ring-1 focus:ring-race-red transition-all duration-150"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-race-muted hover:text-race-text text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}