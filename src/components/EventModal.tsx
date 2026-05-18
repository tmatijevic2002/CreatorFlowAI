import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Calendar, ExternalLink, Share2, Bell } from 'lucide-react';
import { Event } from '../types';

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

const categoryColors = {
  Concert: 'bg-indigo-600',
  Festival: 'bg-amber-400',
  Exhibition: 'bg-emerald-500',
  Social: 'bg-purple-600',
  Other: 'bg-slate-400',
};

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Image/Pattern Area */}
          <div className={`h-32 w-full ${categoryColors[event.category] || categoryColors.Other} relative`}>
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-0 left-0 p-8 transform translate-y-1/2">
              <span className="px-4 py-1.5 bg-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg border border-slate-100">
                {event.category}
              </span>
            </div>
          </div>

          <div className="p-8 pt-12 overflow-y-auto no-scrollbar">
            <h2 className="text-4xl font-black tracking-tighter uppercase mb-6 font-display text-slate-900 leading-tight">
              {event.eventName}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-start p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 shrink-0">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Datum</span>
                  <span className="font-bold text-slate-700">{event.date}</span>
                </div>
              </div>

              <div className="flex items-start p-4 bg-slate-50 rounded-2xl">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 shrink-0">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Vrijeme</span>
                  <span className="font-bold text-slate-700">{event.time || 'Provjeriti naknadno'}</span>
                </div>
              </div>

              <div className="flex items-start p-4 bg-slate-50 rounded-2xl md:col-span-2">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-1">Lokacija</span>
                  <div className="flex justify-between items-center text-slate-700 font-bold">
                    <span>{event.venue}</span>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ' Rijeka')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center"
                    >
                      Vidi na karti <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                </div>
              </div>

              {event.source && (
                <div className="flex items-start p-4 bg-indigo-50 border border-indigo-100 rounded-2xl md:col-span-2">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mr-4 shrink-0 text-indigo-600">
                    <ExternalLink className="w-5 h-5" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="text-[10px] font-black uppercase text-indigo-900/40 tracking-widest block mb-1">Izvor informacija</span>
                    <a 
                      href={event.source.startsWith('http') ? event.source : '#'} 
                      target={event.source.startsWith('http') ? "_blank" : "_self"}
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-900 hover:underline truncate block"
                    >
                      {event.source.startsWith('http') ? new URL(event.source).hostname : event.source}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">O događaju</h3>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                {event.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-100">
              <button className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center">
                <Bell className="w-4 h-4 mr-2" /> Podsjeti me
              </button>
              <button className="px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
