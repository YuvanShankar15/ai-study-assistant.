'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, Clock, Target, Trophy, Flame } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  name: string;
  course: string;
  studyHours: number;
  careerGoals: string[];
  subjects?: any[];
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchAPI('/auth/me');
        if (data.user && data.user.profile) {
          setProfile(data.user.profile);
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-50">
            {getGreeting()}, {profile?.name || 'Student'}! 👋
          </h1>
          <p className="text-orange-200/70 mt-1">
            Here's what your learning journey looks like today.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-[#1a0b06]/80 backdrop-blur-xl p-3 rounded-2xl shadow-[0_4px_20px_rgba(234,88,12,0.05)] border border-orange-900/30">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 shadow-inner">
            <Flame size={20} />
          </div>
          <div>
            <div className="text-sm font-medium text-orange-200/70">Study Streak</div>
            <div className="text-xl font-bold text-orange-50">0 Days</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-200/70">Today's Goal</CardTitle>
            <Target className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-50">{profile?.studyHours || 0} Hours</div>
            <p className="text-xs text-orange-200/50 mt-1">0 hours completed</p>
            <div className="w-full bg-[#3a150b] rounded-full h-2 mt-3 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-yellow-500 h-2 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" style={{ width: '0%' }}></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-200/70">Upcoming Exams</CardTitle>
            <Calendar className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-50">None</div>
            <p className="text-xs text-orange-200/50 mt-1">No exams scheduled yet</p>
          </CardContent>
        </Card>
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-200/70">Tasks Pending</CardTitle>
            <Clock className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-50">0</div>
            <p className="text-xs text-orange-200/50 mt-1">All caught up!</p>
          </CardContent>
        </Card>
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-orange-200/70">XP Earned</CardTitle>
            <Trophy className="w-4 h-4 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-50">0</div>
            <p className="text-xs text-orange-200/50 mt-1">Start studying to earn XP</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl h-full">
            <CardHeader>
              <CardTitle className="text-orange-50">AI Recommendations</CardTitle>
              <CardDescription className="text-orange-200/70">Based on your recent performance and timetable</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile?.subjects && profile.subjects.length > 0 ? (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#2a120a] to-[#1a0b06] border border-orange-900/30">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <BookOpen className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-50">Review {profile.subjects[0]?.name || 'your latest subject'}</h4>
                      <p className="text-sm text-orange-200/70 mt-1">
                        Based on your timetable, it's a good time to review {profile.subjects[0]?.name || 'this subject'}. Want a quick quiz?
                      </p>
                      <Link href="/dashboard/chat">
                        <Button variant="outline" size="sm" className="mt-3 bg-transparent text-orange-400 border-orange-900/50 hover:bg-orange-900/30 hover:text-orange-300">
                          Take Quiz
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-gradient-to-r from-[#2a120a] to-[#1a0b06] border border-orange-900/30 text-center py-8">
                  <div className="flex justify-center mb-3">
                    <Target className="text-orange-500/50" size={32} />
                  </div>
                  <h4 className="font-semibold text-orange-50">No data available yet</h4>
                  <p className="text-sm text-orange-200/70 mt-1 max-w-sm mx-auto">
                    Upload your timetable or start chatting with the AI Assistant to get personalized study recommendations.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-orange-50">Your Timetable</CardTitle>
              <CardDescription className="text-orange-200/70">All your extracted classes and study blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative border-l-2 border-orange-900/30 ml-3 space-y-6 pb-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {profile?.subjects && profile.subjects.length > 0 ? (
                  profile.subjects.map((sub: any, i: number) => {
                    const colors = [
                      { bg: 'bg-orange-500', text: 'text-orange-400', shadow: 'shadow-orange-500' },
                      { bg: 'bg-red-500', text: 'text-red-400', shadow: 'shadow-red-500' },
                      { bg: 'bg-yellow-500', text: 'text-yellow-400', shadow: 'shadow-yellow-500' },
                      { bg: 'bg-rose-500', text: 'text-rose-400', shadow: 'shadow-rose-500' }
                    ];
                    const color = colors[i % colors.length];
                    
                    return (
                      <div key={i} className="relative pl-6">
                        <div className={`absolute w-3 h-3 ${color.bg} rounded-full -left-[7px] top-1.5 ring-4 ring-[#1a0b06] shadow-[0_0_8px_currentColor]`} style={{ color: 'var(--tw-ring-color)' }}></div>
                        <div className={`text-sm font-medium ${color.text} mb-1`}>{sub.startTime} - {sub.endTime}</div>
                        <div className="font-semibold text-orange-50">{sub.name} ({sub.type})</div>
                        <div className="text-xs text-orange-200/50 mt-0.5">{sub.day}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-orange-200/70 mb-3">You haven't uploaded your timetable yet.</p>
                    <Link href="/dashboard/timetable">
                      <Button variant="default" size="sm" className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                        Upload Timetable
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
              
              {profile?.subjects && profile.subjects.length > 0 && (
                <Link href="/dashboard/timetable" className="block w-full">
                  <Button variant="outline" className="w-full mt-4 bg-transparent border-orange-900/50 text-orange-400 hover:bg-orange-900/30 hover:text-orange-300">
                    Update Timetable
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
