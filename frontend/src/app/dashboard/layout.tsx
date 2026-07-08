'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  BookOpen, 
  FileText, 
  MessageSquare, 
  Settings,
  Menu,
  X,
  LogOut,
  BrainCircuit,
  TrendingUp,
  Timer,
  Code2
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Subjects', href: '/dashboard/subjects', icon: BookOpen },
  { name: 'Timetable Analyzer', href: '/dashboard/timetable', icon: Calendar },
  { name: 'Study Resources', href: '/dashboard/resources', icon: FileText },
  { name: 'Pomodoro Timer', href: '/dashboard/timer', icon: Timer },
  { name: 'AI Chat Assistant', href: '/dashboard/chat', icon: MessageSquare },
  { name: 'Coding Practice', href: '/dashboard/practice', icon: Code2 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
  { name: 'Motivation', href: '/dashboard/motivation', icon: BrainCircuit },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-[#0c0503] bg-gradient-to-br from-[#0c0503] via-[#1a0804] to-[#4a1202] text-orange-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/80 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0a0402]/80 backdrop-blur-2xl border-r border-orange-900/30 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col h-full shadow-[4px_0_24px_rgba(234,88,12,0.05)] ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 px-6 border-b border-orange-900/30">
            <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-orange-500 tracking-wide">
              <span>SelfStudy</span>
            </Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X size={24} className="text-orange-500" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600/20 to-transparent border-l-2 border-orange-500 text-orange-400 font-medium'
                      : 'text-orange-100/50 hover:bg-orange-900/20 hover:text-orange-200'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={20} className={isActive ? 'text-orange-400' : 'text-orange-100/40'} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-orange-900/30">
            <Button variant="ghost" className="w-full justify-start text-orange-100/50 hover:text-orange-200 hover:bg-orange-900/20" onClick={handleLogout}>
              <LogOut size={20} className="mr-3" />
              Log out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#0c0503]/80 backdrop-blur-md border-b border-orange-900/30 lg:hidden">
          <button onClick={() => setSidebarOpen(true)} className="text-orange-500 hover:text-orange-400">
            <Menu size={24} />
          </button>
          <div className="font-bold text-orange-500 tracking-wide">
            SelfStudy
          </div>
          <div className="w-6" /> {/* Spacer for centering */}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-transparent">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
