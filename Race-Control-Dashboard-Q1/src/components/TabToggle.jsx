export default function TabToggle({ activeTab, onChange }) {
  return (
    <div className="inline-flex p-1 bg-race-bg rounded-lg border border-race-border">
      <button
        type="button"
        onClick={() => onChange('drivers')}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-150 ${
          activeTab === 'drivers'
            ? 'bg-race-red text-white shadow-sm'
            : 'text-race-muted hover:text-race-text'
        }`}
      >
        Drivers
      </button>
      <button
        type="button"
        onClick={() => onChange('constructors')}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md transition-all duration-150 ${
          activeTab === 'constructors'
            ? 'bg-race-red text-white shadow-sm'
            : 'text-race-muted hover:text-race-text'
        }`}
      >
        Constructors
      </button>
    </div>
  );
}