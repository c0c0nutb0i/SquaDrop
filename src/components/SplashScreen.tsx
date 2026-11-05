import React from 'react';
import { EmblemLogo } from './EmblemLogo';
import { ArrowRight, Sparkles, MapPin, Users, IndianRupee, Radio } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnter,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md transition-all duration-300">
      {/* Outer Card with subtle metallic pins matching the screenshot */}
      <div className="relative w-full max-w-md bg-[#141414] border border-[#2B2B2B] rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Corner metallic pin screws */}
        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-400 shadow-inner" />
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-400 shadow-inner" />
        <div className="absolute bottom-4 left-4 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-400 shadow-inner" />
        <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-neutral-600 border border-neutral-400 shadow-inner" />

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* High-Contrast Circular Emblem */}
        <div className="relative my-6 transition-transform hover:scale-105 duration-300">
          <EmblemLogo size={120} />
          {/* Subtle glow rim */}
          <div className="absolute -inset-2 rounded-full bg-white/10 blur-md -z-10" />
        </div>

        {/* Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 mb-2">
          Squadrop
        </h1>

        {/* Subtitle with dot indicator */}
        <div className="flex items-center gap-2 text-neutral-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-neutral-500" />
          <span>Hangouts made effortless</span>
        </div>

        {/* Location & Context Badge */}
        <div className="w-full bg-[#1A1A1A] border border-[#262626] rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2.5">
            <span className="flex items-center gap-1.5 font-semibold text-neutral-200">
              <MapPin size={13} className="text-white" />
              Bengaluru • Farmlore, Oia, Shiro & Lotus Pavilion
            </span>
            <span className="text-emerald-400 font-medium">Active Squad (5)</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-[#222222] rounded-xl p-2 border border-[#2E2E2E]">
              <Users size={14} className="mx-auto text-neutral-300 mb-1" />
              <div className="text-[11px] text-neutral-400">Match Engine</div>
              <div className="font-semibold text-white">4/5 Voted</div>
            </div>
            <div className="bg-[#222222] rounded-xl p-2 border border-[#2E2E2E]">
              <Radio size={14} className="mx-auto text-emerald-400 mb-1" />
              <div className="text-[11px] text-neutral-400">Voice Huddle</div>
              <div className="font-semibold text-emerald-400">Live (3)</div>
            </div>
            <div className="bg-[#222222] rounded-xl p-2 border border-[#2E2E2E]">
              <IndianRupee size={14} className="mx-auto text-neutral-300 mb-1" />
              <div className="text-[11px] text-neutral-400">UPI Split</div>
              <div className="font-semibold text-white">₹14,850</div>
            </div>
          </div>
        </div>

        {/* Enter Squadrop CTA Button */}
        <button
          onClick={onEnter}
          className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-neutral-100 text-black font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)] active:scale-[0.98]"
        >
          <span>Enter Bangalore Squadrop</span>
          <ArrowRight size={16} />
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="mt-3 text-xs text-neutral-500 hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Dismiss & continue
          </button>
        )}
      </div>
    </div>
  );
};
