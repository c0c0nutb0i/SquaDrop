import React, { useState } from 'react';
import { TabType, SquadMember } from './types';
import {
  INITIAL_MEMBERS,
  REAL_BANGALORE_VENUES,
  VENUE_DETAILS_MAP,
} from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SplashScreen } from './components/SplashScreen';
import { SwipeTab } from './components/SwipeTab';
import { HubTab } from './components/HubTab';
import { HuddleTab } from './components/HuddleTab';
import { SplitTab } from './components/SplitTab';
import { EmblemLogo } from './components/EmblemLogo';
import {
  Wifi,
  BatteryMedium,
  Palette,
  CheckCircle,
  MapPin,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('swipe');
  const [isSplashOpen, setIsSplashOpen] = useState(false);
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [myShareSettled, setMyShareSettled] = useState(false);
  const [showDesignTokens, setShowDesignTokens] = useState(false);

  // Active Real Bangalore Dining Destination ID (Default: Shiro at UB City)
  const [activeVenueId, setActiveVenueId] = useState<string>('shiro');

  const [members, setMembers] = useState<SquadMember[]>(INITIAL_MEMBERS);
  const venues = REAL_BANGALORE_VENUES;

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
    <div className="min-h-screen bg-[#0D0D0D] text-white flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Top Bar with Venue Switcher and Controls */}
      <Header
        onOpenSplash={() => setIsSplashOpen(true)}
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        activeTabName={tabLabels[activeTab]}
        venues={venues}
        activeVenueId={activeVenueId}
        onSelectVenue={handleSelectVenue}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 w-full">
        {isPhoneFrame ? (
          /* Phone Frame Container */
          <div className="relative w-full max-w-[420px] bg-[#121212] rounded-[42px] border-[5px] border-[#2A2A2A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col min-h-[760px] max-h-[92vh]">
            {/* Phone Top Notch / Speaker & Status Bar */}
            <div className="relative bg-[#0D0D0D] pt-3 pb-2 px-6 flex items-center justify-between text-neutral-400 select-none border-b border-[#222222] z-30 shrink-0">
              {/* Dynamic Island / Camera Punch Hole */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-20 h-4 bg-black rounded-full border border-neutral-800" />
              <span className="text-[11px] font-semibold text-neutral-300">9:41</span>
              <div className="flex items-center gap-2">
                <Wifi size={13} className="text-neutral-400" />
                <BatteryMedium size={15} className="text-neutral-300" />
              </div>
            </div>

            {/* Inner App Top Sub-Header */}
            <div className="px-4 py-2.5 bg-[#0D0D0D] flex items-center justify-between border-b border-[#1F1F1F] shrink-0">
              <div className="flex items-center gap-2">
                <EmblemLogo size={22} />
                <span className="text-xs font-bold text-white tracking-tight">
                  Squadrop
                </span>
                <span className="w-1 h-1 rounded-full bg-neutral-500" />
                <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                  {tabLabels[activeTab]}
                </span>
              </div>

              {/* Active Venue Indicator Chip */}
              <div className="flex items-center gap-1.5 bg-[#1C1C1C] border border-[#2B2B2B] pl-2 pr-1.5 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-bold text-neutral-200">
                  {currentVenueData.venue.shortName}
                </span>
                <div className="w-4 h-4 rounded-full overflow-hidden bg-neutral-700 ml-0.5">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=50&auto=format&fit=crop&q=80"
                    alt="Ananya"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Screen Content */}
            <div className="flex-1 overflow-y-auto px-3.5 py-3.5 no-scrollbar bg-[#0D0D0D]">
              {activeTab === 'swipe' && (
                <SwipeTab
                  venues={venues}
                  members={members}
                  activeVenue={currentVenueData.venue}
                  onSelectVenue={handleSelectVenue}
                  onGoToHub={() => setActiveTab('hub')}
                />
              )}
              {activeTab === 'hub' && (
                <HubTab
                  members={members}
                  venueData={currentVenueData}
                  onGoToHuddle={() => setActiveTab('huddle')}
                  onUpdateMemberStatus={handleUpdateMemberStatus}
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
            </div>

            {/* Bottom Navigation Inside Phone */}
            <div className="shrink-0 z-40">
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                matchUnlocked={true}
                matchedVenueName={currentVenueData.venue.name}
              />
            </div>
          </div>
        ) : (
          /* Full View Responsive Mode */
          <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
            {/* Top Toolbar in Full View */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#161616] border border-[#262626] rounded-2xl p-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {(['swipe', 'hub', 'huddle', 'split'] as TabType[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer capitalize ${
                      activeTab === tab
                        ? 'bg-white text-black'
                        : 'text-neutral-400 hover:text-white hover:bg-[#222222]'
                    }`}
                  >
                    {tab === 'swipe' && '1. Swipe Match'}
                    {tab === 'hub' && '2. Event Hub'}
                    {tab === 'huddle' && '3. Voice Huddle'}
                    {tab === 'split' && '4. UPI Bill Split'}
                  </button>
                ))}
              </div>

              {/* Venue Quick Selector in Full View */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 font-medium hidden sm:inline">
                  Destination:
                </span>
                <select
                  value={activeVenueId}
                  onChange={(e) => handleSelectVenue(e.target.value)}
                  className="bg-[#202020] border border-[#303030] text-xs font-bold text-white px-3 py-1.5 rounded-xl cursor-pointer focus:outline-none"
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.area.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="min-h-[600px]">
              {activeTab === 'swipe' && (
                <SwipeTab
                  venues={venues}
                  members={members}
                  activeVenue={currentVenueData.venue}
                  onSelectVenue={handleSelectVenue}
                  onGoToHub={() => setActiveTab('hub')}
                />
              )}
              {activeTab === 'hub' && (
                <HubTab
                  members={members}
                  venueData={currentVenueData}
                  onGoToHuddle={() => setActiveTab('huddle')}
                  onUpdateMemberStatus={handleUpdateMemberStatus}
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
            </div>

            {/* Bottom Bar in Full View */}
            <div className="sticky bottom-4 max-w-md mx-auto w-full z-40 rounded-2xl overflow-hidden shadow-2xl border border-[#262626]">
              <BottomNav
                activeTab={activeTab}
                onTabChange={setActiveTab}
                matchUnlocked={true}
                matchedVenueName={currentVenueData.venue.name}
              />
            </div>
          </div>
        )}

        {/* Floating Design Specs & Tokens Drawer Trigger */}
        <div className="fixed bottom-4 right-4 z-40">
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
      </main>

      {/* Splash Screen Component */}
      <SplashScreen
        isOpen={isSplashOpen}
        onEnter={() => setIsSplashOpen(false)}
        onClose={() => setIsSplashOpen(false)}
      />
    </div>
  );
}
