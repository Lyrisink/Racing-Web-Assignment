export default function RaceCard({ race, isCenter }) {
  const dateStr = new Date(race.date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div 
      className={`
        relative p-3 md:p-4 rounded-xl border border-race-border bg-race-card/90 backdrop-blur-md
        flex flex-col items-center text-center mx-2 h-full justify-center gap-1
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isCenter ? 'scale-100 opacity-100 z-10 shadow-2xl shadow-black/60' : 'scale-[0.85] opacity-60 z-0 hover:opacity-80'}
      `}
    >
      <span className="text-race-red font-bold text-[10px] md:text-xs tracking-widest uppercase">
        Round {race.round}
      </span>
      <h3 className="text-lg md:text-2xl font-black text-race-text uppercase leading-tight drop-shadow-sm">
        {race.name}
      </h3>
      <p className="text-race-muted font-medium text-[10px] md:text-xs">
        {race.circuit}
      </p>
      <div className="bg-race-bg px-3 py-1 rounded-full border border-race-border inline-block shadow-inner mt-1">
        <span className="text-race-text text-[10px] md:text-xs font-semibold tracking-wider uppercase">
          {dateStr} • {race.country}
        </span>
      </div>
    </div>
  );
}