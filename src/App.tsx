import React, { useState, useMemo, useEffect } from 'react';
import {
  Shop,
  PaymentRecord,
  ReminderLog,
  LandlordProfile,
  ReminderTemplate,
  RentStatus,
} from './types/index.ts';
import { StorageService } from './services/storage.ts';
import {
  calculatePortfolioSummary,
  calculateShopStatus,
  getMonthKey,
} from './utils/rentCalculator.ts';
import { Header } from './components/Header.tsx';
import { MetricCards } from './components/MetricCards.tsx';
import { FilterBar } from './components/FilterBar.tsx';
import { ShopCard } from './components/ShopCard.tsx';
import { ShopTable } from './components/ShopTable.tsx';
import { WhatsAppReminderModal } from './components/WhatsAppReminderModal.tsx';
import { RecordPaymentModal } from './components/RecordPaymentModal.tsx';
import { ReceiptViewModal } from './components/ReceiptViewModal.tsx';
import { AddEditShopModal } from './components/AddEditShopModal.tsx';
import { AutomatedMessagingQueueModal } from './components/AutomatedMessagingQueueModal.tsx';
import { TenantLedgerModal } from './components/TenantLedgerModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { GitHubDeployModal } from './components/GitHubDeployModal.tsx';
import { SecurityPinModal } from './components/SecurityPinModal.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { Plus, Search, Building2, Send, ShieldAlert } from 'lucide-react';

