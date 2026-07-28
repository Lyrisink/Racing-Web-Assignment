import HeaderBar from './HeaderBar';
import TitleBlock from './TitleBlock';
import heroBg from '../assets/hero-bg.jpg';

export default function Hero() {
  return (
    <section 
      className="relative w-full bg-cover bg-center bg-no-repeat border-b border-race-border"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--color-race-bg) 15%, transparent 100%),
          linear-gradient(to top, var(--color-race-bg) 0%, transparent 30%),
          url(${heroBg})
        `
      }}
    >
      {/* Constrain content width to match the rest of the dashboard */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col min-h-[400px]">
        <HeaderBar />
        
        {/* Flex-1 pushes the TitleBlock into the remaining vertical space */}
        <div className="flex-1 flex flex-col justify-center">
          <TitleBlock />
        </div>
      </div>
    </section>
  );
}