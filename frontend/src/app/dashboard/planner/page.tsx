'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { fetchAPI } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UploadCloud, Calendar as CalendarIcon, Clock, BookOpen, CheckCircle2, Loader2, Plus, File, Calendar } from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function StudyPlannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [timetableData, setTimetableData] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      setSuccess(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg'],
    },
    maxFiles: 1,
  });

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Using standard fetch since we need to send FormData
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/timetable`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMsg = typeof data?.error === 'object' ? JSON.stringify(data.error) : data?.error;
        throw new Error(errorMsg || 'Upload failed');
      }

      setSuccess(true);
      setTimetableData(data.timetable);
    } catch (error) {
      console.error('Failed to upload timetable:', error);
      alert('Failed to process timetable. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Study Planner
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Upload your timetable and let AI generate your optimal study schedule.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 border-0 shadow-sm bg-white dark:bg-gray-800 h-fit">
          <CardHeader>
            <CardTitle>Upload Timetable</CardTitle>
            <CardDescription>We support PDF, PNG, and JPG formats.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-800/50'
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-600 font-medium">Drop your timetable here...</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    Drag & drop your file here
                  </p>
                  <p className="text-sm text-gray-500">or click to browse files</p>
                </div>
              )}
            </div>

            {file && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <File className="text-blue-600 w-5 h-5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                {success && <CheckCircle2 className="text-green-500 w-5 h-5 shrink-0" />}
              </div>
            )}

            <Button
              className="w-full"
              disabled={!file || uploading || success}
              onClick={handleUpload}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing with AI...
                </>
              ) : success ? (
                'Processed Successfully'
              ) : (
                'Upload & Analyze'
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-0 shadow-sm bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Generated Weekly Plan</CardTitle>
            <CardDescription>Your AI-optimized schedule based on your classes and goals.</CardDescription>
          </CardHeader>
          <CardContent>
            {timetableData ? (
              <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg border border-green-200 dark:border-green-800">
                  <p className="font-medium">Timetable parsed successfully!</p>
                  <p className="text-sm mt-1">Found {timetableData.subjects?.length || 0} subjects and automatically scheduled {timetableData.studyBlocks || 0} study blocks.</p>
                </div>
                {/* Visual rendering of timetable would go here */}
                <div className="h-64 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center text-gray-500">
                  Interactive Calendar View
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <Calendar className="text-gray-400 w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">No schedule available</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                    Upload your college timetable and let the AI generate your personalized study plan.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
