'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, TrendingUp, Target, Clock, Zap, BookOpen } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-orange-50">Performance Analytics</h1>
          <p className="text-orange-200/70 mt-1">AI insights into your study habits and progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-0 shadow-[0_4px_20px_rgba(234,88,12,0.2)] bg-gradient-to-br from-[#4a1202] to-[#2a0800] text-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-200 text-sm font-medium flex items-center gap-2">
                <Clock size={16} /> Total Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">24h 15m</div>
              <p className="text-orange-200/70 text-sm mt-1 flex items-center gap-1">
                <TrendingUp size={14} /> +12% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-[0_4px_20px_rgba(234,88,12,0.2)] bg-gradient-to-br from-[#5a1804] to-[#3a0a00] text-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-200 text-sm font-medium flex items-center gap-2">
                <Target size={16} /> Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">87%</div>
              <p className="text-orange-200/70 text-sm mt-1 flex items-center gap-1">
                <TrendingUp size={14} /> +5% from last week
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-0 shadow-[0_4px_20px_rgba(234,88,12,0.2)] bg-gradient-to-br from-[#6a1f05] to-[#4a1000] text-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-orange-200 text-sm font-medium flex items-center gap-2">
                <Zap size={16} /> Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">12 Days</div>
              <p className="text-orange-200/70 text-sm mt-1 flex items-center gap-1">
                Personal best: 14 days
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-50">
                <BrainCircuit className="text-orange-500" /> AI Study Recommendations
              </CardTitle>
              <CardDescription className="text-orange-200/70">Based on your recent performance and timetable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-medium text-sm text-orange-100">Data Structures</span>
                  <span className="text-xs font-bold text-red-500">Needs Focus</span>
                </div>
                <div className="w-full bg-[#2a120a] rounded-full h-2.5 overflow-hidden border border-orange-900/30">
                  <div className="bg-red-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]" style={{ width: '35%' }}></div>
                </div>
                <p className="text-xs text-orange-200/50 mt-1">Recommendation: Allocate 2 extra hours this weekend.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-medium text-sm text-orange-100">Database Management</span>
                  <span className="text-xs font-bold text-yellow-500">On Track</span>
                </div>
                <div className="w-full bg-[#2a120a] rounded-full h-2.5 overflow-hidden border border-orange-900/30">
                  <div className="bg-yellow-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)]" style={{ width: '65%' }}></div>
                </div>
                <p className="text-xs text-orange-200/50 mt-1">Recommendation: Review normalization concepts before midterms.</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="font-medium text-sm text-orange-100">Web Development</span>
                  <span className="text-xs font-bold text-emerald-500">Mastered</span>
                </div>
                <div className="w-full bg-[#2a120a] rounded-full h-2.5 overflow-hidden border border-orange-900/30">
                  <div className="bg-emerald-500 h-2.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '92%' }}></div>
                </div>
                <p className="text-xs text-orange-200/50 mt-1">Recommendation: Excellent progress! Move on to advanced React hooks.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-50">
                <BookOpen className="text-red-500" /> Weekly Activity
              </CardTitle>
              <CardDescription className="text-orange-200/70">Your study hours over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[250px] flex items-end justify-between gap-2 pt-10">
              {/* Mock Bar Chart */}
              {[35, 45, 25, 60, 80, 50, 90].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="relative w-full bg-[#2a120a] border border-orange-900/30 border-b-0 rounded-t-md overflow-hidden h-40">
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${height}%` }} 
                      transition={{ duration: 1, delay: 0.2 + (i * 0.1) }}
                      className="absolute bottom-0 w-full bg-gradient-to-t from-orange-600 to-red-500 group-hover:from-orange-500 group-hover:to-red-400 rounded-t-md shadow-[0_0_10px_rgba(234,88,12,0.5)]"
                    />
                  </div>
                  <span className="text-xs text-orange-200/50 font-medium group-hover:text-orange-200/80">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
