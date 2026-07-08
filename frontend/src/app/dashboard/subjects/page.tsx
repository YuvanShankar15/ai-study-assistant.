'use client';

import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SubjectsDirectoryPage() {
  const { user } = useAuth();
  
  const subjects = user?.profile?.subjects || [];
  const uniqueSubjects = Array.from(new Set(subjects.map((s: any) => s.name)));

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-orange-50">
          My Subjects
        </h1>
        <p className="text-orange-200/70 mt-1">
          Select a subject to access personalized AI study resources and tutoring.
        </p>
      </div>

      {uniqueSubjects.length === 0 ? (
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl text-center py-16">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-semibold text-orange-50 mb-2">No Subjects Found</h3>
            <p className="text-orange-200/70 max-w-md mx-auto mb-6">
              You haven't uploaded your timetable yet. Upload it now so our AI can extract your subjects and create your learning hubs!
            </p>
            <Link href="/dashboard/timetable">
              <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                <Calendar className="mr-2 h-4 w-4" /> Go to Timetable Analyzer
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueSubjects.map((subjectName: any, i: number) => {
            const subjectSlug = encodeURIComponent(subjectName.toLowerCase().replace(/\s+/g, '-'));
            
            // Find type and day from first occurrence
            const firstOccurrence = subjects.find((s: any) => s.name === subjectName);

            return (
              <Link key={i} href={`/dashboard/subjects/${subjectSlug}`}>
                <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl h-full cursor-pointer hover:border-orange-500 transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,88,12,0.2)] group">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-orange-50 group-hover:text-orange-400 transition-colors flex justify-between items-start">
                      {subjectName}
                      <ChevronRight className="text-orange-200/40 group-hover:text-orange-500 transition-colors h-5 w-5" />
                    </CardTitle>
                    <CardDescription className="text-orange-200/50">
                      {firstOccurrence?.type || 'Class'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-orange-200/70 bg-gradient-to-r from-[#2a120a] to-[#1a0b06] border border-orange-900/30 p-2 rounded-md">
                      <Book className="h-4 w-4 text-orange-500" />
                      <span>View Study Hub & Resources</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
