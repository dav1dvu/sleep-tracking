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
  Trash2,
  Check,
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

  const soundsList: { id: SoundType; name: string; icon: any; desc: string; freq: string }[] = [
    {
      id: 'brown',
      name: 'Nhiễu Nâu (Brown Noise)',
      icon: Sparkles,
      desc: 'Âm sắc ấm áp, tần số thấp sâu lắng mô phỏng tiếng thác nước xa hoặc cabin máy bay, giúp tắt suy nghĩ miên man.',
      freq: 'Cắt dải cao <450Hz',
    },
    {
      id: 'rain',
      name: 'Mưa Đêm Yên Bình (Ocean Rain)',
      icon: CloudRain,
      desc: 'Tiếng giọt mưa gõ nhịp nhàng kèm bộ lọc biến thiên tần số thấp, che lấp tiếng ồn xe cộ ngoài phố.',
      freq: 'Bộ lọc Bandpass biến thiên 900Hz',
    },
    {
      id: 'theta',
      name: 'Sóng Não Theta 6Hz (Binaural Beats)',
      icon: Waves,
      desc: 'Phát lệch tần 196Hz - 202Hz kích thích não sản sinh sóng Theta phục hồi sâu (khuyên dùng tai nghe).',
      freq: 'Theta Entrainment 6Hz',
    },
    {
      id: 'pink',
      name: 'Nhiễu Hồng (Pink Noise)',
      icon: Wind,
      desc: 'Năng lượng phân bổ đồng đều theo tỉ lệ 1/f, được nghiên cứu chứng minh gia tăng thời lượng ngủ sâu (Deep Sleep).',
      freq: 'Phổ tự nhiên 1/f',
    },
    {
      id: 'white',
      name: 'Nhiễu Trắng (White Noise)',
      icon: Sparkles,
      desc: 'Tất cả các dải tần số âm thanh bằng nhau, tạo màn chắn âm thanh cách ly môi trường tĩnh lặng tuyệt đối.',
      freq: 'Phổ đều Full-Spectrum',
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
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Không gian thư giãn trước giấc ngủ (Wind-Down Studio)
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bộ tạo âm thanh ngủ Web Audio & Hơi thở 4-7-8
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            100% âm thanh được tính toán và tổng hợp trực tiếp bằng Web Audio API trên trình duyệt
            của bạn, không tải tệp ngoài, hoạt động mượt mà không cần mạng.
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Sound Machine Studio */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Bộ máy tiếng ồn trắng & Âm hưởng ngủ</h3>
              <p className="text-xs text-slate-400">Chọn âm hưởng ru ngủ phù hợp với tai bạn nhất</p>
            </div>
          </div>

          {/* Volume & Timer Controls */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Volume */}
            <div className="flex items-center gap-2 flex-1 sm:flex-none">
              <span className="text-xs text-slate-400">Âm lượng:</span>
              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-24 sm:w-28 accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-400 w-8">{Math.round(volume * 100)}%</span>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={timerMinutes}
                onChange={(e) => setTimerMinutes(Number(e.target.value))}
                className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value={15} className="bg-slate-900">Tắt sau 15p</option>
                <option value={30} className="bg-slate-900">Tắt sau 30p</option>
                <option value={45} className="bg-slate-900">Tắt sau 45p</option>
                <option value={60} className="bg-slate-900">Tắt sau 60p</option>
                <option value={0} className="bg-slate-900">Không hẹn giờ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sound Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {soundsList.map((sound) => {
            const isPlaying = activeSound === sound.id;
            const Icon = sound.icon;

            return (
              <div
                key={sound.id}
                onClick={() => handleSoundToggle(sound.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative group flex flex-col justify-between ${
                  isPlaying
                    ? 'bg-gradient-to-b from-indigo-950/60 to-purple-950/40 border-indigo-400/50 shadow-xl shadow-indigo-500/15 glow-indigo'
                    : 'bg-slate-900/40 border-white/5 hover:border-white/15'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2.5 rounded-xl border ${
                        isPlaying
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400 border-white/5'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <button
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isPlaying
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                          : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                      }`}
                    >
                      {isPlaying ? <Square className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 ml-0.5" />}
                    </button>
                  </div>

                  <h4 className="font-semibold text-white text-sm mb-1">{sound.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{sound.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>{sound.freq}</span>
                  {isPlaying && <span className="text-emerald-400 font-semibold animate-pulse">● Đang phát</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4-7-8 Breathing Technique Studio */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Bài tập hơi thở 4-7-8 (Hạ nhịp tim tức thì)</h3>
              <p className="text-xs text-slate-400">
                Kích hoạt hệ thần kinh phó giao cảm giúp đưa cơ thể vào trạng thái buồn ngủ trong 2 phút
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Đã hoàn thành:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30">
              {completedCycles} chu kỳ
            </span>
          </div>
        </div>

        {/* Breathing Interactive Display */}
        <div className="py-12 flex flex-col items-center justify-center relative">
          {/* Animated Circle Container */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Pulsing Aura */}
            <div
              className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'bg-indigo-500/20 scale-110 blur-xl'
                    : breathPhase === 'hold'
                    ? 'bg-purple-500/25 scale-115 blur-2xl'
                    : 'bg-emerald-500/15 scale-90 blur-lg'
                  : 'bg-slate-800/30 scale-95'
              }`}
            />

            {/* Main Interactive Circle */}
            <div
              className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl relative z-10 ${
                isBreathingActive
                  ? breathPhase === 'inhale'
                    ? 'border-indigo-400 bg-indigo-950/60 shadow-indigo-500/30 scale-110'
                    : breathPhase === 'hold'
                    ? 'border-purple-400 bg-purple-950/70 shadow-purple-500/40 scale-110'
                    : 'border-emerald-400 bg-emerald-950/60 shadow-emerald-500/30 scale-90'
                  : 'border-white/10 bg-slate-900/60 text-slate-400'
              }`}
            >
              {isBreathingActive ? (
                <div className="text-center animate-fadeIn">
                  <div className="font-mono text-5xl sm:text-6xl font-light text-white mb-1">
                    {breathCount}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                    {breathPhase === 'inhale'
                      ? 'Hít vào bằng mũi (4s)'
                      : breathPhase === 'hold'
                      ? 'Giữ hơi thở (7s)'
                      : 'Thở ra nhẹ nhàng (8s)'}
                  </span>
                </div>
              ) : (
                <div className="text-center p-4">
                  <Wind className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                  <span className="text-xs text-slate-300 font-medium block">
                    Sẵn sàng thư giãn
                  </span>
                  <span className="text-[10px] text-slate-500">Nhấn bắt đầu bên dưới</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex items-center gap-3">
            <button
              onClick={() => setIsBreathingActive(!isBreathingActive)}
              className={`px-8 py-3 rounded-2xl font-semibold text-sm transition-all transform active:scale-95 shadow-xl flex items-center gap-2 cursor-pointer ${
                isBreathingActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-600/25'
              }`}
            >
              {isBreathingActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Tạm dừng</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Bắt đầu bài thở 4-7-8</span>
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
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 transition-colors"
                title="Đặt lại"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Pre-Sleep Worry Pad / Brain Dump */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">
                Nhật ký xả lo âu (Pre-Sleep Worry Pad)
              </h3>
              <p className="text-xs text-slate-400">
                Ghi hết những việc cần làm ngày mai hoặc nỗi bận tâm ra đây để giải phóng vỏ não trước khi ngủ
              </p>
            </div>
          </div>

          {brainDump && (
            <button
              onClick={handleBurnWorry}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-rose-500/10"
            >
              <Flame className="w-3.5 h-3.5 text-rose-400" />
              <span>Đốt sạch lo âu & Xóa tâm trí</span>
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            value={brainDump}
            onChange={(e) => handleBrainDumpChange(e.target.value)}
            placeholder="Ví dụ: Ngày mai cần chuẩn bị báo cáo 9h sáng, liên hệ đối tác... Hãy viết ra hết để yên tâm nhắm mắt ngủ ngon..."
            rows={4}
            className={`w-full p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-amber-400/50 transition-all ${
              burnEffect ? 'opacity-0 scale-95 blur-md duration-1000' : 'opacity-100 duration-200'
            }`}
          />
        </div>
        <p className="text-[11px] text-slate-500 mt-2">
          * Dữ liệu được lưu an toàn tại trình duyệt của bạn (Offline-First).
        </p>
      </div>
    </div>
  );
}
