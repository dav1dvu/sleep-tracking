'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sparkles, Volume2, Square, Plus, Settings, Sun, Flame, Coffee } from 'lucide-react';
import { SoundType } from '@/lib/audio-engine';

interface NavbarProps {
  onOpenLogModal: () => void;
  onOpenZenModal: () => void;
  onOpenSettingsModal: () => void;
  activeSleepTime: number | null;
  activeSound: SoundType | null;
  onStopSound: () => void;
}

export function Navbar({
  onOpenLogModal,
  onOpenZenModal,
  onOpenSettingsModal,
  activeSleepTime,
  activeSound,
  onStopSound,
}: NavbarProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [circadianStatus, setCircadianStatus] = useState<{ label: string; icon: any; color: string }>({
    label: 'Đồng hồ sinh học',
    icon: Moon,
    color: 'text-indigo-400',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      setCurrentTime(timeStr);

      const hour = now.getHours();
      if (hour >= 22 || hour < 6) {
        setCircadianStatus({
          label: 'Cửa sổ ngủ sâu',
          icon: Moon,
          color: 'text-purple-400',
        });
      } else if (hour >= 6 && hour < 10) {
        setCircadianStatus({
          label: 'Đón nắng mai',
          icon: Sun,
          color: 'text-amber-400',
        });
      } else if (hour >= 10 && hour < 14) {
        setCircadianStatus({
          label: 'Tỉnh táo cao độ',
          icon: Flame,
          color: 'text-emerald-400',
        });
      } else if (hour >= 14 && hour < 18) {
        setCircadianStatus({
          label: 'Dừng caffeine chiều',
          icon: Coffee,
          color: 'text-amber-500',
        });
      } else {
        setCircadianStatus({
          label: 'Hạ nhiệt thư giãn',
          icon: Sparkles,
          color: 'text-indigo-400',
        });
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getSoundLabel = (type: SoundType | null) => {
    switch (type) {
      case 'brown':
        return 'Nhiễu nâu';
      case 'pink':
        return 'Nhiễu hồng';
      case 'white':
        return 'Nhiễu trắng';
      case 'rain':
        return 'Mưa đêm';
      case 'theta':
        return 'Sóng Theta';
      default:
        return 'Âm thanh';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#06080F]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-amber-500/10 border border-indigo-500/30 shadow-md">
            <Moon className="w-6 h-6 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight text-white">
                SOMNA
              </span>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Theo dõi & Nhịp sinh học giấc ngủ
            </p>
          </div>
        </div>

        {/* Center: Live Clock (Desktop Only) */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-slate-900/80 border border-white/10">
          <span className="font-mono text-sm font-semibold text-slate-200 tracking-wider">
            {currentTime || '00:00:00'}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-1.5 text-xs">
            <circadianStatus.icon className={`w-4 h-4 ${circadianStatus.color}`} />
            <span className="text-slate-300 font-medium">{circadianStatus.label}</span>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mini Sound Player Widget (if playing) */}
          {activeSound && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/70 border border-indigo-500/40 animate-pulse">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-indigo-200 hidden xs:inline">
                {getSoundLabel(activeSound)}
              </span>
              <button
                onClick={onStopSound}
                className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-indigo-900/80 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Tắt âm thanh"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          )}

          {/* Active Sleep Indicator */}
          {activeSleepTime && (
            <button
              onClick={onOpenZenModal}
              className="flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-semibold hover:bg-purple-600/40 transition-all cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
              <span>Đang ngủ</span>
            </button>
          )}

          {/* Quick Log Sleep Button (Desktop) */}
          <button
            onClick={onOpenLogModal}
            className="hidden md:flex items-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhận</span>
          </button>

          {/* Settings Modal Button */}
          <button
            onClick={onOpenSettingsModal}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
            title="Cài đặt"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
