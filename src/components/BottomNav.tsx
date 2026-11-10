'use client';

import React from 'react';
import { Moon, Clock, Wind, Bot, Award } from 'lucide-react';

export type TabType = 'dashboard' | 'circadian' | 'relax' | 'aicoach' | 'wrapped';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, onSelectTab }: BottomNavProps) {
  const navItems: { id: TabType; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Hôm nay', icon: Moon },
    { id: 'circadian', label: 'Chu kỳ', icon: Clock },
    { id: 'relax', label: 'Ru ngủ', icon: Wind },
    { id: 'aicoach', label: 'Bác sĩ AI', icon: Bot },
    { id: 'wrapped', label: 'Thẻ ngủ', icon: Award },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#06080F]/95 backdrop-blur-xl border-t border-white/10 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full min-h-[48px] transition-colors relative cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-indigo-500 shadow-sm shadow-indigo-500/50" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-bold text-white' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
