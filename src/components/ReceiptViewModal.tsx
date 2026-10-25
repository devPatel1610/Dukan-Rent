import React from 'react';
import { X, Printer, Share2, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { Shop, PaymentRecord, LandlordProfile } from '../types/index.ts';
import { formatCurrency, generateWhatsAppLink } from '../utils/rentCalculator.ts';

interface ReceiptViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  payment: PaymentRecord | null;
  profile: LandlordProfile;
}

export const ReceiptViewModal: React.FC<ReceiptViewModalProps> = ({
  isOpen,
  onClose,
  shop,
  payment,
  profile,
}) => {
  if (!isOpen || !shop || !payment) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const message = `*RENT PAYMENT RECEIPT* 🧾\n\n*Receipt No:* ${payment.receiptNumber}\n*Complex:* ${profile.complexName}\n*Owner:* ${profile.ownerName}\n\n*Received From:* ${shop.tenantName}\n*Business:* ${shop.businessName}\n*Shop Unit:* ${shop.shopNumber} (${shop.floorOrArea})\n*Period:* ${payment.month}\n\n*Breakdown:*\n• Base Rent: ${formatCurrency(payment.rentAmountPaid, profile.currencySymbol)}\n• Maintenance: ${formatCurrency(payment.maintenancePaid, profile.currencySymbol)}\n${payment.electricityPaid > 0 ? `• Electricity/Misc: ${formatCurrency(payment.electricityPaid, profile.currencySymbol)}\n` : ''}*Total Settled:* ${formatCurrency(payment.totalPaid, profile.currencySymbol)}\n\n*Payment Mode:* ${payment.paymentMode}${payment.transactionRef ? ` (${payment.transactionRef})` : ''}\n*Payment Date:* ${payment.paidDate}\n\n*Status:* FULLY SETTLED ✅\n\nThank you for your prompt business!`;
    const url = generateWhatsAppLink(shop.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">
              {payment.receiptNumber}
            </span>
            <span className="text-xs font-medium text-stone-500">Official Rent Receipt</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrint}
              title="Print Receipt"
              className="p-1.5 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper */}
        <div className="p-6 bg-white space-y-5 print:p-8">
          {/* Header */}
          <div className="border-b border-stone-200 pb-4 text-center">
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              {profile.complexName}
            </h2>
            <div className="text-xs text-stone-500 mt-0.5">
              Property Owner: {profile.ownerName} · Phone: {profile.phone}
            </div>
            {profile.bankAccountInfo && (
              <div className="text-[11px] text-stone-400 mt-0.5 font-mono">
                {profile.bankAccountInfo}
              </div>
            )}
          </div>

          {/* Receipt Meta */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                Tenant Details
              </span>
              <div className="font-bold text-stone-900 mt-0.5">{shop.tenantName}</div>
              <div className="text-stone-600">{shop.businessName}</div>
              <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                {shop.shopNumber} ({shop.floorOrArea})
              </div>
            </div>

            <div className="text-right">
              <span className="text-stone-400 block uppercase tracking-wider text-[10px]">
                Receipt Info
              </span>
              <div className="font-mono font-bold text-stone-900 mt-0.5">
                {payment.receiptNumber}
              </div>
              <div className="text-stone-600">Period: {payment.month}</div>
              <div className="text-stone-500">Date: {payment.paidDate}</div>
            </div>
          </div>

          {/* Table Breakdown */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
                <tr>
                  <th className="py-2.5 px-3 text-left font-semibold">Description</th>
                  <th className="py-2.5 px-3 text-right font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-800">
                <tr>
                  <td className="py-2.5 px-3">
                    Monthly Shop Rent ({payment.month})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">
                    {formatCurrency(payment.rentAmountPaid, profile.currencySymbol)}
                  </td>
                </tr>
                {payment.maintenancePaid > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">Common Maintenance & Security</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {formatCurrency(payment.maintenancePaid, profile.currencySymbol)}
                    </td>
                  </tr>
                )}
                {payment.electricityPaid > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">Electricity / Utility Charges</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">
                      {formatCurrency(payment.electricityPaid, profile.currencySymbol)}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-stone-50/80 border-t border-stone-200 font-bold">
                <tr>
                  <td className="py-2.5 px-3 text-stone-900">Total Settled</td>
                  <td className="py-2.5 px-3 text-right text-stone-900 font-mono text-sm">
                    {formatCurrency(payment.totalPaid, profile.currencySymbol)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Payment Method & Verification */}
          <div className="flex items-center justify-between text-xs bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold text-emerald-950 block">
                  Payment Verified: {payment.paymentMode}
                </span>
                {payment.transactionRef && (
                  <span className="font-mono text-[11px] text-emerald-800">
                    Ref: {payment.transactionRef}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right text-[11px] text-emerald-800 font-medium">
              Authorized Acknowledgment
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>Send Receipt via WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
