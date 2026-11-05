import React, { useState } from 'react';
import { SquadMember, VenueDetailData, BillItem, ScannedReceipt } from '../types';
import {
  Zap,
  CheckCircle2,
  Receipt,
  ArrowUpRight,
  Plus,
  X,
  Sparkles,
} from 'lucide-react';

interface SplitTabProps {
  members: SquadMember[];
  venueData: VenueDetailData;
  onSettleMyShare: () => void;
  myShareSettled: boolean;
}

export const SplitTab: React.FC<SplitTabProps> = ({
  members,
  venueData,
  onSettleMyShare,
  myShareSettled,
}) => {
  const [taxSplitMethod, setTaxSplitMethod] = useState<'proportional' | 'even'>('proportional');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showItemBreakdownModal, setShowItemBreakdownModal] = useState<BillItem | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<ScannedReceipt | null>(null);
  const [remindedMembers, setRemindedMembers] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('gpay');

  const { venue, totalBill, taxAndService, taxLabel, items, receipts, squadBalances } = venueData;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const myNetShare = myShareSettled ? 0 : squadBalances.userOwes;

  const handleRemindViaUpi = (memberId: string, memberName: string, amount: number) => {
    setRemindedMembers((prev) => ({ ...prev, [memberId]: true }));
    showToast(`UPI payment request ping sent to ${memberName} for ₹${amount.toLocaleString('en-IN')}`);
    setTimeout(() => {
      setRemindedMembers((prev) => ({ ...prev, [memberId]: false }));
    }, 4000);
  };

  const handleExecutePayment = () => {
    onSettleMyShare();
    setShowUpiModal(false);
    showToast(`Payment of ₹${squadBalances.userOwes.toLocaleString('en-IN')} confirmed via UPI! Reconciled with Aarav.`);
  };

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto w-full pb-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#1E1E1E] text-white border border-[#383838] px-4 py-2 rounded-full text-xs font-bold shadow-2xl animate-in fade-in flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Real Hangout Venue Header */}
      <div className="bg-[#161616] border border-[#262626] rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-sm">
        <div className="min-w-0">
          <h2 className="text-sm font-extrabold text-white truncate">
            {venue.name}
          </h2>
          <div className="text-[11px] text-neutral-400">
            {venue.area} • 5 Squad Diners
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[#202020] border border-[#2E2E2E] text-neutral-300 text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Reconciled</span>
        </div>
      </div>

      {/* 2. Total Hangout Expenses Header */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-5 shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
            Total Hangout Expenses
          </span>
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
            <CheckCircle2 size={12} />
            <span>OCR Matched</span>
          </span>
        </div>

        {/* Big Indian Rupee Typography */}
        <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center">
          <span>₹</span>
          <span className="tabular-nums font-mono">{totalBill.toLocaleString('en-IN')}</span>
        </div>

        {/* Individual Net Balance Card */}
        <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-4 flex flex-col gap-3 mt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-neutral-400">
              <ArrowUpRight size={14} className="text-neutral-300" />
              <span>Your Net Share</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                  alt="Aarav"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-xs text-neutral-300">Aarav Sharma</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-sm font-bold text-white">
              {myShareSettled ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={16} /> All Settled Up
                </span>
              ) : (
                <>
                  You owe{' '}
                  <span className="text-white font-mono text-base font-extrabold">
                    ₹{squadBalances.userOwes.toLocaleString('en-IN')}
                  </span>{' '}
                  to Aarav
                </>
              )}
            </div>
          </div>

          {/* Settle CTA */}
          {!myShareSettled ? (
            <button
              onClick={() => setShowUpiModal(true)}
              className="w-full py-3 rounded-xl bg-white hover:bg-neutral-100 text-black font-extrabold text-xs tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98]"
            >
              <Zap size={14} className="fill-black" />
              <span>⚡ 1-Tap Settle via UPI / GPay / PhonePe</span>
            </button>
          ) : (
            <button
              onClick={() => showToast('Receipt details already verified and settled.')}
              className="w-full py-2.5 rounded-xl bg-[#282828] text-neutral-400 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>Settled via UPI (Ref: UPI-{venue.id.slice(0, 4).toUpperCase()})</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Scanned Receipts */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Receipt size={14} className="text-neutral-400" />
            <span>Scanned Receipts ({receipts.length})</span>
          </div>
          <span className="text-[11px] text-neutral-400">All Verified</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {receipts.map((rcpt) => (
            <div
              key={rcpt.id}
              onClick={() => setShowReceiptModal(rcpt)}
              className="bg-[#202020] border border-[#2E2E2E] hover:border-neutral-500 rounded-2xl p-3 flex flex-col justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mb-1.5">
                <span className="bg-[#2A2A2A] px-1.5 py-0.5 rounded text-neutral-300 font-medium">
                  {rcpt.category}
                </span>
                <span className="text-emerald-400 font-semibold">{rcpt.ocrConfidence}</span>
              </div>
              <div className="text-xs font-bold text-white truncate mb-2">
                {rcpt.venueName}
              </div>
              <div className="text-sm font-extrabold text-white font-mono">
                ₹{rcpt.amount.toLocaleString('en-IN')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Itemized Assignment List (Accurate to User's Venue Specification) */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <span>🍽️ Itemized Assignment</span>
          </div>
          <button
            onClick={() => showToast('Opening item split assignment editor')}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Items</span>
            <span>✎</span>
          </button>
        </div>

        <div className="flex flex-col divide-y divide-[#242424]">
          {items.map((item) => (
            <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 flex flex-col gap-1">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                  <span className="text-xs font-bold text-white">
                    {item.name}
                  </span>
                  {item.isUserIncluded && (
                    <span className="bg-white text-black text-[9px] font-extrabold px-1.5 py-0.2 rounded-sm">
                      YOU
                    </span>
                  )}
                </div>
                <div className="text-xs font-bold text-white font-mono">
                  ₹{item.price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-neutral-400 pl-3.5">
                <span>
                  {item.splitType === 'all'
                    ? 'Shared by All 5 diners'
                    : item.customBreakdownText || 'Split among diners'}
                </span>
                <span className="text-neutral-300 font-mono">
                  {item.splitType === 'all'
                    ? `₹${Math.round(item.price / 5).toLocaleString('en-IN')} ea`
                    : (
                        <button
                          onClick={() => setShowItemBreakdownModal(item)}
                          className="text-white hover:underline text-[11px] cursor-pointer"
                        >
                          View breakdown ›
                        </button>
                      )}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Tax (5% GST) & Service Charge */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">{taxLabel}</div>
            <div className="text-[11px] text-neutral-400">
              Total added: ₹{taxAndService.toLocaleString('en-IN')}
            </div>
          </div>
          <button
            onClick={() => showToast('GST rates and service charge breakdown')}
            className="text-neutral-400 hover:text-white"
          >
            <Sparkles size={14} />
          </button>
        </div>

        {/* Toggle Pills: Proportional vs Even Split */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#202020] border border-[#2E2E2E] rounded-2xl">
          <button
            onClick={() => {
              setTaxSplitMethod('proportional');
              showToast('Switched to Proportional tax calculation');
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              taxSplitMethod === 'proportional'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Proportional</span>
          </button>
          <button
            onClick={() => {
              setTaxSplitMethod('even');
              showToast('Switched to Even split tax calculation');
            }}
            className={`py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
              taxSplitMethod === 'even'
                ? 'bg-white text-black font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Even split</span>
          </button>
        </div>

        <p className="text-[11px] text-neutral-400 leading-relaxed">
          {taxSplitMethod === 'proportional'
            ? 'Proportional: Food and beverage costs divided according to individual ordered courses.'
            : 'Even split: Taxes and restaurant service charges divided equally by 5 squad diners.'}
        </p>
      </div>

      {/* 6. Squad Balances List (Dynamic to Active Venue) */}
      <div className="bg-[#161616] border border-[#262626] rounded-3xl p-4 sm:p-5 flex flex-col gap-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white">Squad Balances</div>
          <span className="text-[11px] text-neutral-400">5 Members</span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Aarav (Host - Paid Upfront) */}
          <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Aarav"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">
                  Aarav Sharma (Host)
                </div>
                <div className="text-[10px] text-neutral-400">
                  Paid upfront: ₹{squadBalances.hostPaidUpfront.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-neutral-400">Gets back</div>
              <div className="text-xs font-extrabold text-emerald-400 font-mono">
                +₹{squadBalances.hostGetsBack.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          {/* You */}
          <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-white text-black font-extrabold text-[10px] flex items-center justify-center shrink-0">
                YOU
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white">You</div>
                <div className="text-[10px] text-neutral-400">
                  {myShareSettled ? 'Reconciled via UPI' : 'Pending UPI settlement'}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] text-neutral-400">
                {myShareSettled ? 'Settled' : 'Owes Aarav'}
              </div>
              <div
                className={`text-xs font-extrabold font-mono ${
                  myShareSettled ? 'text-emerald-400' : 'text-neutral-200'
                }`}
              >
                {myShareSettled ? '₹0' : `-₹${squadBalances.userOwes.toLocaleString('en-IN')}`}
              </div>
            </div>
          </div>

          {/* Ananya Sen */}
          <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
                  alt="Ananya"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Ananya Sen</div>
                <div className="text-[10px] text-neutral-400">
                  Share: ₹{squadBalances.ananyaOwes.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-neutral-400">Owes</div>
                <div className="text-xs font-bold text-neutral-200 font-mono">
                  ₹{squadBalances.ananyaOwes.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => handleRemindViaUpi('ananya', 'Ananya', squadBalances.ananyaOwes)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                  remindedMembers['ananya']
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-[#2A2A2A] hover:bg-[#333333] text-neutral-200 border border-[#3A3A3A]'
                }`}
              >
                {remindedMembers['ananya'] ? 'Reminded' : 'Remind via UPI'}
              </button>
            </div>
          </div>

          {/* Rohan Verma */}
          <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Rohan"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Rohan Verma</div>
                <div className="text-[10px] text-neutral-400">
                  Share: ₹{squadBalances.rohanOwes.toLocaleString('en-IN')}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <div className="text-[10px] text-neutral-400">Owes</div>
                <div className="text-xs font-bold text-neutral-200 font-mono">
                  ₹{squadBalances.rohanOwes.toLocaleString('en-IN')}
                </div>
              </div>
              <button
                onClick={() => handleRemindViaUpi('rohan', 'Rohan', squadBalances.rohanOwes)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-xl transition-colors cursor-pointer ${
                  remindedMembers['rohan']
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                    : 'bg-[#2A2A2A] hover:bg-[#333333] text-neutral-200 border border-[#3A3A3A]'
                }`}
              >
                {remindedMembers['rohan'] ? 'Reminded' : 'Remind via UPI'}
              </button>
            </div>
          </div>

          {/* Priya Nair (Settled) */}
          <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800 border border-neutral-700 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80"
                  alt="Priya"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">Priya Nair</div>
                <div className="text-[10px] text-neutral-400">
                  Paid ₹{squadBalances.priyaPaid.toLocaleString('en-IN')} via UPI
                </div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full shrink-0">
              <CheckCircle2 size={11} />
              <span>Settled</span>
            </span>
          </div>
        </div>
      </div>

      {/* 7. Bottom Action Button: + Scan Bill or Add Expense */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setShowAddExpenseModal(true)}
          className="w-full py-3.5 rounded-2xl bg-[#222222] border border-[#333333] hover:border-neutral-400 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <Plus size={15} />
          <span>+ Scan Bill or Add Expense</span>
        </button>
        <p className="text-[10px] text-center text-neutral-500">
          Receipts automatically split dishes, calculate GST, and group squad tabs.
        </p>
      </div>

      {/* Modals */}
      {/* 1. UPI Payment & Deep Link Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl relative">
            <button
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-full bg-white text-black mx-auto flex items-center justify-center mb-3">
              <Zap size={22} className="fill-black" />
            </div>

            <h3 className="text-base font-extrabold text-white mb-0.5">
              Instant UPI Settlement
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Direct transfer to Aarav Sharma for {venue.name}
            </p>

            {/* UPI Amount Display */}
            <div className="bg-[#202020] border border-[#2E2E2E] rounded-2xl p-4 mb-4">
              <div className="text-[11px] text-neutral-400 mb-1">Settlement Amount</div>
              <div className="text-2xl font-extrabold text-white font-mono">
                ₹{squadBalances.userOwes.toLocaleString('en-IN')}.00
              </div>
              <div className="text-[10px] font-mono text-neutral-400 mt-1">
                UPI ID: <span className="text-white">aarav.sharma@okaxis</span>
              </div>
            </div>

            {/* Simulated UPI QR Code */}
            <div className="bg-white p-3 rounded-2xl inline-block mb-4 shadow-md">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="black">
                <rect width="100" height="100" fill="white" />
                <rect x="10" y="10" width="25" height="25" fill="black" />
                <rect x="15" y="15" width="15" height="15" fill="white" />
                <rect x="18" y="18" width="9" height="9" fill="black" />

                <rect x="65" y="10" width="25" height="25" fill="black" />
                <rect x="70" y="15" width="15" height="15" fill="white" />
                <rect x="73" y="18" width="9" height="9" fill="black" />

                <rect x="10" y="65" width="25" height="25" fill="black" />
                <rect x="15" y="70" width="15" height="15" fill="white" />
                <rect x="18" y="73" width="9" height="9" fill="black" />

                <rect x="42" y="12" width="6" height="6" />
                <rect x="50" y="18" width="6" height="6" />
                <rect x="42" y="28" width="6" height="6" />
                <rect x="12" y="42" width="6" height="6" />
                <rect x="24" y="48" width="6" height="6" />
                <rect x="42" y="42" width="16" height="16" />
                <rect x="65" y="45" width="6" height="6" />
                <rect x="75" y="52" width="6" height="6" />
                <rect x="82" y="42" width="6" height="6" />
                <rect x="45" y="68" width="6" height="6" />
                <rect x="58" y="72" width="6" height="6" />
                <rect x="68" y="65" width="6" height="6" />
                <rect x="78" y="78" width="6" height="6" />
              </svg>
            </div>

            {/* Select Preferred UPI Provider */}
            <div className="grid grid-cols-4 gap-2 mb-4 text-[10px]">
              {[
                { id: 'gpay', label: 'GPay' },
                { id: 'phonepe', label: 'PhonePe' },
                { id: 'paytm', label: 'Paytm' },
                { id: 'cred', label: 'CRED' },
              ].map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedUpiApp(app.id as any)}
                  className={`py-1.5 rounded-xl border font-bold transition-colors cursor-pointer ${
                    selectedUpiApp === app.id
                      ? 'bg-white text-black border-white'
                      : 'bg-[#202020] text-neutral-400 border-[#2E2E2E]'
                  }`}
                >
                  {app.label}
                </button>
              ))}
            </div>

            {/* Native Deep Link / Simulated Success CTA */}
            <button
              onClick={handleExecutePayment}
              className="w-full py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs cursor-pointer shadow-md transition-colors"
            >
              Simulate 1-Tap Pay ₹{squadBalances.userOwes.toLocaleString('en-IN')}
            </button>
          </div>
        </div>
      )}

      {/* 2. Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowAddExpenseModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-white mb-1">Add Expense or Bill</h3>
            <p className="text-xs text-neutral-400 mb-4">
              Enter extra dessert or cab fare to {venue.name}.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Airport tollway cab"
                  defaultValue={`Cab ride to ${venue.name}`}
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Amount (₹)</label>
                <input
                  type="number"
                  defaultValue="650"
                  className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">Paid By</label>
                <select className="w-full bg-[#202020] border border-[#303030] rounded-xl px-3 py-2 text-xs text-white focus:outline-none">
                  <option>You</option>
                  <option>Aarav Sharma</option>
                  <option>Ananya Sen</option>
                  <option>Rohan Verma</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setShowAddExpenseModal(false);
                showToast('New expense added & divided among squad!');
              }}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Add to Squad Split
            </button>
          </div>
        </div>
      )}

      {/* 3. Receipt Details Modal */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowReceiptModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
              <CheckCircle2 size={13} />
              <span>{showReceiptModal.ocrConfidence}</span>
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              {showReceiptModal.venueName}
            </h3>
            <div className="text-xs text-neutral-400 mb-4 font-mono">
              Total ₹{showReceiptModal.amount.toLocaleString('en-IN')} • {showReceiptModal.time}
            </div>

            <div className="bg-[#202020] rounded-2xl p-4 border border-[#2E2E2E] flex flex-col gap-2 mb-5 font-mono text-xs text-neutral-300">
              <div className="flex justify-between border-b border-[#2E2E2E] pb-2">
                <span>Tax Invoice #</span>
                <span className="text-white">BLR-{venue.id.slice(0, 3).toUpperCase()}-9421</span>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{(showReceiptModal.amount - Math.round(taxAndService / 2)).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (2.5%) + SGST (2.5%)</span>
                <span>₹{Math.round(taxAndService / 2).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between border-t border-[#2E2E2E] pt-2 font-bold text-white">
                <span>Total Amount</span>
                <span>₹{showReceiptModal.amount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(null)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* 4. Breakdown modal for custom drinks/dishes */}
      {showItemBreakdownModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="bg-[#141414] border border-[#333333] rounded-3xl max-w-sm w-full p-6 text-left shadow-2xl relative">
            <button
              onClick={() => setShowItemBreakdownModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 cursor-pointer"
            >
              <X size={18} />
            </button>
            <h3 className="text-base font-bold text-white mb-1">
              {showItemBreakdownModal.name}
            </h3>
            <p className="text-xs text-neutral-400 mb-4">
              Individual beverage & course allocation breakdown (₹{showItemBreakdownModal.price.toLocaleString('en-IN')})
            </p>

            <div className="space-y-2 mb-5 text-xs text-neutral-300">
              <div className="flex justify-between bg-[#202020] p-2.5 rounded-xl border border-[#2E2E2E]">
                <span>Aarav (Signature cocktail allocation)</span>
                <span className="font-mono font-bold text-white">
                  ₹{Math.round(showItemBreakdownModal.price * 0.3).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between bg-[#202020] p-2.5 rounded-xl border border-[#2E2E2E]">
                <span>Rohan (Craft drink share)</span>
                <span className="font-mono font-bold text-white">
                  ₹{Math.round(showItemBreakdownModal.price * 0.25).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between bg-[#202020] p-2.5 rounded-xl border border-[#2E2E2E]">
                <span>Ananya (Artisanal infusion share)</span>
                <span className="font-mono font-bold text-white">
                  ₹{Math.round(showItemBreakdownModal.price * 0.25).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between bg-[#202020] p-2.5 rounded-xl border border-[#2E2E2E]">
                <span>You (Cocktail tasting share)</span>
                <span className="font-mono font-bold text-white">
                  ₹{Math.round(showItemBreakdownModal.price * 0.2).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowItemBreakdownModal(null)}
              className="w-full py-2.5 rounded-xl bg-white text-black font-bold text-xs cursor-pointer hover:bg-neutral-200"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
