'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { BrainCircuit, BookOpen, Clock, Target, ArrowRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-blue-600 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">StudyAI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Sign in</Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 shadow-sm shadow-blue-200 dark:shadow-none">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50 via-white to-white dark:from-blue-950/20 dark:via-gray-950 dark:to-gray-950"></div>
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-8 border border-blue-100 dark:border-blue-800"
          >
            <Sparkles size={16} />
            <span>Your Personal AI Academic Mentor</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl lg:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight"
          >
            Study Smarter, <br /> Not <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Harder.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="max-w-2xl mx-auto text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10"
          >
            Upload your timetable, chat with your AI tutor, and get personalized study plans that adapt to your unique learning style and goals.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20">
                Start Learning Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                <BrainCircuit className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">24/7 AI Tutor</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Stuck on a problem at 2 AM? Your personalized AI mentor remembers your weaknesses and explains concepts perfectly.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                <Target className="text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Smart Study Plans</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Upload your timetable. The AI automatically finds gaps and creates dynamic study sessions optimized for your goals.</p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-6">
                <BookOpen className="text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Document Analysis</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">Upload lengthy PDFs or lecture notes. The AI instantly generates summaries, flashcards, and quizzes.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
