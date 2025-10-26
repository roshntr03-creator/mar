/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {GROUP_LABELS, TABS_CONFIG, Tab, Group} from './navigationConfig';
import {XMarkIcon} from './icons';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: Tab;
  onTabClick: (tab: Tab) => void;
  language: 'english' | 'arabic';
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  activeTab,
  onTabClick,
  language,
}) => {
  const dir = language === 'arabic' ? 'rtl' : 'ltr';
  const positionClasses = language === 'arabic' ? 'right-0' : 'left-0';
  const transformClass =
    language === 'arabic'
      ? isOpen
        ? 'translate-x-0'
        : 'translate-x-full'
      : isOpen
      ? 'translate-x-0'
      : '-translate-x-full';

  const groupedTabs = TABS_CONFIG.reduce(
    (acc, tab) => {
      if (!acc[tab.group]) {
        acc[tab.group] = [];
      }
      acc[tab.group].push(tab);
      return acc;
    },
    {} as Record<Group, typeof TABS_CONFIG>,
  );

  const groupOrder: Group[] = [
    'Home',
    'Create',
    'Refine',
    'Strategy',
    'General',
  ];

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-modal="true"
      role="dialog">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"></div>

      {/* Panel */}
      <div
        dir={dir}
        className={`relative ${positionClasses} flex flex-col w-72 max-w-[80vw] h-full bg-component-dark/80 backdrop-blur-lg shadow-2xl transform transition-transform duration-300 ease-in-out ${transformClass} border-l border-border-dark`}>
        <header className="flex items-center justify-between p-4 border-b border-border-dark">
          <h2 className="text-xl font-bold text-text-dark">
            {language === 'arabic' ? 'الأدوات' : 'Tools'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary rounded-full hover:bg-border-dark hover:text-text-dark transition-colors"
            aria-label={language === 'arabic' ? 'إغلاق' : 'Close'}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </header>
        <nav className="flex-grow p-2 overflow-y-auto">
          <ul className="space-y-4">
            {groupOrder.map((group) => (
              <li key={group}>
                <h3 className="px-4 py-2 text-xs font-bold uppercase text-text-secondary tracking-wider">
                  {GROUP_LABELS[group][language === 'arabic' ? 'ar' : 'en']}
                </h3>
                <ul className="space-y-1 mt-1">
                  {(groupedTabs[group] || []).map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    const label =
                      language === 'arabic' ? tab.label.ar : tab.label.en;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => {
                            onTabClick(tab.id);
                            onClose();
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-md text-left transition-colors duration-200 relative ${
                            isActive
                              ? 'bg-primary/20 text-text-dark font-semibold'
                              : 'text-text-secondary hover:bg-border-dark hover:text-text-dark'
                          }`}
                          aria-current={isActive ? 'page' : undefined}>
                          {isActive && <div className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary-start to-primary-end rounded-r-full"></div>}
                          <Icon className={`w-6 h-6 flex-shrink-0 ${isActive ? 'text-primary' : ''}`} />
                          <span>{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};
