'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const MODES = {
  pomodoro: { label: 'Pomodoro', minutes: 25, icon: Brain, color: 'text-red-500', bg: 'bg-gradient-to-r from-red-600 to-red-500', shadow: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]' },
  shortBreak: { label: 'Short Break', minutes: 5, icon: Coffee, color: 'text-orange-500', bg: 'bg-gradient-to-r from-orange-500 to-amber-500', shadow: 'shadow-[0_0_15px_rgba(249,115,22,0.5)]' },
  longBreak: { label: 'Long Break', minutes: 15, icon: Coffee, color: 'text-rose-500', bg: 'bg-gradient-to-r from-rose-600 to-rose-500', shadow: 'shadow-[0_0_15px_rgba(225,29,72,0.5)]' },
};

export default function PomodoroTimerPage() {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(MODES['pomodoro'].minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);

  // Use a ref to store the interval ID so we can clear it
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentMode = MODES[mode];

  const handleComplete = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    // Play a sound (optional)
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-software-interface-start-2574.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          const totalSeconds = currentMode.minutes * 60;
          setProgress((newTime / totalSeconds) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft, currentMode.minutes]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimeLeft(currentMode.minutes * 60);
    setProgress(100);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setMode(newMode);
    setTimeLeft(MODES[newMode].minutes * 60);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // SVG Circle calculations
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-orange-50 flex items-center justify-center gap-3">
          <Timer className="w-10 h-10 text-orange-500" />
          Focus Timer
        </h1>
        <p className="text-orange-200/70 mt-2">
          Boost your productivity with the Pomodoro technique.
        </p>
      </div>

      <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl max-w-xl mx-auto overflow-hidden">
        <CardContent className="p-8 sm:p-12">
          {/* Mode Selector */}
          <div className="flex justify-center mb-12 bg-[#2a120a] border border-orange-900/30 p-1.5 rounded-full shadow-inner">
            {(Object.keys(MODES) as TimerMode[]).map((m) => {
              const Icon = MODES[m].icon;
              return (
                <button
                  key={m}
                  onClick={() => switchMode(m)}
                  className={`relative px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 ${
                    mode === m
                      ? 'text-white'
                      : 'text-orange-200/70 hover:text-orange-100'
                  }`}
                >
                  {mode === m && (
                    <motion.div
                      layoutId="active-mode"
                      className={`absolute inset-0 rounded-full ${MODES[m].bg} ${MODES[m].shadow}`}
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <Icon className="w-4 h-4 hidden sm:block" />
                    {MODES[m].label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Timer Display */}
          <div className="relative flex justify-center items-center py-4">
            <svg width="300" height="300" className="transform -rotate-90 drop-shadow-[0_0_15px_rgba(234,88,12,0.1)]">
              {/* Background Circle */}
              <circle
                cx="150"
                cy="150"
                r={radius}
                className="stroke-[#2a120a]"
                strokeWidth="12"
                fill="none"
              />
              {/* Progress Circle */}
              <motion.circle
                cx="150"
                cy="150"
                r={radius}
                className={`stroke-current ${currentMode.color}`}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.5, ease: 'linear' }}
              />
            </svg>
            
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-6xl sm:text-7xl font-bold tracking-tighter tabular-nums ${currentMode.color} drop-shadow-[0_0_8px_currentColor]`}>
                {formatTime(timeLeft)}
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={isActive ? 'running' : 'paused'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-orange-200/50 uppercase tracking-[0.2em] text-xs font-bold mt-2"
                >
                  {isActive ? 'Focusing...' : 'Paused'}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-6 mt-12">
            <Button
              variant="outline"
              size="icon"
              className="w-14 h-14 rounded-full bg-transparent border-orange-900/50 hover:bg-orange-900/20"
              onClick={resetTimer}
            >
              <RotateCcw className="w-6 h-6 text-orange-400" />
            </Button>
            
            <Button
              size="icon"
              className={`w-20 h-20 rounded-full transition-transform hover:scale-105 ${currentMode.bg} ${currentMode.shadow}`}
              onClick={toggleTimer}
            >
              {isActive ? (
                <Pause className="w-10 h-10 text-white fill-white" />
              ) : (
                <Play className="w-10 h-10 text-white fill-white ml-1" />
              )}
            </Button>
            
            <div className="w-14 h-14" /> {/* Spacer to balance the layout */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
