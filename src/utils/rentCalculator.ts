import {
  Shop,
  PaymentRecord,
  CalculatedShopStatus,
  RentStatus,
  LandlordProfile,
  ReminderLog,
} from '../types/index.ts';

/**
 * Format a number into clean currency string
 */
export function formatCurrency(amount: number, symbol: string = '₹'): string {
  if (isNaN(amount) || amount === null || amount === undefined) return `${symbol}0`;
  const formattedNumber = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formattedNumber}`;
}

/**
 * Get standard Month Key e.g. "2026-10"
 */
export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Format Month Key into natural name e.g. "October 2026"
 */
export function formatMonthName(monthKey: string): string {
  const [yearStr, monthStr] = monthKey.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10) - 1;
  const date = new Date(year, month, 1);
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

/**
 * Calculates payment status for a specific shop for the given target month/date
 */
export function calculateShopStatus(
  shop: Shop,
  payments: PaymentRecord[],
  reminderLogs: ReminderLog[] = [],
  currentDate: Date = new Date()
): CalculatedShopStatus {
  const currentMonthKey = getMonthKey(currentDate);
  const currentYear = currentDate.getFullYear();
  const currentMonthIdx = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  // Find payments made for this shop for this current month
  const monthPayments = payments.filter(
    (p) => p.shopId === shop.id && p.month === currentMonthKey
  );

  const totalPaid = monthPayments.reduce((sum, p) => sum + (p.totalPaid || 0), 0);
  const totalExpected = (shop.monthlyRent || 0) + (shop.maintenanceFee || 0);
  const amountDue = Math.max(0, totalExpected - totalPaid);

  // Determine due date
  const dueDay = Math.min(Math.max(1, shop.dueDayOfMonth || 1), 28);
  const dueDateObj = new Date(currentYear, currentMonthIdx, dueDay);
  const dueDateStr = dueDateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Days difference: positive = days until due, 0 = due today, negative = days overdue
  const msPerDay = 1000 * 60 * 60 * 24;
  const todayAtMidnight = new Date(currentYear, currentMonthIdx, currentDay).getTime();
  const dueAtMidnight = dueDateObj.getTime();
  const daysDifference = Math.round((dueAtMidnight - todayAtMidnight) / msPerDay);

  let status: RentStatus = 'UPCOMING';

  if (amountDue === 0 && totalExpected > 0) {
    status = 'PAID';
  } else if (daysDifference < 0) {
    // If past due date plus grace period
    const gracePeriod = shop.gracePeriodDays ?? 2;
    if (Math.abs(daysDifference) > gracePeriod) {
      status = 'OVERDUE';
    } else {
      status = 'DUE_SOON';
    }
  } else if (daysDifference <= 3) {
    status = 'DUE_SOON';
  } else {
    status = 'UPCOMING';
  }

  // Find last payment
  const lastPayment = [...payments]
    .filter((p) => p.shopId === shop.id)
    .sort((a, b) => new Date(b.paidDate).getTime() - new Date(a.paidDate).getTime())[0];

  // Find last reminder
  const lastReminder = [...reminderLogs]
    .filter((r) => r.shopId === shop.id)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime())[0];

  return {
    shopId: shop.id,
    status,
    currentMonthKey,
    monthName: formatMonthName(currentMonthKey),
    totalExpected,
    totalPaid,
    amountDue,
    dueDayOfMonth: dueDay,
    dueDateStr,
    daysDifference,
    lastPayment,
    lastReminder,
  };
}

/**
 * Calculates portfolio statistics across all active shops
 */
export function calculatePortfolioSummary(
  shops: Shop[],
  payments: PaymentRecord[],
  reminderLogs: ReminderLog[] = [],
  currentDate: Date = new Date()
) {
  const activeShops = shops.filter((s) => s.isActive);
  const statuses = activeShops.map((shop) =>
    calculateShopStatus(shop, payments, reminderLogs, currentDate)
  );

  const totalShops = activeShops.length;
  const totalMonthlyRoll = statuses.reduce((sum, s) => sum + s.totalExpected, 0);
  const totalCollected = statuses.reduce((sum, s) => sum + s.totalPaid, 0);
  const totalPending = statuses.reduce((sum, s) => sum + s.amountDue, 0);

  const paidCount = statuses.filter((s) => s.status === 'PAID').length;
  const dueSoonCount = statuses.filter((s) => s.status === 'DUE_SOON').length;
  const overdueCount = statuses.filter((s) => s.status === 'OVERDUE').length;
  const upcomingCount = statuses.filter((s) => s.status === 'UPCOMING').length;

  const collectionRate =
    totalMonthlyRoll > 0 ? Math.round((totalCollected / totalMonthlyRoll) * 100) : 0;

  return {
    totalShops,
    totalMonthlyRoll,
    totalCollected,
    totalPending,
    paidCount,
    dueSoonCount,
    overdueCount,
    upcomingCount,
    collectionRate,
    statuses,
  };
}

/**
 * Clean phone numbers to pure digits for WhatsApp international format
 */
export function sanitizePhoneForWhatsApp(rawPhone: string, defaultCountryCode = '91'): string {
  if (!rawPhone) return '';
  // Remove all non-digits
  const digits = rawPhone.replace(/\D/g, '');
  if (digits.length === 10) {
    // 10 digits without country code -> prepend default (e.g. 91)
    return `${defaultCountryCode}${digits}`;
  }
  return digits;
}

/**
 * Generates direct WhatsApp deep link with encoded message
 */
export function generateWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = sanitizePhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  // Using api.whatsapp.com/send which works seamlessly on both mobile (Android/iOS) and desktop
  return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
}

/**
 * Replace placeholders in reminder templates
 */
export function interpolateTemplate(
  templateBody: string,
  variables: {
    tenant: string;
    shop: string;
    businessName: string;
    month: string;
    amount: string;
    dueDate: string;
    ownerName: string;
    complexName: string;
    upiId: string;
    bankInfo?: string;
  }
): string {
  return templateBody
    .replace(/{tenant}/g, variables.tenant)
    .replace(/{shop}/g, variables.shop)
    .replace(/{businessName}/g, variables.businessName)
    .replace(/{month}/g, variables.month)
    .replace(/{amount}/g, variables.amount)
    .replace(/{dueDate}/g, variables.dueDate)
    .replace(/{ownerName}/g, variables.ownerName)
    .replace(/{complexName}/g, variables.complexName)
    .replace(/{upiId}/g, variables.upiId)
    .replace(/{bankInfo}/g, variables.bankInfo || 'Contact office');
}

/**
 * Default human-tailored reminder templates (no robotic AI jargon)
 */
export const DEFAULT_TEMPLATES = [
  {
    id: 'courtesy',
    tag: 'courtesy' as const,
    title: 'Polite Advance Reminder',
    description: 'Friendly message sent 2-3 days before the due date.',
    body: `Namaste {tenant} ji 🙏\n\nHope your business at {businessName} ({shop}) is going well.\n\nThis is a gentle reminder that the monthly shop rent for {month} is due on *{dueDate}*.\n\n*Due Amount:* {amount}\n*Complex:* {complexName}\n\n*Payment Details:*\n• UPI ID: \`{upiId}\`\n• Bank Transfer: {bankInfo}\n\nKindly share the transaction screenshot once payment is completed. Thank you!\n\nBest regards,\n*{ownerName}*`,
  },
  {
    id: 'due_today',
    tag: 'due_today' as const,
    title: 'Due Today Reminder',
    description: 'Clear reminder sent on the actual due date.',
    body: `Hello {tenant} ji,\n\nGentle reminder that today (*{dueDate}*) is the scheduled due date for {month} shop rent for *{shop}* ({businessName}).\n\n*Total Payable:* {amount}\n\nPlease transfer via UPI at \`{upiId}\` or direct bank transfer.\n\nKindly acknowledge and share the payment reference. Thank you!\n\n— *{ownerName}* ({complexName})`,
  },
  {
    id: 'overdue',
    tag: 'overdue' as const,
    title: 'Overdue Notice',
    description: 'Urgent notice when rent is past the due date and grace period.',
    body: `Dear {tenant} ji,\n\nWe noticed that the rent for {month} for *{shop}* ({businessName}) was due on *{dueDate}* and remains pending.\n\n*Pending Balance:* {amount}\n\nPlease settle this outstanding balance at the earliest via UPI: \`{upiId}\`.\n\nIf you have already transferred the amount, please reply with the payment reference or receipt so we can update the ledger.\n\nThank you for your prompt attention.\n\nRegards,\n*{ownerName}* ({complexName})`,
  },
  {
    id: 'receipt',
    tag: 'receipt' as const,
    title: 'Payment Acknowledgment Receipt',
    description: 'Digital confirmation sent as soon as payment is received.',
    body: `*RENT PAYMENT RECEIPT* 🧾\n\nDear {tenant} ji,\n\nWe gratefully acknowledge receipt of your rent payment for *{month}*.\n\n*Shop:* {shop} ({businessName})\n*Amount Received:* {amount}\n*Status:* PAID IN FULL ✅\n\nThank you for your timely payment! The ledger has been updated.\n\nWarm regards,\n*{ownerName}*\n{complexName}`,
  },
];
