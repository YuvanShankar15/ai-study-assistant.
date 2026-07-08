'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BrainCircuit, Target, Zap, Quote } from 'lucide-react';

const motivations = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela", image: "https://images.unsplash.com/photo-1528716321680-815a8cdb8cbe?q=80&w=2076&auto=format&fit=crop" },
  { text: "Success is the sum of small efforts, repeated day-in and day-out.", author: "Robert Collier", image: "https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=2070&auto=format&fit=crop" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=2070&auto=format&fit=crop" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon", image: "https://images.unsplash.com/photo-1506784951206-33378a5b78e5?q=80&w=2069&auto=format&fit=crop" }
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
    setCurrentIndex(Math.floor(Math.random() * motivations.length));
  }, []);

  const getRandomMotivation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * motivations.length);
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

      <Card className="border border-orange-900/30 shadow-[0_8px_30px_rgba(234,88,12,0.05)] bg-[#1a0b06]/80 backdrop-blur-xl relative overflow-hidden p-0">
        <div className="absolute top-0 right-0 p-8 opacity-20 z-20 pointer-events-none">
          <Quote size={120} className="text-orange-500" />
        </div>
        
        <CardContent className="p-0 relative flex flex-col items-center justify-center min-h-[400px] w-full">
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
              >
                {/* Background Image */}
                <img 
                  src={motivations[currentIndex].image} 
                  alt="Motivation Background" 
                  className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-lighten"
                />
                
                {/* Dark Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a0b06]/90 via-[#1a0b06]/60 to-[#1a0b06]/40"></div>
                
                {/* Text Content */}
                <div className="relative z-20 max-w-4xl px-8 text-center pt-8 pb-16">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-50 leading-tight mb-6 drop-shadow-xl">
                    "{motivations[currentIndex].text}"
                  </h2>
                  <p className="text-xl text-orange-300 font-semibold tracking-wide drop-shadow-md">
                    — {motivations[currentIndex].author}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={getRandomMotivation}
            disabled={isAnimating}
            className="absolute bottom-8 z-30 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.6)] rounded-full px-8 py-6 text-lg transition-all hover:scale-105"
          >
            <Sparkles className="mr-2" size={20} /> Inspire Me Again
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
