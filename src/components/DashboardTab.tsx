'use client';

import React, { useState, useEffect } from 'react';
import {
  Clock,
  BatteryCharging,
  TrendingUp,
  Sparkles,
  Zap,
  Moon,
  Sun,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Trash2,
  Edit2,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
} from 'lucide-react';
import { SleepSession, SleepStats } from '@/types/sleep';
import { SLEEP_TAGS } from '@/lib/circadian';

interface DashboardTabProps {
  sessions: SleepSession[];
  stats: SleepStats;
  targetHours: number;
  onOpenLogModal: (sessionToEdit?: SleepSession) => void;
  onOpenZenModal: () => void;
  activeSleepStart: number | null;
  onStartSleeping: () => void;
  onDeleteSession: (id: string) => void;
}

export function DashboardTab({
  sessions,
  stats,
  targetHours,
  onOpenLogModal,
  onOpenZenModal,
  activeSleepStart,
  onStartSleeping,
  onDeleteSession,
}: DashboardTabProps) {
  const [trendRange, setTrendRange] = useState<7 | 14 | 30>(7);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [heatmapDays, setHeatmapDays] = useState<string[]>([]);

  useEffect(() => {
    const days: string[] = [];
    const now = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() - (29 - i));
      days.push(d.toISOString().split('T')[0]);
    }
    setHeatmapDays(days);
  }, []);

  const trendSessions = [...sessions].slice(0, trendRange).reverse();

  // Phân tích thói quen tương quan
  const calculateTagCorrelations = () => {
    const tagScores: Record<string, { totalEnergy: number; count: number; name: string; type: string }> = {};

    sessions.forEach((s) => {
      s.tags.forEach((tagId) => {
        const tagMeta = SLEEP_TAGS.find((t) => t.id === tagId);
        if (!tagScores[tagId]) {
          tagScores[tagId] = {
            totalEnergy: 0,
            count: 0,
            name: tagMeta?.label || tagId,
            type: tagMeta?.type || 'neutral',
          };
        }
        tagScores[tagId].totalEnergy += s.energyLevel;
        tagScores[tagId].count += 1;
      });
    });

    const list = Object.entries(tagScores)
      .map(([id, val]) => ({
        id,
        name: val.name,
        type: val.type,
        count: val.count,
        avgEnergy: Number((val.totalEnergy / val.count).toFixed(1)),
      }))
      .filter((item) => item.count >= 2);

    const boosters = list
      .filter((t) => t.type === 'positive' || t.avgEnergy >= 4.0)
      .sort((a, b) => b.avgEnergy - a.avgEnergy)
      .slice(0, 3);

    const drains = list
      .filter((t) => t.type === 'negative' || t.avgEnergy <= 3.0)
      .sort((a, b) => a.avgEnergy - b.avgEnergy)
      .slice(0, 3);

    return { boosters, drains };
  };

  const { boosters, drains } = calculateTagCorrelations();

  const avgHoursNum = Number((stats.averageDurationMinutes / 60).toFixed(1));
  const targetDiff = Number((avgHoursNum - targetHours).toFixed(1));

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 md:pb-8">
      {/* Primary Action Card: Clear & Actionable */}
      {activeSleepStart ? (
        <div className="p-5 sm:p-7 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900 border border-purple-500/40 shadow-xl glow-indigo">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
                <Moon className="w-7 h-7 text-purple-300 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping" />
                  <span className="text-sm font-bold text-purple-200 uppercase tracking-wide">
                    Đang theo dõi giấc ngủ
                  </span>
                </div>
                <p className="text-sm text-slate-300">
                  Màn hình Zen đang chạy ngầm hoặc sẵn sàng khi bạn thức giấc.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onOpenZenModal}
                className="flex-1 sm:flex-none h-13 px-6 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-base transition-all shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Sun className="w-5 h-5" />
                <span>Mở Zen / Tôi đã dậy</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-5 sm:p-7 rounded-3xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Chuẩn bị ngủ tối nay?</h3>
              <p className="text-sm text-slate-300">
                1 chạm để bật đồng hồ Zen ban đêm hoặc ghi nhận giờ ngủ.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onStartSleeping}
              className="w-full sm:w-auto h-13 px-7 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-base font-bold shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Moon className="w-5 h-5" />
              <span>Bắt đầu ngủ (Zen)</span>
            </button>
            <button
              onClick={() => onOpenLogModal()}
              className="w-full sm:w-auto h-13 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Ghi nhận hôm qua</span>
            </button>
          </div>
        </div>
      )}

      {/* 4 Headline KPIs: Large & Clear 2-Column Mobile Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* KPI 1: Thời lượng TB */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
            <span>Thời lượng TB</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-3xl sm:text-4xl text-white tracking-tight">
              {avgHoursNum > 0 ? `${avgHoursNum}h` : '--'}
            </span>
            <span className="text-xs text-slate-400">/ {targetHours}h</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
            {targetDiff >= 0 ? (
              <span className="text-emerald-400 flex items-center">
                <ArrowUpRight className="w-4 h-4" /> +{targetDiff}h
              </span>
            ) : (
              <span className="text-rose-400 flex items-center">
                <ArrowDownRight className="w-4 h-4" /> {targetDiff}h
              </span>
            )}
            <span className="text-slate-400">so mục tiêu</span>
          </div>
        </div>

        {/* KPI 2: Nợ giấc ngủ */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
            <span>Nợ giấc ngủ</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-extrabold text-3xl sm:text-4xl tracking-tight ${
                stats.sleepDebtHours > 2.0
                  ? 'text-rose-400'
                  : stats.sleepDebtHours > 0
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {stats.sleepDebtHours > 0 ? `-${stats.sleepDebtHours}h` : `+${Math.abs(stats.sleepDebtHours)}h`}
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold">
            {stats.sleepDebtHours > 2.0 ? (
              <span className="text-rose-400 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Cần bù 30p mỗi tối
              </span>
            ) : stats.sleepDebtHours > 0 ? (
              <span className="text-amber-400 flex items-center gap-1">
                Thiếu ngủ nhẹ
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Không có nợ ngủ
              </span>
            )}
          </div>
        </div>

        {/* KPI 3: Chỉ số đều đặn */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
            <span>Độ đều đặn</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-3xl sm:text-4xl text-emerald-300 tracking-tight">
              {stats.regularityScore}%
            </span>
          </div>
          <div className="mt-3 text-xs font-semibold text-slate-300">
            {stats.regularityScore >= 80 ? (
              <span className="text-emerald-400">Rất ổn định</span>
            ) : (
              <span className="text-amber-400">Lệch giờ cuối tuần</span>
            )}
            <span className="text-slate-400 ml-1.5">• {stats.chronotype}</span>
          </div>
        </div>

        {/* KPI 4: Năng lượng khi thức dậy */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-sm font-medium mb-2">
            <span>Năng lượng sáng</span>
            <BatteryCharging className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-extrabold text-3xl sm:text-4xl text-amber-300 tracking-tight">
              {stats.averageEnergy > 0 ? `${stats.averageEnergy}` : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 5★</span>
          </div>
          <div className="mt-3 text-xs font-semibold text-amber-300">
            {stats.averageEnergy >= 4.0 ? 'Sảng khoái cao' : 'Khá bình thường'}
            <span className="text-slate-400 font-normal ml-1.5">
              • Ngủ sau ~{stats.averageLatency}p
            </span>
          </div>
        </div>
      </div>

      {/* Chart: Simplified & High Contrast for Mobile */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Biểu đồ thời lượng</span>
            </h3>
            <p className="text-xs text-slate-400">Vạch đứt là mốc chuẩn {targetHours}h</p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-2xl border border-white/10 text-xs font-bold">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => setTrendRange(days as any)}
                className={`h-9 px-3.5 rounded-xl transition-colors cursor-pointer flex items-center justify-center ${
                  trendRange === days
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {days}N
              </button>
            ))}
          </div>
        </div>

        {/* Bars Container */}
        <div className="relative pt-6 pb-2">
          {/* Target 8h guideline */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-indigo-400/40 z-0 flex items-center justify-end pr-2 pointer-events-none"
            style={{ bottom: `${(targetHours / 10) * 100}%` }}
          >
            <span className="text-xs text-indigo-300 font-bold bg-indigo-950 px-2 py-0.5 rounded border border-indigo-500/30">
              Chuẩn {targetHours}h
            </span>
          </div>

          <div className="flex items-end justify-between gap-2 h-48 sm:h-60 px-1">
            {trendSessions.map((session, idx) => {
              const hours = session.durationMinutes / 60;
              const heightPercent = Math.min(100, Math.max(15, (hours / 10) * 100));
              const isHovered = hoveredBarIndex === idx;

              let barColor = 'bg-indigo-500';
              if (session.quality === 5) barColor = 'bg-emerald-500';
              else if (session.quality === 4) barColor = 'bg-indigo-500';
              else if (session.quality === 3) barColor = 'bg-amber-500';
              else barColor = 'bg-rose-500';

              const dateLabel = new Date(session.date).toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  className="flex-1 flex flex-col items-center h-full justify-end relative cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  onClick={() => onOpenLogModal(session)}
                >
                  {isHovered && (
                    <div className="absolute -top-20 z-30 p-2.5 rounded-xl bg-slate-900 border border-white/20 shadow-2xl text-xs w-36 pointer-events-none">
                      <div className="font-bold text-white flex justify-between">
                        <span>{session.date}</span>
                        <span className="text-amber-400">★ {session.quality}</span>
                      </div>
                      <div className="text-indigo-300 font-semibold mt-0.5">
                        {hours.toFixed(1)} giờ
                      </div>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[34px] rounded-t-xl ${barColor} transition-all ${
                      isHovered ? 'brightness-125 scale-y-105' : 'opacity-90'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />

                  <span className="text-xs text-slate-400 font-medium mt-2">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> 5★ Sâu
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> 4★ Tốt
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 3★ Vừa
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 1-2★ Kém
            </span>
          </div>
          <span className="text-slate-500">Chạm cột để sửa</span>
        </div>
      </div>

      {/* Habits Correlation Cards: Clean & Punchy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Boosters */}
        <div className="glass-panel p-5 rounded-3xl border-emerald-500/20">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Thói quen giúp ngủ ngon</h4>
              <p className="text-xs text-slate-400">Được ghi nhận nhiều nhất</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {boosters.length > 0 ? (
              boosters.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-sm"
                >
                  <span className="text-emerald-200 font-semibold">{b.name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs">
                    ⚡ {b.avgEnergy}/5 NL
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Chưa đủ dữ liệu thói quen.</p>
            )}
          </div>
        </div>

        {/* Drains */}
        <div className="glass-panel p-5 rounded-3xl border-rose-500/20">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Tác nhân gây mệt mỏi</h4>
              <p className="text-xs text-slate-400">Nên hạn chế buổi tối</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {drains.length > 0 ? (
              drains.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/30 border border-rose-500/20 text-sm"
                >
                  <span className="text-rose-200 font-semibold">{d.name}</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs">
                    ⚡ {d.avgEnergy}/5 NL
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">Không có thói quen xấu nổi bật.</p>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Heatmap Grid */}
      <div className="glass-panel p-5 rounded-3xl">
        <h4 className="font-bold text-white text-base mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span>Bản đồ nhiệt 30 ngày qua</span>
        </h4>

        <div className="grid grid-cols-6 sm:grid-cols-10 gap-2">
          {heatmapDays.map((dateStr) => {
            const dayNum = dateStr.split('-')[2];
            const session = sessions.find((s) => s.date === dateStr);

            let bgClass = 'bg-slate-900 border-white/5 text-slate-500';
            let title = `${dateStr}: Chưa ghi`;

            if (session) {
              const h = session.durationMinutes / 60;
              title = `${dateStr}: ${h.toFixed(1)}h`;
              if (h >= 8.0) bgClass = 'bg-emerald-500 border-emerald-400 text-white font-bold';
              else if (h >= 7.0) bgClass = 'bg-indigo-500 border-indigo-400 text-white font-semibold';
              else if (h >= 6.0) bgClass = 'bg-purple-600 border-purple-500 text-white';
              else bgClass = 'bg-rose-600 border-rose-500 text-white';
            }

            return (
              <button
                key={dateStr}
                title={title}
                className={`h-11 rounded-xl border flex items-center justify-center text-xs transition-transform active:scale-95 cursor-pointer ${bgClass}`}
                onClick={() => {
                  if (session) onOpenLogModal(session);
                }}
              >
                <span>{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent History Log List */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            <h4 className="font-bold text-white text-base">Nhật ký các đêm gần đây</h4>
          </div>
          <button
            onClick={() => onOpenLogModal()}
            className="h-10 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm</span>
          </button>
        </div>

        <div className="divide-y divide-white/10">
          {sessions.slice(0, 6).map((s) => {
            const hours = Math.floor(s.durationMinutes / 60);
            const mins = s.durationMinutes % 60;

            return (
              <div
                key={s.id}
                className="py-3.5 flex items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs text-indigo-300 font-bold uppercase">
                      {new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </span>
                    <span className="font-extrabold text-sm text-white">
                      {new Date(s.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-base text-white">
                        {hours}h {mins > 0 ? `${mins}p` : ''}
                      </span>
                      <span className="text-amber-400 font-semibold text-xs">
                        ★ {s.quality}/5
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {s.tags.slice(0, 2).map((tId) => {
                        const tagObj = SLEEP_TAGS.find((t) => t.id === tId);
                        return (
                          <span
                            key={tId}
                            className="text-xs px-2 py-0.5 rounded-md bg-slate-900 border border-white/10 text-slate-300 font-medium"
                          >
                            {tagObj?.label || tId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenLogModal(s)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title="Sửa"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteSession(s.id)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
