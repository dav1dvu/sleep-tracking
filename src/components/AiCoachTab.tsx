'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Brain,
  Lightbulb,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { AiChatMessage, SleepSession, SleepStats, WeeklyAuditReport } from '@/types/sleep';

interface AiCoachTabProps {
  sessions: SleepSession[];
  stats: SleepStats;
  targetHours: number;
}

export function AiCoachTab({ sessions, stats, targetHours }: AiCoachTabProps) {
  // Chat state
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Xin chào! Tôi là **Dr. Somna**, trợ lý trí tuệ nhân tạo chuyên sâu về Y học Giấc ngủ & Nhịp sinh học (Chronobiology). Tôi nắm rõ dữ liệu giấc ngủ của bạn và sẵn sàng giải đáp mọi thắc mắc để giúp bạn thức dậy với 100% năng lượng mỗi sáng. Bạn muốn cải thiện điều gì hôm nay?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Audit state
  const [auditReport, setAuditReport] = useState<WeeklyAuditReport | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState<boolean>(false);

  const quickQuestions = [
    'Tại sao ngủ 8h mà thức dậy vẫn uể oải?',
    'Cách cắt cơn buồn ngủ lúc 14:00 chiều?',
    'Nên uống cà phê cữ cuối lúc mấy giờ?',
    'Làm sao để chìm vào giấc ngủ dưới 15 phút?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isSending) return;

    const userMsg: AiChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const userContext = {
        stats,
        targetHours,
        recentSessionsSummary: sessions.slice(0, 5).map((s) => ({
          date: s.date,
          hours: (s.durationMinutes / 60).toFixed(1),
          quality: s.quality,
          energy: s.energyLevel,
          tags: s.tags,
        })),
      };

      const res = await fetch('/api/ai/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          userContext,
        }),
      });

      const data = await res.json();
      const botReply: AiChatMessage = {
        id: `bot_${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Cảm ơn bạn đã chia sẻ!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorReply: AiChatMessage = {
        id: `err_${Date.now()}`,
        role: 'assistant',
        content:
          'Để duy trì năng lượng cao, hãy đảm bảo đón ánh nắng sáng tự nhiên trong 15 phút đầu tiên sau khi thức dậy để kích hoạt nhịp sinh học!',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setIsSending(false);
    }
  };

  const handleGenerateAudit = async () => {
    setIsGeneratingAudit(true);
    try {
      const res = await fetch('/api/ai/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats,
          recentSessions: sessions.slice(0, 7),
        }),
      });

      const report = await res.json();
      setAuditReport(report);
    } catch (err) {
      console.error('Audit generation failed:', err);
    } finally {
      setIsGeneratingAudit(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Intro Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-3">
            <Brain className="w-3.5 h-3.5" />
            NVIDIA Nemotron 3 Ultra 550B • OpenRouter
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Bác Sĩ Giấc Ngủ AI & Báo Cáo Tuần Lâm Sàng
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            Mô hình AI đọc trực tiếp dữ liệu thói quen và các phiên ngủ thực tế của bạn để đưa ra
            phác đồ cải thiện chuyên sâu, không lý thuyết suông.
          </p>
        </div>
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Section 1: Weekly Sleep Audit Report */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">
                Báo cáo tuần tự động (Clinical Weekly Audit)
              </h3>
              <p className="text-xs text-slate-400">
                Tổng hợp tình trạng nợ ngủ, tính đều đặn và 3 hành động khắc phục
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateAudit}
            disabled={isGeneratingAudit}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingAudit ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI đang phân tích dữ liệu...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{auditReport ? 'Phân tích lại tuần này' : 'Tạo báo cáo tuần ngay'}</span>
              </>
            )}
          </button>
        </div>

        {/* Audit Report View */}
        {auditReport ? (
          <div className="mt-6 space-y-6 animate-fadeIn">
            {/* Headline and Score Box */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-semibold tracking-wider text-purple-300">
                  {auditReport.chronotype}
                </span>
                <h4 className="font-bold text-lg sm:text-xl text-white mt-1">
                  {auditReport.headline}
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  {auditReport.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-3 bg-purple-900/30 p-4 rounded-2xl border border-purple-500/20">
                <div className="text-center">
                  <span className="text-[10px] text-purple-200 block uppercase font-medium">
                    Điểm phục hồi
                  </span>
                  <span className="font-bold text-3xl sm:text-4xl text-purple-300 font-mono">
                    {auditReport.overallScore}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/ 100</span>
                </div>
              </div>
            </div>

            {/* Insights & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Key Insights */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                <h5 className="font-semibold text-sm text-indigo-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Quan sát & Phát hiện y sinh</span>
                </h5>
                <ul className="space-y-2.5">
                  {auditReport.keyInsights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Micro-Habits */}
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-white/5 space-y-3">
                <h5 className="font-semibold text-sm text-emerald-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-emerald-400" />
                  <span>3 Hành động vi mô tối nay</span>
                </h5>
                <ul className="space-y-2.5">
                  {auditReport.recommendedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Debt Verdict */}
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Khuyến nghị nợ giấc ngủ:</strong> {auditReport.debtVerdict}
              </span>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400">
            <Brain className="w-10 h-10 text-indigo-400/40 mx-auto mb-3" />
            <p className="text-sm">Chưa có báo cáo tuần nào được tạo.</p>
            <p className="text-xs text-slate-500 mt-1">
              Nhấn nút "Tạo báo cáo tuần ngay" ở trên để AI tiến hành phân tích y sinh.
            </p>
          </div>
        )}
      </div>

      {/* Section 2: Interactive AI Sleep Doctor Chat */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/5 mb-6">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-white text-base">Hỏi đáp trực tiếp cùng Dr. Somna</h3>
            <p className="text-xs text-slate-400">
              Tư vấn giấc ngủ, mất ngủ, giải pháp caffeine, và các mẹo thư giãn thần kinh
            </p>
          </div>
        </div>

        {/* Quick Question Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
          <span className="text-xs text-slate-500 whitespace-nowrap">Gợi ý:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-500/40 text-xs text-slate-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                    : 'bg-slate-900/90 border border-white/10 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <span className="text-[10px] text-slate-400 block text-right mt-1.5 opacity-70">
                  {m.timestamp}
                </span>
              </div>

              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 animate-pulse" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-white/10 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150" />
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300" />
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-white/5">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Hỏi Dr. Somna về giấc ngủ của bạn (ví dụ: tối qua tôi ngủ hay thức giấc...)"
            disabled={isSending}
            className="flex-1 px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-lg shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
