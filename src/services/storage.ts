import {
  Shop,
  PaymentRecord,
  ReminderLog,
  LandlordProfile,
  ReminderTemplate,
} from '../types/index.ts';
import { DEFAULT_TEMPLATES, getMonthKey } from '../utils/rentCalculator.ts';

const STORAGE_KEYS = {
  SHAMBLING_SHOPS: 'dukan_shops_v1',
  PAYMENTS: 'dukan_payments_v1',
  REMINDERS: 'dukan_reminders_v1',
  PROFILE: 'dukan_profile_v1',
  TEMPLATES: 'dukan_templates_v1',
  SECURITY: 'dukan_security_v1',
};

const SEED_PROFILE: LandlordProfile = {
  ownerName: 'Praveen Sharma',
  complexName: 'Shree Krishna Commercial Complex',
  phone: '+91 98200 12345',
  upiId: 'praveen.sharma@okaxis',
  bankAccountInfo: 'HDFC Bank, A/C: 501004928172, IFSC: HDFC0000240',
  defaultReminderDaysBefore: 3,
  pinCodeEnabled: false,
  pinCode: '',
  currencySymbol: '₹',
  autoMessageScheduleEnabled: true,
};

const SEED_SHOPS: Shop[] = [
  {
    id: 'shop-g01',
    shopNumber: 'Shop G-01',
    floorOrArea: 'Ground Floor, Main Entrance',
    sizeSqFt: 350,
    tenantName: 'Rajesh Aggarwal',
    businessName: 'Sanjeevani Medicos & Healthcare',
    businessCategory: 'Pharmacy',
    phone: '+91 98111 22334',
    monthlyRent: 24000,
    maintenanceFee: 2000,
    securityDeposit: 75000,
    dueDayOfMonth: 5,
    gracePeriodDays: 3,
    leaseStartDate: '2024-04-01',
    notes: 'Long term tenant, always pays on time via UPI.',
    isActive: true,
    createdAt: '2024-04-01T00:00:00.000Z',
  },
  {
    id: 'shop-g02',
    shopNumber: 'Shop G-02',
    floorOrArea: 'Ground Floor, West Wing',
    sizeSqFt: 280,
    tenantName: 'Vikram Mehta',
    businessName: 'Apex Mobile & Laptop Care',
    businessCategory: 'Electronics',
    phone: '+91 98222 33445',
    monthlyRent: 18500,
    maintenanceFee: 1500,
    securityDeposit: 55000,
    dueDayOfMonth: 7,
    gracePeriodDays: 2,
    leaseStartDate: '2024-09-01',
    notes: 'Runs high customer footfall gadget service center.',
    isActive: true,
    createdAt: '2024-09-01T00:00:00.000Z',
  },
  {
    id: 'shop-101',
    shopNumber: 'Shop 101',
    floorOrArea: 'First Floor, Central Atrium',
    sizeSqFt: 480,
    tenantName: 'Meenakshi Sundaram',
    businessName: 'Aura Designer Sarees & Boutique',
    businessCategory: 'Retail',
    phone: '+91 98333 44556',
    monthlyRent: 32000,
    maintenanceFee: 2500,
    securityDeposit: 100000,
    dueDayOfMonth: 5,
    gracePeriodDays: 2,
    leaseStartDate: '2023-11-01',
    notes: 'Premium corner store facing escalator.',
    isActive: true,
    createdAt: '2023-11-01T00:00:00.000Z',
  },
  {
    id: 'shop-102',
    shopNumber: 'Shop 102',
    floorOrArea: 'First Floor, East Corridor',
    sizeSqFt: 220,
    tenantName: 'Tariq Hussain',
    businessName: 'Brew & Bite Artisan Cafe',
    businessCategory: 'Food & Cafe',
    phone: '+91 98444 55667',
    monthlyRent: 16000,
    maintenanceFee: 1800,
    securityDeposit: 50000,
    dueDayOfMonth: 10,
    gracePeriodDays: 3,
    leaseStartDate: '2025-01-15',
    notes: 'Separate submeter for coffee espresso machine.',
    isActive: true,
    createdAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'shop-b01',
    shopNumber: 'Shop B-01',
    floorOrArea: 'Basement Arcade, Unit 4',
    sizeSqFt: 300,
    tenantName: 'Devendra Yadav',
    businessName: 'Royal Men Tailors & Fabrics',
    businessCategory: 'Services',
    phone: '+91 98555 66778',
    monthlyRent: 14000,
    maintenanceFee: 1200,
    securityDeposit: 40000,
    dueDayOfMonth: 1,
    gracePeriodDays: 3,
    leaseStartDate: '2024-01-01',
    notes: 'Established tailor, prefers cash or direct bank transfer.',
    isActive: true,
    createdAt: '2024-01-01T00:00:00.000Z',
  },
];

// Seed sample payments for the current month
const currentMonth = getMonthKey(new Date());

