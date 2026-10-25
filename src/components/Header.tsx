import React from 'react';
import {
  Building2,
  Calendar,
  Plus,
  Send,
  Lock,
  Unlock,
  Settings,
  Github,
  Search,
  BellRing,
} from 'lucide-react';
import { LandlordProfile } from '../types/index.ts';

interface HeaderProps {
  profile: LandlordProfile;
  selectedMonth: string; // YYYY-MM
  onMonthChange: (month: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenAddShop: () => void;
  onOpenAutomatedMessaging: () => void;
  onOpenSettings: () => void;
  onOpenGitHubModal: () => void;
  onLockApp: () => void;
  isPinLocked: boolean;
  pendingRemindersCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  selectedMonth,
  onMonthChange,
  searchQuery,
  onSearchChange,
  onOpenAddShop,
  onOpenAutomatedMessaging,
  onOpenSettings,
  onOpenGitHubModal,
  onLockApp,
  isPinLocked,
  pendingRemindersCount,
}) => {
  // Generate list of 12 months (past 6 months + future 5 months)
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();

  const monthOptions: { key: string; label: string }[] = [];
  for (let i = -6; i <= 3; i++) {
    const d = new Date(currentYear, currentMonthIdx + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthOptions.push({ key, label });
  }

  return (
    <header className="sticky top-0 z-30 bg-[#F8F9F5]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Complex Name */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#14281D] text-[#4ADE80] flex items-center justify-center shadow-xs font-semibold shrink-0">
                <Building2 className="w-5 h-5 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-sm sm:text-lg font-bold text-stone-900 tracking-tight leading-tight truncate">
                    {profile.complexName || 'Commercial Shop Ledger'}
                  </h1>
                </div>
                <div className="text-[11px] sm:text-xs text-stone-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                  <span className="truncate">Owner: {profile.ownerName || 'Landlord'}</span>
                  <span aria-hidden="true" className="hidden sm:inline">·</span>
                  <span className="font-mono text-[11px] text-emerald-800 truncate">UPI: {profile.upiId}</span>
                </div>
              </div>
            </div>

            {/* Mobile Action Icons */}
            <div className="flex items-center gap-1 shrink-0 md:hidden">
              <button
                type="button"
                onClick={onOpenAutomatedMessaging}
                aria-label={`Automated Reminders (${pendingRemindersCount} pending)`}
                className="relative p-2 rounded-lg text-stone-700 hover:bg-stone-200/60 transition-colors"
              >
                <Send className="w-5 h-5 text-emerald-700" />
                {pendingRemindersCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-amber-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {pendingRemindersCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onOpenSettings}
                aria-label="Settings"
                className="p-2 rounded-lg text-stone-700 hover:bg-stone-200/60 transition-colors"
              >
                <Settings className="w-5 h-5 text-stone-600" />
              </button>
            </div>
          </div>

          {/* Desktop Controls: Month Picker, Search, Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month Selector */}
            <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
              <Calendar className="w-4 h-4 text-stone-500 mr-2 shrink-0" />
              <label htmlFor="month-select" className="sr-only">Select Month</label>
              <select
                id="month-select"
                value={selectedMonth}
                onChange={(e) => onMonthChange(e.target.value)}
                className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none cursor-pointer pr-1"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Search */}
            <div className="relative flex-1 sm:w-56 md:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tenant, shop #..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-700/20 focus:border-emerald-700 shadow-2xs"
              />
            </div>

            {/* Automated Messaging Queue Button */}
            <button
              type="button"
              onClick={onOpenAutomatedMessaging}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>WhatsApp Reminders</span>
              {pendingRemindersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-emerald-700 text-white rounded-full text-[10px] font-bold">
                  {pendingRemindersCount}
                </span>
              )}
            </button>

            {/* Add Shop Button */}
            <button
              type="button"
              onClick={onOpenAddShop}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#14281D] hover:bg-[#1E3A2B] text-white rounded-lg text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add Shop</span>
            </button>

            {/* Security PIN toggle */}
            {profile.pinCodeEnabled && (
              <button
                type="button"
                onClick={onLockApp}
                title="Lock Dashboard"
                className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
              >
                {isPinLocked ? <Lock className="w-4 h-4 text-amber-600" /> : <Unlock className="w-4 h-4 text-stone-600" />}
              </button>
            )}

            {/* GitHub Deploy modal trigger */}
            <button
              type="button"
              onClick={onOpenGitHubModal}
              title="GitHub & Deployment Guide"
              className="hidden sm:inline-flex p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
            >
              <Github className="w-4 h-4 text-stone-700" />
            </button>

            {/* Settings button */}
            <button
              type="button"
              onClick={onOpenSettings}
              title="Ledger Settings"
              className="hidden sm:inline-flex p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-stone-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
