import React, { useState, useEffect } from 'react';
import {
  X,
  Send,
  Copy,
  Check,
  Sparkles,
  Phone,
  Building,
  User,
  Clock,
} from 'lucide-react';
import {
  Shop,
  CalculatedShopStatus,
  LandlordProfile,
  ReminderTemplate,
  ReminderLog,
} from '../types/index.ts';
import {
  interpolateTemplate,
  generateWhatsAppLink,
  formatCurrency,
} from '../utils/rentCalculator.ts';

interface WhatsAppReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  shop: Shop | null;
  statusInfo: CalculatedShopStatus | null;
  profile: LandlordProfile;
  templates: ReminderTemplate[];
  onLogReminder: (log: ReminderLog) => void;
}

export const WhatsAppReminderModal: React.FC<WhatsAppReminderModalProps> = ({
  isOpen,
  onClose,
  shop,
  statusInfo,
  profile,
  templates,
  onLogReminder,
}) => {
  if (!isOpen || !shop || !statusInfo) return null;

  // Choose appropriate default template based on status
  const defaultTemplateTag =
    statusInfo.status === 'PAID'
      ? 'receipt'
      : statusInfo.status === 'OVERDUE'
      ? 'overdue'
      : statusInfo.daysDifference === 0
      ? 'due_today'
      : 'courtesy';

  const [selectedTag, setSelectedTag] = useState<string>(defaultTemplateTag);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>(shop.phone);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Re-interpolate when shop, profile, or template changes
  useEffect(() => {
    setSelectedTag(defaultTemplateTag);
    setRecipientPhone(shop.phone);
    setSentSuccess(false);
  }, [shop, defaultTemplateTag]);

  useEffect(() => {
    const template = templates.find((t) => t.tag === selectedTag) || templates[0];
    const interpolated = interpolateTemplate(template.body, {
      tenant: shop.tenantName,
      shop: shop.shopNumber,
      businessName: shop.businessName,
      month: statusInfo.monthName,
      amount: formatCurrency(
        statusInfo.status === 'PAID' ? statusInfo.totalPaid : statusInfo.amountDue,
        profile.currencySymbol
      ),
      dueDate: statusInfo.dueDateStr,
      ownerName: profile.ownerName,
      complexName: profile.complexName,
      upiId: profile.upiId,
      bankInfo: profile.bankAccountInfo,
    });
    setCustomMessage(interpolated);
  }, [selectedTag, shop, statusInfo, profile, templates]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleLaunchWhatsApp = () => {
    const link = generateWhatsAppLink(recipientPhone, customMessage);
    // Log this reminder in persistent state
    const newLog: ReminderLog = {
      id: `rem-${Date.now()}`,
      shopId: shop.id,
      tenantName: shop.tenantName,
      phone: recipientPhone,
      month: statusInfo.currentMonthKey,
      amountDue: statusInfo.amountDue,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      messagePreview: customMessage.slice(0, 100),
      templateType: selectedTag as any,
    };
    onLogReminder(newLog);
    setSentSuccess(true);

    // Open WhatsApp in new tab / mobile app
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Send WhatsApp Rent Reminder
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

        {/* Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Tenant Phone & Recipient Verification */}
          <div className="bg-stone-50 rounded-xl p-3 border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Phone className="w-4 h-4 text-emerald-700" />
              <span className="font-semibold text-stone-800">WhatsApp Destination:</span>
            </div>
            <input
              type="text"
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              className="text-xs font-mono font-semibold px-2.5 py-1 bg-white border border-stone-200 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-700"
              placeholder="+91 9876543210"
            />
          </div>

          {/* Template Selector Tabs */}
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1.5">
              Select Message Template:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-stone-100 rounded-xl">
              <button
                type="button"
                onClick={() => setSelectedTag('courtesy')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                  selectedTag === 'courtesy'
                    ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Advance
              </button>
              <button
                type="button"
                onClick={() => setSelectedTag('due_today')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                  selectedTag === 'due_today'
                    ? 'bg-white text-amber-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Due Today
              </button>
              <button
                type="button"
                onClick={() => setSelectedTag('overdue')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                  selectedTag === 'overdue'
                    ? 'bg-white text-rose-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Overdue
              </button>
              <button
                type="button"
                onClick={() => setSelectedTag('receipt')}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all cursor-pointer ${
                  selectedTag === 'receipt'
                    ? 'bg-white text-emerald-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Receipt
              </button>
            </div>
          </div>

          {/* WhatsApp Chat Bubble Live Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="custom-message-textarea" className="text-xs font-medium text-stone-700">
                Message Preview (Click to edit):
              </label>
              <span className="text-[11px] text-stone-400">
                Variables are auto-filled with your UPI & amounts
              </span>
            </div>

            <div className="relative rounded-2xl bg-[#EFEAE2] p-4 border border-stone-300/80 shadow-inner">
              {/* WhatsApp stylized background pattern */}
              <div className="bg-[#E7FFDB] text-stone-900 rounded-xl p-3.5 shadow-xs border border-emerald-100 max-w-md ml-auto text-xs whitespace-pre-wrap leading-relaxed font-sans">
                <textarea
                  id="custom-message-textarea"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  rows={8}
                  style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
                  className="w-full bg-transparent border-none focus:outline-none resize-none text-xs text-stone-900 leading-relaxed font-medium"
                />
                <div className="text-[10px] text-stone-500 text-right mt-1 flex items-center justify-end gap-1">
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <Check className="w-3 h-3 text-emerald-600 inline" />
                </div>
              </div>
            </div>
          </div>

          {sentSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center justify-between">
              <span>WhatsApp message opened! A reminder record was added to your ledger audit trail.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 hover:bg-stone-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-500" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleLaunchWhatsApp}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 fill-emerald-400" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Launch WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
