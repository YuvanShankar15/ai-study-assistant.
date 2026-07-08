'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAPI } from '@/lib/api';
import { Bot, User as UserIcon, Send, UploadCloud, File, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

export default function UnifiedOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Step 1: Timetable Upload State
  const [file, setFile] = useState<globalThis.File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Step 2: Chat State
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Great! I've analyzed your timetable. Before I generate your dashboard, I'd like to know a little about you. What is your name and what are you studying?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [chatting, setChatting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (step === 2) {
      scrollToBottom();
    }
  }, [messages, chatting, step]);

  // Handle Timetable Drop
  const onDrop = useCallback((acceptedFiles: globalThis.File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setUploadError('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleTimetableSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using standard fetch here since it's FormData, not JSON.
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const response = await fetch('http://localhost:5000/api/ai/timetable', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = typeof data?.error === 'object' ? JSON.stringify(data.error) : data?.error;
        throw new Error(errorMsg || 'Upload failed');
      }

      // Success, move to Step 2
      setStep(2);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process timetable. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatting(true);

    try {
      const response = await fetchAPI('/ai/onboarding', {
        method: 'POST',
        body: JSON.stringify({ messages: [...messages, { role: 'user', text: userMessage }] }),
      });

      if (response.completed) {
        setStep(3); // Move to preparation screen
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } else {
        setMessages((prev) => [...prev, { role: 'ai', text: response.message }]);
      }
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setChatting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: TIMETABLE UPLOAD */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-2xl"
          >
            <Card className="border-0 shadow-xl bg-white dark:bg-gray-900 rounded-3xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-center text-white">
                <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-90" />
                <h1 className="text-3xl font-bold mb-2">Let's set up your Study AI</h1>
                <p className="text-blue-100 opacity-90">First, upload your class or office timetable.</p>
              </div>
              
              <CardContent className="p-8">
                <div 
                  {...getRootProps()} 
                  className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200 ease-in-out ${
                    isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                  {file ? (
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                      <File size={16} />
                      {file.name}
                    </div>
                  ) : (
                    <>
                      <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">Drag & drop your timetable here</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">or click to browse files (PDF, JPG, PNG)</p>
                    </>
                  )}
                </div>

                {uploadError && (
                  <p className="text-red-500 text-sm mt-4 text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">{uploadError}</p>
                )}

                <Button 
                  className="w-full mt-6 h-12 rounded-xl text-lg shadow-md hover:shadow-lg transition-all"
                  disabled={!file || uploading}
                  onClick={handleTimetableSubmit}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Timetable...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
                <div className="mt-4 text-center">
                  <Button variant="ghost" size="sm" onClick={() => setStep(2)} className="text-gray-400 hover:text-gray-600">
                    Skip this step for now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* STEP 2: AI CHAT QUESTIONNAIRE */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-3xl h-[85vh] flex flex-col bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-sm flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Bot size={24} />
                  AI Onboarding Wizard
                </h1>
                <p className="text-blue-100 text-sm opacity-90 mt-1">Answer a few questions to personalize your experience.</p>
              </div>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                Step 2 of 2
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-950">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'ai' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {msg.role === 'ai' ? <Bot size={20} /> : <UserIcon size={20} />}
                  </div>
                  <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'ai' ? 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-tl-none shadow-sm' : 'bg-blue-600 text-white rounded-tr-none shadow-md'}`}>
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {chatting && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">
                    <Bot size={20} />
                  </div>
                  <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your answer here..."
                  className="flex-1 rounded-xl h-12 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 focus-visible:ring-blue-500 px-4"
                  disabled={chatting}
                />
                <Button type="submit" className="rounded-xl h-12 px-6 bg-blue-600 hover:bg-blue-700 shadow-sm" disabled={chatting || !inputValue.trim()}>
                  <Send size={18} className="mr-2" />
                  Send
                </Button>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 3: PREPARING DASHBOARD */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md text-center"
          >
            <div className="bg-white dark:bg-gray-900 p-12 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-24 h-24 mx-auto border-4 border-gray-100 border-t-blue-600 rounded-full mb-8 relative"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="text-blue-600 w-8 h-8 animate-pulse" />
                </div>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Almost there!</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Gemini is crunching your data, optimizing your timetable, and preparing your personalized dashboard...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
