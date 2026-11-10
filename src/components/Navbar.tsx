'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sparkles, Volume2, Square, Plus, Settings, Sun, Flame, Coffee } from 'lucide-react';
import { soundEngine, SoundType } from '@/lib/audio-engine';

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
          label: 'Cửa sổ ngủ sâu (Melatonin cao)',
          icon: Moon,
          color: 'text-purple-400',
        });
      } else if (hour >= 6 && hour < 10) {
        setCircadianStatus({
          label: 'Đón nắng & Kích hoạt Cortisol',
          icon: Sun,
          color: 'text-amber-400',
        });
      } else if (hour >= 10 && hour < 14) {
        setCircadianStatus({
          label: 'Đỉnh cao tỉnh táo & Tập trung',
          icon: Flame,
          color: 'text-emerald-400',
        });
      } else if (hour >= 14 && hour < 18) {
        setCircadianStatus({
          label: 'Dừng nạp Caffeine buổi chiều',
          icon: Coffee,
          color: 'text-amber-500',
        });
      } else {
        setCircadianStatus({
          label: 'Chu kỳ hạ nhiệt & Giảm sáng',
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
        return 'Tiếng ồn nâu';
      case 'pink':
        return 'Tiếng ồn hồng';
      case 'white':
        return 'Tiếng ồn trắng';
      case 'rain':
        return 'Mưa đêm êm dịu';
      case 'theta':
        return 'Sóng não Theta 6Hz';
      default:
        return 'Đang phát âm thanh';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#06080F]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-amber-500/10 border border-indigo-500/30 shadow-lg shadow-indigo-500/10">
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                SOMNA
              </span>
              <span className="hidden xs:inline-block px-1.5 py-0.5 text-[10px] uppercase font-semibold tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PRO
              </span>
            </div>
            <p className="hidden sm:block text-[11px] text-slate-400">
              Circadian & Sleep Intelligence
            </p>
          </div>
        </div>

        {/* Center: Live Circadian Clock & Status */}
        <div className="hidden md:flex items-center gap-3 px-4 py-1.5 rounded-full bg-slate-900/60 border border-white/[0.06]">
          <span className="font-mono text-sm font-semibold text-slate-200 tracking-wider">
            {currentTime || '00:00:00'}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-600" />
          <div className="flex items-center gap-1.5 text-xs">
            <circadianStatus.icon className={`w-3.5 h-3.5 ${circadianStatus.color}`} />
            <span className="text-slate-300 font-medium">{circadianStatus.label}</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mini Sound Player Widget (if playing) */}
          {activeSound && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/50 border border-indigo-500/30 animate-pulse">
              <Volume2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="hidden sm:inline text-xs font-medium text-indigo-200">
                {getSoundLabel(activeSound)}
              </span>
              <button
                onClick={onStopSound}
                className="p-1 rounded-md hover:bg-indigo-900/60 text-slate-400 hover:text-white transition-colors"
                title="Tắt âm thanh"
              >
                <Square className="w-3 h-3 fill-current" />
              </button>
            </div>
          )}

          {/* Active Sleep Mode Tracker Button or Start Zen Mode */}
          {activeSleepTime ? (
            <button
              onClick={onOpenZenModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-200 text-xs sm:text-sm font-medium hover:bg-purple-600/40 transition-all glow-indigo"
            >
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span>Đang ngủ... (Mở Zen)</span>
            </button>
          ) : (
            <button
              onClick={onOpenZenModal}
              className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-xs sm:text-sm font-medium text-slate-200 transition-all"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Chế độ ngủ Zen</span>
            </button>
          )}

          {/* Quick Log Sleep Button */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-medium shadow-lg shadow-indigo-600/25 transition-all transform active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhận</span>
          </button>

          {/* Settings modal */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-white/10 transition-colors"
            title="Cài đặt"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
