'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchAPI } from '@/lib/api';
import { Bot, User as UserIcon, Send, Paperclip, MoreVertical, Loader2, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'ai' | 'user';
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "Hello! I'm your personal AI mentor. I've analyzed your profile and schedule. How can I help you study today?",
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() && !selectedFile) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage + (selectedFile ? `\n[Attached: ${selectedFile.name}]` : '') }]);
    
    // Add empty AI message placeholder for streaming
    setMessages((prev) => [...prev, { role: 'ai', text: '' }]);
    setLoading(true);

    try {
      let fileData = null;
      let mimeType = null;
      if (selectedFile) {
        mimeType = selectedFile.type;
        fileData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64String = (reader.result as string).split(',')[1];
            resolve(base64String);
          };
          reader.readAsDataURL(selectedFile);
        });
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }

      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message: userMessage, history: messages, fileData, mimeType }),
      });

      if (!response.ok) throw new Error('Failed to fetch');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      
      if (!reader) throw new Error('No reader available');

      setLoading(false); // Stop bounce animation, start typing

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.text) {
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage.role === 'ai') {
                    lastMessage.text += data.text;
                  }
                  return newMessages;
                });
              }
            } catch (err) {
              console.error('Error parsing SSE json', err, dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage.role === 'ai') {
          lastMessage.text = 'Sorry, I encountered an error. Please try again later.';
        }
        return newMessages;
      });
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-1 flex flex-col border border-orange-900/30 shadow-[0_4px_20px_rgba(234,88,12,0.02)] bg-[#1a0b06]/80 backdrop-blur-xl overflow-hidden">
        <CardHeader className="border-b border-orange-900/30 py-4 px-6 flex flex-row items-center justify-between space-y-0 bg-[#2a120a]/30">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-orange-50">
              <Bot className="text-orange-500" />
              AI Study Assistant
            </CardTitle>
            <CardDescription className="text-orange-200/70">Ask me anything about your subjects, upload notes, or request a quiz.</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="text-orange-200/50 hover:text-orange-400 hover:bg-orange-900/20">
            <MoreVertical size={20} />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${msg.role === 'ai' ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500' : 'bg-orange-900/40 text-orange-400'}`}>
                {msg.role === 'ai' ? <Bot size={20} /> : <UserIcon size={20} />}
              </div>
              <div className={`p-4 rounded-2xl max-w-[80%] ${msg.role === 'ai' ? 'bg-[#2a120a] border border-orange-900/30 rounded-tl-none text-orange-50 shadow-sm' : 'bg-gradient-to-br from-orange-600 to-red-600 text-white border border-orange-500/30 rounded-tr-none shadow-[0_0_15px_rgba(234,88,12,0.2)]'}`}>
                <div className={`prose prose-sm max-w-none ${msg.role === 'ai' ? 'prose-invert prose-p:text-orange-100 prose-headings:text-orange-50 prose-strong:text-orange-300' : 'text-white'}`}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 text-orange-500 flex items-center justify-center shadow-inner">
                <Bot size={20} />
              </div>
              <div className="p-5 bg-[#2a120a] border border-orange-900/30 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 bg-[#2a120a]/80 border-t border-orange-900/30 flex flex-col gap-2">
          {selectedFile && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-900/30 text-orange-200 text-sm rounded-lg self-start">
              <Paperclip size={14} />
              <span className="truncate max-w-[200px]">{selectedFile.name}</span>
              <button type="button" onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }} className="hover:text-red-400 ml-2">
                <X size={14} />
              </button>
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,application/pdf"
            />
            <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} className="shrink-0 bg-transparent border-orange-900/50 hover:bg-orange-900/20 text-orange-400">
              <Paperclip size={18} />
            </Button>
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question, request a summary, or type 'quiz me'..."
              className="flex-1 bg-[#1a0b06] border-orange-900/30 text-orange-50 placeholder:text-orange-900/50 focus-visible:ring-orange-500"
              disabled={loading}
            />
            <Button type="submit" className="shrink-0 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white px-6 shadow-[0_0_15px_rgba(234,88,12,0.4)] disabled:opacity-50 disabled:shadow-none border-0" disabled={loading || (!inputValue.trim() && !selectedFile)}>
              <Send size={18} className="mr-2" />
              Send
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
