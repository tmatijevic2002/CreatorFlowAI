import { Event } from '../types';
import { MapPin, Clock, Tag, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

interface EventCardProps {
  key?: string | number;
  event: Event;
  onLearnMore: (event: Event) => void;
}

const categoryColors = {
  Concert: 'bg-indigo-600 text-white border-transparent',
  Festival: 'bg-amber-400 text-slate-900 border-transparent',
  Exhibition: 'bg-emerald-500 text-white border-transparent',
  Social: 'bg-purple-600 text-white border-transparent',
  Other: 'bg-slate-200 text-slate-600 border-transparent',
};

export default function EventCard({ event, onLearnMore }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, shadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
      className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm transition-all duration-300 group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-6">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border shadow-sm ${categoryColors[event.category] || categoryColors.Other}`}>
          {event.category || 'Drugi'}
        </span>
        <div className="bg-slate-100 p-2 rounded-xl text-slate-400 group-hover:text-rijeka-blue transition-colors">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-2xl font-black tracking-tight text-slate-900 mb-4 leading-tight line-clamp-2 uppercase group-hover:text-rijeka-blue transition-colors font-display">
        {event.eventName}
      </h3>

      <div className="space-y-3 mb-8">
        <div className="flex items-center text-sm font-bold text-slate-500">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
            <MapPin className="w-4 h-4 text-rijeka-blue" />
          </div>
          {event.venue}
        </div>
        <div className="flex items-center text-sm font-bold text-slate-400">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center mr-3">
            <Clock className="w-4 h-4" />
          </div>
          {event.time || 'Cijeli dan'}
        </div>
      </div>

      <p className="text-sm font-medium text-slate-500 leading-relaxed mb-8 line-clamp-3">
        {event.description}
      </p>

      {event.source && (
        <div className="mb-6 flex items-center text-[10px] font-black uppercase tracking-widest text-indigo-400">
          <ExternalLink className="w-3 h-3 mr-2" />
          Izvor: {event.source.startsWith('http') ? new URL(event.source).hostname.replace('www.', '') : event.source}
        </div>
      )}

      <div className="mt-auto">
        <button 
          onClick={() => onLearnMore(event)}
          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rijeka-blue transition-all active:scale-95"
        >
          Saznaj više
        </button>
      </div>
    </motion.div>
  );
}