const SEED_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-001',
    shopId: 'shop-g01',
    month: currentMonth,
    rentAmountPaid: 24000,
    maintenancePaid: 2000,
    electricityPaid: 0,
    totalPaid: 26000,
    paidDate: new Date(new Date().getFullYear(), new Date().getMonth(), 4).toISOString().split('T')[0],
    paymentMode: 'UPI',
    transactionRef: 'UPI/261048194012/HDFC',
    receiptNumber: `REC-${currentMonth.replace('-', '')}-01`,
    recordedAt: new Date(new Date().getFullYear(), new Date().getMonth(), 4, 11, 30).toISOString(),
    notes: 'Full payment received with gratitude.',
  },
  {
    id: 'pay-002',
    shopId: 'shop-102',
    month: currentMonth,
    rentAmountPaid: 16000,
    maintenancePaid: 1800,
    electricityPaid: 0,
    totalPaid: 17800,
    paidDate: new Date(new Date().getFullYear(), new Date().getMonth(), 8).toISOString().split('T')[0],
    paymentMode: 'Bank Transfer',
    transactionRef: 'NEFT/AXIS/918237192',
    receiptNumber: `REC-${currentMonth.replace('-', '')}-02`,
    recordedAt: new Date(new Date().getFullYear(), new Date().getMonth(), 8, 14, 15).toISOString(),
    notes: 'Advance transfer for rent + cafe maintenance.',
  },
];

const SEED_REMINDERS: ReminderLog[] = [
  {
    id: 'rem-001',
    shopId: 'shop-g02',
    tenantName: 'Vikram Mehta',
    phone: '+91 98222 33445',
    month: currentMonth,
    amountDue: 20000,
    sentAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    status: 'SENT',
    messagePreview: 'Namaste Vikram ji, gentle reminder regarding Shop G-02 rent...',
    templateType: 'courtesy',
  },
];

export const StorageService = {
  getShops(): Shop[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHAMBLING_SHOPS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SHAMBLING_SHOPS, JSON.stringify(SEED_SHOPS));
        return SEED_SHOPS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_SHOPS;
    }
  },

  saveShop(shop: Shop): Shop[] {
    const shops = this.getShops();
    const existingIndex = shops.findIndex((s) => s.id === shop.id);
    let updated: Shop[];
    if (existingIndex >= 0) {
      updated = [...shops];
      updated[existingIndex] = shop;
    } else {
      updated = [shop, ...shops];
    }
    localStorage.setItem(STORAGE_KEYS.SHAMBLING_SHOPS, JSON.stringify(updated));
    return updated;
  },

  deleteShop(id: string): Shop[] {
    const shops = this.getShops().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SHAMBLING_SHOPS, JSON.stringify(shops));
    return shops;
  },

  getPayments(): PaymentRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
        return SEED_PAYMENTS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PAYMENTS;
    }
  },

  addPayment(payment: PaymentRecord): PaymentRecord[] {
    const payments = [payment, ...this.getPayments()];
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    return payments;
  },

  deletePayment(id: string): PaymentRecord[] {
    const payments = this.getPayments().filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(payments));
    return payments;
  },

  getReminderLogs(): ReminderLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
        return SEED_REMINDERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_REMINDERS;
    }
  },

  logReminder(log: ReminderLog): ReminderLog[] {
    const logs = [log, ...this.getReminderLogs()];
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(logs));
    return logs;
  },

  getLandlordProfile(): LandlordProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(SEED_PROFILE));
        return SEED_PROFILE;
      }
      return JSON.parse(data);
    } catch {
      return SEED_PROFILE;
    }
  },

  saveLandlordProfile(profile: LandlordProfile): LandlordProfile {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    return profile;
  },

  getTemplates(): ReminderTemplate[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
        return DEFAULT_TEMPLATES;
      }
      return JSON.parse(data);
    } catch {
      return DEFAULT_TEMPLATES;
    }
  },

  saveTemplates(templates: ReminderTemplate[]): ReminderTemplate[] {
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
    return templates;
  },

  exportAllDataJSON(): string {
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      profile: this.getLandlordProfile(),
      shops: this.getShops(),
      payments: this.getPayments(),
      reminders: this.getReminderLogs(),
      templates: this.getTemplates(),
    };
    return JSON.stringify(exportData, null, 2);
  },

  importDataJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.shops && Array.isArray(parsed.shops)) {
        localStorage.setItem(STORAGE_KEYS.SHAMBLING_SHOPS, JSON.stringify(parsed.shops));
      }
      if (parsed.payments && Array.isArray(parsed.payments)) {
        localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(parsed.payments));
      }
      if (parsed.reminders && Array.isArray(parsed.reminders)) {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(parsed.reminders));
      }
      if (parsed.profile) {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(parsed.profile));
      }
      if (parsed.templates && Array.isArray(parsed.templates)) {
        localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(parsed.templates));
      }
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  },

  resetAllData(): void {
    localStorage.setItem(STORAGE_KEYS.SHAMBLING_SHOPS, JSON.stringify(SEED_SHOPS));
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(SEED_PAYMENTS));
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(SEED_REMINDERS));
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(SEED_PROFILE));
    localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(DEFAULT_TEMPLATES));
  },
};
