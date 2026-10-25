import React, { useState } from 'react';
import {
  X,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  History,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Settings,
} from 'lucide-react';
import {
  Shop,
  CalculatedShopStatus,
  LandlordProfile,
  ReminderLog,
  ReminderTemplate,
} from '../types/index.ts';
import {
  formatCurrency,
  generateWhatsAppLink,
  interpolateTemplate,
} from '../utils/rentCalculator.ts';

interface AutomatedMessagingQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
  shops: Shop[];
  statuses: CalculatedShopStatus[];
  profile: LandlordProfile;
  templates: ReminderTemplate[];
  reminderLogs: ReminderLog[];
  onLogReminder: (log: ReminderLog) => void;
  onUpdateProfile: (profile: LandlordProfile) => void;
}

export const AutomatedMessagingQueueModal: React.FC<AutomatedMessagingQueueModalProps> = ({
  isOpen,
  onClose,
  shops,
  statuses,
  profile,
  templates,
  reminderLogs,
  onLogReminder,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'queue' | 'audit' | 'rules'>('queue');

  // Filter shops that have pending balance or overdue status
  const pendingQueue = statuses
    .filter((s) => s.status !== 'PAID' && s.amountDue > 0)
    .map((status) => {
      const shop = shops.find((s) => s.id === status.shopId);
      return { shop, status };
    })
    .filter((item): item is { shop: Shop; status: CalculatedShopStatus } => item.shop !== undefined);

  const handleSendReminderForShop = (shop: Shop, status: CalculatedShopStatus) => {
    const templateTag =
      status.status === 'OVERDUE'
        ? 'overdue'
        : status.daysDifference === 0
        ? 'due_today'
        : 'courtesy';

    const template = templates.find((t) => t.tag === templateTag) || templates[0];
    const message = interpolateTemplate(template.body, {
      tenant: shop.tenantName,
      shop: shop.shopNumber,
      businessName: shop.businessName,
      month: status.monthName,
      amount: formatCurrency(status.amountDue, profile.currencySymbol),
      dueDate: status.dueDateStr,
      ownerName: profile.ownerName,
      complexName: profile.complexName,
      upiId: profile.upiId,
      bankInfo: profile.bankAccountInfo,
    });

    const newLog: ReminderLog = {
      id: `rem-${Date.now()}`,
      shopId: shop.id,
      tenantName: shop.tenantName,
      phone: shop.phone,
      month: status.currentMonthKey,
      amountDue: status.amountDue,
      sentAt: new Date().toISOString(),
      status: 'SENT',
      messagePreview: message.slice(0, 100),
      templateType: templateTag as any,
    };
    onLogReminder(newLog);

    const url = generateWhatsAppLink(shop.phone, message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
              <Send className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Automated Messaging & WhatsApp Hub
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                Batch reminders queue, automation schedule & delivery audit trail
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

        {/* Tab Switcher */}
        <div className="px-5 pt-3 pb-0 border-b border-stone-200 flex items-center gap-4 bg-stone-50/30 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'queue' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Pending Queue ({pendingQueue.length})
            {activeTab === 'queue' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'audit' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Audit Log ({reminderLogs.length})
            {activeTab === 'audit' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rules')}
            className={`pb-3 relative transition-colors cursor-pointer ${
              activeTab === 'rules' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            Automation Rules & Templates
            {activeTab === 'rules' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {/* TAB 1: PENDING QUEUE */}
          {activeTab === 'queue' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 rounded-xl p-3 border border-stone-200/80">
                <span>
                  {pendingQueue.length === 0
                    ? '🎉 All rent accounts are settled! No reminders needed.'
                    : `${pendingQueue.length} tenant${pendingQueue.length > 1 ? 's' : ''} currently have pending balances.`}
                </span>
                <span className="font-semibold text-emerald-800 font-mono">
                  UPI: {profile.upiId}
                </span>
              </div>

              {pendingQueue.length === 0 ? (
                <div className="text-center py-12 text-stone-400">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-stone-700">Great job! 100% on-time ledger.</p>
                  <p className="text-xs text-stone-500 mt-1">
                    No active reminders due in the queue.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {pendingQueue.map(({ shop, status }) => {
                    const isOverdue = status.status === 'OVERDUE';
                    const isDueToday = status.daysDifference === 0;

                    return (
                      <div
                        key={shop.id}
                        className="p-3.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                              {shop.shopNumber}
                            </span>
                            <span className="text-xs font-bold text-stone-800">
                              {shop.businessName}
                            </span>
                            <span className="text-xs text-stone-500">({shop.tenantName})</span>
                          </div>

                          <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                            <span className="font-semibold text-stone-800">
                              Due: {formatCurrency(status.amountDue, profile.currencySymbol)}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span
                              className={
                                isOverdue
                                  ? 'text-rose-700 font-bold'
                                  : isDueToday
                                  ? 'text-amber-800 font-bold'
                                  : 'text-stone-600'
                              }
                            >
                              {isOverdue
                                ? `Overdue by ${Math.abs(status.daysDifference)} days`
                                : isDueToday
                                ? 'Due Today!'
                                : `Due in ${status.daysDifference} days (${status.dueDateStr})`}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSendReminderForShop(shop, status)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-2xs transition-colors shrink-0 cursor-pointer"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                          </svg>
                          <span>Send WhatsApp</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              {reminderLogs.length === 0 ? (
                <div className="text-center py-12 text-stone-400 text-xs">
                  No WhatsApp reminders logged yet.
                </div>
              ) : (
                reminderLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{log.tenantName}</span>
                        <span className="font-mono text-stone-500">{log.phone}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">
                        {new Date(log.sentAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div className="text-stone-600 line-clamp-2 italic bg-white p-2 rounded-lg border border-stone-100">
                      "{log.messagePreview}..."
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                      <span>Template: {log.templateType}</span>
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Dispatched
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: AUTOMATION RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4 text-xs">
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-stone-900 text-sm">
                      Smart Reminder Schedule
                    </h3>
                    <p className="text-stone-500 text-xs mt-0.5">
                      Automatically queue personalized reminders on WhatsApp without typing.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.autoMessageScheduleEnabled}
                    onChange={(e) =>
                      onUpdateProfile({
                        ...profile,
                        autoMessageScheduleEnabled: e.target.checked,
                      })
                    }
                    className="w-5 h-5 text-emerald-700 rounded border-stone-300"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-200 text-stone-700">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-700" />
                    <span>Advance Reminder: <strong>{profile.defaultReminderDaysBefore} days before</strong> due date</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-700" />
                    <span>Due Day Reminder: <strong>On the exact due date</strong> (morning)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-700" />
                    <span>Overdue Notice: <strong>After grace period (3 days)</strong> if still unpaid</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <h4 className="font-bold text-stone-900">Configured Message Templates:</h4>
                {templates.map((tpl) => (
                  <div key={tpl.id} className="p-3 bg-white border border-stone-200 rounded-xl">
                    <div className="font-semibold text-stone-800">{tpl.title}</div>
                    <div className="text-[11px] text-stone-500 mb-1.5">{tpl.description}</div>
                    <pre className="text-[11px] bg-stone-50 p-2.5 rounded-lg border border-stone-100 whitespace-pre-wrap font-sans text-stone-700">
                      {tpl.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-white transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
