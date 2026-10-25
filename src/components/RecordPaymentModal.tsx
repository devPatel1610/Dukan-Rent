import React, { useState, useEffect } from 'react';
import { X, CreditCard, Check, Receipt } from 'lucide-react';
import {
  Shop,
  CalculatedShopStatus,
  PaymentRecord,
  PaymentMode,
  LandlordProfile,
} from '../types/index.ts';
import { formatCurrency, getMonthKey } from '../utils/rentCalculator.ts';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  statusInfo: CalculatedShopStatus | null;
  profile: LandlordProfile;
  onPaymentRecorded: (payment: PaymentRecord, sendReceiptNow: boolean) => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  onClose,
  shop,
  statusInfo,
  profile,
  onPaymentRecorded,
}) => {
  if (!isOpen || !shop || !statusInfo) return null;

  const [rentPaid, setRentPaid] = useState<number>(shop.monthlyRent);
  const [maintenancePaid, setMaintenancePaid] = useState<number>(shop.maintenanceFee || 0);
  const [electricityPaid, setElectricityPaid] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('UPI');
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [paidDate, setPaidDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState<string>('');
  const [sendWhatsAppReceipt, setSendWhatsAppReceipt] = useState<boolean>(true);

  useEffect(() => {
    setRentPaid(shop.monthlyRent);
    setMaintenancePaid(shop.maintenanceFee || 0);
    setElectricityPaid(0);
    setPaymentMode('UPI');
    setTransactionRef('');
    setPaidDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  }, [shop]);

  const totalCalculated =
    (Number(rentPaid) || 0) + (Number(maintenancePaid) || 0) + (Number(electricityPaid) || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCalculated <= 0) return;

    const receiptNum = `REC-${statusInfo.currentMonthKey.replace('-', '')}-${String(
      Math.floor(100 + Math.random() * 900)
    )}`;

    const newPayment: PaymentRecord = {
      id: `pay-${Date.now()}`,
      shopId: shop.id,
      month: statusInfo.currentMonthKey,
      rentAmountPaid: Number(rentPaid) || 0,
      maintenancePaid: Number(maintenancePaid) || 0,
      electricityPaid: Number(electricityPaid) || 0,
      totalPaid: totalCalculated,
      paidDate,
      paymentMode,
      transactionRef: transactionRef.trim() || undefined,
      receiptNumber: receiptNum,
      recordedAt: new Date().toISOString(),
      notes: notes.trim() || undefined,
    };

    onPaymentRecorded(newPayment, sendWhatsAppReceipt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Record Rent Payment
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                {shop.shopNumber} · {shop.businessName} ({statusInfo.monthName})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          {/* Breakdown: Rent, Maintenance, Electricity */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="rent-paid-input" className="text-xs font-semibold text-stone-700 block mb-1">
                Shop Rent ({profile.currencySymbol})
              </label>
              <input
                id="rent-paid-input"
                type="number"
                min="0"
                required
                value={rentPaid}
                onChange={(e) => setRentPaid(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:border-stone-800"
              />
            </div>

            <div>
              <label htmlFor="maint-paid-input" className="text-xs font-semibold text-stone-700 block mb-1">
                Maintenance ({profile.currencySymbol})
              </label>
              <input
                id="maint-paid-input"
                type="number"
                min="0"
                value={maintenancePaid}
                onChange={(e) => setMaintenancePaid(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:border-stone-800"
              />
            </div>

            <div>
              <label htmlFor="elec-paid-input" className="text-xs font-semibold text-stone-700 block mb-1">
                Electricity / Misc
              </label>
              <input
                id="elec-paid-input"
                type="number"
                min="0"
                value={electricityPaid}
                onChange={(e) => setElectricityPaid(Number(e.target.value))}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-stone-800/10 focus:border-stone-800"
              />
            </div>
          </div>

          {/* Total Display Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-3 flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-900">Total Settlement Amount:</span>
            <span className="text-base font-bold text-emerald-800 font-mono">
              {formatCurrency(totalCalculated, profile.currencySymbol)}
            </span>
          </div>

          {/* Payment Mode & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="payment-mode-select" className="text-xs font-semibold text-stone-700 block mb-1">
                Payment Method
              </label>
              <select
                id="payment-mode-select"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-800/10"
              >
                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                <option value="Cash">Cash in Hand</option>
                <option value="Bank Transfer">Bank Transfer (NEFT/IMPS)</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label htmlFor="paid-date-input" className="text-xs font-semibold text-stone-700 block mb-1">
                Payment Date
              </label>
              <input
                id="paid-date-input"
                type="date"
                required
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-stone-800/10"
              />
            </div>
          </div>

          {/* Transaction Reference (UPI ID or Cheque No) */}
          <div>
            <label htmlFor="trans-ref-input" className="text-xs font-semibold text-stone-700 block mb-1">
              Transaction Reference / UPI Ref / Cheque # (Optional)
            </label>
            <input
              id="trans-ref-input"
              type="text"
              placeholder="e.g. UPI/20261024/091248"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/10"
            />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="payment-notes-input" className="text-xs font-semibold text-stone-700 block mb-1">
              Notes / Remarks (Optional)
            </label>
            <input
              id="payment-notes-input"
              type="text"
              placeholder="e.g. Paid in full before afternoon"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-stone-800/10"
            />
          </div>

          {/* Checkbox: Instantly send receipt */}
          <div className="flex items-center gap-2.5 pt-2">
            <input
              type="checkbox"
              id="sendReceipt"
              checked={sendWhatsAppReceipt}
              onChange={(e) => setSendWhatsAppReceipt(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-700 border-stone-300"
            />
            <label htmlFor="sendReceipt" className="text-xs font-medium text-stone-700 cursor-pointer">
              Prompt to send digital WhatsApp payment receipt to tenant immediately
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Confirm & Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
