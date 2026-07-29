import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CarouselContainer({ children, className }) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -containerRef.current.offsetWidth + 150 : containerRef.current.offsetWidth - 150;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative group">
      <button 
        onClick={(e) => { e.preventDefault(); scroll('left'); }}
        className="absolute -left-4 md:-left-8 top-[40%] -translate-y-1/2 z-20 bg-black/70 hover:bg-primary text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div 
        ref={containerRef}
        className={`flex overflow-x-auto hide-scrollbar scroll-smooth ${className || ''}`}
      >
        {children}
      </div>

      <button 
        onClick={(e) => { e.preventDefault(); scroll('right'); }}
        className="absolute -right-4 md:-right-8 top-[40%] -translate-y-1/2 z-20 bg-black/70 hover:bg-primary text-white p-2 md:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
