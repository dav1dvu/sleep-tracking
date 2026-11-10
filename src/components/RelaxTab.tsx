'use client';

import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Sparkles,
  CloudRain,
  Waves,
  Wind,
  Flame,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { soundEngine, SoundType } from '@/lib/audio-engine';
import { getStoredBrainDump, saveStoredBrainDump } from '@/lib/storage';

interface RelaxTabProps {
  activeSound: SoundType | null;
  onPlaySound: (type: SoundType, volume?: number, timerMins?: number) => void;
  onStopSound: () => void;
}

export function RelaxTab({ activeSound, onPlaySound, onStopSound }: RelaxTabProps) {
  const [volume, setVolume] = useState<number>(0.65);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);

  // 4-7-8 Breathing State
  const [isBreathingActive, setIsBreathingActive] = useState<boolean>(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCount, setBreathCount] = useState<number>(4);
  const [completedCycles, setCompletedCycles] = useState<number>(0);

  // Brain Dump State
  const [brainDump, setBrainDump] = useState<string>('');
  const [burnEffect, setBurnEffect] = useState<boolean>(false);

  useEffect(() => {
    setBrainDump(getStoredBrainDump());
  }, []);

  const handleBrainDumpChange = (text: string) => {
    setBrainDump(text);
    saveStoredBrainDump(text);
  };

  const handleBurnWorry = () => {
    setBurnEffect(true);
    setTimeout(() => {
      setBrainDump('');
      saveStoredBrainDump('');
      setBurnEffect(false);
    }, 1200);
  };

  // 4-7-8 Breathing timer loop
  useEffect(() => {
    if (!isBreathingActive) {
      setBreathPhase('inhale');
      setBreathCount(4);
      return;
    }

    let interval: NodeJS.Timeout;

    if (breathPhase === 'inhale') {
      if (breathCount > 1) {
        interval = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('hold');
        setBreathCount(7);
      }
    } else if (breathPhase === 'hold') {
      if (breathCount > 1) {
        interval = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('exhale');
        setBreathCount(8);
      }
    } else if (breathPhase === 'exhale') {
      if (breathCount > 1) {
        interval = setTimeout(() => setBreathCount(breathCount - 1), 1000);
      } else {
        setBreathPhase('inhale');
        setBreathCount(4);
        setCompletedCycles((c) => c + 1);
      }
    }

    return () => clearTimeout(interval);
  }, [isBreathingActive, breathPhase, breathCount]);

  const soundsList: { id: SoundType; name: string; icon: any; shortDesc: string }[] = [
    {
      id: 'brown',
      name: 'Nhiễu Nâu (Brown Noise)',
      icon: Sparkles,
      shortDesc: 'Âm trầm sâu lắng, giúp ngắt suy nghĩ miên man trước khi ngủ.',
    },
    {
      id: 'rain',
      name: 'Mưa Đêm (Ocean Rain)',
      icon: CloudRain,
      shortDesc: 'Tiếng giọt mưa gõ nhịp êm dịu, che lấp tiếng ồn ngoài phố.',
    },
    {
      id: 'theta',
      name: 'Sóng Não Theta 6Hz',
      icon: Waves,
      shortDesc: 'Sóng não thư giãn sâu đưa cơ thể vào trạng thái buồn ngủ.',
    },
    {
      id: 'pink',
      name: 'Nhiễu Hồng (Pink Noise)',
      icon: Wind,
      shortDesc: 'Âm điệu tự nhiên, hỗ trợ kéo dài pha ngủ sâu (Deep Sleep).',
    },
  ];

  const handleSoundToggle = (type: SoundType) => {
    if (activeSound === type) {
      onStopSound();
    } else {
      onPlaySound(type, volume, timerMinutes);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 md:pb-8">
      {/* Title */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Âm thanh ru ngủ & Bài tập thở
        </h2>
        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Âm thanh được phát trực tiếp trên thiết bị, hoạt động mượt mà không cần mạng Internet.
        </p>
      </div>

      {/* Sound Machine Cards */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
          <div>
            <h3 className="font-bold text-lg text-white">Máy phát âm thanh ngủ</h3>
            <p className="text-xs text-slate-400">Chạm vào thẻ để bật hoặc tắt</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Âm lượng:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-24 accent-indigo-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-2 rounded-xl border border-white/10 text-xs font-bold text-slate-200">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value={15} className="bg-slate-900">15 phút</option>
                <option value={30} className="bg-slate-900">30 phút</option>
                <option value={45} className="bg-slate-900">45 phút</option>
                <option value={60} className="bg-slate-900">60 phút</option>
                <option value={0} className="bg-slate-900">Không tắt</option>
              </select>
            </div>
          </div>
        </div>

        {/* Big Touch-Friendly Sound Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {soundsList.map((sound) => {
            const isPlaying = activeSound === sound.id;
            const Icon = sound.icon;

            return (
              <div
                key={sound.id}
                onClick={() => handleSoundToggle(sound.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 active:scale-98 ${
                  isPlaying
                    ? 'bg-indigo-950/80 border-indigo-400/70 shadow-lg shadow-indigo-500/20 glow-indigo'
                    : 'bg-slate-900/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      isPlaying
                        ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400'
                        : 'bg-slate-800 text-slate-400 border-white/10'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{sound.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{sound.shortDesc}</p>
                  </div>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isPlaying
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {isPlaying ? (
                    <Square className="w-5 h-5 fill-current" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-7-8 Breathing Guide */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6">
          <div>
            <h3 className="font-bold text-lg text-white">Bài tập hơi thở 4-7-8</h3>
            <p className="text-xs text-slate-400">Giúp hạ nhịp tim và dễ ngủ chỉ trong 2 phút</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/30">
            {completedCycles} chu kỳ
          </span>
        </div>

        <div className="py-8 flex flex-col items-center justify-center">
          {/* Animated Circle */}
          <div className="relative w-64 h-64 flex items-center justify-center mb-8">
            <div
              className={`w-52 h-52 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'border-indigo-400 bg-indigo-950/80 shadow-indigo-500/40 scale-110'
                    : breathPhase === 'hold'
                    ? 'border-purple-400 bg-purple-950/80 shadow-purple-500/50 scale-110'
                    : 'border-emerald-400 bg-emerald-950/80 shadow-emerald-500/40 scale-90'
                  : 'border-white/10 bg-slate-900/80 text-slate-400'
              }`}
            >
              {isBreathingActive ? (
                <div className="text-center">
                  <div className="font-mono text-6xl font-extrabold text-white mb-2">
                    {breathCount}
                  </div>
                  <span className="text-sm font-bold uppercase tracking-wider text-white">
                    {breathPhase === 'inhale'
                      ? 'Hít vào (4s)'
                      : breathPhase === 'hold'
                      ? 'Giữ hơi (7s)'
                      : 'Thở ra (8s)'}
                  </span>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Wind className="w-10 h-10 text-indigo-400 mx-auto mb-2" />
                  <span className="text-sm text-white font-bold block">Sẵn sàng thở</span>
                  <span className="text-xs text-slate-400">Chạm nút bên dưới</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full max-w-xs">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`flex-1 h-13 rounded-2xl font-bold text-base transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isBreathingActive
                  ? 'bg-slate-800 text-white border border-white/20'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Bắt đầu bài thở</span>
                </>
              )}
            </button>

            {isBreathingActive && (
              <button
                onClick={() => {
                  setIsBreathingActive(false);
                  setBreathPhase('inhale');
                  setBreathCount(4);
                }}
                className="w-13 h-13 rounded-2xl bg-white/10 hover:bg-white/15 text-slate-300 flex items-center justify-center border border-white/10 cursor-pointer"
                title="Đặt lại"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Worry Pad */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-white text-lg">Sổ tay xả lo âu</h3>
            <p className="text-xs text-slate-400">Viết ra mọi việc ngày mai để giải phóng tâm trí</p>
          </div>

          {brainDump && (
            <button
              onClick={handleBurnWorry}
              className="h-10 px-4 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Đốt sạch lo âu</span>
            </button>
          )}
        </div>

        <textarea
          value={brainDump}
          onChange={(e) => handleBrainDumpChange(e.target.value)}
          placeholder="Viết việc cần làm hoặc nỗi bận tâm của bạn vào đây..."
          rows={3}
          className={`w-full p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-all ${
            burnEffect ? 'opacity-0 scale-95 duration-1000' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
}
