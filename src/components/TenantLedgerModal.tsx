import React from 'react';
import {
  X,
  History,
  Receipt,
  Phone,
  Building,
  CreditCard,
  CheckCircle2,
  Calendar,
  Send,
} from 'lucide-react';
import { Shop, PaymentRecord, ReminderLog, LandlordProfile } from '../types/index.ts';
import { formatCurrency } from '../utils/rentCalculator.ts';

interface TenantLedgerModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  payments: PaymentRecord[];
  reminderLogs: ReminderLog[];
  profile: LandlordProfile;
  onViewReceipt: (payment: PaymentRecord) => void;
}

export const TenantLedgerModal: React.FC<TenantLedgerModalProps> = ({
  isOpen,
  onClose,
  shop,
  payments,
  reminderLogs,
  profile,
  onViewReceipt,
}) => {
  if (!isOpen || !shop) return null;

  const shopPayments = payments.filter((p) => p.shopId === shop.id);
  const shopReminders = reminderLogs.filter((r) => r.shopId === shop.id);
  const totalRentPaidEver = shopPayments.reduce((sum, p) => sum + p.totalPaid, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <History className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Tenant Ledger & Payment History
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                {shop.shopNumber} · {shop.businessName} ({shop.tenantName})
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 text-xs">
          {/* Quick Shop Profile Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200/80">
            <div>
              <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                Monthly Rent
              </span>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {formatCurrency(shop.monthlyRent, profile.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                Maintenance
              </span>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {formatCurrency(shop.maintenanceFee, profile.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                Security Deposit
              </span>
              <span className="text-sm font-bold text-stone-900 font-mono">
                {formatCurrency(shop.securityDeposit, profile.currencySymbol)}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-stone-400 block font-semibold">
                Total Settled All-Time
              </span>
              <span className="text-sm font-bold text-emerald-800 font-mono">
                {formatCurrency(totalRentPaidEver, profile.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Section: Payments & Receipts */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5 flex items-center gap-1.5">
              <Receipt className="w-4 h-4 text-stone-500" />
              <span>Payment Transactions & Receipts ({shopPayments.length})</span>
            </h3>

            {shopPayments.length === 0 ? (
              <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 text-center text-stone-400 text-xs">
                No payments recorded yet for this shop.
              </div>
            ) : (
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Period</th>
                      <th className="py-2.5 px-3 font-semibold">Receipt #</th>
                      <th className="py-2.5 px-3 font-semibold">Paid Date</th>
                      <th className="py-2.5 px-3 font-semibold">Mode</th>
                      <th className="py-2.5 px-3 text-right font-semibold">Amount</th>
                      <th className="py-2.5 px-3 text-center font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800">
                    {shopPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/60">
                        <td className="py-2.5 px-3 font-semibold">{p.month}</td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-stone-600">
                          {p.receiptNumber}
                        </td>
                        <td className="py-2.5 px-3 text-stone-500">{p.paidDate}</td>
                        <td className="py-2.5 px-3">
                          <span className="text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded text-[11px]">
                            {p.paymentMode}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-900">
                          {formatCurrency(p.totalPaid, profile.currencySymbol)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => onViewReceipt(p)}
                            className="text-emerald-800 hover:text-emerald-950 font-semibold text-[11px] hover:underline cursor-pointer"
                          >
                            View Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section: Reminders Sent */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2.5 flex items-center gap-1.5">
              <Send className="w-4 h-4 text-emerald-700" />
              <span>WhatsApp Reminders Sent ({shopReminders.length})</span>
            </h3>

            {shopReminders.length === 0 ? (
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-center text-stone-400 text-xs">
                No reminders sent to this tenant yet.
              </div>
            ) : (
              <div className="space-y-2">
                {shopReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-800">
                          Template: {rem.templateType}
                        </span>
                        <span className="text-stone-400 text-[11px]">
                          ({new Date(rem.sentAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })})
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px] mt-0.5 italic">
                        "{rem.messagePreview}..."
                      </p>
                    </div>

                    <span className="text-emerald-700 font-bold text-[11px] shrink-0">
                      Dispatched
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
          >
            Close Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
