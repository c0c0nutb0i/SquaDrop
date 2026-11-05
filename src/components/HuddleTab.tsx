import React, { useState, useEffect } from 'react';
import { SquadMember } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  PhoneCall,
  Bell,
  Sparkles,
  Car,
  Headphones,
  Check,
  Radio,
} from 'lucide-react';

interface HuddleTabProps {
  members: SquadMember[];
}

interface FloatingEmoji {
  id: number;
  emoji: string;
  x: number;
}

export const HuddleTab: React.FC<HuddleTabProps> = ({ members }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [nudgedMembers, setNudgedMembers] = useState<Record<string, boolean>>({});
  const [floatingEmojis, setFloatingEmojis] = useState<FloatingEmoji[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Equalizer wave bar heights state for lively audio room feeling
  const [waveHeights, setWaveHeights] = useState<number[]>([18, 32, 48, 64, 52, 34, 20]);

  useEffect(() => {
    if (!isConnected) return;
    const interval = setInterval(() => {
      setWaveHeights([
        Math.floor(Math.random() * 24) + 12,
        Math.floor(Math.random() * 40) + 16,
        Math.floor(Math.random() * 60) + 24,
        Math.floor(Math.random() * 70) + 30,
        Math.floor(Math.random() * 60) + 20,
        Math.floor(Math.random() * 40) + 14,
        Math.floor(Math.random() * 24) + 10,
      ]);
    }, 180);
    return () => clearInterval(interval);
  }, [isConnected]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNudge = (memberId: string, memberName: string) => {
    setNudgedMembers((prev) => ({ ...prev, [memberId]: true }));
    showToast(`Nudge notification sent to ${memberName}! 🔔`);
    setTimeout(() => {
      setNudgedMembers((prev) => ({ ...prev, [memberId]: false }));
    }, 4000);
  };

  const handleSendReaction = (emoji: string) => {
    const newEmoji: FloatingEmoji = {
      id: Date.now() + Math.random(),
      emoji,
      x: Math.floor(Math.random() * 60) + 20, // percentage offset
    };
    setFloatingEmojis((prev) => [...prev, newEmoji]);
    setTimeout(() => {
      setFloatingEmojis((prev) => prev.filter((e) => e.id !== newEmoji.id));
    }, 2000);
  };

  const activeConnectedMembers = members.filter((m) => m.inHuddle);
  const outsideMembers = members.filter((m) => !m.inHuddle);

  return (
    <div className="relative flex flex-col gap-4 max-w-md mx-auto w-full pb-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white border border-[#383838] px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-in fade-in flex items-center gap-2">
          <Check size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Floating Emojis Animation Container */}
      <div className="absolute inset-x-0 bottom-24 top-0 pointer-events-none overflow-hidden z-40">
        {floatingEmojis.map((item) => (
          <div
            key={item.id}
            style={{ left: `${item.x}%` }}
            className="absolute bottom-10 text-2xl animate-float-up opacity-90 transition-all select-none"
          >
            {item.emoji}
          </div>
        ))}
      </div>

      {/* 1. Active State Banner (Matches screenshot) */}
      <div className="bg-[#161616] border border-[#282828] rounded-2xl p-3 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[9px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
              Live Huddle
            </span>
            <span className="text-white font-semibold">Friday Bangalore Hangout</span>
          </div>
          <span className="text-neutral-400 text-[11px] font-medium">
            {isConnected ? '3/5 Connected' : 'Disconnected'}
          </span>
        </div>
        <p className="text-[11px] text-neutral-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Finalizing table reservation & cab pickup spot...</span>
        </p>
      </div>

      {/* 2. Main Live Speaker Visual Arena (Matches screenshot) */}
      <div className="relative rounded-3xl bg-[#161616] border border-[#262626] p-6 flex flex-col items-center text-center shadow-xl overflow-hidden min-h-[300px] justify-center">
        {/* Ambient room background rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-56 h-56 rounded-full border border-emerald-500 animate-ping duration-1000" />
          <div className="w-40 h-40 rounded-full border border-white/20" />
        </div>

        {isConnected ? (
          <>
            {/* Center Speaking Speaker Avatar */}
            <div className="relative mb-3">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-400 p-0.5 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80"
                  alt="Ananya Sen"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Speaking pill badge below avatar */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-black border border-emerald-500/80 rounded-full px-2.5 py-0.5 text-[9px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Radio size={10} className="animate-pulse" />
                <span>Speaking</span>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white mt-1">Ananya Sen</h3>
            <p className="text-xs text-neutral-400 mb-4">Host • Table Booker</p>

            {/* Sound Wave Audio Equalizer Visualizer */}
            <div className="flex items-center justify-center gap-1.5 h-8 mb-6">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  style={{ height: `${h * 0.4}px` }}
                  className="w-1 bg-white rounded-full transition-all duration-150 ease-out"
                />
              ))}
            </div>

            {/* Other Connected Members Mini Avatars */}
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs pt-3 border-t border-[#262626]">
              {/* Rohan */}
              <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                    alt="Rohan Verma"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-white truncate">Rohan Verma</div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Headphones size={10} />
                    <span>Listening</span>
                  </div>
                </div>
              </div>

              {/* Aarav */}
              <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-2.5 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                    alt="Aarav Sharma"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <div className="text-xs font-bold text-white truncate">Aarav Sharma</div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Car size={10} />
                    <span>Driving (Handsfree)</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-8">
            <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400">
              <PhoneOff size={22} />
            </div>
            <div className="text-sm font-bold text-white">You Left the Voice Huddle</div>
            <p className="text-xs text-neutral-400 max-w-xs">
              The squad is still on the line coordinating arrival.
            </p>
            <button
              onClick={() => {
                setIsConnected(true);
                showToast('Reconnected to Bangalore Squad Huddle!');
              }}
              className="mt-2 px-5 py-2 rounded-xl bg-white text-black font-bold text-xs flex items-center gap-1.5 cursor-pointer hover:bg-neutral-200 transition-colors"
            >
              <PhoneCall size={14} />
              <span>Rejoin Voice Huddle</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Squad Outside Room Section (Matches screenshot) */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Squad Outside Room
          </span>
          <span className="text-[10px] text-neutral-500">Tap to nudge</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {outsideMembers.map((member) => (
            <div
              key={member.id}
              className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-2.5 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-xs font-semibold text-white truncate">
                  {member.name.split(' ')[0]} {member.name.split(' ')[1]?.[0]}.
                </div>
              </div>

              <button
                onClick={() => handleNudge(member.id, member.name)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer ${
                  nudgedMembers[member.id]
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-[#2A2A2A] hover:bg-[#353535] text-neutral-200 border border-[#3A3A3A]'
                }`}
              >
                {nudgedMembers[member.id] ? 'Nudged' : 'Nudge'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Reaction Bar (Matches screenshot: REACT 🔥 👏 🚗 😂 👍) */}
      <div className="bg-[#161616] border border-[#262626] rounded-2xl px-3 py-2 flex items-center justify-between">
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
          REACT
        </span>
        <div className="flex items-center gap-2">
          {['🔥', '👏', '🚗', '😂', '👍', '❤️'].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleSendReaction(emoji)}
              className="text-lg hover:scale-125 active:scale-95 transition-transform p-1 cursor-pointer select-none"
              title={`Send ${emoji} reaction`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Bottom Audio Control Panel Pills (Matches screenshot) */}
      <div className="flex items-center justify-center gap-3">
        {/* Mute / Unmute Mic Button */}
        <button
          onClick={() => {
            setIsMuted(!isMuted);
            showToast(isMuted ? 'Microphone unmuted (live)' : 'Microphone muted');
          }}
          disabled={!isConnected}
          className={`flex-1 py-3 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
            isMuted
              ? 'bg-[#222222] border border-[#333333] hover:border-neutral-500 text-white'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(5,150,105,0.4)]'
          } ${!isConnected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isMuted ? <MicOff size={16} /> : <Mic size={16} className="animate-pulse" />}
          <span>{isMuted ? 'Mute Mic' : 'Unmuted (Live)'}</span>
        </button>

        {/* Speaker Volume toggle */}
        <button
          onClick={() => {
            setIsSpeakerOn(!isSpeakerOn);
            showToast(isSpeakerOn ? 'Speaker muted' : 'Speaker audio active');
          }}
          disabled={!isConnected}
          className="w-12 h-12 rounded-2xl bg-[#222222] border border-[#333333] hover:border-neutral-500 text-white flex items-center justify-center cursor-pointer transition-colors"
          title="Toggle Speaker"
        >
          {isSpeakerOn ? <Volume2 size={18} /> : <VolumeX size={18} className="text-neutral-500" />}
        </button>

        {/* Leave / Rejoin Button */}
        {isConnected ? (
          <button
            onClick={() => {
              setIsConnected(false);
              showToast('Left the voice room');
            }}
            className="py-3 px-5 rounded-2xl bg-[#2C1818] border border-rose-900/60 hover:bg-rose-900/40 text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PhoneOff size={15} />
            <span>Leave</span>
          </button>
        ) : (
          <button
            onClick={() => {
              setIsConnected(true);
              showToast('Rejoined voice room');
            }}
            className="py-3 px-5 rounded-2xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <PhoneCall size={15} />
            <span>Join</span>
          </button>
        )}
      </div>
    </div>
  );
};
