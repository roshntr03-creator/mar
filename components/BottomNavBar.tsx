/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {Tab} from './navigationConfig';
import {
  Cog6ToothIcon,
  DashboardIcon,
  PlusIcon,
  ShieldCheckIcon,
  SparklesIcon,
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
      icon: SparklesIcon,
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
    className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
      isActive ? 'text-primary' : 'text-text-secondary hover:text-text-dark'
    }`}>
    <Icon className="w-6 h-6 mb-1" />
    <span className="text-xs font-medium">{label}</span>
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
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-component-dark/80 backdrop-blur-lg border-t border-border-dark z-40">
      <div className="grid grid-cols-5 items-center h-full max-w-2xl mx-auto">
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

        {/* Central Create Button */}
        <div className="w-full flex justify-center">
          <button
            onClick={onPlusClick}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-start to-primary-end -mt-8 flex items-center justify-center text-white shadow-lg shadow-primary/30 transform hover:scale-105 transition-transform"
            aria-label={language === 'english' ? 'Create new' : 'إنشاء جديد'}>
            <PlusIcon className="w-8 h-8" />
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
  );
};
