import React from 'react';
import {
  Phone,
  Receipt,
  CreditCard,
  History,
  MoreVertical,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Shop, CalculatedShopStatus } from '../types/index.ts';
import { formatCurrency } from '../utils/rentCalculator.ts';

interface ShopCardProps {
  shop: Shop;
  statusInfo: CalculatedShopStatus;
  currencySymbol: string;
  onSendReminder: (shop: Shop) => void;
  onRecordPayment: (shop: Shop) => void;
  onViewLedger: (shop: Shop) => void;
  onEditShop: (shop: Shop) => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  shop,
  statusInfo,
  currencySymbol,
  onSendReminder,
  onRecordPayment,
  onViewLedger,
  onEditShop,
}) => {
  const isPaid = statusInfo.status === 'PAID';
  const isOverdue = statusInfo.status === 'OVERDUE';
  const isDueSoon = statusInfo.status === 'DUE_SOON';

  return (
    <div className="bg-white rounded-xl border border-stone-200/90 hover:border-stone-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between overflow-hidden">
      {/* Top Header Section */}
      <div className="p-4 sm:p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                {shop.shopNumber}
              </span>
              <span className="text-xs text-stone-500">{shop.floorOrArea}</span>
            </div>
            <h2 className="text-base font-bold text-stone-900 mt-1 leading-snug">
              {shop.businessName}
            </h2>
            <div className="text-xs text-stone-600 mt-0.5 flex items-center gap-2">
              <span className="font-medium text-stone-700">{shop.tenantName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-stone-500">{shop.businessCategory}</span>
              {shop.sizeSqFt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-400">{shop.sizeSqFt} sq ft</span>
                </>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onEditShop(shop)}
            title="Edit shop details"
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-50 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>

        {/* Financial & Status Bar */}
        <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
              Monthly Rent
            </span>
            <div className="text-base font-bold text-stone-900">
              {formatCurrency(statusInfo.totalExpected, currencySymbol)}
            </div>
            {shop.maintenanceFee > 0 && (
              <span className="text-[11px] text-stone-500 block">
                Incl. {formatCurrency(shop.maintenanceFee, currencySymbol)} maint.
              </span>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 block">
              Current Status
            </span>
            {isPaid ? (
              <div className="flex items-center justify-end gap-1 text-emerald-800 font-bold text-xs mt-0.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Paid Full</span>
              </div>
            ) : isOverdue ? (
              <div className="flex items-center justify-end gap-1 text-rose-800 font-bold text-xs mt-0.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>Overdue: {formatCurrency(statusInfo.amountDue, currencySymbol)}</span>
              </div>
            ) : isDueSoon ? (
              <div className="flex items-center justify-end gap-1 text-amber-900 font-bold text-xs mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Due: {formatCurrency(statusInfo.amountDue, currencySymbol)}</span>
              </div>
            ) : (
              <div className="text-stone-600 font-medium text-xs mt-0.5">
                Due {statusInfo.dueDateStr}
              </div>
            )}

            <div className="text-[11px] text-stone-500 mt-0.5">
              {isPaid
                ? `Paid on ${statusInfo.lastPayment?.paidDate || 'time'}`
                : isOverdue
                ? `${Math.abs(statusInfo.daysDifference)} days overdue`
                : statusInfo.daysDifference === 0
                ? 'Due today'
                : `Due on ${shop.dueDayOfMonth}th`}
            </div>
          </div>
        </div>

        {/* Tenant Contact Line */}
        <div className="mt-3 flex items-center justify-between text-xs text-stone-600 bg-stone-50/80 rounded-lg px-2.5 py-1.5">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span className="font-mono text-stone-700">{shop.phone}</span>
          </div>
          {statusInfo.lastReminder && (
            <span className="text-[11px] text-stone-500">
              Reminder: {new Date(statusInfo.lastReminder.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-3 bg-stone-50/60 border-t border-stone-100 flex items-center gap-2">
        {/* WhatsApp Reminder Button */}
        <button
          type="button"
          onClick={() => onSendReminder(shop)}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isPaid
              ? 'bg-stone-200/70 text-stone-700 hover:bg-stone-200'
              : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs'
          }`}
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
          <span>{isPaid ? 'Send Receipt' : 'Send Reminder'}</span>
        </button>

        {/* Record Payment Button */}
        <button
          type="button"
          onClick={() => onRecordPayment(shop)}
          title="Record Rent Payment"
          className="py-2 px-3 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <CreditCard className="w-3.5 h-3.5 text-stone-600" />
          <span className="hidden sm:inline">Record</span>
        </button>

        {/* Ledger History Button */}
        <button
          type="button"
          onClick={() => onViewLedger(shop)}
          title="Payment History & Receipts"
          className="p-2 rounded-lg text-xs font-semibold bg-white border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors flex items-center justify-center cursor-pointer"
        >
          <History className="w-3.5 h-3.5 text-stone-500" />
        </button>
      </div>
    </div>
  );
};
