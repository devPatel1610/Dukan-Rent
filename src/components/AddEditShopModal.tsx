import React, { useState, useEffect } from 'react';
import { X, Building, Check, Trash2 } from 'lucide-react';
import { Shop, LandlordProfile } from '../types/index.ts';

interface AddEditShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopToEdit: Shop | null;
  profile: LandlordProfile;
  onSaveShop: (shop: Shop) => void;
  onDeleteShop?: (id: string) => void;
}

export const AddEditShopModal: React.FC<AddEditShopModalProps> = ({
  isOpen,
  onClose,
  shopToEdit,
  profile,
  onSaveShop,
  onDeleteShop,
}) => {
  if (!isOpen) return null;

  const isEditing = !!shopToEdit;

  const [shopNumber, setShopNumber] = useState(shopToEdit?.shopNumber || '');
  const [floorOrArea, setFloorOrArea] = useState(shopToEdit?.floorOrArea || 'Ground Floor');
  const [sizeSqFt, setSizeSqFt] = useState<number | undefined>(shopToEdit?.sizeSqFt);
  const [tenantName, setTenantName] = useState(shopToEdit?.tenantName || '');
  const [businessName, setBusinessName] = useState(shopToEdit?.businessName || '');
  const [businessCategory, setBusinessCategory] = useState<Shop['businessCategory']>(
    shopToEdit?.businessCategory || 'Retail'
  );
  const [phone, setPhone] = useState(shopToEdit?.phone || '+91 ');
  const [alternatePhone, setAlternatePhone] = useState(shopToEdit?.alternatePhone || '');
  const [monthlyRent, setMonthlyRent] = useState<number>(shopToEdit?.monthlyRent || 15000);
  const [maintenanceFee, setMaintenanceFee] = useState<number>(shopToEdit?.maintenanceFee || 1500);
  const [securityDeposit, setSecurityDeposit] = useState<number>(shopToEdit?.securityDeposit || 50000);
  const [dueDayOfMonth, setDueDayOfMonth] = useState<number>(shopToEdit?.dueDayOfMonth || 5);
  const [gracePeriodDays, setGracePeriodDays] = useState<number>(shopToEdit?.gracePeriodDays || 3);
  const [leaseStartDate, setLeaseStartDate] = useState(
    shopToEdit?.leaseStartDate || new Date().toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState(shopToEdit?.notes || '');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (shopToEdit) {
      setShopNumber(shopToEdit.shopNumber);
      setFloorOrArea(shopToEdit.floorOrArea);
      setSizeSqFt(shopToEdit.sizeSqFt);
      setTenantName(shopToEdit.tenantName);
      setBusinessName(shopToEdit.businessName);
      setBusinessCategory(shopToEdit.businessCategory);
      setPhone(shopToEdit.phone);
      setAlternatePhone(shopToEdit.alternatePhone || '');
      setMonthlyRent(shopToEdit.monthlyRent);
      setMaintenanceFee(shopToEdit.maintenanceFee);
      setSecurityDeposit(shopToEdit.securityDeposit);
      setDueDayOfMonth(shopToEdit.dueDayOfMonth);
      setGracePeriodDays(shopToEdit.gracePeriodDays);
      setLeaseStartDate(shopToEdit.leaseStartDate);
      setNotes(shopToEdit.notes || '');
    } else {
      setShopNumber('');
      setFloorOrArea('Ground Floor');
      setSizeSqFt(300);
      setTenantName('');
      setBusinessName('');
      setBusinessCategory('Retail');
      setPhone('+91 ');
      setAlternatePhone('');
      setMonthlyRent(18000);
      setMaintenanceFee(1500);
      setSecurityDeposit(50000);
      setDueDayOfMonth(5);
      setGracePeriodDays(3);
      setLeaseStartDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setErrorMsg('');
  }, [shopToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopNumber.trim()) {
      setErrorMsg('Please specify the shop or unit number.');
      return;
    }
    if (!tenantName.trim()) {
      setErrorMsg('Please specify the tenant name.');
      return;
    }
    if (!businessName.trim()) {
      setErrorMsg('Please specify the trade / business name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Please enter a valid WhatsApp phone number.');
      return;
    }

    const shopData: Shop = {
      id: shopToEdit?.id || `shop-${Date.now()}`,
      shopNumber: shopNumber.trim(),
      floorOrArea: floorOrArea.trim(),
      sizeSqFt: sizeSqFt ? Number(sizeSqFt) : undefined,
      tenantName: tenantName.trim(),
      businessName: businessName.trim(),
      businessCategory,
      phone: phone.trim(),
      alternatePhone: alternatePhone.trim() || undefined,
      monthlyRent: Number(monthlyRent) || 0,
      maintenanceFee: Number(maintenanceFee) || 0,
      securityDeposit: Number(securityDeposit) || 0,
      dueDayOfMonth: Number(dueDayOfMonth) || 5,
      gracePeriodDays: Number(gracePeriodDays) || 3,
      leaseStartDate,
      notes: notes.trim() || undefined,
      isActive: true,
      createdAt: shopToEdit?.createdAt || new Date().toISOString(),
    };

    onSaveShop(shopData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#14281D] text-white flex items-center justify-center shadow-xs">
              <Building className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">
                {isEditing ? `Edit ${shopToEdit.shopNumber}` : 'Add New Rented Shop'}
              </h2>
              <div className="text-xs text-stone-500 mt-0.5">
                Keep shop records and configure WhatsApp rent reminders
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

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {errorMsg}
            </div>
          )}

          {/* Section: Shop & Location */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Shop Unit Identification
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="shop-number-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Shop Number *
                </label>
                <input
                  id="shop-number-input"
                  type="text"
                  required
                  placeholder="e.g. Shop G-03"
                  value={shopNumber}
                  onChange={(e) => setShopNumber(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="floor-location-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Floor / Location *
                </label>
                <input
                  id="floor-location-input"
                  type="text"
                  required
                  placeholder="e.g. Ground Floor, West Wing"
                  value={floorOrArea}
                  onChange={(e) => setFloorOrArea(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="shop-size-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Size (Sq Ft)
                </label>
                <input
                  id="shop-size-input"
                  type="number"
                  min="0"
                  placeholder="e.g. 350"
                  value={sizeSqFt || ''}
                  onChange={(e) => setSizeSqFt(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>
          </div>

          {/* Section: Tenant & Business Details */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Tenant & Trade Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="tenant-name-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Tenant Full Name *
                </label>
                <input
                  id="tenant-name-input"
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={tenantName}
                  onChange={(e) => setTenantName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="business-name-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Business / Shop Board Name *
                </label>
                <input
                  id="business-name-input"
                  type="text"
                  required
                  placeholder="e.g. Apex Mobile Care & Repairs"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="business-category-select" className="text-xs font-semibold text-stone-700 block mb-1">
                  Trade Category
                </label>
                <select
                  id="business-category-select"
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value as any)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                >
                  <option value="Retail">Retail Store</option>
                  <option value="Grocery">Grocery / Kirana</option>
                  <option value="Food & Cafe">Food & Cafe / Restaurant</option>
                  <option value="Services">Services / Tailor / Salon</option>
                  <option value="Pharmacy">Pharmacy / Healthcare</option>
                  <option value="Electronics">Electronics & Mobile</option>
                  <option value="Office">Office / Clinic</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="whatsapp-phone-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  WhatsApp Contact Number *
                </label>
                <input
                  id="whatsapp-phone-input"
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>
          </div>

          {/* Section: Rent Terms & Due Dates */}
          <div className="border border-stone-200 rounded-xl p-3.5 space-y-3 bg-stone-50/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Rent Terms & Due Date
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="monthly-rent-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Monthly Rent ({profile.currencySymbol}) *
                </label>
                <input
                  id="monthly-rent-input"
                  type="number"
                  min="0"
                  required
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-bold font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="maintenance-fee-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Maintenance Fee ({profile.currencySymbol})
                </label>
                <input
                  id="maintenance-fee-input"
                  type="number"
                  min="0"
                  value={maintenanceFee}
                  onChange={(e) => setMaintenanceFee(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="security-deposit-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Security Deposit ({profile.currencySymbol})
                </label>
                <input
                  id="security-deposit-input"
                  type="number"
                  min="0"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="due-day-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Due Day of Month (1 - 28)
                </label>
                <input
                  id="due-day-input"
                  type="number"
                  min="1"
                  max="28"
                  value={dueDayOfMonth}
                  onChange={(e) => setDueDayOfMonth(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="grace-period-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Grace Period (Days)
                </label>
                <input
                  id="grace-period-input"
                  type="number"
                  min="0"
                  max="15"
                  value={gracePeriodDays}
                  onChange={(e) => setGracePeriodDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>

              <div>
                <label htmlFor="lease-start-input" className="text-xs font-semibold text-stone-700 block mb-1">
                  Lease Start Date
                </label>
                <input
                  id="lease-start-input"
                  type="date"
                  value={leaseStartDate}
                  onChange={(e) => setLeaseStartDate(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
                />
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div>
            <label htmlFor="shop-notes-input" className="text-xs font-semibold text-stone-700 block mb-1">
              Internal Notes & Terms (Optional)
            </label>
            <input
              id="shop-notes-input"
              type="text"
              placeholder="e.g. Submeter installed, 2 wheeler parking included"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-700/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            {isEditing && onDeleteShop ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to remove ${shopToEdit.shopNumber}?`)) {
                    onDeleteShop(shopToEdit.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Shop</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
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
                <span>{isEditing ? 'Save Changes' : 'Create Shop'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
