import React from 'react';
import { Home, FileText, Radio, Settings } from 'lucide-react';
import { AppTab } from '../../types/index.ts';

interface BottomNavProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isDark?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  isDark = false
}) => {
  const tabs = [
    {
      id: 'home' as AppTab,
      label: 'Home',
      icon: Home,
    },
    {
      id: 'reports' as AppTab,
      label: 'Reports',
      icon: FileText,
    },
    {
      id: 'live' as AppTab,
      label: 'Live',
      icon: Radio,
      badge: 'LIVE',
    },
    {
      id: 'settings' as AppTab,
      label: 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={`w-full max-w-md mx-auto border-t transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]'
      } px-4 py-2 flex items-center justify-around z-30`}
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive =
          currentTab === tab.id ||
          (tab.id === 'home' && ['hardware', 'software'].includes(currentTab)) ||
          (tab.id === 'live' && ['voice'].includes(currentTab));

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            aria-label={tab.label}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 cursor-pointer ${
              isActive
                ? 'text-blue-600 font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {/* Live badge for Live tab */}
            {tab.badge && (
              <span className="absolute -top-1.5 right-1 px-1.5 py-0.2 bg-red-500 text-[9px] font-bold text-white rounded-full leading-tight tracking-wider animate-pulse shadow-xs">
                {tab.badge}
              </span>
            )}

            <div className={`p-1 rounded-lg transition-transform ${isActive ? 'scale-110' : ''}`}>
              <Icon
                className={`w-5 h-5 ${
                  isActive
                    ? 'stroke-blue-600 fill-blue-50/50'
                    : 'stroke-current'
                }`}
                strokeWidth={isActive ? 2.3 : 1.8}
              />
            </div>
            <span className={`text-[11px] mt-0.5 tracking-tight ${isActive ? 'font-bold text-blue-600' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
