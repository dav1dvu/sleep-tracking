'use client';

import React, { useState, useEffect } from 'react';
import {
  Moon,
  Clock,
  Wind,
  Bot,
  Award,
  Plus,
  RotateCw,
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { BottomNav, TabType } from '@/components/BottomNav';
import { DashboardTab } from '@/components/DashboardTab';
import { CircadianTab } from '@/components/CircadianTab';
import { RelaxTab } from '@/components/RelaxTab';
import { AiCoachTab } from '@/components/AiCoachTab';
import { SleepWrappedTab } from '@/components/SleepWrappedTab';
import { ZenSleepModal } from '@/components/ZenSleepModal';
import { LogSleepModal } from '@/components/LogSleepModal';
import { SettingsModal } from '@/components/SettingsModal';
import { StarryNightCanvas } from '@/components/StarryNightCanvas';
import {
  getStoredSessions,
  saveSession,
  deleteSession,
  getCircadianProfile,
  saveCircadianProfile,
  getActiveSleepStart,
  setActiveSleepStart,
} from '@/lib/storage';
import { computeSleepStats } from '@/lib/circadian';
import { soundEngine, SoundType } from '@/lib/audio-engine';
import { CircadianProfile, SleepSession, SleepStats } from '@/types/sleep';

export default function HomePage() {
  const [sessions, setSessions] = useState<SleepSession[]>([]);
  const [profile, setProfile] = useState<CircadianProfile>(getCircadianProfile());
  const [activeSleepStart, setActiveSleepStartState] = useState<number | null>(null);
  const [activeSound, setActiveSound] = useState<SoundType | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMounted, setIsMounted] = useState<boolean>(false);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<SleepSession | null>(null);
  const [isZenModalOpen, setIsZenModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // Initial client load
  useEffect(() => {
    setIsMounted(true);
    const loadedSessions = getStoredSessions();
    setSessions(loadedSessions);
    setProfile(getCircadianProfile());
    setActiveSleepStartState(getActiveSleepStart());
  }, []);

  const stats: SleepStats = computeSleepStats(sessions, profile.targetHours);

  // Sound handlers
  const handlePlaySound = (type: SoundType, volume: number = 0.65, timerMinutes: number = 30) => {
    soundEngine.play(type, volume, timerMinutes, () => {
      setActiveSound(null);
    });
    setActiveSound(type);
  };

  const handleStopSound = () => {
    soundEngine.stopWithFade(1.0);
    setActiveSound(null);
  };

  // Active sleep mode handlers
  const handleStartSleeping = () => {
    const now = Date.now();
    setActiveSleepStart(now);
    setActiveSleepStartState(now);
    setIsZenModalOpen(true);
  };

  const handleWakeUp = (bedtimeMs: number, wakeTimeMs: number) => {
    setActiveSleepStart(null);
    setActiveSleepStartState(null);
    setIsZenModalOpen(false);

    setEditingSession(null);
    setIsLogModalOpen(true);
  };

  // Session saving
  const handleSaveSession = (newSession: SleepSession) => {
    const updated = saveSession(newSession);
    setSessions(updated);
  };

  const handleDeleteSession = (id: string) => {
    const updated = deleteSession(id);
    setSessions(updated);
  };

  // Profile saving
  const handleSaveProfile = (newProfile: CircadianProfile) => {
    setProfile(newProfile);
    saveCircadianProfile(newProfile);
  };

  const desktopTabs: { id: TabType; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Hôm nay & Nhật ký', icon: Moon },
    { id: 'circadian', label: 'Chu kỳ 90P', icon: Clock },
    { id: 'relax', label: 'Ru ngủ & Thở', icon: Wind },
    { id: 'aicoach', label: 'Bác sĩ AI', icon: Bot, badge: 'Nemotron' },
    { id: 'wrapped', label: 'Thẻ ngủ Wrapped', icon: Award },
  ];

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070B18] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10 animate-pulse">
            <Moon className="w-6 h-6 text-amber-400" />
          </div>
          <span className="text-xs font-mono text-amber-300/80 tracking-widest">SOMNA • STARRY NIGHT...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Dynamic Animated Starry Night Canvas Background */}
      <StarryNightCanvas />

      {/* Top Fixed Navbar */}
      <Navbar
        onOpenLogModal={() => {
          setEditingSession(null);
          setIsLogModalOpen(true);
        }}
        onOpenZenModal={() => setIsZenModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        activeSleepTime={activeSleepStart}
        activeSound={activeSound}
        onStopSound={handleStopSound}
      />

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 pb-24 md:pb-8">
        {/* Desktop-only Tab Switcher */}
        <div className="hidden md:flex items-center gap-2 pb-2 border-b border-amber-400/15">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'btn-starry-gold text-slate-950 shadow-md shadow-amber-500/20 border border-amber-300'
                    : 'bg-[#0B1530]/70 hover:bg-[#0F1E44] text-slate-300 hover:text-white border border-white/10'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${
                    isActive ? 'bg-black/20 text-slate-950 border-black/30' : 'bg-purple-500/30 text-purple-200 border-purple-400/40'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content Display */}
        <div className="py-1">
          {activeTab === 'dashboard' && (
            <DashboardTab
              sessions={sessions}
              stats={stats}
              targetHours={profile.targetHours}
              onOpenLogModal={(sessionToEdit) => {
                setEditingSession(sessionToEdit || null);
                setIsLogModalOpen(true);
              }}
              onOpenZenModal={() => setIsZenModalOpen(true)}
              activeSleepStart={activeSleepStart}
              onStartSleeping={handleStartSleeping}
              onDeleteSession={handleDeleteSession}
            />
          )}

          {activeTab === 'circadian' && (
            <CircadianTab
              profile={profile}
              onUpdateProfile={handleSaveProfile}
            />
          )}

          {activeTab === 'relax' && (
            <RelaxTab
              activeSound={activeSound}
              onPlaySound={handlePlaySound}
              onStopSound={handleStopSound}
            />
          )}

          {activeTab === 'aicoach' && (
            <AiCoachTab
              sessions={sessions}
              stats={stats}
              targetHours={profile.targetHours}
            />
          )}

          {activeTab === 'wrapped' && (
            <SleepWrappedTab
              sessions={sessions}
              stats={stats}
              targetHours={profile.targetHours}
            />
          )}
        </div>
      </main>

      {/* Floating Action Button for Mobile (+ Ghi nhận luôn sẵn sàng) */}
      <button
        onClick={() => {
          setEditingSession(null);
          setIsLogModalOpen(true);
        }}
        className="md:hidden fixed bottom-20 right-4 z-40 w-13 h-13 rounded-2xl btn-starry-gold flex items-center justify-center shadow-xl shadow-amber-500/30 border border-amber-300 active:scale-95 transition-transform cursor-pointer"
        aria-label="Ghi nhận giấc ngủ"
        title="Ghi nhận giấc ngủ"
      >
        <Plus className="w-6 h-6 text-slate-950 stroke-[3]" />
      </button>

      {/* Mobile Bottom Navigation Bar (Fixed for phone screens) */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Starry Night Footer with Van Gogh Quote & Cache-Buster Action */}
      <footer className="relative z-10 border-t border-amber-400/20 bg-[#050814]/90 backdrop-blur-md py-6 text-xs text-slate-400 pb-24 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-white tracking-wide">SOMNA</span>
              <span className="text-amber-300 font-semibold">• The Starry Night (v2.0)</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="italic text-slate-400">
              &ldquo;Ngắm nhìn những vì sao luôn khiến tôi mơ mộng.&rdquo; — Vincent van Gogh
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if ('caches' in window) {
                  caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))));
                }
                window.location.reload();
              }}
              className="h-9 px-3.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Xóa cache và tải bản mới nhất từ Vercel"
            >
              <RotateCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Làm mới bản mới nhất</span>
            </button>
            <span className="text-slate-400 font-mono">Build 2026.11</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ZenSleepModal
        isOpen={isZenModalOpen}
        onClose={() => setIsZenModalOpen(false)}
        activeSleepStart={activeSleepStart}
        onStartSleeping={handleStartSleeping}
        onWakeUp={handleWakeUp}
        activeSound={activeSound}
        onPlaySound={handlePlaySound}
        onStopSound={handleStopSound}
      />

      <LogSleepModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingSession(null);
        }}
        onSave={handleSaveSession}
        editingSession={editingSession}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        sessions={sessions}
        onUpdateSessions={setSessions}
      />
    </div>
  );
}
