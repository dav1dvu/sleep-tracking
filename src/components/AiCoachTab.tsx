'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Brain,
  Lightbulb,
  FileText,
} from 'lucide-react';
import { AiChatMessage, SleepSession, SleepStats, WeeklyAuditReport } from '@/types/sleep';

interface AiCoachTabProps {
  sessions: SleepSession[];
  stats: SleepStats;
  targetHours: number;
}

export function AiCoachTab({ sessions, stats, targetHours }: AiCoachTabProps) {
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Xin chào! Tôi là **Dr. Somna**, trợ lý chuyên sâu về giấc ngủ. Tôi đã đọc các số liệu giấc ngủ gần đây của bạn. Bạn muốn tôi tư vấn hoặc cải thiện điều gì?',
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Audit state
  const [auditReport, setAuditReport] = useState<WeeklyAuditReport | null>(null);
  const [isGeneratingAudit, setIsGeneratingAudit] = useState<boolean>(false);

  const quickQuestions = [
    'Tại sao ngủ 8 tiếng dậy vẫn mệt?',
    'Cách cắt cơn buồn ngủ chiều?',
    'Giờ uống cà phê cữ cuối?',
    'Mẹo ngủ nhanh dưới 15 phút?',
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
          'Để cơ thể hồi phục tối ưu, hãy cố gắng dậy cùng một giờ mỗi sáng và đón ánh nắng tự nhiên trong 15 phút đầu ngày nhé!',
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-20 md:pb-8">
      {/* Title */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
          Bác sĩ giấc ngủ AI
        </h2>
        <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
          Tư vấn giải pháp phục hồi năng lượng dựa trên dữ liệu nhật ký thực tế của bạn.
        </p>
      </div>

      {/* Weekly Audit Section */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
          <div>
            <h3 className="font-bold text-lg text-white">Báo cáo đánh giá tuần</h3>
            <p className="text-xs text-slate-400">Đánh giá điểm phục hồi và 3 lời khuyên tối nay</p>
          </div>

          <button
            onClick={handleGenerateAudit}
            disabled={isGeneratingAudit}
            className="w-full sm:w-auto h-12 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-bold shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingAudit ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Đang phân tích...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{auditReport ? 'Phân tích lại tuần này' : 'Chấm điểm tuần này'}</span>
              </>
            )}
          </button>
        </div>

        {auditReport ? (
          <div className="space-y-5 animate-fadeIn">
            {/* Score & Headline */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-slate-900 border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                  {auditReport.chronotype}
                </span>
                <h4 className="font-extrabold text-lg sm:text-xl text-white mt-1">
                  {auditReport.headline}
                </h4>
                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                  {auditReport.summary}
                </p>
              </div>

              <div className="shrink-0 flex items-center justify-center bg-purple-900/40 p-4 rounded-2xl border border-purple-500/30 text-center">
                <div>
                  <span className="text-xs text-purple-200 block font-bold uppercase">
                    Điểm phục hồi
                  </span>
                  <span className="font-mono text-4xl font-extrabold text-purple-300">
                    {auditReport.overallScore}
                  </span>
                  <span className="text-xs text-slate-400 block">/ 100</span>
                </div>
              </div>
            </div>

            {/* Insights & Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5">
                <h5 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Điểm cần lưu ý</span>
                </h5>
                <ul className="space-y-2">
                  {auditReport.keyInsights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/70 border border-white/10 space-y-2.5">
                <h5 className="font-bold text-sm text-emerald-300 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>3 Việc nên làm tối nay</span>
                </h5>
                <ul className="space-y-2">
                  {auditReport.recommendedActions.map((action, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">
            <Brain className="w-10 h-10 text-indigo-400/40 mx-auto mb-2" />
            <p className="text-sm font-medium">Chưa có báo cáo tuần.</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Bấm nút "Chấm điểm tuần này" ở trên để AI đánh giá ngay.
            </p>
          </div>
        )}
      </div>

      {/* Interactive Chat */}
      <div className="glass-panel p-5 sm:p-7 rounded-3xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-4">
          <Bot className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-white text-base">Hỏi đáp cùng Dr. Somna</h3>
        </div>

        {/* Quick Suggestion Chips: Comfortable 40px height */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(q)}
              className="h-10 px-4 rounded-xl bg-slate-900 border border-white/10 hover:border-indigo-400/50 text-xs text-slate-300 font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 active:scale-95"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1 mb-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white font-medium shadow-md'
                    : 'bg-slate-900 border border-white/10 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>
                <span className="text-xs text-slate-400 block text-right mt-1.5 opacity-60">
                  {m.timestamp}
                </span>
              </div>

              {m.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
              <Bot className="w-4 h-4 animate-pulse text-indigo-400" />
              <span>Dr. Somna đang suy nghĩ câu trả lời...</span>
            </div>
          )}
        </div>

        {/* Big Input Bar */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Hỏi về giấc ngủ của bạn..."
            disabled={isSending}
            className="flex-1 h-13 px-4 rounded-2xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-400"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={isSending || !inputMessage.trim()}
            className="w-13 h-13 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 flex items-center justify-center cursor-pointer shadow-md shadow-indigo-600/25 shrink-0 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
