import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Stars, Sparkles, Gift, Camera, Music, Play, Pause, ChevronRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';
import { cn } from './utils';

// --- Types ---
type Stage = 'intro' | 'celebration' | 'gallery' | 'ai-wish' | 'final';

const MEMORIES = [
  { id: 1, url: 'https://picsum.photos/seed/love1/800/1000', caption: 'The day we first met...' },
  { id: 2, url: 'https://picsum.photos/seed/love2/800/1000', caption: 'That beautiful sunset we watched together.' },
  { id: 3, url: 'https://picsum.photos/seed/love3/800/1000', caption: 'Every smile of yours is a treasure.' },
  { id: 4, url: 'https://picsum.photos/seed/love4/800/1000', caption: 'To many more adventures together.' },
];

export default function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [aiWish, setAiWish] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Effects ---
  useEffect(() => {
    if (stage === 'celebration') {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [stage]);

  // --- Handlers ---
  const handleMusicToggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Placeholder royalty-free
      audioRef.current.loop = true;
    }
    
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const generateAIWish = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Write a deeply romantic, poetic, and modern birthday wish for a beloved wife. Keep it under 100 words. Use beautiful metaphors about time, light, and love.",
      });
      setAiWish(response.text || "You are the light of my life, today and every day. Happy Birthday, my love.");
    } catch (error) {
      console.error("AI Generation failed", error);
      setAiWish("My love for you grows with every passing second. You are my everything. Happy Birthday!");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden selection:bg-rose-500/30">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="atmosphere absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.05)_0%,transparent_100%)]" />
      </div>

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-20">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110vh', x: `${Math.random() * 100}vw`, opacity: 0 }}
            animate={{ 
              y: '-10vh', 
              opacity: [0, 1, 1, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 10 + Math.random() * 20, 
              repeat: Infinity, 
              delay: Math.random() * 20,
              ease: "linear"
            }}
            className="absolute"
          >
            <Heart size={12 + Math.random() * 20} className="text-rose-400 fill-rose-400" />
          </motion.div>
        ))}
      </div>

      {/* Music Control */}
      <button 
        onClick={handleMusicToggle}
        className="fixed top-6 right-6 z-50 p-3 rounded-full glass hover:bg-white/10 transition-all group"
      >
        {isMusicPlaying ? <Pause size={20} /> : <Play size={20} />}
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full glass text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {isMusicPlaying ? 'Pause Music' : 'Play Music'}
        </span>
      </button>

      {/* Main Content */}
      <main className="relative z-20 flex flex-col items-center justify-center min-h-screen px-6">
        <AnimatePresence mode="wait">
          {stage === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center max-w-2xl"
            >
              <motion.div 
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-8 inline-block p-4 rounded-full bg-rose-500/10 border border-rose-500/20"
              >
                <Heart className="text-rose-500 fill-rose-500" size={48} />
              </motion.div>
              <h1 className="serif text-5xl md:text-7xl font-bold mb-6 tracking-tight glow-text italic">
                For the one who makes my world brighter...
              </h1>
              <p className="text-white/60 text-lg md:text-xl mb-12 font-light tracking-wide">
                A small journey through my heart, dedicated to you.
              </p>
              <button
                onClick={() => setStage('celebration')}
                className="group relative px-8 py-4 rounded-full bg-white text-black font-medium overflow-hidden transition-all hover:scale-105 active:scale-95"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Open Your Surprise <ChevronRight size={18} />
                </span>
                <div className="absolute inset-0 bg-rose-100 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          )}

          {stage === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="mx-auto text-gold mb-6 animate-pulse" size={64} />
                <h2 className="serif text-6xl md:text-9xl font-bold mb-4 tracking-tighter glow-text">
                  Happy Birthday,<br />My Lovely Wife
                </h2>
                <p className="text-rose-400 text-2xl md:text-3xl font-light italic serif mb-12">
                  You are my today and all of my tomorrows.
                </p>
                <button
                  onClick={() => setStage('gallery')}
                  className="px-8 py-4 rounded-full glass hover:bg-white/10 transition-all flex items-center gap-2 mx-auto"
                >
                  View Our Memories <Camera size={18} />
                </button>
              </motion.div>
            </motion.div>
          )}

          {stage === 'gallery' && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-6xl"
            >
              <div className="text-center mb-12">
                <h3 className="serif text-4xl font-bold mb-2">Our Beautiful Moments</h3>
                <p className="text-white/40 uppercase tracking-[0.2em] text-xs">Captured in time</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {MEMORIES.map((memory, i) => (
                  <motion.div
                    key={memory.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden glass"
                  >
                    <img 
                      src={memory.url} 
                      alt={memory.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <p className="serif italic text-lg">{memory.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <button
                  onClick={() => setStage('ai-wish')}
                  className="px-8 py-4 rounded-full bg-rose-600 hover:bg-rose-500 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-rose-500/20"
                >
                  A Special Message for You <Stars size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {stage === 'ai-wish' && (
            <motion.div
              key="ai-wish"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl w-full"
            >
              <div className="glass rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
                
                <Gift className="mx-auto text-rose-400 mb-8" size={48} />
                
                <h3 className="serif text-3xl font-bold mb-8">A Heartfelt Wish</h3>
                
                <div className="min-h-[200px] flex items-center justify-center mb-8">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="animate-spin text-rose-400" size={32} />
                      <p className="text-white/40 animate-pulse uppercase tracking-widest text-xs">Crafting something special...</p>
                    </div>
                  ) : aiWish ? (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="markdown-body text-xl md:text-2xl serif italic leading-relaxed text-white/90"
                    >
                      <Markdown>{aiWish}</Markdown>
                    </motion.div>
                  ) : (
                    <p className="text-white/40 italic">I asked the stars to help me find the right words...</p>
                  )}
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <button
                    onClick={generateAIWish}
                    disabled={isGenerating}
                    className="px-6 py-3 rounded-full glass hover:bg-white/10 transition-all flex items-center gap-2 justify-center disabled:opacity-50"
                  >
                    {aiWish ? 'Generate Another' : 'Reveal the Wish'} <Sparkles size={16} />
                  </button>
                  
                  {aiWish && (
                    <button
                      onClick={() => setStage('final')}
                      className="px-6 py-3 rounded-full bg-white text-black font-medium hover:scale-105 transition-all flex items-center gap-2 justify-center"
                    >
                      One Last Thing <ChevronRight size={16} />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {stage === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl"
            >
              <h2 className="serif text-5xl md:text-7xl font-bold mb-8 glow-text">I Love You.</h2>
              <p className="text-white/70 text-lg md:text-xl mb-12 leading-relaxed">
                Thank you for being the most incredible partner, friend, and wife. 
                Every day with you is a celebration, but today is extra special. 
                May your year be as beautiful as your soul.
              </p>
              
              <div className="flex justify-center gap-8 mb-12">
                <div className="flex flex-col items-center">
                  <span className="text-rose-500 font-bold text-3xl">365</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">Days of Joy</span>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-rose-500 font-bold text-3xl">∞</span>
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">Love Always</span>
                </div>
              </div>

              <button
                onClick={() => setStage('intro')}
                className="text-white/40 hover:text-white transition-colors flex items-center gap-2 mx-auto text-sm uppercase tracking-widest"
              >
                Start Over <RefreshCw size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <p className="text-white/20 text-[10px] uppercase tracking-[0.4em] whitespace-nowrap">
          Crafted with love for my forever
        </p>
      </footer>
    </div>
  );
}
