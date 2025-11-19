/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Tab} from './navigationConfig';
import {
  CreationsIcon,
  DashboardIcon,
  PlusIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from './icons';

interface BottomNavBarProps {
  activeTab: Tab;
  onTabClick: (tab: Tab) => void;
  onPlusClick: () => void;
  language: 'english' | 'arabic';
}

const TABS: {id: Tab; icon: React.FC<any>; label: {en: string; ar: string}}[] =
  [
    {
      id: 'dashboard',
      icon: DashboardIcon,
      label: {en: 'Home', ar: 'الرئيسية'},
    },
    {
      id: 'creations',
      icon: CreationsIcon,
      label: {en: 'Creations', ar: 'إبداعاتي'},
    },
    {
      id: 'brand_identity',
      icon: ShieldCheckIcon,
      label: {en: 'Brand', ar: 'الهوية'},
    },
    {id: 'settings', icon: Cog6ToothIcon, label: {en: 'More', ar: 'المزيد'}},
  ];

const NavItem: React.FC<{
  icon: React.FC<any>;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({icon: Icon, label, isActive, onClick}) => (
  <button
    onClick={onClick}
    className="relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 group">
    <div className={`p-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-white bg-gradient-to-br from-primary-start to-primary-end shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-110 border border-white/20 translate-y-[-8px]' : 'text-white/40 group-hover:text-white'}`}>
       <Icon className="w-6 h-6" />
    </div>
  </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabClick,
  onPlusClick,
  language,
}) => {
  const lang = language === 'english' ? 'en' : 'ar';
  return (
    <div className="fixed bottom-8 left-0 right-0 z-40 safe-area-bottom pointer-events-none flex justify-center px-6">
      <div className="glass-card rounded-[2.5rem] shadow-2xl pointer-events-auto w-full max-w-md backdrop-blur-2xl bg-[#0a0a0f]/90 border border-white/10">
        <div className="grid grid-cols-5 items-center h-20 px-2">
          <NavItem
            icon={TABS[0].icon}
            label={TABS[0].label[lang]}
            isActive={activeTab === TABS[0].id}
            onClick={() => onTabClick(TABS[0].id)}
          />
          <NavItem
            icon={TABS[1].icon}
            label={TABS[1].label[lang]}
            isActive={activeTab === TABS[1].id}
            onClick={() => onTabClick(TABS[1].id)}
          />

          {/* Floating Action Button */}
          <div className="relative -top-8 w-full flex justify-center pointer-events-none">
            <button
              onClick={onPlusClick}
              className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.4)] pointer-events-auto transform transition-transform hover:scale-110 active:scale-95 border-4 border-[#030014] group z-50"
              aria-label={language === 'english' ? 'Create new' : 'إنشاء جديد'}>
              <PlusIcon className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          <NavItem
            icon={TABS[2].icon}
            label={TABS[2].label[lang]}
            isActive={activeTab === TABS[2].id}
            onClick={() => onTabClick(TABS[2].id)}
          />
          <NavItem
            icon={TABS[3].icon}
            label={TABS[3].label[lang]}
            isActive={activeTab === TABS[3].id}
            onClick={() => onTabClick(TABS[3].id)}
          />
        </div>
      </div>
    </div>
  );
};