export default function App() {
  // --- Persistent State ---
  const [shops, setShops] = useState<Shop[]>(() => StorageService.getShops());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => StorageService.getPayments());
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() =>
    StorageService.getReminderLogs()
  );
  const [profile, setProfile] = useState<LandlordProfile>(() =>
    StorageService.getLandlordProfile()
  );
  const [templates, setTemplates] = useState<ReminderTemplate[]>(() =>
    StorageService.getTemplates()
  );

  // --- UI Controls State ---
  const [selectedMonth, setSelectedMonth] = useState<string>(() => getMonthKey(new Date()));
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<'ALL' | RentStatus>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [mobileTab, setMobileTab] = useState<'shops' | 'reminders' | 'receipts' | 'settings'>(
    'shops'
  );

  // --- Security PIN State ---
  const [isPinLocked, setIsPinLocked] = useState<boolean>(() => profile.pinCodeEnabled);

  // --- Modal Visibility States ---
  const [reminderShop, setReminderShop] = useState<Shop | null>(null);
  const [paymentShop, setPaymentShop] = useState<Shop | null>(null);
  const [receiptModal, setReceiptModal] = useState<{
    shop: Shop;
    payment: PaymentRecord;
  } | null>(null);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [isAddShopOpen, setIsAddShopOpen] = useState<boolean>(false);
  const [isAutomatedMessagingOpen, setIsAutomatedMessagingOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);
  const [ledgerShop, setLedgerShop] = useState<Shop | null>(null);

  // --- Computed Portfolio Statistics for the Selected Month ---
  const targetDateForMonth = useMemo(() => {
    const [y, m] = selectedMonth.split('-');
    return new Date(parseInt(y, 10), parseInt(m, 10) - 1, 15);
  }, [selectedMonth]);

  const portfolioSummary = useMemo(() => {
    return calculatePortfolioSummary(shops, payments, reminderLogs, targetDateForMonth);
  }, [shops, payments, reminderLogs, targetDateForMonth]);

  // Map each shop to its calculated status
  const shopStatusesMap = useMemo(() => {
    const map = new Map<string, ReturnType<typeof calculateShopStatus>>();
    for (const shop of shops) {
      map.set(shop.id, calculateShopStatus(shop, payments, reminderLogs, targetDateForMonth));
    }
    return map;
  }, [shops, payments, reminderLogs, targetDateForMonth]);

  // Filtered Shops List
  const filteredShops = useMemo(() => {
    return shops.filter((shop) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = shop.tenantName.toLowerCase().includes(q);
        const matchesShop = shop.shopNumber.toLowerCase().includes(q);
        const matchesBiz = shop.businessName.toLowerCase().includes(q);
        const matchesPhone = shop.phone.includes(q);
        if (!matchesName && !matchesShop && !matchesBiz && !matchesPhone) {
          return false;
        }
      }

      // 2. Category Filter
      if (selectedCategory !== 'All Categories' && shop.businessCategory !== selectedCategory) {
        return false;
      }

      // 3. Status Filter
      const statusInfo = shopStatusesMap.get(shop.id);
      if (currentFilter !== 'ALL') {
        if (!statusInfo || statusInfo.status !== currentFilter) {
          return false;
        }
      }

      return true;
    });
  }, [shops, searchQuery, selectedCategory, currentFilter, shopStatusesMap]);

  // Handlers for storage updates
  const handleSaveShop = (savedShop: Shop) => {
    const updated = StorageService.saveShop(savedShop);
    setShops(updated);
  };

  const handleDeleteShop = (id: string) => {
    const updated = StorageService.deleteShop(id);
    setShops(updated);
  };

  const handlePaymentRecorded = (newPayment: PaymentRecord, sendReceiptNow: boolean) => {
    const updated = StorageService.addPayment(newPayment);
    setPayments(updated);

    if (sendReceiptNow && paymentShop) {
      setReceiptModal({ shop: paymentShop, payment: newPayment });
    }
  };

  const handleLogReminder = (log: ReminderLog) => {
    const updated = StorageService.logReminder(log);
    setReminderLogs(updated);
  };

  const handleSaveProfile = (newProfile: LandlordProfile) => {
    const updated = StorageService.saveLandlordProfile(newProfile);
    setProfile(updated);
  };

  const handleDataReset = () => {
    StorageService.resetAllData();
    setShops(StorageService.getShops());
    setPayments(StorageService.getPayments());
    setReminderLogs(StorageService.getReminderLogs());
    setProfile(StorageService.getLandlordProfile());
    setTemplates(StorageService.getTemplates());
    setIsPinLocked(false);
  };

  const handleMobileTabSelect = (tab: typeof mobileTab) => {
    setMobileTab(tab);
    if (tab === 'reminders') {
      setIsAutomatedMessagingOpen(true);
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    } else if (tab === 'receipts') {
      // Find latest shop with payments to show ledger, or open automated messaging audit
      setIsAutomatedMessagingOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9F5] text-stone-900 pb-24 md:pb-12">
      {/* Security Passcode Modal if PIN Protection is Active */}
      <SecurityPinModal
        isOpen={isPinLocked}
        profile={profile}
        onUnlock={() => setIsPinLocked(false)}
      />

      {/* Top Application Header */}
      <Header
        profile={profile}
        selectedMonth={selectedMonth}
        onMonthChange={setSelectedMonth}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenAddShop={() => setIsAddShopOpen(true)}
        onOpenAutomatedMessaging={() => setIsAutomatedMessagingOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onLockApp={() => setIsPinLocked(true)}
        isPinLocked={isPinLocked}
        pendingRemindersCount={portfolioSummary.dueSoonCount + portfolioSummary.overdueCount}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Executive KPI Metric Cards */}
        <MetricCards
          totalMonthlyRoll={portfolioSummary.totalMonthlyRoll}
          totalCollected={portfolioSummary.totalCollected}
          totalPending={portfolioSummary.totalPending}
          paidCount={portfolioSummary.paidCount}
          dueSoonCount={portfolioSummary.dueSoonCount}
          overdueCount={portfolioSummary.overdueCount}
          totalShops={portfolioSummary.totalShops}
          currencySymbol={profile.currencySymbol}
        />

        {/* Filter & View Switcher Bar */}
        <FilterBar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          counts={{
            all: portfolioSummary.totalShops,
            dueSoon: portfolioSummary.dueSoonCount,
            overdue: portfolioSummary.overdueCount,
            paid: portfolioSummary.paidCount,
            upcoming: portfolioSummary.upcomingCount,
          }}
        />

        {/* Shops Content (Grid or Table) */}
        {filteredShops.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center shadow-2xs">
            <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800">No rented shops found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || selectedCategory !== 'All Categories' || currentFilter !== 'ALL'
                ? 'Try adjusting your search query or status filter.'
                : 'Start tracking your commercial properties and automated WhatsApp reminders.'}
            </p>
            <button
              type="button"
              onClick={() => setIsAddShopOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#14281D] hover:bg-[#1E3A2B] text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Add First Shop</span>
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredShops.map((shop) => {
              const statusInfo = shopStatusesMap.get(shop.id)!;
              return (
                <ShopCard
                  key={shop.id}
                  shop={shop}
                  statusInfo={statusInfo}
                  currencySymbol={profile.currencySymbol}
                  onSendReminder={(s) => setReminderShop(s)}
                  onRecordPayment={(s) => setPaymentShop(s)}
                  onViewLedger={(s) => setLedgerShop(s)}
                  onEditShop={(s) => setEditingShop(s)}
                />
              );
            })}
          </div>
        ) : (
          <ShopTable
            shops={filteredShops}
            statuses={portfolioSummary.statuses}
            currencySymbol={profile.currencySymbol}
            onSendReminder={(s) => setReminderShop(s)}
            onRecordPayment={(s) => setPaymentShop(s)}
            onViewLedger={(s) => setLedgerShop(s)}
            onEditShop={(s) => setEditingShop(s)}
          />
        )}
      </main>

      {/* --- ALL WORKING MODALS --- */}

      {/* 1. WhatsApp Rent Reminder Modal */}
      <WhatsAppReminderModal
        isOpen={!!reminderShop}
        onClose={() => setReminderShop(null)}
        shop={reminderShop}
        statusInfo={reminderShop ? shopStatusesMap.get(reminderShop.id) || null : null}
        profile={profile}
        templates={templates}
        onLogReminder={handleLogReminder}
      />

      {/* 2. Record Rent Payment Modal */}
      <RecordPaymentModal
        isOpen={!!paymentShop}
        onClose={() => setPaymentShop(null)}
        shop={paymentShop}
        statusInfo={paymentShop ? shopStatusesMap.get(paymentShop.id) || null : null}
        profile={profile}
        onPaymentRecorded={handlePaymentRecorded}
      />

      {/* 3. Official Digital Receipt View / Share Modal */}
      <ReceiptViewModal
        isOpen={!!receiptModal}
        onClose={() => setReceiptModal(null)}
        shop={receiptModal?.shop || null}
        payment={receiptModal?.payment || null}
        profile={profile}
      />

      {/* 4. Add / Edit Shop Modal */}
      <AddEditShopModal
        isOpen={isAddShopOpen || !!editingShop}
        onClose={() => {
          setIsAddShopOpen(false);
          setEditingShop(null);
        }}
        shopToEdit={editingShop}
        profile={profile}
        onSaveShop={handleSaveShop}
        onDeleteShop={handleDeleteShop}
      />

      {/* 5. Automated Messaging Hub & Dispatcher Modal */}
      <AutomatedMessagingQueueModal
        isOpen={isAutomatedMessagingOpen}
        onClose={() => setIsAutomatedMessagingOpen(false)}
        shops={shops}
        statuses={portfolioSummary.statuses}
        profile={profile}
        templates={templates}
        reminderLogs={reminderLogs}
        onLogReminder={handleLogReminder}
        onUpdateProfile={handleSaveProfile}
      />

      {/* 6. Comprehensive Tenant Ledger Modal */}
      <TenantLedgerModal
        isOpen={!!ledgerShop}
        onClose={() => setLedgerShop(null)}
        shop={ledgerShop}
        payments={payments}
        reminderLogs={reminderLogs}
        profile={profile}
        onViewReceipt={(p) => {
          if (ledgerShop) {
            setReceiptModal({ shop: ledgerShop, payment: p });
          }
        }}
      />

      {/* 7. Settings & Account Profile Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
        onDataReset={handleDataReset}
      />

      {/* 8. Private GitHub Deployment & Mobile Setup Modal */}
      <GitHubDeployModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Seamless Mobile Bottom Navigation (iPhone & Android) */}
      <MobileBottomNav
        currentTab={mobileTab}
        onSelectTab={handleMobileTabSelect}
        pendingRemindersCount={portfolioSummary.dueSoonCount + portfolioSummary.overdueCount}
        onOpenAddShop={() => setIsAddShopOpen(true)}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />
    </div>
  );
}
