import StandingsTable from './StandingsTable';
import CircuitDetail from './CircuitDetail';

export default function StandingsSection() {
  return (
    <section className="pt-8 border-t border-race-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Natural content height dictates the row height */}
        <div className="md:col-span-4">
          <CircuitDetail />
        </div>

        {/* Right Column: Relative positioning container */}
        <div className="md:col-span-8 relative min-h-[500px] md:min-h-0">
          <StandingsTable type="drivers" />
        </div>
      </div>
    </section>
  );
}