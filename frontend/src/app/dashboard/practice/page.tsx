'use client';

import React, { useState } from 'react';
import { Play, RotateCcw, Loader2, Code2 } from 'lucide-react';
import { CodeEditor } from '@/components/CodeEditor';
import { motion } from 'framer-motion';

const SUPPORTED_LANGUAGES = [
  { id: 'c', name: 'C', version: '10.2.0' },
  { id: 'cpp', name: 'C++', version: '10.2.0' },
  { id: 'java', name: 'Java', version: '15.0.2' },
  { id: 'python', name: 'Python', version: '3.10.0' },
];

const DEFAULT_CODE: Record<string, string> = {
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}\n',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n',
  python: 'print("Hello, World!")\n',
};

export default function PracticePage() {
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0]);
  const [code, setCode] = useState(DEFAULT_CODE[language.id]);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = SUPPORTED_LANGUAGES.find((l) => l.id === e.target.value) || SUPPORTED_LANGUAGES[0];
    setLanguage(newLang);
    setCode(DEFAULT_CODE[newLang.id]);
    setOutput('');
    setError(null);
  };

  const handleRunCode = async () => {
    if (!code.trim()) return;
    
    setIsRunning(true);
    setError(null);
    setOutput('');

    try {
      const response = await fetch('https://emkc.org/api/v2/piston/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language.id,
          version: language.version,
          files: [
            {
              content: code,
            },
          ],
        }),
      });

      const data = await response.json();

      if (data.run && data.run.output) {
        setOutput(data.run.output);
      } else if (data.message) {
        setError(data.message);
      } else {
        setOutput('No output.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to execute code. Please try again later.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="text-white font-sans space-y-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 flex items-center gap-3">
              <Code2 className="w-8 h-8 text-blue-400" />
              Coding Practice
            </h1>
            <p className="text-white/60 mt-2">Write, compile, and execute code in real-time.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md">
            <select
              value={language.id}
              onChange={handleLanguageChange}
              className="bg-transparent text-white border-none focus:ring-0 outline-none cursor-pointer text-sm font-medium px-2"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id} className="bg-[#111]">
                  {lang.name}
                </option>
              ))}
            </select>
            <div className="w-px h-6 bg-white/20"></div>
            <button
              onClick={() => setCode(DEFAULT_CODE[language.id])}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors group"
              title="Reset Code"
            >
              <RotateCcw className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
            </button>
            <button
              onClick={handleRunCode}
              disabled={isRunning || !code.trim()}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-5 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Editor Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 rounded-t-xl border border-b-0 border-white/10 backdrop-blur-md">
              <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                main.{language.id === 'python' ? 'py' : language.id === 'c' ? 'c' : language.id === 'java' ? 'java' : 'cpp'}
              </span>
            </div>
            <div className="mt-0 pt-0">
              <CodeEditor
                language={language.id}
                value={code}
                onChange={(val) => setCode(val || '')}
                height="600px"
              />
            </div>
          </motion.div>

          {/* Output Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col h-[600px] lg:h-[650px] bg-black/40 rounded-xl border border-white/10 overflow-hidden backdrop-blur-md shadow-2xl"
          >
            <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white/80">Console Output</h3>
              {isRunning && <span className="text-xs text-blue-400 animate-pulse">Executing...</span>}
            </div>
            
            <div className="flex-1 p-4 overflow-auto font-mono text-sm">
              {error ? (
                <div className="text-red-400 whitespace-pre-wrap">{error}</div>
              ) : output ? (
                <div className="text-emerald-400 whitespace-pre-wrap">{output}</div>
              ) : (
                <div className="text-white/30 italic">Output will appear here...</div>
              )}
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
