'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BrainCircuit, Target, Zap, Quote } from 'lucide-react';

const classicPosters = [
  { text: "STAY FOCUSED.", bg: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=2074&auto=format&fit=crop" },
  { text: "NEVER GIVE UP.", bg: "https://images.unsplash.com/photo-1434394354979-a235cd36269d?q=80&w=2051&auto=format&fit=crop" },
  { text: "SUCCESS IS A DECISION.", bg: "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?q=80&w=2070&auto=format&fit=crop" },
  { text: "WORK HARD IN SILENCE.", bg: "https://images.unsplash.com/photo-1506744626753-1fa44df14d28?q=80&w=2070&auto=format&fit=crop" },
  { text: "BELIEVE IN YOURSELF.", bg: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop" },
  { text: "MAKE IT HAPPEN.", bg: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop" },
  { text: "THINK BIG.", bg: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" }
];

const tips = [
  {
    title: "The Pomodoro Technique",
    desc: "Study for 25 minutes, then take a 5-minute break. This keeps your brain fresh and focused.",
    icon: Zap
  },
  {
    title: "Active Recall",
    desc: "Don't just re-read your notes. Test yourself without looking at the material to force your brain to remember.",
    icon: BrainCircuit
  },
  {
    title: "Set Clear Goals",
    desc: "Instead of 'I will study math', say 'I will complete 10 calculus problems'. Be specific.",
    icon: Target
  }
];

export default function MotivationPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setCurrentIndex(Math.floor(Math.random() * classicPosters.length));
  }, []);

  const getRandomMotivation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * classicPosters.length);
      } while (newIndex === currentIndex);
      
      setCurrentIndex(newIndex);
      setIsAnimating(false);
    }, 400);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-orange-50 flex items-center gap-2">
          <Sparkles className="text-yellow-500" /> Daily Motivation
        </h1>
        <p className="text-orange-200/70 mt-2">
          Fuel your mind and stay focused on your learning journey.
        </p>
      </div>

      <Card className="border border-orange-900/30 shadow-[0_8px_30px_rgba(234,88,12,0.05)] bg-[#0a0402] relative overflow-hidden p-0 rounded-2xl">
        <CardContent className="p-0 relative flex flex-col items-center justify-center h-[500px] md:h-[600px] w-full bg-black overflow-hidden">
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                {/* Stunning Nature Background */}
                <img 
                  src={classicPosters[currentIndex].bg} 
                  alt="Motivation Background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity"
                />
                
                {/* Dark Vignette Overlay for maximum text contrast */}
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
                
                {/* Huge Classic Motivational Text */}
                <div className="relative z-20 w-full px-4 text-center flex flex-col items-center justify-center">
                  <h2 
                    className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-none"
                    style={{ 
                      textShadow: "0 10px 30px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,1)",
                      fontFamily: "system-ui, -apple-system, sans-serif"
                    }}
                  >
                    {classicPosters[currentIndex].text.split(' ').map((word, i) => (
                      <span key={i} className="block md:inline md:mx-2">{word}</span>
                    ))}
                  </h2>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={getRandomMotivation}
            disabled={isAnimating}
            className="absolute bottom-8 z-30 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-full px-8 py-6 text-lg transition-all hover:scale-105"
          >
            <Sparkles className="mr-2" size={20} /> Show Another
          </Button>
        </CardContent>
      </Card>

      {/* Study Tips Section */}
      <div className="pt-6">
        <h3 className="text-xl font-bold text-orange-50 mb-6 flex items-center gap-2">
          <BrainCircuit className="text-orange-500" /> Proven Study Strategies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/60 backdrop-blur-xl hover:bg-[#2a120a]/80 transition-colors cursor-default">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-orange-950/50 flex items-center justify-center mb-4 text-orange-500 border border-orange-900/50">
                    <tip.icon size={24} />
                  </div>
                  <CardTitle className="text-lg text-orange-50">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-orange-200/70 text-sm leading-relaxed">
                    {tip.desc}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
