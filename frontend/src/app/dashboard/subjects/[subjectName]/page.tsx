'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Book, FileText, Download, Loader2, ArrowLeft, MessageSquare, PlayCircle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function SubjectPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [subjectData, setSubjectData] = useState<any>(null);
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const subjectSlug = params.subjectName as string;
  const decodedName = decodeURIComponent(subjectSlug).replace(/-/g, ' ');

  useEffect(() => {
    if (authLoading) return;
    
    if (!user?.profile?.subjects) {
      setLoading(false);
      return;
    }

    // Find the subject from the timetable
    const subjects = user.profile.subjects;
    const matchingSubject = subjects.find((s: any) => s.name.toLowerCase() === decodedName.toLowerCase());
    
    if (matchingSubject) {
      setSubjectData(matchingSubject);
      
      // Look for generated resources for this subject
      if (user.profile.resources) {
        const matchingResource = user.profile.resources.find(
          (r: any) => r.subjectName.toLowerCase() === matchingSubject.name.toLowerCase()
        );
        if (matchingResource) {
          setResource(matchingResource);
        }
      }
    }
    
    setLoading(false);
  }, [user, authLoading, decodedName]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!subjectData) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-orange-50 mb-2">Subject Not Found</h2>
        <p className="text-orange-200/70 mb-6">We couldn't find "{decodedName}" in your timetable.</p>
        <Button onClick={() => router.push('/dashboard')} variant="outline" className="bg-transparent border-orange-900/50 text-orange-400 hover:bg-orange-900/30 hover:text-orange-300">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')} className="rounded-full text-orange-400 hover:bg-orange-900/30">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-50 capitalize">
            {subjectData.name}
          </h1>
          <p className="text-orange-200/70 mt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#2a120a] border border-orange-900/30 text-xs font-medium text-orange-300">{subjectData.type}</span>
            Classes on {subjectData.day}s
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          {!resource ? (
            <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl text-center py-12">
              <CardContent>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-xl font-semibold text-orange-50 mb-2">No Study Materials Yet</h3>
                <p className="text-orange-200/70 max-w-md mx-auto mb-6">
                  You haven't generated AI study resources for your subjects yet. Generate them to unlock textbooks and PPT outlines here!
                </p>
                <Link href="/dashboard/resources">
                  <Button className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)]">
                    Go to Resource Generator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-50">
                    <Book className="text-orange-500" /> Recommended Textbook
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-[#2a120a] rounded-xl border border-orange-900/30 text-orange-200 font-medium">
                    {resource.textbook}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-50">
                    <FileText className="text-orange-500" /> PPTX Presentation Structure
                  </CardTitle>
                  <CardDescription className="text-orange-200/70">Use this outline for your assignments and projects.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {resource.pptxStructure?.map((slide: string, j: number) => (
                      <li key={j} className="flex items-start gap-3 text-orange-100 bg-[#2a120a] p-3 rounded-lg border border-orange-900/30">
                        <span className="w-6 h-6 rounded-full bg-orange-900/40 text-orange-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-inner">
                          {j + 1}
                        </span>
                        <span className="mt-0.5">{slide}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          <Card className="border-0 shadow-[0_4px_20px_rgba(234,88,12,0.2)] bg-gradient-to-br from-[#4a1202] to-[#2a0800] text-white">
            <CardHeader>
              <CardTitle className="text-white">AI Study Buddy</CardTitle>
              <CardDescription className="text-orange-200">Stuck on a concept?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-orange-50 mb-6">
                Your AI mentor is pre-loaded with knowledge about {subjectData.name}. Ask it anything to get instant help!
              </p>
              <Link href="/dashboard/chat" className="w-full">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white border-0 shadow-md">
                  <MessageSquare className="mr-2 h-4 w-4" /> Ask AI Assistant
                </Button>
              </Link>
            </CardContent>
          </Card>

          {resource?.keyTopics && (
            <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-50">Key Topics</CardTitle>
                <CardDescription className="text-orange-200/70">Focus areas for exams</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.keyTopics.map((topic: string, k: number) => (
                    <span key={k} className="px-3 py-1.5 bg-[#2a120a] border border-orange-900/30 rounded-lg text-xs font-medium text-orange-200">
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-orange-50">Video Lectures</CardTitle>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-400 bg-transparent border-red-900/50 hover:bg-red-900/20">
                <PlayCircle className="mr-2 h-4 w-4" /> Search YouTube
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
