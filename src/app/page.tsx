'use client';

import React, { useState, useEffect } from 'react';
import {
  Moon,
  Clock,
  Wind,
  Bot,
  Award,
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
      <div className="min-h-screen flex items-center justify-center bg-[#06080F] text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shadow-lg shadow-indigo-500/10 animate-pulse">
            <Moon className="w-6 h-6 text-indigo-400" />
          </div>
          <span className="text-xs font-mono text-slate-500 tracking-widest">SOMNA INTELLIGENCE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#06080F] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7 space-y-6 pb-24 md:pb-8">
        {/* Desktop-only Tab Switcher */}
        <div className="hidden md:flex items-center gap-2 pb-2 border-b border-white/5">
          {desktopTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 border border-indigo-400/40'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/30 text-purple-200 border border-purple-400/40">
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

          {activeTab === 'circadian' && <CircadianTab />}

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

      {/* Mobile Bottom Navigation Bar (Fixed for phone screens) */}
      <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Desktop Footer */}
      <footer className="hidden md:block border-t border-white/5 bg-[#04060a] py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">SOMNA</span>
            <span>• Nền tảng theo dõi giấc ngủ chuẩn khoa học y sinh</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Chu kỳ 90 Phút & Curfew nhịp sinh học</span>
            <span>•</span>
            <span>AI: Nemotron 3 Ultra</span>
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
