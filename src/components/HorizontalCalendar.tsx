import { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { format, addDays, startOfToday, isSameDay, eachDayOfInterval } from 'date-fns';
import { hr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function HorizontalCalendar({ selectedDate, onDateChange }: HorizontalCalendarProps) {
  const today = startOfToday();
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: today,
      end: addDays(today, 30), // Show next 30 days
    });
  }, [today]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-1.5 bg-slate-100 rounded-[1.5rem] border border-slate-200 shadow-inner">
      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 no-scrollbar scroll-smooth p-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, today);
          
          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`flex-shrink-0 flex flex-col items-center justify-center px-4 py-2 rounded-xl transition-all duration-200 ${
                isSelected 
                  ? 'bg-white text-rijeka-blue shadow-sm border border-slate-200' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-widest leading-none mb-1">
                {format(day, 'EEE', { locale: hr })}
              </span>
              <span className={`text-sm font-black ${isSelected ? 'text-slate-900' : ''}`}>
                {format(day, 'dd.MM.')}
              </span>
              {isToday && !isSelected && (
                <div className="w-1 h-1 bg-rijeka-blue rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
