'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BrainCircuit, Target, Zap, Quote } from 'lucide-react';

const motivationalPosters = [
  "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop", // "Do it with passion or not at all"
  "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070&auto=format&fit=crop", // "Work hard, dream big"
  "https://images.unsplash.com/photo-1526289034009-0240ddb68ce3?q=80&w=2070&auto=format&fit=crop", // "You got this"
  "https://images.unsplash.com/photo-1574015974293-817f0ebebb74?q=80&w=2070&auto=format&fit=crop", // "Never give up"
  "https://images.unsplash.com/photo-1499914485622-a88fac536970?q=80&w=2070&auto=format&fit=crop", // "Make it happen"
  "https://images.unsplash.com/photo-1533227260815-484d6676f028?q=80&w=2070&auto=format&fit=crop", // "Hello ideas"
  "https://images.unsplash.com/photo-1542435503-956c22dd1c73?q=80&w=2070&auto=format&fit=crop"  // "Focus"
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
    setCurrentIndex(Math.floor(Math.random() * motivationalPosters.length));
  }, []);

  const getRandomMotivation = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * motivationalPosters.length);
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
        <CardContent className="p-0 relative flex flex-col items-center justify-center min-h-[500px] w-full">
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 1.02, filter: 'blur(5px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 w-full h-full flex items-center justify-center bg-black"
              >
                {/* Image containing the actual motivational text */}
                <img 
                  src={motivationalPosters[currentIndex]} 
                  alt="Motivational Quote" 
                  className="w-full h-full object-contain opacity-90"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={getRandomMotivation}
            disabled={isAnimating}
            className="absolute bottom-6 z-30 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.6)] rounded-full px-8 py-6 text-lg transition-all hover:scale-105"
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
