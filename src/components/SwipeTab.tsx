import React, { useState } from 'react';
import { VenueCard, SquadMember, AIMatchmakerResult } from '../types';
import { AIMatchmakerBanner } from './AIMatchmakerBanner';
import { VENUE_AI_PROFILES } from '../services/aiMatchmaker';
import {
  X,
  Heart,
  Star,
  Info,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  Users,
  Navigation,
  ChevronRight,
  Building,
  Car,
  Bell,
  Check,
  Radio,
  Bot,
  Zap,
} from 'lucide-react';

interface SwipeTabProps {
  venues: VenueCard[];
  members: SquadMember[];
  activeVenue: VenueCard;
  onSelectVenue: (venueId: string) => void;
  onGoToHub: () => void;
  matchmakerResult: AIMatchmakerResult;
  onUserSwipe?: (venueId: string, action: 'like' | 'skip' | 'priority') => void;
}

export const SwipeTab: React.FC<SwipeTabProps> = ({
  venues,
  members,
  activeVenue,
  onSelectVenue,
  onGoToHub,
  matchmakerResult,
  onUserSwipe,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('All Ideas');
  const [matchBannerVisible, setMatchBannerVisible] = useState(true);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedVenueModal, setSelectedVenueModal] = useState<VenueCard | null>(null);
  const [showVotingMatrixModal, setShowVotingMatrixModal] = useState(false);
  const [kabirVoted, setKabirVoted] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [swipeFeedback, setSwipeFeedback] = useState<'like' | 'skip' | 'priority' | null>(null);
  const [userVotes, setUserVotes] = useState<Record<string, 'liked' | 'skipped' | 'priority'>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filters = [
    'All Ideas',
    'Farm-to-Table',
    'Luxury Lounge',
    'Mediterranean',
    'Pan-Asian & Sushi',
  ];

  const filteredVenues = venues.filter((v) => {
    if (activeFilter === 'All Ideas') return true;
    if (activeFilter === 'Farm-to-Table') return v.tags.includes('Farm-to-Table') || v.tags.includes('Sustainable');
    if (activeFilter === 'Luxury Lounge') return v.category === 'Luxury Lounge' || v.tags.includes('High Tea');
    if (activeFilter === 'Mediterranean') return v.tags.includes('Mediterranean') || v.tags.includes('Greek');
    if (activeFilter === 'Pan-Asian & Sushi') return v.tags.includes('Pan-Asian') || v.tags.includes('Japanese') || v.tags.includes('Sushi');
    return true;
  });

  const currentVenue = filteredVenues[currentIndex] || null;

  const handleSwipe = (action: 'like' | 'skip' | 'priority') => {
    if (!currentVenue) return;

    setSwipeFeedback(action);
    const voteType = action === 'like' ? 'liked' : action === 'skip' ? 'skipped' : 'priority';
    setUserVotes((prev) => ({ ...prev, [currentVenue.id]: voteType }));
    if (onUserSwipe) {
      onUserSwipe(currentVenue.id, action);
    }

    if (action === 'like') {
      onSelectVenue(currentVenue.id);
      showToast(`You dropped in to ${currentVenue.name}! 3 of your friends have also voted for this same place.`);
    } else if (action === 'priority') {
      onSelectVenue(currentVenue.id);
      showToast(`Priority vote cast for ${currentVenue.name}! (3 friends also voted for this place)`);
    } else {
      showToast(`Skipped ${currentVenue.name} quietly`);
    }

    const duration = action === 'like' ? 1200 : 350;
    setTimeout(() => {
      setSwipeFeedback(null);
      if (currentIndex < filteredVenues.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setCurrentIndex(filteredVenues.length);
      }
    }, duration);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
    setUserVotes({});
  };

  const handleNudgeKabir = () => {
    showToast('Sent real-time WhatsApp & push nudge to Kabir Mehta!');
  };

  const handleSimulateKabirVote = () => {
    setKabirVoted(true);
    showToast('Kabir Mehta just voted "Drop In" for Shiro from Manyata Tech Park! (4/5 Voted for Shiro)');
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full pb-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white border border-[#383838] px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl animate-in fade-in flex items-center gap-2 max-w-[92vw] text-center">
          <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
          <span className="leading-tight">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Match Unlocked Banner (Smart Hangout & Venue Matchmaker) */}
      <AIMatchmakerBanner
        matchmakerResult={matchmakerResult}
        venues={venues}
        onSelectVenue={onSelectVenue}
        onGoToHub={onGoToHub}
      />

      {/* 2. Squad Voting Progress Header (INTERACTABLE: Tap to show who is voting and their real-time locations) */}
      <button
        type="button"
        onClick={() => setShowVotingMatrixModal(true)}
        className="w-full bg-[#141414] hover:bg-[#1A1A1A] border border-[#262626] hover:border-neutral-500 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all duration-200 cursor-pointer shadow-sm group active:scale-[0.99] focus:outline-none"
        title="Tap to see who is voting and where they are voting from in real-time"
      >
        {/* Avatars Stack */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex -space-x-2 shrink-0">
            <div className="w-8 h-8 rounded-full border-2 border-[#141414] bg-neutral-800 text-[11px] font-bold text-white flex items-center justify-center">
              AS
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#141414] bg-neutral-700 text-[11px] font-bold text-white flex items-center justify-center">
              RV
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-[#141414] bg-neutral-900 text-[10px] font-semibold text-neutral-300 flex items-center justify-center">
              +3
            </div>
          </div>

          <div className="min-w-0">
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
              <span>Bangalore Fine Dining & Social</span>
              <ChevronRight size={13} className="text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="text-[11px] text-neutral-400 truncate flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              <span>5 voting in real-time • Tap to view locations</span>
            </div>
          </div>
        </div>

        {/* Voting count badge */}
        <div className="text-right shrink-0">
          <div className="text-xs font-extrabold text-white bg-[#202020] px-2.5 py-1 rounded-full border border-[#2F2F2F] group-hover:border-neutral-400 transition-colors">
            {kabirVoted ? '4 / 5 Voted' : '3 / 5 Voted'}
          </div>
          <div className="text-[10px] text-neutral-400 mt-0.5">
            {kabirVoted ? 'Consensus 80%' : '3 Friends Voted Shiro'}
          </div>
        </div>
      </button>

      {/* 3. Filter Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setCurrentIndex(0);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-white text-black border-white font-bold'
                  : 'bg-[#1A1A1A] text-neutral-400 border-[#262626] hover:text-white'
              }`}
            >
              {filter === 'All Ideas' && <span className="mr-1">∞</span>}
              {filter}
            </button>
          );
        })}
      </div>

      {/* 4. Real Bangalore Venue Stacked Card Display */}
      {currentVenue ? (
        <div className="relative rounded-3xl overflow-hidden bg-[#161616] border border-[#262626] shadow-xl flex flex-col group transition-all">
          {/* Swiping Feedback Overlay */}
          {swipeFeedback && (
            <div
              className={`absolute inset-0 z-30 flex items-center justify-center p-5 text-center backdrop-blur-xs transition-opacity duration-200 ${
                swipeFeedback === 'like'
                  ? 'bg-emerald-950/85'
                  : swipeFeedback === 'skip'
                  ? 'bg-rose-950/75'
                  : 'bg-amber-950/75'
              }`}
            >
              <div className="bg-[#121212]/95 border border-white/20 rounded-3xl p-5 flex flex-col items-center gap-2.5 text-white max-w-xs shadow-2xl animate-in zoom-in-95">
                {swipeFeedback === 'like' && (
                  <>
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
                      <Heart className="text-emerald-400 fill-emerald-400" size={26} />
                    </div>
                    <div className="text-sm font-extrabold text-white leading-snug">
                      You dropped in to {currentVenue.name}!
                    </div>
                    <div className="text-xs text-emerald-300 font-semibold bg-emerald-950/70 border border-emerald-800/80 px-3 py-1.5 rounded-full leading-tight">
                      3 of your friends have also voted for this same place.
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      (Aarav, Ananya & Rohan also dropped in)
                    </div>
                  </>
                )}
                {swipeFeedback === 'skip' && (
                  <>
                    <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
                      <X className="text-rose-400" size={26} />
                    </div>
                    <span className="text-sm font-bold text-white">Skipped {currentVenue.shortName}</span>
                    <span className="text-[11px] text-neutral-400">Not shared with the squad</span>
                  </>
                )}
                {swipeFeedback === 'priority' && (
                  <>
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
                      <Star className="text-amber-400 fill-amber-400" size={26} />
                    </div>
                    <span className="text-sm font-bold text-white">Priority Vote Added!</span>
                    <span className="text-[11px] text-neutral-300">Boosted {currentVenue.shortName} in squad quorum</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Card Image Container with Badges */}
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
            <img
              src={currentVenue.image}
              alt={currentVenue.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            {/* Dark gradient overlay for bottom text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/60 pointer-events-none" />

            {/* Top Left: Friends Swiped Right badge */}
            {currentVenue.swipedRightBy.length > 0 && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[11px] text-white">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{currentVenue.swipedRightBy.join(' & ')} swiped Right!</span>
              </div>
            )}

            {/* Top Right: Distance & Real Neighborhood badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[11px] text-neutral-300">
              <MapPin size={11} className="text-neutral-400" />
              <span>{currentVenue.distance} • {currentVenue.area.split(',')[0]}</span>
            </div>

            {/* Bottom Floating Badges on Image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-white font-semibold">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span>{currentVenue.rating}</span>
                <span className="text-neutral-400 text-[10px]">({currentVenue.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-neutral-300 text-[11px]">
                <Clock size={11} className="text-neutral-400" />
                <span>Open: {currentVenue.openUntil}</span>
              </div>
            </div>
          </div>

          {/* Real Venue Details */}
          <div className="p-4 sm:p-5 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight leading-snug">
                  {currentVenue.name}
                </h3>
                <div className="text-[11px] text-neutral-400 flex items-center gap-1.5 mt-0.5">
                  <span className="text-emerald-400 font-semibold">{currentVenue.category}</span>
                  <span>•</span>
                  <span>{currentVenue.area}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedVenueModal(currentVenue)}
                className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
                title="View full culinary details"
              >
                <Info size={18} />
              </button>
            </div>

            <p className="text-xs text-neutral-300 line-clamp-2 leading-relaxed">
              {currentVenue.description}
            </p>

            {/* Authentic Cuisine Tags row */}
            <div className="flex items-center gap-2 flex-wrap pt-1">
              {currentVenue.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#222222] border border-[#2F2F2F] text-neutral-300 text-[11px] px-2.5 py-0.5 rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* AI Recommendation Badge on Cards */}
            <div className="bg-[#1C1C1C] border border-[#2D2D2D] rounded-2xl p-2.5 flex items-center justify-between gap-2.5 shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-base shrink-0">🤖</span>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <span>Squadrop AI</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span className="text-neutral-400 font-normal">Matchmaker Analysis</span>
                  </div>
                  <div className="text-xs font-semibold text-neutral-200 truncate mt-0.5">
                    {VENUE_AI_PROFILES[currentVenue.id]?.aiRationaleChip.replace('🤖 Squadrop AI: ', '') ||
                      'Best match for tonight • Fits 5/5 budgets • 15 min travel time'}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full shrink-0 font-bold">
                {currentVenue.id === matchmakerResult.unlockedVenueId
                  ? `${matchmakerResult.groupOverlapPercent}% Match`
                  : '92% Match'}
              </span>
            </div>
          </div>

          {/* Bottom Swipe Action Controls */}
          <div className="p-4 pt-1 pb-5 border-t border-[#242424] flex items-center justify-around">
            {/* Skip Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleSwipe('skip')}
                className="w-14 h-14 rounded-full bg-[#201515] border border-rose-900/60 hover:bg-rose-900/40 text-rose-400 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                title="Skip venue"
              >
                <X size={26} strokeWidth={2.5} />
              </button>
              <span className="text-[11px] font-medium text-neutral-400">Skip</span>
            </div>

            {/* Priority Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleSwipe('priority')}
                className="w-12 h-12 rounded-full bg-[#242424] border border-neutral-700 hover:border-amber-400 hover:text-amber-400 text-neutral-300 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                title="Mark as Priority"
              >
                <Star size={20} />
              </button>
              <span className="text-[11px] font-medium text-neutral-400">Priority</span>
            </div>

            {/* Drop In (Heart) Button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={() => handleSwipe('like')}
                className="w-14 h-14 rounded-full bg-[#11241A] border border-emerald-800/80 hover:bg-emerald-900/50 text-emerald-400 flex items-center justify-center transition-transform active:scale-90 cursor-pointer shadow-md"
                title="Drop In (Vote Yes)"
              >
                <Heart size={26} className="fill-emerald-400" />
              </button>
              <span className="text-[11px] font-medium text-emerald-400">Drop In</span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty / Completed Deck State */
        <div className="bg-[#161616] border border-[#262626] rounded-3xl p-8 text-center flex flex-col items-center justify-center gap-4 py-12">
          <div className="w-14 h-14 rounded-full bg-[#242424] flex items-center justify-center text-emerald-400">
            <CheckCircle2 size={32} />
          </div>
          <div className="max-w-xs">
            <h3 className="text-base font-bold text-white mb-1">
              All 4 Bangalore Spots Reviewed!
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The squad has achieved consensus on <span className="text-white font-bold">{activeVenue.name}</span> in {activeVenue.area.split(',')[0]}.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleResetDeck}
              className="px-4 py-2 rounded-xl bg-[#222222] border border-[#333333] hover:border-neutral-500 text-xs font-semibold text-neutral-300 flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Vote Again</span>
            </button>
            <button
              onClick={onGoToHub}
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Event Hub</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. INTERACTIVE MODAL: Real-Time Squad Voting & Location Matrix */}
      {/* ============================================================== */}
      {showVotingMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-md w-full p-5 sm:p-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="uppercase tracking-wider">Live Squad Quorum</span>
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  Bangalore Fine Dining & Social
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Real-time voter breakdown & live Bangalore coordinates
                </p>
              </div>
              <button
                onClick={() => setShowVotingMatrixModal(false)}
                className="text-neutral-400 hover:text-white p-1 cursor-pointer rounded-full hover:bg-neutral-800 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {/* Voting Progress Bar Card */}
            <div className="bg-[#1C1C1C] border border-[#2B2B2B] rounded-2xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-neutral-300 font-semibold flex items-center gap-1.5">
                  <Users size={14} className="text-white" />
                  <span>Quorum Progress</span>
                </span>
                <span className="font-mono text-emerald-400 font-extrabold">
                  {kabirVoted ? '4/5 Voted (80% Locked)' : '3/5 Voted (Shiro Locked by 3 Friends)'}
                </span>
              </div>
              {/* Progress bar track */}
              <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden p-0.5 border border-neutral-700">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  style={{ width: kabirVoted ? '80%' : '60%' }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-2">
                <span>Threshold: 3/5 for Match Unlock</span>
                <span className="text-emerald-400 font-medium">✓ Shiro Match Unlocked (3 Friends Voted)</span>
              </div>
            </div>

            {/* Member Voting & Location Cards List */}
            <div className="space-y-2.5 mb-5">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                <span>Real-Time Voter Coordinates</span>
                <span className="text-neutral-500">Live GPS ping</span>
              </div>

              {/* 1. Aarav Sharma (Host) */}
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80"
                        alt="Aarav"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-white text-black rounded-full text-[7px] font-bold flex items-center justify-center">
                        ★
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Aarav Sharma</span>
                        <span className="text-[10px] text-neutral-400 font-normal">(Host)</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">Bangalore 5G • 2m ago</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={10} />
                    <span>Voted Drop In</span>
                  </span>
                </div>
                <div className="bg-[#222222] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 flex items-center gap-1 truncate">
                    <MapPin size={11} className="text-amber-400 shrink-0" />
                    <span>Indiranagar 100ft Road (Work Studio)</span>
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0 ml-1">Shiro (Priority ★)</span>
                </div>
              </div>

              {/* 2. Ananya Sen */}
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&auto=format&fit=crop&q=80"
                        alt="Ananya"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Ananya Sen</div>
                      <div className="text-[10px] text-neutral-400">Mobile App • 4m ago</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={10} />
                    <span>Voted Drop In</span>
                  </span>
                </div>
                <div className="bg-[#222222] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 flex items-center gap-1 truncate">
                    <Car size={11} className="text-sky-400 shrink-0" />
                    <span>Uber cab on Bellary Rd Tollway</span>
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0 ml-1">Shiro</span>
                </div>
              </div>

              {/* 3. Rohan Verma */}
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80"
                        alt="Rohan"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Rohan Verma</div>
                      <div className="text-[10px] text-neutral-400">Mobile App • 6m ago</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={10} />
                    <span>Voted Drop In</span>
                  </span>
                </div>
                <div className="bg-[#222222] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 flex items-center gap-1 truncate">
                    <Navigation size={11} className="text-amber-400 shrink-0" />
                    <span>UB City Concorde Parking</span>
                  </span>
                  <span className="text-emerald-400 font-semibold shrink-0 ml-1">Shiro</span>
                </div>
              </div>

              {/* 4. Priya Nair */}
              <div className="bg-[#1A1A1A] border border-[#262626] rounded-2xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&auto=format&fit=crop&q=80"
                        alt="Priya"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Priya Nair</div>
                      <div className="text-[10px] text-neutral-400">Mobile App • 8m ago</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                    <Check size={10} />
                    <span>Voted Drop In</span>
                  </span>
                </div>
                <div className="bg-[#222222] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 flex items-center gap-1 truncate">
                    <MapPin size={11} className="text-emerald-400 shrink-0" />
                    <span>Residency Road Lounge</span>
                  </span>
                  <span className="text-white font-semibold shrink-0 ml-1">Lotus Pavilion</span>
                </div>
              </div>

              {/* 5. Kabir Mehta (Active / Pending or Voted) */}
              <div
                className={`border rounded-2xl p-3 flex flex-col gap-2 transition-all ${
                  kabirVoted
                    ? 'bg-[#1A1A1A] border-[#262626]'
                    : 'bg-[#1E1815] border-amber-900/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80"
                        alt="Kabir"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white">Kabir Mehta</div>
                      <div className="text-[10px] text-neutral-400">
                        {kabirVoted ? 'Voted via Mobile • Just now' : 'Online now • Reviewing menus'}
                      </div>
                    </div>
                  </div>

                  {kabirVoted ? (
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Check size={10} />
                      <span>Voted Drop In</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
                      <Clock size={10} />
                      <span>Pending Vote</span>
                    </span>
                  )}
                </div>

                <div className="bg-[#222222] rounded-xl px-2.5 py-1.5 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-300 flex items-center gap-1 truncate">
                    <Building size={11} className="text-neutral-400 shrink-0" />
                    <span>Manyata Tech Park, Nagavara</span>
                  </span>
                  <span className="text-neutral-300 font-medium shrink-0 ml-1">
                    {kabirVoted ? 'Shiro' : 'Browsing Shiro sushi menu'}
                  </span>
                </div>

                {!kabirVoted && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleNudgeKabir}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-[#28221D] hover:bg-[#342A22] border border-amber-800/50 text-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Bell size={12} />
                      <span>Send Nudge Alert</span>
                    </button>
                    <button
                      onClick={handleSimulateKabirVote}
                      className="py-1.5 px-3 rounded-xl bg-white hover:bg-neutral-200 text-black text-[11px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      title="Simulate Kabir casting his vote in real-time"
                    >
                      <span>Simulate Vote</span>
                      <Check size={12} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Bangalore Venue Voting Standings */}
            <div className="bg-[#1C1C1C] border border-[#2B2B2B] rounded-2xl p-3.5 mb-5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                Bangalore Venue Standings
              </div>
              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onSelectVenue('oia-bangalore');
                    showToast('⚡ AI Matchmaker Unlocked: Oia Bangalore (4/5 Squad Members Voted Yes)');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] transition-colors cursor-pointer text-left"
                >
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <span>⚡ Oia Bangalore (Hebbal)</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/40">
                      AI Matchmaker Pick
                    </span>
                  </span>
                  <span className="font-mono text-emerald-400 font-extrabold">
                    4/5 Votes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectVenue('shiro');
                    showToast('⚡ AI Matchmaker Unlocked: Shiro (3/5 Squad Members Voted Yes)');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2D2D2D] transition-colors cursor-pointer text-left"
                >
                  <span className="text-white font-semibold flex items-center gap-1.5">
                    <span>Shiro (UB City)</span>
                    <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1.5 py-0.2 rounded">
                      Central Pick
                    </span>
                  </span>
                  <span className="font-mono text-neutral-300">
                    3/5 Votes
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectVenue('lotus-pavilion');
                    showToast('⚡ AI Matchmaker Unlocked: Lotus Pavilion (4/5 Squad Members Voted Yes)');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2D2D2D] transition-colors cursor-pointer text-left text-neutral-300"
                >
                  <span>Lotus Pavilion (Residency Rd)</span>
                  <span className="font-mono text-neutral-400">1/5 Votes</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectVenue('farmlore');
                    showToast('⚡ AI Matchmaker Unlocked: Farmlore (4/5 Squad Members Voted Yes)');
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#1E1E1E] hover:bg-[#2A2A2A] border border-[#2D2D2D] transition-colors cursor-pointer text-left text-neutral-300"
                >
                  <span>Farmlore (Devanahalli)</span>
                  <span className="font-mono text-neutral-400">1/5 Votes</span>
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowVotingMatrixModal(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-extrabold text-xs cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              Close & Return to Swipe Deck
            </button>
          </div>
        </div>
      )}

      {/* 6. Match Unlocked Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowMatchModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-3">
              <Sparkles size={28} />
            </div>

            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1">
              Squad Consensus (Match Unlocked)
            </div>
            <h2 className="text-xl font-extrabold text-white mb-1">
              {activeVenue.name}
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Locked as the squad destination for tonight. Reservation held by Aarav Sharma.
            </p>

            <div className="rounded-2xl overflow-hidden aspect-video mb-4 bg-neutral-900 border border-[#2E2E2E]">
              <img
                src={activeVenue.image}
                alt={activeVenue.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 text-left text-xs mb-5 flex items-center justify-between">
              <div>
                <div className="text-neutral-400 text-[10px]">Location</div>
                <div className="font-semibold text-white">{activeVenue.area}</div>
              </div>
              <div className="text-right">
                <div className="text-neutral-400 text-[10px]">Distance</div>
                <div className="font-semibold text-emerald-400">{activeVenue.distance}</div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowMatchModal(false);
                onGoToHub();
              }}
              className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>View Itinerary in Event Hub</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* 7. Venue Info Modal */}
      {selectedVenueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-md w-full p-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedVenueModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="rounded-2xl overflow-hidden aspect-video mb-4 bg-neutral-900 border border-[#262626]">
              <img
                src={selectedVenueModal.image}
                alt={selectedVenueModal.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">
              {selectedVenueModal.name}
            </h3>
            <div className="text-xs text-neutral-400 mb-3 flex items-center gap-2 flex-wrap">
              <span>{selectedVenueModal.area}</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">★ {selectedVenueModal.rating}</span>
              <span>•</span>
              <span>Avg ₹{selectedVenueModal.priceForTwo.toLocaleString('en-IN')} for two</span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed mb-4">
              {selectedVenueModal.description}
            </p>

            <div className="bg-[#202020] rounded-xl p-3 border border-[#2E2E2E] mb-5">
              <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
                Cuisine & Experience Tags
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {selectedVenueModal.tags.map((t) => (
                  <span key={t} className="bg-black/80 px-2 py-0.5 rounded text-[11px] text-white border border-[#3A3A3A]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectVenue(selectedVenueModal.id);
                setSelectedVenueModal(null);
              }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-extrabold text-xs cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              Set as Squad Drop Destination
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
