import React, { useState } from 'react';
import { SquadMember, VenueDetailData, VenueCard, AIMatchmakerResult } from '../types';
import { AIMatchmakerBanner } from './AIMatchmakerBanner';
import {
  Radio,
  Calendar,
  Share2,
  PlusCircle,
  Clock,
  MapPin,
  Navigation,
  Copy,
  ChevronRight,
  CloudSun,
  Car,
  Footprints,
  Maximize2,
  Check,
  X,
  Sparkles,
} from 'lucide-react';

interface HubTabProps {
  members: SquadMember[];
  venueData: VenueDetailData;
  onGoToHuddle: () => void;
  onUpdateMemberStatus: (status: SquadMember['status'], note: string) => void;
  matchmakerResult?: AIMatchmakerResult;
  venues?: VenueCard[];
  onSelectVenue?: (venueId: string) => void;
}

export const HubTab: React.FC<HubTabProps> = ({
  members,
  venueData,
  onGoToHuddle,
  onUpdateMemberStatus,
  matchmakerResult,
  venues,
  onSelectVenue,
}) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [myStatus, setMyStatus] = useState<SquadMember['status']>('Confirmed');
  const [myNote, setMyNote] = useState('Approaching venue entrance walkway');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [showDirectionsModal, setShowDirectionsModal] = useState<any | null>(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState<any | null>(null);
  const [showAddStopModal, setShowAddStopModal] = useState(false);
  const [showMapExpand, setShowMapExpand] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { venue, itinerary, areaContext } = venueData;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(`https://squadrop.app/bangalore/${venue.id}-squad-drop`);
    setCopiedLink(true);
    showToast(`Squad invite link for ${venue.name} copied!`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyAddress = (stop: any) => {
    navigator.clipboard?.writeText?.(stop.address);
    setCopiedAddress(stop.id);
    showToast(`Address copied for ${stop.venueName}`);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleSaveStatus = () => {
    onUpdateMemberStatus(myStatus, myNote);
    setShowStatusModal(false);
    showToast('Your squad pulse status has been updated!');
  };

  const getStatusBadgeStyle = (status: SquadMember['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';
      case 'On the way':
        return 'text-sky-400 bg-sky-950/60 border-sky-800/60';
      case 'Running Late':
        return 'text-amber-400 bg-amber-950/60 border-amber-800/60';
      case 'Deciding':
      default:
        return 'text-neutral-400 bg-neutral-900 border-neutral-700';
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full pb-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white border border-[#383838] px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-in fade-in flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Match Unlocked Banner (Swipe & Hub Tabs) */}
      {matchmakerResult && venues && (
        <AIMatchmakerBanner
          matchmakerResult={matchmakerResult}
          venues={venues}
          onSelectVenue={onSelectVenue || (() => {})}
        />
      )}

      {/* 1. Voice Huddle Mini Banner */}
      <div className="bg-[#181818] border border-[#2B2B2B] hover:border-neutral-500 rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm transition-all">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shrink-0">
            <Radio size={16} className="animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Voice Huddle Active</span>
              <span className="bg-emerald-500 text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-sm tracking-wider uppercase">
                LIVE
              </span>
            </div>
            <div className="text-[11px] text-neutral-400 truncate">
              Aarav, Rohan & Ananya are talking
            </div>
          </div>
        </div>

        <button
          onClick={onGoToHuddle}
          className="flex items-center gap-1 bg-white hover:bg-neutral-200 text-black text-xs font-bold px-3 py-1.5 rounded-full cursor-pointer shrink-0 transition-colors"
        >
          <span>Join</span>
          <ChevronRight size={13} />
        </button>
      </div>

      {/* 2. Squad Drop Ongoing Hero Card (Using Real Venue Reference Photo) */}
      <div className="relative rounded-3xl overflow-hidden bg-[#161616] border border-[#262626] shadow-xl">
        <div className="relative aspect-[16/9] w-full bg-neutral-900">
          <img
            src={venue.image}
            alt={venue.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-[#161616]/40 to-black/50" />

          {/* Top Pill: Squad Drop Ongoing */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Squad Drop Ongoing</span>
          </div>

          {/* Top Right: Share Button */}
          <button
            onClick={handleCopyLink}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
            title="Share destination link"
          >
            <Share2 size={13} />
          </button>

          {/* Bottom Overlay on Image */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-2 text-[11px] text-neutral-300 font-medium mb-1">
              <span className="bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded-md font-semibold text-white">
                Tonight • 8:00 PM
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Clock size={11} />
                Starts in 35m
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {venue.name} Experience
            </h2>
            <div className="text-xs text-neutral-300 font-medium mt-0.5">
              {venue.area} • {venue.cuisineCategory}
            </div>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="p-3 bg-[#161616] border-t border-[#242424] grid grid-cols-3 gap-2">
          <button
            onClick={() => showToast(`Added ${venue.name} to your Calendar (.ics)`)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2E2E2E] text-xs font-semibold text-neutral-300 cursor-pointer transition-colors"
          >
            <Calendar size={13} className="text-neutral-400" />
            <span>Calendar</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2E2E2E] text-xs font-semibold text-neutral-300 cursor-pointer transition-colors"
          >
            <Share2 size={13} className="text-neutral-400" />
            <span>{copiedLink ? 'Copied!' : 'Invite Link'}</span>
          </button>
          <button
            onClick={() => setShowAddStopModal(true)}
            className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#202020] hover:bg-[#282828] border border-[#2E2E2E] text-xs font-semibold text-white cursor-pointer transition-colors"
          >
            <PlusCircle size={13} className="text-white" />
            <span>Add Stop</span>
          </button>
        </div>
      </div>

      {/* 3. Squad Pulse Section */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3.5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Squad Pulse</span>
            <span className="bg-[#242424] text-neutral-300 text-[11px] font-semibold px-2 py-0.5 rounded-full border border-[#303030]">
              5/5 Ready
            </span>
          </div>
          <button
            onClick={() => setShowStatusModal(true)}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Update</span>
            <span>✎</span>
          </button>
        </div>

        {/* Group Consensus Summary Pill */}
        <div className="bg-[#1C1C1C] border border-[#2B2B2B] rounded-2xl p-3 flex items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sparkles size={13} />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Squadrop AI • Group Consensus
              </div>
              <div className="text-xs font-bold text-white truncate mt-0.5">
                {matchmakerResult?.vibeConsensusText ||
                  'Squad Vibe Consensus: 80% prefer Mediterranean & Outdoor Seating tonight.'}
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full shrink-0">
            {matchmakerResult?.groupOverlapPercent || 88}% Vibe Fit
          </span>
        </div>

        {/* Member Status Rows */}
        <div className="flex flex-col gap-2.5">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-[#202020] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {member.isHost && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-white text-black rounded-full text-[8px] font-bold flex items-center justify-center">
                      ★
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                    <span>{member.name}</span>
                    {member.role && (
                      <span className="text-[10px] text-neutral-400 font-normal">
                        ({member.role})
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-400 truncate">
                    {member.statusNote}
                  </div>
                </div>
              </div>

              {/* Status Chip */}
              <div
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1.5 ${getStatusBadgeStyle(
                  member.status
                )}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                <span>{member.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Planned Itinerary Module (Real Bangalore Itinerary for Active Venue) */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white">Planned Itinerary</div>
          <span className="bg-[#242424] text-neutral-400 text-[11px] px-2.5 py-0.5 rounded-full border border-[#303030]">
            {itinerary.length} Stops Locked
          </span>
        </div>

        <div className="relative pl-6 flex flex-col gap-6">
          {/* Timeline Vertical Line */}
          <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-[#2A2A2A]" />

          {itinerary.map((stop) => (
            <div key={stop.id} className="relative flex flex-col gap-2">
              {/* Step numbered node */}
              <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-white text-black text-xs font-bold flex items-center justify-center shadow-md">
                {stop.stepNumber}
              </div>

              {/* Stop Header info */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">{stop.time}</span>
                <span className="text-neutral-400 text-[11px] bg-[#222222] px-2 py-0.5 rounded-md border border-[#2F2F2F]">
                  {stop.reservationTag}
                </span>
              </div>

              {/* Venue Name & Address */}
              <div>
                <h4 className="text-sm font-extrabold text-white">{stop.venueName}</h4>
                <p className="text-xs text-neutral-400 mt-0.5">{stop.address}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {stop.stepNumber === 1 ? (
                  <>
                    <button
                      onClick={() => setShowDirectionsModal(stop)}
                      className="bg-white hover:bg-neutral-200 text-black text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                    >
                      <Navigation size={13} />
                      <span>Directions ({stop.walkingMinutes} min)</span>
                    </button>
                    <button
                      onClick={() => handleCopyAddress(stop)}
                      className="p-1.5 bg-[#242424] hover:bg-[#303030] text-neutral-300 rounded-xl border border-[#303030] cursor-pointer"
                      title="Copy Address"
                    >
                      {copiedAddress === stop.id ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowConfirmationModal(stop)}
                      className="bg-[#242424] hover:bg-[#303030] text-white text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#333333] flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>View Confirmation</span>
                    </button>
                    <button
                      onClick={() => handleCopyLink()}
                      className="p-1.5 bg-[#242424] hover:bg-[#303030] text-neutral-300 rounded-xl border border-[#303030] cursor-pointer"
                      title="Share reservation"
                    >
                      <Share2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Live Area Status Card (Real Bangalore Neighborhood Context) */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5">
              <Navigation size={14} className="text-neutral-400" />
              <span>Live Area Status</span>
            </div>
            <div className="text-[11px] text-neutral-400">
              {areaContext.neighborhood}
            </div>
          </div>
          <button
            onClick={() => setShowMapExpand(true)}
            className="text-xs bg-[#242424] hover:bg-[#303030] text-neutral-300 px-2.5 py-1 rounded-lg border border-[#303030] flex items-center gap-1 cursor-pointer"
          >
            <span>Expand</span>
            <Maximize2 size={11} />
          </button>
        </div>

        {/* Stylized Dark Map Preview */}
        <div className="relative rounded-2xl overflow-hidden h-28 bg-[#0F141C] border border-[#222E3F] p-3 flex flex-col justify-between">
          {/* Grid street lines simulated */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="grid-map" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#60A5FA" strokeWidth="0.7" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-map)" />
            </svg>
          </div>

          {/* Simulated highway/corridor glow */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-emerald-500/80 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <div className="absolute left-1/3 top-2 bottom-2 w-0.5 bg-sky-500/60" />

          {/* Street labels */}
          <div className="relative z-10 flex items-center justify-between text-[10px] text-neutral-400">
            <span className="bg-black/75 px-2 py-0.5 rounded text-neutral-200 font-medium">
              {areaContext.trafficStatus}
            </span>
            <span className="font-mono text-[9px] text-neutral-400">
              {areaContext.coordinates}
            </span>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[10px]">
            <span className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Footprints size={11} />
              {areaContext.walkability}
            </span>
            <span className="bg-sky-950/80 border border-sky-800 text-sky-300 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Car size={11} />
              {areaContext.transitInfo}
            </span>
          </div>
        </div>

        {/* Weather strip */}
        <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CloudSun size={18} className="text-amber-400" />
            <div>
              <div className="text-xs font-bold text-white">{areaContext.weather}</div>
              <div className="text-[11px] text-neutral-400">{areaContext.walkingNote}</div>
            </div>
          </div>
          <button
            onClick={() => setShowMapExpand(true)}
            className="text-[11px] font-semibold text-white hover:underline cursor-pointer"
          >
            Details
          </button>
        </div>
      </div>

      {/* Modals */}
      {/* 1. Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowStatusModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Update Your Status</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Let the squad know your current location or eta.
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {(['Confirmed', 'On the way', 'Running Late', 'Deciding'] as SquadMember['status'][]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setMyStatus(status)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-colors cursor-pointer ${
                      myStatus === status
                        ? 'bg-white text-black border-white'
                        : 'bg-[#222222] text-neutral-300 border-[#303030] hover:text-white'
                    }`}
                  >
                    {status}
                  </button>
                )
              )}
            </div>

            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Status Note / ETA
            </label>
            <input
              type="text"
              value={myNote}
              onChange={(e) => setMyNote(e.target.value)}
              placeholder="e.g., Just boarded cab, 10 mins away"
              className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white mb-5 focus:outline-none focus:border-white"
            />

            <button
              onClick={handleSaveStatus}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs cursor-pointer transition-colors"
            >
              Update Squad Pulse
            </button>
          </div>
        </div>
      )}

      {/* 2. Real Directions Modal */}
      {showDirectionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowDirectionsModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
              <Navigation size={14} />
              <span>Bangalore Route Preview • {showDirectionsModal.walkingMinutes} min</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {showDirectionsModal.venueName}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">{showDirectionsModal.address}</p>

            <div className="bg-[#202020] rounded-2xl p-4 border border-[#2E2E2E] flex flex-col gap-3 mb-5 text-xs text-neutral-300">
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  1
                </span>
                <span>Destination: {showDirectionsModal.venueName}</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  2
                </span>
                <span>{showDirectionsModal.reservationNotes}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://maps.google.com/?q=${showDirectionsModal.mapQuery}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-center font-bold text-xs transition-colors"
              >
                Open in Google Maps
              </a>
              <button
                onClick={() => setShowDirectionsModal(null)}
                className="py-2.5 px-4 rounded-xl bg-[#242424] hover:bg-[#303030] text-neutral-300 text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Confirmation Details Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowConfirmationModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">
              {showConfirmationModal.venueName}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">{showConfirmationModal.address}</p>

            <div className="bg-[#202020] rounded-2xl p-4 border border-[#2E2E2E] flex flex-col gap-2.5 mb-5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Booking Status</span>
                <span className="text-emerald-400 font-bold">Pre-Booked & Guaranteed</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Seating Area</span>
                <span className="text-white font-medium">{showConfirmationModal.reservationTag}</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>Reserved For</span>
                <span className="text-white font-medium">Aarav Sharma (5 guests)</span>
              </div>
              <div className="text-[11px] text-neutral-400 pt-2 border-t border-[#2E2E2E]">
                {showConfirmationModal.reservationNotes}
              </div>
            </div>

            <button
              onClick={() => setShowConfirmationModal(null)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Close Confirmation
            </button>
          </div>
        </div>
      )}

      {/* 4. Add Stop Modal */}
      {showAddStopModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#161616] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowAddStopModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Add Crawl Stop</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Add a late-night cafe or dessert stop to the itinerary.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Stop Name</label>
                <input
                  type="text"
                  placeholder="e.g. Corner House Ice Cream"
                  defaultValue="Corner House Ice Cream"
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Time</label>
                <input
                  type="text"
                  defaultValue="11:30 PM (Late Night Dessert)"
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setShowAddStopModal(false);
                showToast('Dessert Stop added to Itinerary!');
              }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Lock Stop to Itinerary
            </button>
          </div>
        </div>
      )}

      {/* 5. Map Expand Modal */}
      {showMapExpand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-lg w-full p-6 text-left shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowMapExpand(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-lg font-bold text-white mb-1">
              Live Transit & Area Context
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              {areaContext.neighborhood}
            </p>

            <div className="rounded-2xl bg-[#0F141C] border border-[#222E3F] p-4 mb-4 flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Corridor Traffic</span>
                <span className="text-emerald-400 font-bold">{areaContext.trafficStatus}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Walkability & Atmosphere</span>
                <span className="text-white font-medium">{areaContext.walkability}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Transit Connection</span>
                <span className="text-sky-400 font-bold">{areaContext.transitInfo}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-300 font-semibold">Current Weather</span>
                <span className="text-white font-medium">{areaContext.weather}</span>
              </div>
            </div>

            <button
              onClick={() => setShowMapExpand(false)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Close Live Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
