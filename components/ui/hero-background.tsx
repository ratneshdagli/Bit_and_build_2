import React, { useEffect, useRef } from 'react';
import { Palette } from '@/lib/types';

function getReadableForeground(bg: string): string {
  // Simple luminance check for readable text color
  if (!bg.startsWith('#')) return '#fff';
  const hex = bg.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#222' : '#fff';
}

export const HeroBackground: React.FC<{ palette: Palette }> = ({ palette }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Pick 3 colors for gradients
  const colors = palette.colors.slice(0, 3).map(c => c.hex);
  const fallback = ['#232526', '#414345', '#232526'];
  const gradientColors = colors.length === 3 ? colors : fallback;
  const noiseUrl =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9QkQnAAAAABJRU5ErkJggg==';
  const readable = getReadableForeground(gradientColors[1]);

  useEffect(() => {
    // Parallax effect
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const handle = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      ref.current.style.setProperty('--parallax-x', `${(x - 0.5) * 20}px`);
      ref.current.style.setProperty('--parallax-y', `${(y - 0.5) * 20}px`);
    };
    window.addEventListener('mousemove', handle);
    return () => window.removeEventListener('mousemove', handle);
  }, []);

  return (
    <div
      ref={ref}
      className="hero-bg fixed inset-0 -z-10 w-full h-full pointer-events-none select-none"
      style={{
        background:
          `radial-gradient(ellipse 80% 60% at 50% 30%, ${gradientColors[0]} 0%, transparent 70%),` +
          `radial-gradient(ellipse 60% 40% at 70% 70%, ${gradientColors[1]} 0%, transparent 80%),` +
          `linear-gradient(120deg, ${gradientColors[2]} 0%, ${gradientColors[1]} 100%)`,
        color: readable,
        '--parallax-x': '0px',
        '--parallax-y': '0px',
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 w-full h-full mix-blend-soft-light opacity-40"
        style={{ backgroundImage: `url(${noiseUrl})` }}
      />
      {/* Parallax lights */}
      <div className="absolute left-[30%] top-[20%] w-96 h-96 rounded-full bg-white/10 blur-3xl animate-hero-float" style={{ transform: 'translate(var(--parallax-x), var(--parallax-y))' }} />
      <div className="absolute right-[20%] bottom-[10%] w-72 h-72 rounded-full bg-white/10 blur-2xl animate-hero-float2" style={{ transform: 'translate(calc(var(--parallax-x) * -0.7), calc(var(--parallax-y) * -0.7))' }} />
    </div>
  );
}

export function getHeroForeground(palette: Palette): string {
  const colors = palette.colors.slice(0, 3).map(c => c.hex);
  const fallback = ['#232526', '#414345', '#232526'];
  const gradientColors = colors.length === 3 ? colors : fallback;
  return getReadableForeground(gradientColors[1]);
}
