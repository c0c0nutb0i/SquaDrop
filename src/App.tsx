import React, { useState } from 'react';
import { TabType, SquadMember } from './types';
import {
  INITIAL_MEMBERS,
  REAL_BANGALORE_VENUES,
  VENUE_DETAILS_MAP,
} from './data/mockData';
import { calculateAIMatchmaker } from './services/aiMatchmaker';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { SwipeTab } from './components/SwipeTab';
import { HubTab } from './components/HubTab';
import { HuddleTab } from './components/HuddleTab';
import { SplitTab } from './components/SplitTab';
import { Palette, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('swipe');
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [myShareSettled, setMyShareSettled] = useState(false);
  const [showDesignTokens, setShowDesignTokens] = useState(false);

  // Active Real Bangalore Dining Destination ID (Default: Shiro at UB City)
  const [activeVenueId, setActiveVenueId] = useState<string>('shiro');
  const [userSwipes, setUserSwipes] = useState<Record<string, 'liked' | 'skipped' | 'priority'>>({});

  const [members, setMembers] = useState<SquadMember[]>(INITIAL_MEMBERS);
  const venues = REAL_BANGALORE_VENUES;

  // Real-time AI Matchmaker computation
  const matchmakerResult = calculateAIMatchmaker(venues, activeVenueId, userSwipes);

  const currentVenueData = VENUE_DETAILS_MAP[activeVenueId] || VENUE_DETAILS_MAP['shiro'];

  const handleSelectVenue = (venueId: string) => {
    setActiveVenueId(venueId);
    setMyShareSettled(false); // Reset settlement state for the new venue bill
    setMembers((prev) =>
      prev.map((m) =>
        m.id === 'aarav'
          ? {
              ...m,
              statusNote: `Table reserved at ${VENUE_DETAILS_MAP[venueId]?.venue.name || 'venue'}`,
            }
          : m
      )
    );
  };

  const handleUserSwipe = (venueId: string, action: 'like' | 'skip' | 'priority') => {
    const voteType = action === 'like' ? 'liked' : action === 'skip' ? 'skipped' : 'priority';
    setUserSwipes((prev) => ({ ...prev, [venueId]: voteType }));
    if (action === 'like' || action === 'priority') {
      handleSelectVenue(venueId);
    }
  };

  const handleUpdateMemberStatus = (newStatus: SquadMember['status'], note: string) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === 'you'
          ? {
              ...m,
              status: newStatus,
              statusNote: note,
            }
          : m
      )
    );
  };

  const handleSettleMyShare = () => {
    setMyShareSettled(true);
    setMembers((prev) =>
      prev.map((m) =>
        m.id === 'you'
          ? { ...m, owesOrGets: 0, isSettled: true }
          : m.id === 'aarav'
          ? { ...m, owesOrGets: m.owesOrGets - currentVenueData.squadBalances.userOwes }
          : m
      )
    );
  };

  const tabLabels: Record<TabType, string> = {
    swipe: 'Swipe Mode',
    hub: 'Live Hub',
    huddle: 'Live Audio Huddle',
    split: 'Split Tab',
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
      className="w-screen h-[100dvh] overflow-hidden flex flex-col bg-[#0D0D0D] text-white font-sans selection:bg-white selection:text-black relative"
    >
      {/* Top Header with Venue Switcher and Squad Status */}
      <Header
        onOpenSplash={() => setIsSplashOpen(true)}
        activeTabName={tabLabels[activeTab]}
        venues={venues}
        activeVenueId={activeVenueId}
        onSelectVenue={handleSelectVenue}
      />

      {/* Internal Viewport Scrollable Content Area */}
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          paddingBottom: '80px',
        }}
        className="flex-1 overflow-y-auto no-scrollbar w-full max-w-xl mx-auto px-3 sm:px-4 py-3"
      >
        {activeTab === 'swipe' && (
          <SwipeTab
            venues={venues}
            members={members}
            activeVenue={currentVenueData.venue}
            onSelectVenue={handleSelectVenue}
            onGoToHub={() => setActiveTab('hub')}
            matchmakerResult={matchmakerResult}
            onUserSwipe={handleUserSwipe}
          />
        )}
        {activeTab === 'hub' && (
          <HubTab
            members={members}
            venueData={currentVenueData}
            onGoToHuddle={() => setActiveTab('huddle')}
            onUpdateMemberStatus={handleUpdateMemberStatus}
            matchmakerResult={matchmakerResult}
            venues={venues}
            onSelectVenue={handleSelectVenue}
          />
        )}
        {activeTab === 'huddle' && <HuddleTab members={members} />}
        {activeTab === 'split' && (
          <SplitTab
            members={members}
            venueData={currentVenueData}
            onSettleMyShare={handleSettleMyShare}
            myShareSettled={myShareSettled}
          />
        )}
      </main>

      {/* Sticky Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        matchUnlocked={true}
        matchedVenueName={currentVenueData.venue.name}
      />

      {/* Floating Design Specs & Tokens Drawer Trigger */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setShowDesignTokens(!showDesignTokens)}
          className="flex items-center gap-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#333333] text-neutral-300 text-xs font-semibold px-3 py-2 rounded-full shadow-lg transition-all cursor-pointer"
          title="Inspect Monochrome Design System Tokens & Real Bangalore Venues"
        >
          <Palette size={14} className="text-neutral-300" />
          <span className="hidden sm:inline">Bangalore Venues & Spec</span>
        </button>
      </div>

        {/* Design System & Real Bangalore Venues Modal */}
        {showDesignTokens && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-white" />
                  <h3 className="text-base font-bold text-white">
                    Squadrop • 4 Real Bangalore Venues
                  </h3>
                </div>
                <button
                  onClick={() => setShowDesignTokens(false)}
                  className="text-neutral-400 hover:text-white p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* 4 Venues Overview */}
              <div className="space-y-4 text-xs mb-5">
                <div className="grid grid-cols-2 gap-2">
                  {venues.map((v) => {
                    const isSelected = v.id === activeVenueId;
                    const d = VENUE_DETAILS_MAP[v.id];
                    return (
                      <div
                        key={v.id}
                        onClick={() => handleSelectVenue(v.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#222222] border-white text-white'
                            : 'bg-[#181818] border-[#2A2A2A] text-neutral-400 hover:border-neutral-500'
                        }`}
                      >
                        <div className="font-extrabold text-white text-xs mb-0.5">
                          {v.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 mb-1.5">
                          {v.area}
                        </div>
                        <div className="font-mono text-emerald-400 text-xs font-bold">
                          ₹{d.totalBill.toLocaleString('en-IN')} Total
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Smart Hangout & Venue Matchmaker Summary */}
                <div className="bg-[#1C1C1C] p-3 rounded-2xl border border-emerald-900/50 space-y-2">
                  <div className="flex items-center justify-between text-white font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Zap size={13} className="fill-emerald-400" />
                      <span>Smart Hangout & Venue Matchmaker</span>
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                      {matchmakerResult.groupOverlapPercent}% Overlap
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-300 font-medium">
                    {matchmakerResult.bannerText}
                  </div>
                  <div className="text-[11px] text-neutral-400 italic">
                    "{matchmakerResult.vibeConsensusText}"
                  </div>
                </div>

                {/* Monochrome Spec Sheet */}
                <div className="bg-[#1C1C1C] p-3 rounded-2xl border border-[#2B2B2B] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Canvas Background</span>
                    <span className="font-mono text-white">#0D0D0D (Deep Charcoal)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Bottom Nav Bar</span>
                    <span className="font-mono text-white">#141414 Dark Grey Slate</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Surface Cards</span>
                    <span className="font-mono text-white">#1A1A1A (Dark Slate)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Currency</span>
                    <span className="font-mono text-white">₹ INR (Indian Rupees)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Payment Standard</span>
                    <span className="font-mono text-white">Native UPI (GPay / PhonePe / Paytm)</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowDesignTokens(false)}
                  className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200 mt-2"
                >
                  Close & Explore {currentVenueData.venue.name}
                </button>
              </div>
            </div>
          </div>
        )}

      {/* Splash Screen Component */}
      <SplashScreen
        isOpen={isSplashOpen}
        onEnter={() => setIsSplashOpen(false)}
        onClose={() => setIsSplashOpen(false)}
      />
    </div>
  );
}
