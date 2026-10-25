import React from 'react';
import {
  Building2,
  Send,
  Plus,
  Receipt,
  Settings,
  Github,
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'shops' | 'reminders' | 'receipts' | 'settings';
  onSelectTab: (tab: 'shops' | 'reminders' | 'receipts' | 'settings') => void;
  pendingRemindersCount: number;
  onOpenAddShop: () => void;
  onOpenGitHubModal: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  pendingRemindersCount,
  onOpenAddShop,
  onOpenGitHubModal,
}) => {
  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/90 safe-pb px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {/* Shops Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('shops')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'shops'
              ? 'text-emerald-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Building2 className={`w-5 h-5 ${currentTab === 'shops' ? 'text-emerald-800' : 'text-stone-500'}`} />
          <span className="text-[10px]">Shops</span>
        </button>

        {/* Reminders Tab with badge */}
        <button
          type="button"
          onClick={() => onSelectTab('reminders')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors relative cursor-pointer ${
            currentTab === 'reminders'
              ? 'text-emerald-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Send className={`w-5 h-5 ${currentTab === 'reminders' ? 'text-emerald-800' : 'text-stone-500'}`} />
          <span className="text-[10px]">Remind</span>
          {pendingRemindersCount > 0 && (
            <span className="absolute top-0 right-1 w-4 h-4 bg-emerald-700 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {pendingRemindersCount}
            </span>
          )}
        </button>

        {/* Center Quick Add Floating Button */}
        <button
          type="button"
          onClick={onOpenAddShop}
          aria-label="Add New Shop"
          className="w-11 h-11 -mt-4 rounded-full bg-[#14281D] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform cursor-pointer border-2 border-white"
        >
          <Plus className="w-5 h-5 text-emerald-300" />
        </button>

        {/* GitHub / Deploy Info */}
        <button
          type="button"
          onClick={onOpenGitHubModal}
          className="flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors text-stone-500 hover:text-stone-800 cursor-pointer"
        >
          <Github className="w-5 h-5 text-stone-500" />
          <span className="text-[10px]">Deploy</span>
        </button>

        {/* Settings Tab */}
        <button
          type="button"
          onClick={() => onSelectTab('settings')}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg transition-colors cursor-pointer ${
            currentTab === 'settings'
              ? 'text-emerald-900 font-bold'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Settings className={`w-5 h-5 ${currentTab === 'settings' ? 'text-emerald-800' : 'text-stone-500'}`} />
          <span className="text-[10px]">Settings</span>
        </button>
      </div>
    </nav>
  );
};
