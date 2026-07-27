export default function SearchBar({ value, onChange }) {
  return (
    <div className="w-full sm:w-64">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or team..."
        className="w-full px-3 py-2 bg-race-bg border border-race-border rounded text-race-text placeholder-race-muted text-sm focus:outline-none focus:border-race-red"
      />
    </div>
  );
}