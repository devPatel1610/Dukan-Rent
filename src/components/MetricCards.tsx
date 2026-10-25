import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
} from 'lucide-react';
import { formatCurrency } from '../utils/rentCalculator.ts';

interface MetricCardsProps {
  totalMonthlyRoll: number;
  totalCollected: number;
  totalPending: number;
  paidCount: number;
  dueSoonCount: number;
  overdueCount: number;
  totalShops: number;
  currencySymbol: string;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  totalMonthlyRoll,
  totalCollected,
  totalPending,
  paidCount,
  dueSoonCount,
  overdueCount,
  totalShops,
  currencySymbol,
}) => {
  const collectionPercentage =
    totalMonthlyRoll > 0 ? Math.min(100, Math.round((totalCollected / totalMonthlyRoll) * 100)) : 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {/* 1. Monthly Expected Rent Roll */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Total Rent Roll</span>
          <Building className="w-4 h-4 text-stone-400" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          {formatCurrency(totalMonthlyRoll, currencySymbol)}
        </div>
        <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
          <span>{totalShops} rented units</span>
          <span aria-hidden="true">·</span>
          <span>100% occupied</span>
        </div>
      </div>

      {/* 2. Total Collected */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Collected</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-800 tracking-tight">
          {formatCurrency(totalCollected, currencySymbol)}
        </div>
        <div className="mt-2.5">
          <div className="flex justify-between text-[11px] text-stone-500 mb-1">
            <span>{paidCount} paid</span>
            <span className="font-semibold text-emerald-700">{collectionPercentage}%</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Pending / Due Soon */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Pending Balance</span>
          <Clock className="w-4 h-4 text-amber-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-amber-900 tracking-tight">
          {formatCurrency(totalPending, currencySymbol)}
        </div>
        <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
          <span>{dueSoonCount} due soon</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-700 font-medium">Ready for reminder</span>
        </div>
      </div>

      {/* 4. Overdue Notice */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs">
        <div className="flex items-center justify-between text-stone-500 mb-2">
          <span className="text-xs font-medium uppercase tracking-wider">Overdue Alerts</span>
          <AlertTriangle className="w-4 h-4 text-rose-600" />
        </div>
        <div className="text-xl sm:text-2xl font-bold text-rose-800 tracking-tight">
          {overdueCount} {overdueCount === 1 ? 'Shop' : 'Shops'}
        </div>
        <div className="text-xs text-stone-500 mt-1.5 flex items-center gap-1.5">
          {overdueCount > 0 ? (
            <span className="text-rose-600 font-medium">Follow-up overdue rent</span>
          ) : (
            <span className="text-emerald-700 font-medium">All accounts in good standing</span>
          )}
        </div>
      </div>
    </div>
  );
};
