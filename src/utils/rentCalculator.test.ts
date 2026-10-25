import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  getMonthKey,
  formatMonthName,
  sanitizePhoneForWhatsApp,
  generateWhatsAppLink,
  calculateShopStatus,
  calculatePortfolioSummary,
  interpolateTemplate,
  DEFAULT_TEMPLATES,
} from './rentCalculator.ts';
import { Shop, PaymentRecord } from '../types/index.ts';

test('formatCurrency formats Indian and standard currency correctly', () => {
  assert.equal(formatCurrency(25000), '₹25,000');
  assert.equal(formatCurrency(0), '₹0');
  assert.equal(formatCurrency(1250500, '$'), '$12,50,500');
});

test('getMonthKey and formatMonthName handle standard dates', () => {
  const d = new Date(2026, 9, 24); // Oct 2026
  assert.equal(getMonthKey(d), '2026-10');
  assert.equal(formatMonthName('2026-10'), 'October 2026');
});

test('sanitizePhoneForWhatsApp standardizes 10-digit and country coded numbers', () => {
  assert.equal(sanitizePhoneForWhatsApp('9876543210'), '919876543210');
  assert.equal(sanitizePhoneForWhatsApp('+91 98765 43210'), '919876543210');
  assert.equal(sanitizePhoneForWhatsApp('098765-43210'), '09876543210');
});

test('generateWhatsAppLink produces valid api.whatsapp.com URL with encoded text', () => {
  const link = generateWhatsAppLink('+91 9876543210', 'Rent due: ₹15,000');
  assert.match(link, /^https:\/\/api\.whatsapp\.com\/send\?phone=919876543210&text=/);
  assert.ok(link.includes('%E2%82%B915%2C000') || link.includes('Rent%20due'));
});

test('calculateShopStatus correctly identifies PAID when payment covers rent', () => {
  const mockShop: Shop = {
    id: 's-1',
    shopNumber: 'Shop G-01',
    floorOrArea: 'Ground Floor',
    tenantName: 'Rajesh Gupta',
    businessName: 'Gupta Medical Store',
    businessCategory: 'Pharmacy',
    phone: '+919876500001',
    monthlyRent: 20000,
    maintenanceFee: 2000,
    securityDeposit: 50000,
    dueDayOfMonth: 5,
    gracePeriodDays: 2,
    leaseStartDate: '2025-01-01',
    isActive: true,
    createdAt: '2025-01-01',
  };

  const currentDate = new Date(2026, 9, 10); // Oct 10, 2026
  const mockPayment: PaymentRecord = {
    id: 'p-1',
    shopId: 's-1',
    month: '2026-10',
    rentAmountPaid: 20000,
    maintenancePaid: 2000,
    electricityPaid: 0,
    totalPaid: 22000,
    paidDate: '2026-10-04',
    paymentMode: 'UPI',
    receiptNumber: 'REC-202610-01',
    recordedAt: '2026-10-04T10:00:00Z',
  };

  const status = calculateShopStatus(mockShop, [mockPayment], [], currentDate);
  assert.equal(status.status, 'PAID');
  assert.equal(status.amountDue, 0);
  assert.equal(status.totalPaid, 22000);
  assert.equal(status.totalExpected, 22000);
});

test('calculateShopStatus marks OVERDUE when past grace period without payment', () => {
  const mockShop: Shop = {
    id: 's-2',
    shopNumber: 'Shop 104',
    floorOrArea: 'First Floor',
    tenantName: 'Amit Verma',
    businessName: 'Verma Electronics',
    businessCategory: 'Electronics',
    phone: '+919876500002',
    monthlyRent: 30000,
    maintenanceFee: 2500,
    securityDeposit: 90000,
    dueDayOfMonth: 5,
    gracePeriodDays: 3,
    leaseStartDate: '2025-02-01',
    isActive: true,
    createdAt: '2025-02-01',
  };

  const currentDate = new Date(2026, 9, 20); // Oct 20, 2026 (Due was Oct 5 + 3 grace days = Oct 8)
  const status = calculateShopStatus(mockShop, [], [], currentDate);
  assert.equal(status.status, 'OVERDUE');
  assert.equal(status.amountDue, 32500);
});

test('calculatePortfolioSummary aggregates totals accurately', () => {
  const shops: Shop[] = [
    {
      id: 's-1',
      shopNumber: 'G-1',
      floorOrArea: 'GF',
      tenantName: 'Tenant 1',
      businessName: 'Biz 1',
      businessCategory: 'Retail',
      phone: '9999900001',
      monthlyRent: 10000,
      maintenanceFee: 1000,
      securityDeposit: 20000,
      dueDayOfMonth: 5,
      gracePeriodDays: 2,
      leaseStartDate: '2025-01-01',
      isActive: true,
      createdAt: '2025-01-01',
    },
    {
      id: 's-2',
      shopNumber: 'G-2',
      floorOrArea: 'GF',
      tenantName: 'Tenant 2',
      businessName: 'Biz 2',
      businessCategory: 'Retail',
      phone: '9999900002',
      monthlyRent: 15000,
      maintenanceFee: 1500,
      securityDeposit: 30000,
      dueDayOfMonth: 5,
      gracePeriodDays: 2,
      leaseStartDate: '2025-01-01',
      isActive: true,
      createdAt: '2025-01-01',
    },
  ];

  const payments: PaymentRecord[] = [
    {
      id: 'p-1',
      shopId: 's-1',
      month: '2026-10',
      rentAmountPaid: 10000,
      maintenancePaid: 1000,
      electricityPaid: 0,
      totalPaid: 11000,
      paidDate: '2026-10-02',
      paymentMode: 'Cash',
      receiptNumber: 'REC-01',
      recordedAt: '2026-10-02',
    },
  ];

  const summary = calculatePortfolioSummary(shops, payments, [], new Date(2026, 9, 10));
  assert.equal(summary.totalShops, 2);
  assert.equal(summary.totalMonthlyRoll, 27500);
  assert.equal(summary.totalCollected, 11000);
  assert.equal(summary.totalPending, 16500);
  assert.equal(summary.paidCount, 1);
});

test('interpolateTemplate replaces all place holders accurately', () => {
  const template = DEFAULT_TEMPLATES[0].body;
  const result = interpolateTemplate(template, {
    tenant: 'Ramesh',
    shop: 'G-02',
    businessName: 'Sweet House',
    month: 'October 2026',
    amount: '₹12,000',
    dueDate: 'Oct 5, 2026',
    ownerName: 'Sunil Aggarwal',
    complexName: 'Aggarwal Commercial Complex',
    upiId: 'sunil@upi',
  });

  assert.ok(result.includes('Ramesh ji'));
  assert.ok(result.includes('Sweet House'));
  assert.ok(result.includes('₹12,000'));
  assert.ok(result.includes('sunil@upi'));
  assert.ok(result.includes('Aggarwal Commercial Complex'));
});
