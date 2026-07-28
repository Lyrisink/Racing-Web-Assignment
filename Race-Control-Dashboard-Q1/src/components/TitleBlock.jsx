export default function TitleBlock() {
  return (
    // Added a slight negative top margin and bottom margin to push it up naturally
    <div className="py-1 flex flex-col items-center text-center mt-[-1rem] md:mt-[-2rem] mb-2 md:mb-4">
      <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-widest leading-none drop-shadow-2xl text-race-text">
        <span className="text-race-red">APEX</span> F1
      </h1>
      <p className="mt-2 text-race-text/90 font-medium tracking-wider text-xs md:text-sm drop-shadow-md max-w-xl">
        Championship Standings & Live Telemetry
      </p>
    </div>
  );
}