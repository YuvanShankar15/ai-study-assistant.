'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, CheckCircle, Loader2, AlertCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAPI } from '@/lib/api';

export default function TimetableAnalyzerPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkExistingTimetable = async () => {
      try {
        const data = await fetchAPI('/auth/me');
        const profile = data.user?.profile;
        if (profile?.subjects?.length > 0) {
          setResult({
            subjects: profile.subjects,
            studyBlocks: profile.studyBlocks || 5
          });
          
          if (!profile.university || !profile.course || !profile.semester) {
            setStep(2); // Missing academic details, ask them
          } else {
            setStep(3); // Has everything, show results
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile', err);
      }
    };
    checkExistingTimetable();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setError(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    if (college) formData.append('college', college);
    if (department) formData.append('department', department);
    if (semester) formData.append('semester', semester);

    try {
      const data = await fetchAPI('/ai/timetable', {
        method: 'POST',
        headers: {} as any,
        body: formData
      });
      
      setResult(data.timetable);
      setStep(3);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-orange-50">
          AI Timetable Analyzer
        </h1>
        <p className="text-orange-200/70 mt-1">
          Upload your class schedule or timetable. Our AI will analyze it to extract your subjects and recommend optimal study blocks.
        </p>
      </div>

      {step === 1 && !result && (
        <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-orange-50">Step 1: Upload Timetable</CardTitle>
            <CardDescription className="text-orange-200/70">Supported formats: JPG, PNG, PDF (Max 5MB)</CardDescription>
          </CardHeader>
          <CardContent>
            <div 
              {...getRootProps()} 
              className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200 ${
                isDragActive ? 'border-orange-500 bg-orange-900/20' : 'border-orange-900/40 hover:border-orange-500/70 hover:bg-[#2a120a]/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 rounded-full shadow-inner">
                  <UploadCloud size={32} />
                </div>
                <div>
                  <p className="text-lg font-medium text-orange-50">
                    {isDragActive ? 'Drop your file here' : 'Drag & drop your timetable'}
                  </p>
                  <p className="text-sm text-orange-200/50 mt-1">or click to browse from your device</p>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {file && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl border border-orange-900/30 bg-[#2a120a] flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="text-orange-500" />
                    <div>
                      <p className="text-sm font-medium text-orange-50">{file.name}</p>
                      <p className="text-xs text-orange-200/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <CheckCircle className="text-emerald-500" size={20} />
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-4 rounded-xl bg-red-900/20 border border-red-900/50 text-red-400 flex items-center gap-2">
                <AlertCircle size={18} />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end bg-[#2a120a]/50 p-4 border-t border-orange-900/30">
            <Button 
              onClick={() => setStep(2)} 
              disabled={!file}
              className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] disabled:opacity-50 disabled:shadow-none"
            >
              Next Step
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 2 && !result && (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
          <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-orange-50">Step 2: Academic Details</CardTitle>
              <CardDescription className="text-orange-200/70">Tell us a bit about your education so we can personalize your study plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-1">College / University</label>
                <Input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="h-11 bg-[#2a120a] border-orange-900/30 text-orange-50 placeholder:text-orange-900/50 focus-visible:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-1">Department / Course</label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Computer Science"
                  className="h-11 bg-[#2a120a] border-orange-900/30 text-orange-50 placeholder:text-orange-900/50 focus-visible:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-100 mb-1">Semester / Year</label>
                <Input
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  placeholder="e.g. 5th Semester"
                  className="h-11 bg-[#2a120a] border-orange-900/30 text-orange-50 placeholder:text-orange-900/50 focus-visible:ring-orange-500"
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-[#2a120a]/50 p-4 border-t border-orange-900/30">
              <Button variant="outline" onClick={() => setStep(1)} className="bg-transparent border-orange-900/50 text-orange-400 hover:bg-orange-900/30 hover:text-orange-300">
                Back
              </Button>
              <Button 
                onClick={handleUpload} 
                disabled={loading || !college || !department || !semester}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-[0_0_15px_rgba(234,88,12,0.4)] disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Timetable...
                  </>
                ) : (
                  'Generate Study Plan'
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )}

      {step === 3 && result && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-900/50 flex items-center gap-3">
            <CheckCircle className="text-emerald-500" />
            <div>
              <h3 className="font-semibold text-emerald-400">Analysis Complete!</h3>
              <p className="text-sm text-emerald-500/80">We extracted {result.subjects?.length || 0} subjects and generated {result.studyBlocks || 0} study blocks.</p>
            </div>
            <Button variant="outline" className="ml-auto bg-transparent border-emerald-900/50 text-emerald-500 hover:bg-emerald-900/30 hover:text-emerald-400" onClick={() => { setResult(null); setFile(null); setStep(1); }}>
              Upload Another
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-50">Extracted Subjects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {result.subjects?.map((sub: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-[#2a120a] border border-orange-900/30">
                      <div>
                        <div className="font-medium text-orange-50">{sub.name} <span className="text-xs text-orange-300 bg-orange-900/40 border border-orange-900/50 px-2 py-0.5 rounded-full ml-2">{sub.type}</span></div>
                        <div className="text-sm text-orange-200/70">{sub.day}</div>
                      </div>
                      <div className="flex items-center text-sm font-medium text-orange-500">
                        <Clock size={14} className="mr-1" />
                        {sub.startTime} - {sub.endTime}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-orange-50">AI Recommendations</CardTitle>
                <CardDescription className="text-orange-200/70">Based on your extracted schedule</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-orange-900/20 border border-orange-900/50">
                  <h4 className="font-semibold text-orange-400">Study Blocks Generated</h4>
                  <p className="text-sm text-orange-200/70 mt-1">
                    I've scheduled {result.studyBlocks} optimized study blocks into your planner, avoiding your busy class times.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-red-900/20 border border-red-900/50">
                  <h4 className="font-semibold text-red-400">Subjects Synced</h4>
                  <p className="text-sm text-red-300/70 mt-1">
                    Your {result.subjects?.length} subjects have been saved to your profile. The AI Chat Assistant is now aware of what you are studying!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
