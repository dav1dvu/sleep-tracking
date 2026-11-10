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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#070B18]/95 backdrop-blur-xl border-t border-amber-400/20 pb-[env(safe-area-inset-bottom,0px)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 w-full h-full min-h-[48px] transition-colors relative cursor-pointer select-none active:scale-95 ${
                isActive ? 'text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-1 rounded-full bg-amber-400 shadow-sm shadow-amber-400/80" />
              )}
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5] text-amber-400' : 'stroke-2'}`} />
              <span className={`text-xs ${isActive ? 'font-bold text-amber-200' : 'font-medium'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
