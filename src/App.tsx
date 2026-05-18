import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format, isSameDay } from 'date-fns';
import { hr } from 'date-fns/locale';
import { Waves, Calendar as CalendarIcon, Info, Map as MapIcon, Plus, Activity } from 'lucide-react';
import HorizontalCalendar from './components/HorizontalCalendar';
import EventCard from './components/EventCard';
import IngestionPanel from './components/IngestionPanel';
import EventModal from './components/EventModal';
import { Event } from './types';

// Mock data based on user requirements
const initialEvents: Event[] = [
  {
    id: '1',
    eventName: 'Večer s okusom Rijeke',
    date: format(new Date(), 'dd.MM.yyyy'),
    time: '19:00',
    venue: 'Molo Longo',
    category: 'Social',
    description: 'Tradicionalna riječka fešta uz domaće delicije i glazbu na samom lukobranu.',
    source: 'Visit Rijeka'
  },
  {
    id: '2',
    eventName: 'Exhibition: Industrijska Rijeka',
    date: format(new Date(), 'dd.MM.yyyy'),
    time: '10:00 - 20:00',
    venue: 'Exportdrvo',
    category: 'Exhibition',
    description: 'Povijesni pregled industrijske baštine grada kroz fotografije i arhivsku građu.',
    source: 'Muzej grada Rijeke'
  },
  {
    id: '3',
    eventName: 'Rock na Korzu',
    date: format(new Date(), 'dd.MM.yyyy'),
    time: '21:00',
    venue: 'Korzo',
    category: 'Concert',
    description: 'Energični nastup lokalnih rock bendova na glavnoj šetnici grada.',
    source: 'Novi List'
  }
];

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [showIngestion, setShowIngestion] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const [d, m, y] = event.date.split('.');
      const eventDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
      return isSameDay(eventDate, selectedDate);
    });
  }, [events, selectedDate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8 flex flex-col gap-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      <header className="flex flex-col lg:flex-row justify-between items-center bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm gap-8 transition-all">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-rijeka-blue rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-lg shadow-rijeka-blue/20">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none mb-1 font-display">Riječki Puls</h1>
            <p className="text-[10px] font-black text-indigo-600 tracking-[0.3em] uppercase underline decoration-2 underline-offset-4">Centrala Događanja</p>
          </div>
        </div>
        
        {/* Horizontal Calendar Selector */}
        <div className="flex-1 max-w-2xl w-full">
          <HorizontalCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Lokacija</span>
            <span className="text-sm font-bold">Rijeka, HR</span>
          </div>
          <div className="hidden xl:block h-10 w-px bg-slate-200"></div>
          <button 
            onClick={() => setShowIngestion(!showIngestion)}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rijeka-blue transition-all active:scale-95 shadow-xl shadow-slate-900/10 flex items-center"
          >
            <Plus className={`w-4 h-4 mr-2 transition-transform duration-300 ${showIngestion ? 'rotate-45' : ''}`} />
            {showIngestion ? 'Zatvori' : 'Dodaj'}
          </button>
        </div>
      </header>

      {/* Main Bento Grid */}
      <main className="grid grid-cols-1 md:grid-cols-12 gap-8 min-h-[800px]">
        {/* Left Section: Featured or Content */}
        <div className="md:col-span-8 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {showIngestion && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, height: 0 }}
                animate={{ opacity: 1, scale: 1, height: 'auto' }}
                exit={{ opacity: 0, scale: 0.95, height: 0 }}
                className="overflow-hidden"
              >
                <IngestionPanel 
                  onExtractionComplete={(newEvents) => {
                    setEvents(prev => [...prev, ...newEvents]);
                    setShowIngestion(false);
                  }} 
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Featured/Title Section */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black uppercase tracking-tight flex items-center font-display">
                <CalendarIcon className="w-8 h-8 mr-4 text-rijeka-blue" />
                Događanja: {format(selectedDate, 'd. MMMM', { locale: hr })}
              </h2>
              <div className="px-5 py-2 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none">
                {filteredEvents.length} Rezultata
              </div>
            </div>

            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onLearnMore={(e) => setSelectedEvent(e)}
                  />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-32 flex flex-col items-center text-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200"
              >
                <div className="w-24 h-24 bg-white shadow-sm rounded-full flex items-center justify-center mb-8">
                  <CalendarIcon className="w-10 h-10 text-slate-200" />
                </div>
                <h3 className="text-2xl font-black text-slate-300 uppercase tracking-tight mb-3">Nema planiranih događanja</h3>
                <p className="text-slate-400 font-medium max-w-sm">
                  Pokušajte odabrati drugi datum ili dodajte informaciju iz vanjskog izvora putem AI panela.
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Section: Sidebar Bento Items */}
        <div className="md:col-span-4 flex flex-col gap-8">
          {/* Categories Grid Card */}
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400">Kategorije</h3>
              <Waves className="w-5 h-5 text-rijeka-blue" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between aspect-square hover:bg-indigo-50 transition-colors cursor-pointer group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🎸</div>
                <div>
                  <div className="font-black uppercase text-xs tracking-tight">Koncerti</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Saznaj više</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between aspect-square hover:bg-emerald-50 transition-colors cursor-pointer group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🖼️</div>
                <div>
                  <div className="font-black uppercase text-xs tracking-tight">Izložbe</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Saznaj više</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between aspect-square hover:bg-amber-50 transition-colors cursor-pointer group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🎭</div>
                <div>
                  <div className="font-black uppercase text-xs tracking-tight">Festivali</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Saznaj više</div>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex flex-col justify-between aspect-square hover:bg-purple-50 transition-colors cursor-pointer group">
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform origin-left">🤝</div>
                <div>
                  <div className="font-black uppercase text-xs tracking-tight">Druženja</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Saznaj više</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tech Status Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between min-h-[220px] shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_#34d399] animate-pulse"></div>
              <span className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-400">AI Sustav Online</span>
            </div>
            <div className="relative z-10">
              <div className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-2">Partnerstvo</div>
              <div className="font-black text-xl leading-tight">Startup Incubator Energana <span className="text-indigo-400">AI LAB</span></div>
            </div>
          </div>

          {/* Mobility Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-[2.5rem] p-8 flex flex-col justify-between min-h-[200px]">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-black uppercase text-indigo-900 tracking-widest leading-none">Intergracije</span>
              <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">🚗</div>
            </div>
            <div>
              <h4 className="font-black uppercase text-xs tracking-tight text-indigo-900 mb-2">Mobilnost & Prijevoz</h4>
              <p className="text-sm font-medium text-indigo-800/70 leading-relaxed">
                Brzi linkovi na Jadroliniju, Uber i Bolt uskoro dostupni za svaki event.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />

      {/* Footer Bar */}
      <footer className="flex flex-col md:flex-row justify-between items-center p-8 bg-white rounded-[2rem] border border-slate-200 mt-8 gap-6">
        <div className="flex gap-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gemini 1.5 Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Visit Rijeka Sync</span>
          </div>
        </div>
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
          Dizajnirano u Rijeci za Riječane • Grad koji teče &copy; 2026
        </div>
      </footer>
    </div>
  );
}
