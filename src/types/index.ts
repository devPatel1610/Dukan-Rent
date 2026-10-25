export type PaymentMode = 'UPI' | 'Cash' | 'Bank Transfer' | 'Cheque';

export type RentStatus = 'PAID' | 'DUE_SOON' | 'OVERDUE' | 'UPCOMING';

export interface Shop {
  id: string;
  shopNumber: string; // e.g. "Shop G-04", "Unit 102"
  floorOrArea: string; // e.g. "Ground Floor, Front Row"
  sizeSqFt?: number;
  tenantName: string;
  businessName: string; // e.g. "Sharma Kirana & General Store"
  businessCategory: 'Retail' | 'Grocery' | 'Food & Cafe' | 'Services' | 'Pharmacy' | 'Electronics' | 'Office' | 'Other';
  phone: string; // WhatsApp number
  alternatePhone?: string;
  monthlyRent: number;
  maintenanceFee: number;
  electricityRatePerUnit?: number;
  securityDeposit: number;
  dueDayOfMonth: number; // e.g. 5 for 5th of every month
  gracePeriodDays: number; // default 3
  leaseStartDate: string; // YYYY-MM-DD
  leaseEndDate?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  shopId: string;
  month: string; // Format: "YYYY-MM", e.g. "2026-10"
  rentAmountPaid: number;
  maintenancePaid: number;
  electricityPaid: number;
  totalPaid: number;
  paidDate: string; // YYYY-MM-DD
  paymentMode: PaymentMode;
  transactionRef?: string; // UPI Ref ID or Cheque No
  receiptNumber: string; // e.g. "REC-202610-04"
  recordedAt: string;
  notes?: string;
}

export interface ReminderLog {
  id: string;
  shopId: string;
  tenantName: string;
  phone: string;
  month: string;
  amountDue: number;
  sentAt: string;
  status: 'SENT' | 'PENDING' | 'LOGGED';
  messagePreview: string;
  templateType: 'courtesy' | 'due_today' | 'overdue' | 'receipt' | 'custom';
}

export interface LandlordProfile {
  ownerName: string;
  complexName: string;
  phone: string;
  upiId: string;
  bankAccountInfo?: string;
  defaultReminderDaysBefore: number;
  pinCodeEnabled: boolean;
  pinCode?: string; // 4-digit PIN
  currencySymbol: string;
  autoMessageScheduleEnabled: boolean;
}

export interface ReminderTemplate {
  id: string;
  title: string;
  tag: 'courtesy' | 'due_today' | 'overdue' | 'receipt';
  description: string;
  body: string; // contains {tenant}, {shop}, {month}, {amount}, {dueDate}, {ownerName}, {upiId}, {complexName}
}

export interface CalculatedShopStatus {
  shopId: string;
  status: RentStatus;
  currentMonthKey: string; // "2026-10"
  monthName: string; // "October 2026"
  totalExpected: number;
  totalPaid: number;
  amountDue: number;
  dueDayOfMonth: number;
  dueDateStr: string; // "Oct 5, 2026"
  daysDifference: number; // positive = days until due, 0 = due today, negative = days overdue
  lastPayment?: PaymentRecord;
  lastReminder?: ReminderLog;
}
