'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, BrainCircuit, Target, Zap, Quote } from 'lucide-react';

const quotes = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't let what you cannot do interfere with what you can do.", author: "John Wooden" },
  { text: "Success is the sum of small efforts, repeated day-in and day-out.", author: "Robert Collier" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" }
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
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set initial random quote on client-side to avoid hydration mismatch
  useEffect(() => {
    setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  const getRandomQuote = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * quotes.length);
      } while (newIndex === currentQuoteIndex);
      
      setCurrentQuoteIndex(newIndex);
      setIsAnimating(false);
    }, 400); // Wait for fade out
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

      {/* Main Quote Card */}
      <Card className="border border-orange-900/30 shadow-[0_8px_30px_rgba(234,88,12,0.05)] bg-[#1a0b06]/80 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Quote size={120} className="text-orange-500" />
        </div>
        
        <CardContent className="pt-12 pb-10 px-8 text-center relative z-10 flex flex-col items-center justify-center min-h-[300px]">
          <AnimatePresence mode="wait">
            {!isAnimating && (
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="max-w-3xl"
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-orange-50 leading-tight mb-6">
                  "{quotes[currentQuoteIndex].text}"
                </h2>
                <p className="text-xl text-orange-400 font-medium tracking-wide">
                  — {quotes[currentQuoteIndex].author}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <Button 
            onClick={getRandomQuote}
            disabled={isAnimating}
            className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)] rounded-full px-8 py-6 text-lg transition-all hover:scale-105"
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
