import React from 'react';
import { TabType } from '../types';
import { Layers, LayoutGrid, Radio, CircleDollarSign } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  matchUnlocked?: boolean;
  matchedVenueName?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  matchUnlocked = true,
}) => {
  const tabs = [
    {
      id: 'swipe' as TabType,
      label: 'Swipe',
      icon: Layers,
      badge: matchUnlocked ? 'Match' : null,
    },
    {
      id: 'hub' as TabType,
      label: 'Hub',
      icon: LayoutGrid,
      badge: '5 Ready',
    },
    {
      id: 'huddle' as TabType,
      label: 'Huddle',
      icon: Radio,
      badge: 'Live',
    },
    {
      id: 'split' as TabType,
      label: 'Split',
      icon: CircleDollarSign,
      badge: null,
    },
  ];

  return (
    <nav className="w-full bg-[#141414] text-white border-t border-[#262626] shadow-[0_-4px_24px_rgba(0,0,0,0.6)] backdrop-blur-md">
      <div className="grid grid-cols-4 items-center max-w-lg mx-auto h-16 px-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center py-1 transition-all duration-150 active:scale-95 group cursor-pointer focus:outline-none"
            >
              {/* Badge indicator */}
              {tab.badge && (
                <span
                  className={`absolute -top-1.5 px-1.5 py-0.2 text-[9px] font-bold rounded-full tracking-wide shadow-xs border ${
                    tab.id === 'huddle'
                      ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                      : 'bg-[#242424] text-neutral-200 border-[#383838]'
                  }`}
                >
                  {tab.badge}
                </span>
              )}

              {/* Icon */}
              <div
                className={`p-1 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'text-white scale-110 font-bold'
                    : 'text-[#A1A1AA] group-hover:text-white'
                }`}
              >
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="transition-transform"
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight transition-colors ${
                  isActive
                    ? 'text-white font-extrabold'
                    : 'text-[#A1A1AA] font-medium group-hover:text-white'
                }`}
              >
                {tab.label}
              </span>

              {/* Active Bottom Dot indicator */}
              {isActive && (
                <span className="w-1 h-1 rounded-full mt-0.5 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
