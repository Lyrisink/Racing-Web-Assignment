import StandingsTable from './StandingsTable';

export default function StandingsSection() {
  return (
    <section className="pt-8 border-t border-race-border">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Circuit Detail Placeholder (~30%) */}
        <div className="md:col-span-4 bg-race-card border border-race-border rounded-xl p-6 min-h-[320px] flex items-center justify-center text-race-muted font-semibold uppercase tracking-wider text-xs border-dashed">
          Circuit Detail
        </div>

        {/* Right Column: Standings Table (~70%) */}
        <div className="md:col-span-8">
          <StandingsTable type="drivers" />
        </div>
      </div>
    </section>
  );
}