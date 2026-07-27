export default function TabToggle({ activeTab, onChange }) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => onChange('drivers')}
        className={`px-4 py-2 text-sm font-semibold rounded border transition-colors ${
          activeTab === 'drivers'
            ? 'bg-race-red text-white border-race-red'
            : 'bg-race-card text-race-muted border-race-border hover:text-race-text'
        }`}
      >
        Drivers
      </button>
      <button
        type="button"
        onClick={() => onChange('constructors')}
        className={`px-4 py-2 text-sm font-semibold rounded border transition-colors ${
          activeTab === 'constructors'
            ? 'bg-race-red text-white border-race-red'
            : 'bg-race-card text-race-muted border-race-border hover:text-race-text'
        }`}
      >
        Constructors
      </button>
    </div>
  );
}