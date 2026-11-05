import React from 'react';
import { EmblemLogo } from './EmblemLogo';
import { Smartphone, Monitor, Sparkles, ChevronDown } from 'lucide-react';
import { VenueCard } from '../types';

interface HeaderProps {
  onOpenSplash: () => void;
  activeTabName: string;
  venues: VenueCard[];
  activeVenueId: string;
  onSelectVenue: (venueId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSplash,
  activeTabName,
  venues,
  activeVenueId,
  onSelectVenue,
}) => {
  const currentVenue = venues.find((v) => v.id === activeVenueId) || venues[0];

  return (
    <header
      style={{ paddingTop: 'max(10px, env(safe-area-inset-top))' }}
      className="sticky top-0 z-40 w-full bg-[#0D0D0D]/95 backdrop-blur-md border-b border-[#222222] px-3.5 sm:px-4 pb-2.5 shrink-0"
    >
      <div className="max-w-xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left: Squadrop Brand Wordmark with circular emblem & Venue Quick Switcher */}
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={onOpenSplash}
            title="Open Squadrop Splash Screen"
            className="flex items-center gap-2 group cursor-pointer text-left transition-opacity hover:opacity-90 shrink-0"
          >
            <EmblemLogo size={28} />
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white group-hover:text-neutral-200">
                Squadrop
              </span>
              <span className="w-1 h-1 rounded-full bg-neutral-600" />
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-semibold truncate">
                {activeTabName}
              </span>
            </div>
          </button>
        </div>

        {/* Right: Active Bangalore Venue Switcher Dropdown & Active Status Pill */}
        <div className="flex items-center gap-2">
          {/* Active Bangalore Venue Switcher Dropdown */}
          <div className="relative flex items-center">
            <select
              value={activeVenueId}
              onChange={(e) => onSelectVenue(e.target.value)}
              className="appearance-none bg-[#1A1A1A] border border-[#2B2B2B] hover:border-neutral-500 text-[11px] font-semibold text-white pl-2.5 pr-6 py-1 rounded-full cursor-pointer focus:outline-none transition-colors max-w-[130px] truncate"
              title="Switch Active Bangalore Venue across screens"
            >
              {venues.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#181818] text-white">
                  📍 {v.shortName}
                </option>
              ))}
            </select>
            <ChevronDown size={11} className="absolute right-2 pointer-events-none text-neutral-400" />
          </div>

          {/* Splash Reopen */}
          <button
            onClick={onOpenSplash}
            className="flex items-center gap-1 text-xs text-neutral-300 bg-[#1A1A1A] border border-[#262626] hover:border-neutral-500 px-2.5 py-1.5 rounded-full transition-colors cursor-pointer"
            title="View Monochrome Brand Splash Card"
          >
            <Sparkles size={12} className="text-neutral-300" />
            <span className="hidden sm:inline">Splash</span>
          </button>

          {/* Squad Status Pill (matching screenshot: `ACTIVE` with host avatar) */}
          <div className="flex items-center gap-2 bg-[#1A1A1A] border border-[#262626] pl-2.5 pr-1 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-neutral-300">
              Active
            </span>
            <div className="w-6 h-6 rounded-full overflow-hidden border border-neutral-600 bg-neutral-800 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                alt="Ananya"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
