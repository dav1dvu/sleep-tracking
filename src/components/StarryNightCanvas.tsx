'use client';

import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  cx: number; // percentage
  cy: number; // percentage
  r: number;
  color: string;
  glowColor: string;
  duration: number;
  delay: number;
}

export function StarryNightCanvas() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate the iconic 11 Van Gogh stars + background stardust
    const generatedStars: Star[] = [
      // 11 Principal Van Gogh Stars (positions inspired by Saint-Rémy canvas)
      { id: 1, cx: 85, cy: 12, r: 8, color: '#FEF08A', glowColor: 'rgba(253, 224, 71, 0.45)', duration: 4.2, delay: 0 },
      { id: 2, cx: 72, cy: 18, r: 5.5, color: '#FDE047', glowColor: 'rgba(245, 158, 11, 0.4)', duration: 3.8, delay: 0.6 },
      { id: 3, cx: 62, cy: 10, r: 6.5, color: '#FBBF24', glowColor: 'rgba(251, 191, 36, 0.4)', duration: 4.8, delay: 1.2 },
      { id: 4, cx: 48, cy: 22, r: 5, color: '#FEF08A', glowColor: 'rgba(254, 240, 138, 0.35)', duration: 3.5, delay: 0.4 },
      { id: 5, cx: 35, cy: 14, r: 7, color: '#FDE047', glowColor: 'rgba(245, 158, 11, 0.45)', duration: 5.0, delay: 1.8 },
      { id: 6, cx: 22, cy: 26, r: 5, color: '#FBBF24', glowColor: 'rgba(251, 191, 36, 0.35)', duration: 4.0, delay: 0.9 },
      { id: 7, cx: 12, cy: 15, r: 6, color: '#FEF08A', glowColor: 'rgba(253, 224, 71, 0.4)', duration: 4.5, delay: 1.5 },
      { id: 8, cx: 28, cy: 45, r: 4.5, color: '#FDE047', glowColor: 'rgba(245, 158, 11, 0.35)', duration: 3.2, delay: 0.3 },
      { id: 9, cx: 58, cy: 42, r: 5.5, color: '#FBBF24', glowColor: 'rgba(251, 191, 36, 0.4)', duration: 4.4, delay: 1.1 },
      { id: 10, cx: 78, cy: 50, r: 6, color: '#FEF08A', glowColor: 'rgba(253, 224, 71, 0.45)', duration: 3.9, delay: 0.7 },
      { id: 11, cx: 92, cy: 38, r: 4.5, color: '#FDE047', glowColor: 'rgba(245, 158, 11, 0.35)', duration: 4.6, delay: 1.4 },
    ];

    // Additional twinkling stardust particles
    for (let i = 12; i <= 32; i++) {
      generatedStars.push({
        id: i,
        cx: Math.floor(Math.random() * 96) + 2,
        cy: Math.floor(Math.random() * 88) + 4,
        r: Math.random() * 2 + 1.2,
        color: i % 2 === 0 ? '#FEF08A' : '#93C5FD',
        glowColor: i % 2 === 0 ? 'rgba(253, 224, 71, 0.3)' : 'rgba(147, 197, 253, 0.3)',
        duration: Math.random() * 3 + 2.5,
        delay: Math.random() * 3,
      });
    }

    setStars(generatedStars);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <svg
        className="w-full h-full object-cover"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Van Gogh Deep Cosmic Gradients */}
          <linearGradient id="cosmicSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#050814" />
            <stop offset="30%" stopColor="#09142E" />
            <stop offset="65%" stopColor="#0D1E4A" />
            <stop offset="85%" stopColor="#0B1634" />
            <stop offset="100%" stopColor="#040711" />
          </linearGradient>

          {/* Golden Moon Gradient */}
          <radialGradient id="crescentMoonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFBEB" stopOpacity="1" />
            <stop offset="35%" stopColor="#FDE047" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
          </radialGradient>

          {/* Swirling Brushstroke Gradients */}
          <linearGradient id="swirlBlue1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E3A8A" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#2563EB" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0D9488" stopOpacity="0.15" />
          </linearGradient>

          <linearGradient id="swirlGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.05" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FDE047" stopOpacity="0.05" />
          </linearGradient>

          {/* Cypress Silhouette Gradient */}
          <linearGradient id="cypressGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#020408" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#042F2E" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#0F766E" stopOpacity="0.1" />
          </linearGradient>

          {/* Glow Filters */}
          <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Base Sky Canvas */}
        <rect width="1440" height="900" fill="url(#cosmicSky)" />

        {/* Major Swirling Celestial Waves (Van Gogh Vortex) */}
        <g opacity="0.65">
          {/* Great Cosmic Swirl 1: Center-Left to Upper-Right */}
          <path
            d="M -100 320 C 300 180, 520 480, 850 260 C 1100 80, 1300 280, 1550 200"
            fill="none"
            stroke="url(#swirlBlue1)"
            strokeWidth="68"
            strokeLinecap="round"
            className="animate-pulse"
            style={{ animationDuration: '8s' }}
          />

          {/* Golden Starlight Current through the Swirl */}
          <path
            d="M -80 340 C 320 200, 540 500, 870 280 C 1120 100, 1320 300, 1570 220"
            fill="none"
            stroke="url(#swirlGold)"
            strokeWidth="24"
            strokeDasharray="14 18"
            strokeLinecap="round"
          />

          {/* Swirl 2: Counter-flow Vortex */}
          <path
            d="M 200 150 C 450 320, 750 120, 1100 350 C 1280 480, 1420 380, 1550 420"
            fill="none"
            stroke="#1D4ED8"
            strokeWidth="36"
            strokeOpacity="0.22"
            strokeDasharray="20 12"
          />

          {/* Swirl 3: Lower Ethereal Current */}
          <path
            d="M -50 560 C 250 420, 600 680, 950 480 C 1200 350, 1380 520, 1550 460"
            fill="none"
            stroke="url(#swirlBlue1)"
            strokeWidth="48"
            strokeLinecap="round"
            strokeOpacity="0.35"
          />
        </g>

        {/* The Iconic Van Gogh Crescent Moon (Upper Right) */}
        <g transform="translate(1220, 130)">
          {/* Giant Outer Starlight Corona */}
          <circle cx="0" cy="0" r="110" fill="url(#crescentMoonGlow)" opacity="0.4" />
          <circle cx="0" cy="0" r="75" fill="none" stroke="#FDE047" strokeWidth="2.5" strokeDasharray="6 8" opacity="0.6" className="animate-spin" style={{ animationDuration: '40s' }} />
          <circle cx="0" cy="0" r="55" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeOpacity="0.5" />
          
          {/* Luminous Crescent Moon Silhouette */}
          <path
            d="M 20 -40 A 45 45 0 1 0 20 40 A 35 35 0 0 1 20 -40 Z"
            fill="#FEF08A"
            filter="url(#starGlow)"
          />
        </g>

        {/* The 11 Saint-Rémy Stars with Concentric Halos */}
        {stars.map((star) => (
          <g key={star.id} transform={`translate(${(star.cx / 100) * 1440}, ${(star.cy / 100) * 900})`}>
            {/* Outer Corona Ripple */}
            <circle
              cx="0"
              cy="0"
              r={star.r * 5}
              fill={star.glowColor}
              className="animate-pulse"
              style={{
                animationDuration: `${star.duration}s`,
                animationDelay: `${star.delay}s`,
              }}
            />

            {/* Middle Concentric Light Ring */}
            <circle
              cx="0"
              cy="0"
              r={star.r * 2.8}
              fill="none"
              stroke={star.color}
              strokeWidth="1.2"
              strokeDasharray="3 4"
              opacity="0.6"
            />

            {/* Inner Radiant Star Core */}
            <circle
              cx="0"
              cy="0"
              r={star.r}
              fill={star.color}
              filter="url(#starGlow)"
            />
          </g>
        ))}

        {/* Majestic Cypress Silhouette (Left Foreground - Iconic Van Gogh Touch) */}
        <g opacity="0.35" transform="translate(40, 420)">
          <path
            d="M 30 500 C 15 360, 45 220, 20 120 C 10 70, 35 20, 50 -30 C 65 20, 90 80, 80 140 C 70 200, 105 320, 90 500 Z"
            fill="url(#cypressGradient)"
          />
        </g>

        {/* Distant Alpine Village Horizon Waves */}
        <path
          d="M 0 840 Q 220 790, 440 830 T 880 810 T 1320 830 T 1440 820 L 1440 900 L 0 900 Z"
          fill="#03060E"
          opacity="0.8"
        />
      </svg>
    </div>
  );
}
