import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { getRaceSchedule } from '../api/jolpica';
import RaceCard from './RaceCard';
import SessionScheduleModal from './SessionScheduleModal'; // Import new modal

export default function RaceCarousel() {
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCenterIndex, setInitialCenterIndex] = useState(0);
  
  // Track which race's modal is currently open
  const [modalRace, setModalRace] = useState(null);

  useEffect(() => {
    async function fetchCarouselData() {
      try {
        const schedule = await getRaceSchedule();
        const now = new Date();
        
        let centerIdx = schedule.findIndex(r => new Date(r.date) >= now);
        if (centerIdx === -1) centerIdx = schedule.length - 1; 

        let start = Math.max(0, centerIdx - 2);
        let end = Math.min(schedule.length - 1, start + 4);
        
        if (end - start < 4) {
          start = Math.max(0, end - 4);
        }

        const window = schedule.slice(start, end + 1);
        setRaces(window);
        
        const newCenterIdx = window.findIndex(r => r.round === schedule[centerIdx].round);
        setInitialCenterIndex(newCenterIdx);
        
      } catch (err) {
        console.error(err);
        setError('Failed to load race schedule.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCarouselData();
  }, []);

  if (loading) return <div className="text-race-text text-xs font-medium tracking-wide text-center">Loading schedule...</div>;
  if (error) return <div className="text-race-red text-xs font-medium tracking-wide text-center">{error}</div>;

  return (
    <>
      <CarouselView races={races} initialCenterIndex={initialCenterIndex} onOpenModal={setModalRace} />
      
      {/* Modals are rendered here so they overlay the entire viewport correctly */}
      <SessionScheduleModal race={modalRace} onClose={() => setModalRace(null)} />
    </>
  );
}

function CarouselView({ races, initialCenterIndex, onOpenModal }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: 'center', 
    containScroll: false,
    startIndex: initialCenterIndex
  });
  
  const [selectedIndex, setSelectedIndex] = useState(initialCenterIndex);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  // Click Handler with Drag-Protection
  const handleCardClick = useCallback((index, race) => {
    if (!emblaApi) return;
    
    // Safety check: Embla provides .clickAllowed() on older versions. 
    // Embla v8+ cancels clicks natively, but this provides foolproof backward compatibility.
    if (typeof emblaApi.clickAllowed === 'function' && !emblaApi.clickAllowed()) return;

    if (index === selectedIndex) {
      // If centered card is clicked, open the session modal
      onOpenModal(race);
    } else {
      // If an off-center card is clicked, smoothly scroll it into focus
      emblaApi.scrollTo(index);
    }
  }, [emblaApi, selectedIndex, onOpenModal]);

  return (
    <div className="relative w-full max-w-7xl mx-auto group">
      <div className="overflow-hidden py-1" ref={emblaRef}>
        {/* Height bumped slightly to accommodate the CTA button cleanly */}
        <div className="flex touch-pan-y h-40 md:h-48">
          {races.map((race, index) => (
            <div 
              key={race.round} 
              className="flex-[0_0_80%] md:flex-[0_0_42%] min-w-0 cursor-pointer"
              onClick={() => handleCardClick(index, race)}
            >
              <RaceCard race={race} isCenter={index === selectedIndex} />
            </div>
          ))}
        </div>
      </div>

      <button 
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-race-bg/80 border border-race-border text-race-text hover:text-race-red hover:border-race-red transition-all z-20 backdrop-blur-sm shadow-xl opacity-0 group-hover:opacity-100 disabled:opacity-0 cursor-pointer text-xs"
        disabled={selectedIndex === 0}
      >
        &#8592;
      </button>
      <button 
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-race-bg/80 border border-race-border text-race-text hover:text-race-red hover:border-race-red transition-all z-20 backdrop-blur-sm shadow-xl opacity-0 group-hover:opacity-100 disabled:opacity-0 cursor-pointer text-xs"
        disabled={selectedIndex === races.length - 1}
      >
        &#8594;
      </button>
    </div>
  );
}