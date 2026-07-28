export default function ScrollButton() {
  const handleScroll = () => {
    // Smoothly scroll down to the standings section
    document.getElementById('standings')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes gentle-wobble {
          0%, 100% { transform: translate(-50%, 0); }
          50% { transform: translate(-50%, -6px); }
        }
        .animate-gentle-wobble {
          animation: gentle-wobble 2s ease-in-out infinite;
        }
      `}</style>
      
      <button
        onClick={handleScroll}
        aria-label="Scroll to standings and circuit details"
        className="absolute bottom-6 left-1/2 px-4 py-2 flex items-center gap-2 rounded-full bg-race-card/90 backdrop-blur-md border border-race-border text-race-text hover:text-race-red hover:border-race-red transition-all animate-gentle-wobble cursor-pointer shadow-xl z-30"
      >
        <span className="text-[10px] md:text-xs font-bold tracking-wider uppercase">
          Standings / Circuit
        </span>
        <svg className="w-4 h-4 text-race-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </>
  );
}