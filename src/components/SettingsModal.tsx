import React, { useState } from 'react';
import {
  X,
  Settings,
  Shield,
  Save,
  RotateCcw,
  Download,
  Upload,
  Lock,
  Building,
} from 'lucide-react';
import { LandlordProfile } from '../types/index.ts';
import { StorageService } from '../services/storage.ts';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: LandlordProfile;
  onSaveProfile: (profile: LandlordProfile) => void;
  onDataReset: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  onDataReset,
}) => {
  if (!isOpen) return null;

  const [ownerName, setOwnerName] = useState(profile.ownerName);
  const [complexName, setComplexName] = useState(profile.complexName);
  const [phone, setPhone] = useState(profile.phone);
  const [upiId, setUpiId] = useState(profile.upiId);
  const [bankAccountInfo, setBankAccountInfo] = useState(profile.bankAccountInfo || '');
  const [currencySymbol, setCurrencySymbol] = useState(profile.currencySymbol);
  const [defaultReminderDaysBefore, setDefaultReminderDaysBefore] = useState(
    profile.defaultReminderDaysBefore
  );
  const [pinCodeEnabled, setPinCodeEnabled] = useState(profile.pinCodeEnabled);
  const [pinCode, setPinCode] = useState(profile.pinCode || '1234');
  const [importStatus, setImportStatus] = useState<string>('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: LandlordProfile = {
      ...profile,
      ownerName: ownerName.trim(),
      complexName: complexName.trim(),
      phone: phone.trim(),
      upiId: upiId.trim(),
      bankAccountInfo: bankAccountInfo.trim(),
      currencySymbol,
      defaultReminderDaysBefore: Number(defaultReminderDaysBefore) || 3,
      pinCodeEnabled,
      pinCode: pinCode.trim(),
    };
    onSaveProfile(updated);
    onClose();
  };

  const handleExport = () => {
    const dataStr = StorageService.exportAllDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dukan-ledger-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = StorageService.importDataJSON(text);
        if (success) {
          setImportStatus('Backup restored successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          setImportStatus('Failed to restore file. Invalid JSON structure.');
        }
      } catch {
        setImportStatus('Error reading file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Settings className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                Ledger Settings & Security
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                Owner profile, payment accounts, security PIN & backups
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

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs">
          {/* Owner & Complex Details */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Landlord & Property Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="owner-name-input" className="font-semibold text-stone-700 block mb-1">
                  Owner / Landlord Name
                </label>
                <input
                  id="owner-name-input"
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>

              <div>
                <label htmlFor="complex-name-input" className="font-semibold text-stone-700 block mb-1">
                  Commercial Complex / Market Name
                </label>
                <input
                  id="complex-name-input"
                  type="text"
                  required
                  value={complexName}
                  onChange={(e) => setComplexName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>

              <div>
                <label htmlFor="owner-phone-input" className="font-semibold text-stone-700 block mb-1">
                  Contact Phone Number
                </label>
                <input
                  id="owner-phone-input"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>

              <div>
                <label htmlFor="currency-symbol-input" className="font-semibold text-stone-700 block mb-1">
                  Currency Symbol
                </label>
                <input
                  id="currency-symbol-input"
                  type="text"
                  required
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono font-bold focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>
            </div>
          </div>

          {/* Payment Credentials for WhatsApp Reminders */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Payment Receiver Details (Auto-filled in WhatsApp messages)
            </h3>
            <div className="space-y-3">
              <div>
                <label htmlFor="upi-id-input" className="font-semibold text-stone-700 block mb-1">
                  Primary UPI ID (GPay / PhonePe / Paytm / BHIM)
                </label>
                <input
                  id="upi-id-input"
                  type="text"
                  required
                  placeholder="e.g. yourname@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono text-emerald-800 font-semibold focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>

              <div>
                <label htmlFor="bank-details-input" className="font-semibold text-stone-700 block mb-1">
                  Bank Transfer Details (Account #, Bank, IFSC)
                </label>
                <input
                  id="bank-details-input"
                  type="text"
                  placeholder="e.g. HDFC Bank, A/C: 501004928172, IFSC: HDFC0000240"
                  value={bankAccountInfo}
                  onChange={(e) => setBankAccountInfo(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>
            </div>
          </div>

          {/* Security PIN Code */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  App Security & PIN Lock
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Protect confidential tenant ledgers and financial balances on mobile.
                </p>
              </div>
              <input
                type="checkbox"
                id="pinCodeEnabled"
                checked={pinCodeEnabled}
                onChange={(e) => setPinCodeEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded border-stone-300"
              />
            </div>

            {pinCodeEnabled && (
              <div className="pt-2">
                <label htmlFor="pinCodeInput" className="font-semibold text-stone-700 block mb-1">
                  4-Digit Security PIN
                </label>
                <input
                  type="password"
                  id="pinCodeInput"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                  className="w-32 px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-center font-mono text-base tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-stone-800/10"
                />
              </div>
            )}
          </div>

          {/* Backup & Demo Data */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Data Management & Backup
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="px-3 py-1.5 bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON Backup</span>
              </button>

              <label className="px-3 py-1.5 bg-white border border-stone-200 text-stone-800 hover:bg-stone-50 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>Restore Backup</span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
              </label>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all ledger data back to sample shops and payments?')) {
                    onDataReset();
                    onClose();
                  }
                }}
                className="px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 hover:bg-rose-100 rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer ml-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
            {importStatus && (
              <p className="text-[11px] font-semibold text-emerald-700">{importStatus}</p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl font-semibold text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold bg-[#14281D] hover:bg-[#1E3A2B] text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4 text-emerald-400" />
              <span>Save Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
