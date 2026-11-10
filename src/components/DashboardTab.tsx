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
  Tag,
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

  // Lấy danh sách phiên cho biểu đồ xu hướng
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
    <div className="space-y-8 animate-fadeIn">
      {/* Active Sleep Mode Tracker Banner */}
      {activeSleepStart ? (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/50 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl glow-indigo">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
              <Moon className="w-6 h-6 text-purple-300 animate-pulse" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                Đang theo dõi giấc ngủ trực tiếp
              </div>
              <p className="text-xs text-slate-300">
                Hệ thống đang ghi nhận thời gian ngủ. Nhấn vào để mở màn hình Zen hoặc thức dậy.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenZenModal}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm transition-all shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Mở màn hình Zen
          </button>
        </div>
      ) : (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Chuẩn bị đi ngủ tối nay?</h3>
              <p className="text-xs text-slate-400">
                Bật bộ đếm ngủ 1 chạm với màn hình OLED tối tuyệt đối hoặc ghi nhận thủ công sáng mai.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onStartSleeping}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
            >
              🌙 Bắt đầu ngủ ngay
            </button>
            <button
              onClick={() => onOpenLogModal()}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs sm:text-sm font-medium transition-all cursor-pointer"
            >
              + Ghi nhận thủ công
            </button>
          </div>
        </div>
      )}

      {/* 4 Headline KPI Cards (kpi-dashboard-design pattern) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* KPI 1: Thời lượng TB */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Thời lượng TB</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl sm:text-3xl text-white tracking-tight">
              {avgHoursNum > 0 ? `${avgHoursNum}h` : '--'}
            </span>
            <span className="text-xs text-slate-400">/ {targetHours}h mục tiêu</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            {targetDiff >= 0 ? (
              <span className="text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +{targetDiff}h
              </span>
            ) : (
              <span className="text-rose-400 font-semibold flex items-center">
                <ArrowDownRight className="w-3.5 h-3.5" /> {targetDiff}h
              </span>
            )}
            <span className="text-slate-500">so với mục tiêu</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
        </div>

        {/* KPI 2: Nợ giấc ngủ */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Nợ giấc ngủ (7 ngày)</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`font-bold text-2xl sm:text-3xl tracking-tight ${
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
          <div className="mt-3 flex items-center gap-1 text-xs">
            {stats.sleepDebtHours > 2.0 ? (
              <span className="text-rose-400 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Cần bù ngủ 30p/tối
              </span>
            ) : stats.sleepDebtHours > 0 ? (
              <span className="text-amber-400 font-medium flex items-center gap-1">
                Thiếu hụt nhẹ, dễ phục hồi
              </span>
            ) : (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Không có nợ ngủ
              </span>
            )}
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all" />
        </div>

        {/* KPI 3: Chỉ số đều đặn (SRI) */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Chỉ số đều đặn (SRI)</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl sm:text-3xl text-emerald-300 tracking-tight">
              {stats.regularityScore}%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            {stats.regularityScore >= 80 ? (
              <span className="text-emerald-400 font-medium">Nhịp sinh học rất vững</span>
            ) : (
              <span className="text-amber-400 font-medium">Lệch giờ cuối tuần</span>
            )}
            <span className="text-slate-500">• {stats.chronotype}</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
        </div>

        {/* KPI 4: Năng lượng khi thức dậy */}
        <div className="glass-panel p-5 rounded-3xl relative overflow-hidden group hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-3">
            <span>Năng lượng thức dậy</span>
            <BatteryCharging className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-2xl sm:text-3xl text-amber-300 tracking-tight">
              {stats.averageEnergy > 0 ? `${stats.averageEnergy}` : '--'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">
              {stats.averageEnergy >= 4.0 ? 'Sảng khoái cao' : 'Khá ổn định'}
            </span>
            <span className="text-slate-500">• Trằn trọc ~{stats.averageLatency}p</span>
          </div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition-all" />
        </div>
      </div>

      {/* Interactive Sleep Duration Bar Chart (High visual fidelity) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-lg text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span>Xu hướng thời lượng giấc ngủ</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Thời gian ngủ thực tế so với mốc chuẩn vàng {targetHours}h mỗi đêm
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5 text-xs font-medium">
            <button
              onClick={() => setTrendRange(7)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                trendRange === 7
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7 ngày
            </button>
            <button
              onClick={() => setTrendRange(14)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                trendRange === 14
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              14 ngày
            </button>
            <button
              onClick={() => setTrendRange(30)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                trendRange === 30
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              30 ngày
            </button>
          </div>
        </div>

        {/* Chart Canvas Area */}
        <div className="relative pt-6 pb-2">
          {/* Target 8h guideline */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-indigo-400/40 z-0 flex items-center justify-end pr-2 pointer-events-none"
            style={{ bottom: `${(targetHours / 10) * 100}%` }}
          >
            <span className="text-[10px] text-indigo-300 font-mono bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-500/30">
              Mục tiêu {targetHours}h
            </span>
          </div>

          {/* Bars Container */}
          <div className="flex items-end justify-between gap-2 sm:gap-3 h-52 sm:h-64 px-1">
            {trendSessions.map((session, idx) => {
              const hours = session.durationMinutes / 60;
              const heightPercent = Math.min(100, Math.max(12, (hours / 10) * 100));
              const isHovered = hoveredBarIndex === idx;

              // Color gradient based on quality
              let barColor = 'from-indigo-600 to-purple-600';
              if (session.quality === 5) barColor = 'from-emerald-500 to-teal-400';
              else if (session.quality === 4) barColor = 'from-indigo-500 to-purple-500';
              else if (session.quality === 3) barColor = 'from-amber-500 to-orange-400';
              else barColor = 'from-rose-600 to-rose-400';

              const dateLabel = new Date(session.date).toLocaleDateString('vi-VN', {
                weekday: 'narrow',
                day: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  className="flex-1 flex flex-col items-center h-full justify-end relative group cursor-pointer"
                  onMouseEnter={() => setHoveredBarIndex(idx)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                  onClick={() => onOpenLogModal(session)}
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-24 z-30 p-2.5 rounded-xl bg-slate-900 border border-white/20 shadow-2xl text-xs w-36 sm:w-44 pointer-events-none animate-fadeIn">
                      <div className="font-semibold text-white mb-1 flex items-center justify-between">
                        <span>{session.date}</span>
                        <span className="text-amber-400">★ {session.quality}/5</span>
                      </div>
                      <div className="text-indigo-300 font-medium">
                        {(session.durationMinutes / 60).toFixed(1)} giờ (
                        {Math.floor(session.durationMinutes / 60)}h{session.durationMinutes % 60}m)
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-emerald-400" /> Năng lượng: {session.energyLevel}/5
                      </div>
                    </div>
                  )}

                  {/* Visual Bar */}
                  <div
                    className={`w-full max-w-[36px] rounded-t-xl bg-gradient-to-t ${barColor} transition-all duration-300 relative ${
                      isHovered ? 'brightness-125 scale-y-105 shadow-lg shadow-indigo-500/25' : 'opacity-85'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  >
                    {/* Top indicator dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-white/60 mx-auto mt-1" />
                  </div>

                  {/* Day Label */}
                  <span className="text-[10px] sm:text-xs text-slate-400 font-medium mt-2 truncate w-full text-center">
                    {dateLabel}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> 5★ Tuyệt hảo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> 4★ Ngon giấc
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 3★ Bình thường
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 1-2★ Chập chờn
            </span>
          </div>
          <span className="text-slate-500 italic">Nhấn vào cột để chỉnh sửa</span>
        </div>
      </div>

      {/* Correlation Factor Insights (Khoa học dữ liệu tương quan) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Boosters */}
        <div className="glass-panel p-6 rounded-3xl border-emerald-500/20">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm sm:text-base">
                Thói quen mang lại năng lượng cao nhất
              </h4>
              <p className="text-xs text-slate-400">
                Các yếu tố gắn liền với điểm phục hồi 4-5 sao của bạn
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {boosters.length > 0 ? (
              boosters.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs"
                >
                  <span className="text-emerald-200 font-medium">{b.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{b.count} lần</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                      ★ {b.avgEnergy} NL
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                Ghi nhận thêm vài đêm có kèm tag thói quen để thuật toán phân tích tương quan.
              </p>
            )}
          </div>
        </div>

        {/* Drains */}
        <div className="glass-panel p-6 rounded-3xl border-rose-500/20">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm sm:text-base">
                Thủ phạm gây hao tổn giấc ngủ
              </h4>
              <p className="text-xs text-slate-400">
                Những tác nhân khiến bạn uể oải và trằn trọc nhất
              </p>
            </div>
          </div>
          <div className="space-y-3">
            {drains.length > 0 ? (
              drains.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs"
                >
                  <span className="text-rose-200 font-medium">{d.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{d.count} lần</span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-semibold">
                      ★ {d.avgEnergy} NL
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">
                Chưa phát hiện thói quen tiêu cực lặp lại nhiều lần. Rất tốt!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 30-Day Sleep Heatmap Grid (GitHub style) */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <span>Bản đồ nhiệt giấc ngủ (30 ngày gần nhất)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Mỗi ô thể hiện mức độ đủ giấc của từng đêm
            </p>
          </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
          {heatmapDays.map((dateStr) => {
            const dayNum = dateStr.split('-')[2];
            const session = sessions.find((s) => s.date === dateStr);

            let bgClass = 'bg-slate-900 border-white/5';
            let title = `${dateStr}: Chưa ghi nhận`;

            if (session) {
              const h = session.durationMinutes / 60;
              title = `${dateStr}: ${h.toFixed(1)}h (${session.quality}★)`;
              if (h >= 8.0) bgClass = 'bg-emerald-500 border-emerald-400 shadow-sm shadow-emerald-500/20';
              else if (h >= 7.0) bgClass = 'bg-indigo-500 border-indigo-400';
              else if (h >= 6.0) bgClass = 'bg-purple-600/70 border-purple-500/40';
              else bgClass = 'bg-rose-600/70 border-rose-500/40';
            }

            return (
              <div
                key={dateStr}
                title={title}
                className={`h-9 rounded-xl border flex items-center justify-center text-[10px] font-mono transition-transform hover:scale-110 cursor-pointer ${bgClass}`}
                onClick={() => {
                  if (session) onOpenLogModal(session);
                }}
              >
                <span className="text-white/80">{dayNum}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent History Log List */}
      <div className="glass-panel p-6 rounded-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Nhật ký các đêm gần đây</h4>
              <p className="text-xs text-slate-400">Xem lại chi tiết từng phiên và thói quen</p>
            </div>
          </div>
          <button
            onClick={() => onOpenLogModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>Thêm đêm ngủ</span>
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {sessions.slice(0, 7).map((s) => {
            const [bH, bM] = [new Date(s.bedtime).getHours(), new Date(s.bedtime).getMinutes()];
            const [wH, wM] = [new Date(s.wakeTime).getHours(), new Date(s.wakeTime).getMinutes()];
            const timeFormat = `${String(bH).padStart(2, '0')}:${String(bM).padStart(2, '0')} → ${String(
              wH
            ).padStart(2, '0')}:${String(wM).padStart(2, '0')}`;

            const hours = Math.floor(s.durationMinutes / 60);
            const mins = s.durationMinutes % 60;
            const cycles = (s.durationMinutes / 90).toFixed(1);

            return (
              <div
                key={s.id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:bg-white/[0.02] -mx-2 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-indigo-300 uppercase font-semibold">
                      {new Date(s.date).toLocaleDateString('vi-VN', { weekday: 'short' })}
                    </span>
                    <span className="font-bold text-xs text-white">
                      {new Date(s.date).getDate()}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-white">
                        {hours}h {mins > 0 ? `${mins}p` : ''}
                      </span>
                      <span className="text-xs text-slate-400">({timeFormat})</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-200 text-[10px] font-semibold">
                        {cycles} chu kỳ
                      </span>
                    </div>
                    {/* Tags List */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {s.tags.slice(0, 4).map((tId) => {
                        const tagObj = SLEEP_TAGS.find((t) => t.id === tId);
                        return (
                          <span
                            key={tId}
                            className={`text-[10px] px-2 py-0.5 rounded-lg border font-medium ${
                              tagObj?.type === 'positive'
                                ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                                : tagObj?.type === 'negative'
                                ? 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                                : 'bg-slate-900 border-white/10 text-slate-300'
                            }`}
                          >
                            {tagObj?.label || tId}
                          </span>
                        );
                      })}
                      {s.notes && (
                        <span className="text-[10px] text-slate-400 italic truncate max-w-xs">
                          "{s.notes}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-0 border-white/5 pt-2 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-xs font-medium">★ {s.quality}/5</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700" />
                    <span className="text-emerald-400 text-xs font-medium">⚡ {s.energyLevel}/5</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onOpenLogModal(s)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteSession(s.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
