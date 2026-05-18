import { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, Loader2, Send, AlertCircle, Search, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExtractionResult, Event } from '../types';

interface IngestionPanelProps {
  onExtractionComplete: (events: Event[]) => void;
}

export default function IngestionPanel({ onExtractionComplete }: IngestionPanelProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'manual' | 'search'>('manual');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extractEvents = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let prompt = '';
      let tools: any[] = [];

      if (mode === 'manual') {
        if (!text.trim()) {
          setIsLoading(false);
          return;
        }
        prompt = `STRIKTNO ekstrahiraj događaje iz sljedećeg teksta za grad RIJEKU. 
        Moraš biti 100% precizan oko datuma (DD.MM.YYYY), lokacije i opisa. 
        Fokus: koncerti, festivali, izložbe, druženja. 
        Ako u tekstu piše "danas" ili "sutra", izračunaj točan datum s obzirom na današnji datum: ${new Date().toLocaleDateString('hr')}.
        Izvor postavi kao "Korisnički unos" ili naziv portala ako je vidljiv u tekstu.
        
        TEKST ZA ANALIZU:
        ${text}`;
      } else {
        prompt = `Pronađi stvarne i nadolazeće događaje u RIJECI pretraživanjem weba. 
        KORISTI STVARNE IZVORE (Visit Rijeka, MojeKarte, RiRock, Pogon Kulture, lokalni portali). 
        Ekstrahiraj točne datume, vremena i lokacije.
        Za svaki događaj OBAVEZNO navedi URL stranice kao 'source'.
        Opis mora biti na HRVATSKOM, profesionalan i točan.
        Vrati isključivo događaje koji se održavaju u Rijeci.`;
        tools = [{ googleSearch: {} }];
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          tools: tools,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              events: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    eventName: { type: Type.STRING },
                    date: { type: Type.STRING, description: "Format DD.MM.YYYY" },
                    time: { type: Type.STRING },
                    venue: { type: Type.STRING },
                    category: { 
                      type: Type.STRING, 
                      enum: ['Concert', 'Festival', 'Exhibition', 'Social', 'Other'] 
                    },
                    description: { type: Type.STRING },
                    source: { type: Type.STRING, description: "URL ili naziv izvora" }
                  },
                  required: ['eventName', 'date', 'venue', 'category', 'description', 'source']
                }
              }
            }
          }
        }
      });

      const result = JSON.parse(response.text) as ExtractionResult;
      
      // Add temporary IDs
      const eventsWithIds: Event[] = (result.events || []).map(e => ({
        ...e,
        id: Math.random().toString(36).substring(7)
      }));

      onExtractionComplete(eventsWithIds);
      setText('');
    } catch (err) {
      console.error('AI Extraction Error:', err);
      setError('Došlo je do pogreške prilikom analize ili pretraživanja. Molimo pokušajte ponovno.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-10 mb-12 text-white shadow-2xl relative overflow-hidden border-4 border-white">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rijeka-blue/20 rounded-full -mr-20 -mt-20 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
          <div className="flex items-center">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl mr-5">
              {mode === 'manual' ? (
                <FileText className="w-8 h-8 text-indigo-400" />
              ) : (
                <Search className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Dodaj nove događaje</h2>
              <p className="text-sm font-medium text-slate-400">
                {mode === 'manual' 
                  ? 'Zalijepi tekst za pametnu ekstrakciju.' 
                  : 'AI pretražuje web za najnovija događanja u gradu.'}
              </p>
            </div>
          </div>

          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setMode('manual')}
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                mode === 'manual' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3 h-3 mr-2" />
              Manual
            </button>
            <button
              onClick={() => setMode('search')}
              className={`flex items-center px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                mode === 'search' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="w-3 h-3 mr-2" />
              Live Search
            </button>
          </div>
        </div>

        <div className="relative group">
          {mode === 'manual' ? (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Npr. 'Ovaj petak u Pogonu Kulture nastupa Let 3 s početkom u 21 sat...'"
              className="w-full h-48 p-6 rounded-3xl bg-white/5 border border-white/10 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none text-lg text-white placeholder:text-slate-600 font-medium"
            />
          ) : (
            <div className="w-full h-48 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center border-dashed">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pretraži internet uživo</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                Pokrenite pretragu za trenutno najpopularnija događanja u Rijeci. Provjerit ćemo portale, novosti i najave.
              </p>
            </div>
          )}
          
          <div className="absolute bottom-6 right-6">
            <button
              onClick={extractEvents}
              disabled={isLoading || (mode === 'manual' && !text.trim())}
              className={`group flex items-center px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:scale-100 ${
                mode === 'manual' ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-emerald-600 shadow-emerald-600/20'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                  {mode === 'manual' ? 'Analiziram...' : 'Pretražujem...'}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-3" />
                  {mode === 'manual' ? 'Procesuiraj' : 'Pretraži uživo'}
                </>
              )
            }
            </button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex items-center text-red-400 text-sm font-bold bg-red-500/10 border border-red-500/20 p-4 rounded-2xl"
            >
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
