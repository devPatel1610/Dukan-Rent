import React from 'react';
import {
  Shop,
  CalculatedShopStatus,
} from '../types/index.ts';
import { formatCurrency } from '../utils/rentCalculator.ts';
import {
  CreditCard,
  History,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

interface ShopTableProps {
  shops: Shop[];
  statuses: CalculatedShopStatus[];
  currencySymbol: string;
  onSendReminder: (shop: Shop) => void;
  onRecordPayment: (shop: Shop) => void;
  onViewLedger: (shop: Shop) => void;
  onEditShop: (shop: Shop) => void;
}

export const ShopTable: React.FC<ShopTableProps> = ({
  shops,
  statuses,
  currencySymbol,
  onSendReminder,
  onRecordPayment,
  onViewLedger,
  onEditShop,
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold text-[11px] uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Unit #</th>
              <th className="py-3 px-4">Business & Tenant</th>
              <th className="py-3 px-4">Rent Roll</th>
              <th className="py-3 px-4">Due Schedule</th>
              <th className="py-3 px-4">Payment Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 text-stone-800">
            {shops.map((shop) => {
              const statusInfo =
                statuses.find((s) => s.shopId === shop.id) ||
                ({
                  status: 'UPCOMING',
                  amountDue: shop.monthlyRent,
                  totalExpected: shop.monthlyRent,
                  totalPaid: 0,
                  dueDateStr: '',
                  daysDifference: 0,
                } as any);

              const isPaid = statusInfo.status === 'PAID';
              const isOverdue = statusInfo.status === 'OVERDUE';
              const isDueSoon = statusInfo.status === 'DUE_SOON';

              return (
                <tr key={shop.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Shop Unit */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                      {shop.shopNumber}
                    </span>
                    <span className="block text-[11px] text-stone-400 mt-0.5">
                      {shop.floorOrArea}
                    </span>
                  </td>

                  {/* Business & Tenant */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900">{shop.businessName}</div>
                    <div className="text-stone-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                      <span>{shop.tenantName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-stone-600">{shop.phone}</span>
                    </div>
                  </td>

                  {/* Rent Roll */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-stone-900 font-mono">
                      {formatCurrency(statusInfo.totalExpected, currencySymbol)}
                    </div>
                    {shop.maintenanceFee > 0 && (
                      <span className="text-[11px] text-stone-400 block">
                        +{formatCurrency(shop.maintenanceFee, currencySymbol)} maint.
                      </span>
                    )}
                  </td>

                  {/* Due Schedule */}
                  <td className="py-3 px-4">
                    <div className="font-medium text-stone-700">
                      {shop.dueDayOfMonth}th of month
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {isPaid
                        ? `Paid on ${statusInfo.lastPayment?.paidDate || 'time'}`
                        : isOverdue
                        ? `${Math.abs(statusInfo.daysDifference)}d overdue`
                        : statusInfo.daysDifference === 0
                        ? 'Due today'
                        : `In ${statusInfo.daysDifference} days`}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4">
                    {isPaid ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid Full</span>
                      </span>
                    ) : isOverdue ? (
                      <span className="inline-flex items-center gap-1 text-rose-800 font-bold text-[11px]">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Overdue ({formatCurrency(statusInfo.amountDue, currencySymbol)})</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Due ({formatCurrency(statusInfo.amountDue, currencySymbol)})</span>
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => onSendReminder(shop)}
                        title="Send WhatsApp Reminder"
                        className="p-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors cursor-pointer"
                      >
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                      </button>

                      <button
                        type="button"
                        onClick={() => onRecordPayment(shop)}
                        title="Record Payment"
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onViewLedger(shop)}
                        title="View Ledger History"
                        className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditShop(shop)}
                        title="Edit Details"
                        className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
