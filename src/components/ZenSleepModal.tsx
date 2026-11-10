'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, X, Wind, Sparkles, CloudRain, Waves } from 'lucide-react';
import { soundEngine, SoundType } from '@/lib/audio-engine';

interface ZenSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeSleepStart: number | null;
  onStartSleeping: () => void;
  onWakeUp: (bedtimeMs: number, wakeTimeMs: number) => void;
  activeSound: SoundType | null;
  onPlaySound: (type: SoundType) => void;
  onStopSound: () => void;
}

export function ZenSleepModal({
  isOpen,
  onClose,
  activeSleepStart,
  onStartSleeping,
  onWakeUp,
  activeSound,
  onPlaySound,
  onStopSound,
}: ZenSleepModalProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [elapsedString, setElapsedString] = useState<string>('00:00:00');
  const [breathPacing, setBreathPacing] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );

      if (activeSleepStart) {
        const diffMs = Math.max(0, now.getTime() - activeSleepStart);
        const hours = Math.floor(diffMs / (1000 * 60 * 60));
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
        setElapsedString(
          `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, activeSleepStart]);

  if (!isOpen) return null;

  const handleWakeUpClick = () => {
    const bedtime = activeSleepStart || Date.now() - 7.5 * 60 * 60 * 1000;
    const wakeTime = Date.now();
    onWakeUp(bedtime, wakeTime);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#020408] text-amber-100/90 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-700 animate-fadeIn">
      {/* Top Bar */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
        <div className="flex items-center gap-2">
          <Moon className="w-5 h-5 text-amber-400" />
          <span className="text-xs uppercase tracking-widest text-amber-200/60 font-medium">
            Chế độ ngủ Zen • OLED Dark
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setBreathPacing(!breathPacing)}
            className={`p-2 rounded-xl border transition-all text-xs flex items-center gap-1.5 ${
              breathPacing
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                : 'border-white/10 text-slate-400'
            }`}
            title="Nhịp thở điều hòa"
          >
            <Wind className="w-4 h-4" />
            <span className="hidden sm:inline">Nhịp thở</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Đóng Zen Mode"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Clock & Breathing Animation */}
      <div className="relative flex flex-col items-center justify-center my-auto">
        {/* Breathing Circle Effect */}
        {breathPacing && (
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-amber-500/5 via-indigo-500/10 to-purple-500/10 animate-breathe blur-2xl pointer-events-none" />
        )}

        <div className="relative z-10 text-center">
          <div className="font-mono text-7xl sm:text-9xl font-light tracking-tight text-amber-200/90 drop-shadow-[0_0_35px_rgba(245,158,11,0.2)]">
            {currentTime || '23:00'}
          </div>

          {activeSleepStart ? (
            <div className="mt-4 flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-sm sm:text-base font-mono text-amber-400/80 bg-amber-950/40 px-4 py-1.5 rounded-full border border-amber-500/20">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Thời gian đã ngủ: {elapsedString}</span>
              </div>
              <p className="text-xs text-amber-200/50">
                Màn hình OLED đen tuyệt đối giúp bảo vệ hormone Melatonin tự nhiên.
              </p>
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={onStartSleeping}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-indigo-500/20 hover:from-amber-500/30 hover:to-indigo-500/30 border border-amber-500/40 text-amber-200 text-sm sm:text-base font-medium shadow-lg shadow-amber-500/10 transition-all transform active:scale-95 cursor-pointer"
              >
                🌙 Bắt đầu tính giờ ngủ ngay bây giờ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-amber-500/10">
        {/* Quick Ambient Sounds */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full">
          <span className="text-xs text-amber-200/40 flex items-center gap-1 mr-1">
            <Volume2 className="w-3.5 h-3.5" /> Ru ngủ:
          </span>
          <button
            onClick={() => (activeSound === 'brown' ? onStopSound() : onPlaySound('brown'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              activeSound === 'brown'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-md shadow-amber-500/10'
                : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-amber-100 hover:border-amber-500/20'
            }`}
          >
            Nhiễu nâu
          </button>
          <button
            onClick={() => (activeSound === 'rain' ? onStopSound() : onPlaySound('rain'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
              activeSound === 'rain'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-md shadow-amber-500/10'
                : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-amber-100 hover:border-amber-500/20'
            }`}
          >
            <CloudRain className="w-3 h-3" /> Mưa đêm
          </button>
          <button
            onClick={() => (activeSound === 'theta' ? onStopSound() : onPlaySound('theta'))}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1 ${
              activeSound === 'theta'
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-200 shadow-md shadow-amber-500/10'
                : 'bg-white/[0.03] border-white/5 text-slate-400 hover:text-amber-100 hover:border-amber-500/20'
            }`}
          >
            <Waves className="w-3 h-3" /> Sóng Theta
          </button>
          {activeSound && (
            <button
              onClick={onStopSound}
              className="p-1.5 rounded-xl text-slate-500 hover:text-white"
              title="Tắt âm"
            >
              <VolumeX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Wake Up Action Button */}
        {activeSleepStart && (
          <button
            onClick={handleWakeUpClick}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all cursor-pointer"
          >
            <Sun className="w-4 h-4 text-slate-950 fill-current" />
            <span>Mặt trời lên • Tôi đã thức dậy</span>
          </button>
        )}
      </div>
    </div>
  );
}
