import React, { useState } from 'react';
import { AIMatchmakerResult, VenueCard } from '../types';
import {
  Sparkles,
  ArrowRight,
  X,
  Bot,
  Zap,
  TrendingUp,
  MapPin,
  CircleDollarSign,
  Users,
  Compass,
  CheckCircle2,
  Sliders,
} from 'lucide-react';

interface AIMatchmakerBannerProps {
  matchmakerResult: AIMatchmakerResult;
  venues: VenueCard[];
  onSelectVenue: (venueId: string) => void;
  onGoToHub?: () => void;
  className?: string;
}

export const AIMatchmakerBanner: React.FC<AIMatchmakerBannerProps> = ({
  matchmakerResult,
  venues,
  onSelectVenue,
  onGoToHub,
  className = '',
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const currentVenue =
    venues.find((v) => v.id === matchmakerResult.unlockedVenueId) || venues[0];

  return (
    <>
      {/* High-Contrast Interactive Top Match Unlocked Banner */}
      <div
        className={`relative flex items-center justify-between gap-3 bg-[#181818] border border-[#2E2E2E] hover:border-neutral-400 rounded-2xl px-3.5 py-2.5 transition-all shadow-md group ${className}`}
      >
        {/* Glow indicator line */}
        <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none" />

        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-black border border-emerald-500/50 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            <Zap size={14} className="fill-emerald-400" />
          </div>

          <div className="text-xs truncate">
            <span className="font-extrabold text-white">
              ⚡ AI Matchmaker Unlocked:{' '}
            </span>
            <span className="text-emerald-400 font-bold">
              {matchmakerResult.unlockedVenueName}
            </span>
            <span className="text-neutral-400 font-medium ml-1">
              ({matchmakerResult.votesCount}/{matchmakerResult.totalSquad} Squad Members Voted Yes)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1 bg-white hover:bg-neutral-200 text-black text-[11px] font-extrabold px-3 py-1 rounded-full cursor-pointer transition-all active:scale-95 shadow-sm"
          >
            <span>View Details</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="text-neutral-500 hover:text-white p-1 cursor-pointer transition-colors"
            title="Dismiss banner"
          >
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Smart Hangout & Venue Matchmaker Deep Analysis Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-md w-full p-5 sm:p-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-black border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.2 rounded-full">
                      Intelligent Mediation Engine
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-0.5">
                    Smart Hangout & Venue Matchmaker
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Solved decision fatigue with real-time squad mediation
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 cursor-pointer transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Unlocked Winning Destination Highlight */}
            <div className="bg-[#1A1A1A] border border-[#2B2B2B] rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-400 font-medium">Optimal Squad Choice</span>
                <span className="font-mono text-emerald-400 font-extrabold flex items-center gap-1">
                  <TrendingUp size={13} />
                  <span>{matchmakerResult.groupOverlapPercent}% Overlap</span>
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-neutral-900 border border-[#333333] shrink-0">
                  <img
                    src={currentVenue?.image}
                    alt={currentVenue?.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-base font-extrabold text-white truncate">
                    {currentVenue?.name}
                  </h4>
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                    <MapPin size={11} className="text-amber-400 shrink-0" />
                    <span>{currentVenue?.area}</span>
                  </div>
                  <div className="text-[11px] text-emerald-300 font-medium mt-1">
                    {matchmakerResult.votesCount}/{matchmakerResult.totalSquad} Squad Members Confirmed
                  </div>
                </div>
              </div>
            </div>

            {/* AI Decision Matrices */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {/* Metric 1: Budget Constraint */}
              <div className="bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                  <CircleDollarSign size={13} className="text-emerald-400" />
                  <span className="font-semibold text-white">Budget Fit</span>
                </div>
                <div className="text-xs font-bold text-neutral-200">
                  {matchmakerResult.budgetRationale}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Index: {matchmakerResult.metrics.budgetScore}/100
                </div>
              </div>

              {/* Metric 2: Travel Distance */}
              <div className="bg-[#1C1C1C] border border-[#2B2B2B] rounded-xl p-3 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                  <Compass size={13} className="text-sky-400" />
                  <span className="font-semibold text-white">Commute & Distance</span>
                </div>
                <div className="text-xs font-bold text-neutral-200">
                  {matchmakerResult.travelRationale}
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">
                  Transit: {matchmakerResult.metrics.commuteScore}/100
                </div>
              </div>
            </div>

            {/* Squad Vibe Consensus Pill / Banner */}
            <div className="bg-[#1A1A1A] border border-emerald-900/40 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Users size={15} />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Group Consensus Summary
                </div>
                <div className="text-xs font-bold text-white mt-0.5 leading-snug">
                  {matchmakerResult.vibeConsensusText}
                </div>
              </div>
            </div>

            {/* AI Decision Rationale List */}
            <div className="bg-[#181818] border border-[#262626] rounded-2xl p-3.5 mb-5 space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-400" />
                <span>AI Mediation Rationale</span>
              </div>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                {matchmakerResult.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold shrink-0">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Switcher Simulation for testing venues */}
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center justify-between">
                <span>Simulate Other Bangalore Venues</span>
                <span className="text-[9px] text-neutral-500">Live test</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {venues.map((v) => {
                  const isCurrent = v.id === matchmakerResult.unlockedVenueId;
                  return (
                    <button
                      key={v.id}
                      onClick={() => onSelectVenue(v.id)}
                      className={`py-1.5 px-2.5 rounded-xl text-[11px] font-semibold text-left truncate border transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#222222] border-white text-white'
                          : 'bg-[#181818] border-[#2A2A2A] text-neutral-400 hover:text-white hover:border-neutral-500'
                      }`}
                    >
                      <span>{v.shortName}</span>
                      {v.id === 'oia-bangalore' && (
                        <span className="text-[9px] text-emerald-400 ml-1 font-mono">
                          (4/5 Yes)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowModal(false);
                  if (onGoToHub) onGoToHub();
                }}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-lg"
              >
                <span>Pin to Hub Itinerary & Split Tab</span>
                <ArrowRight size={13} />
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="py-3 px-4 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] text-neutral-300 font-semibold text-xs cursor-pointer border border-[#333333]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
