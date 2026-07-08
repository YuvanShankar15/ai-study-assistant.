'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, FileText, Download, Loader2, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { fetchAPI } from '@/lib/api';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchAPI('/auth/me');
      if (data.user?.profile?.resources) {
        setResources(data.user.profile.resources);
      }
    } catch (err) {
      console.error('Failed to load profile', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const data = await fetchAPI('/ai/resources', {
        method: 'GET', // The API is a GET endpoint
      });
      if (data.resources) {
        setResources(data.resources);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to generate resources');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-orange-50">
            AI Study Resources
          </h1>
          <p className="text-orange-200/70 mt-1">
            Personalized textbooks, PPT outlines, and key topics for your subjects.
          </p>
        </div>
        <Button 
          onClick={handleGenerate} 
          disabled={generating}
          className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] disabled:opacity-50 disabled:shadow-none"
        >
          {generating ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>
          ) : (
            <><RefreshCw className="mr-2 h-4 w-4" /> {resources.length > 0 ? 'Regenerate Resources' : 'Generate Resources'}</>
          )}
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-900/20 text-red-400 border border-red-900/50">
          {error}
        </div>
      )}

      {resources.length === 0 && !generating && !error && (
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl text-center py-16">
          <CardContent>
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <Book size={32} />
            </div>
            <h3 className="text-xl font-semibold text-orange-50 mb-2">No Resources Yet</h3>
            <p className="text-orange-200/70 max-w-md mx-auto mb-6">
              Click the button above to ask your AI Mentor to compile textbooks and study guides based on your current subjects.
            </p>
            <Button onClick={handleGenerate} className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white">
              Generate Now
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {resources.map((res: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl h-full flex flex-col">
              <CardHeader className="border-b border-orange-900/30 pb-4">
                <CardTitle className="flex items-center gap-2 text-xl text-orange-50">
                  <div className="w-8 h-8 rounded-lg bg-orange-900/40 text-orange-400 flex items-center justify-center shrink-0 shadow-inner">
                    <Book size={18} />
                  </div>
                  {res.subjectName}
                </CardTitle>
                <CardDescription className="font-medium text-orange-300 pt-1">
                  Recommended: {res.textbook}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 flex-1 space-y-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-orange-50 uppercase tracking-wider mb-3">
                    <FileText size={16} className="text-orange-500" />
                    PPTX Presentation Structure
                  </h4>
                  <ul className="space-y-2">
                    {res.pptxStructure?.map((slide: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-orange-100">
                        <span className="w-5 h-5 rounded-full bg-orange-900/40 text-orange-400 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5 shadow-inner">
                          {j + 1}
                        </span>
                        {slide}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-4 bg-[#2a120a] rounded-xl border border-orange-900/30">
                  <h4 className="text-sm font-semibold text-orange-50 uppercase tracking-wider mb-2">
                    Key Topics to Study
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {res.keyTopics?.map((topic: string, k: number) => (
                      <span key={k} className="px-3 py-1 bg-[#1a0b06] border border-orange-900/50 rounded-full text-xs font-medium text-orange-200 shadow-[0_0_8px_rgba(234,88,12,0.1)]">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-orange-900/30 pt-4 bg-[#2a120a]/30">
                <Button variant="ghost" size="sm" className="w-full text-orange-400 hover:text-orange-300 hover:bg-orange-900/30">
                  <Download size={16} className="mr-2" />
                  Download Notes (PDF)
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
