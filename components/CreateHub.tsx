/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {TABS_CONFIG, Tab} from './navigationConfig';
import {XMarkIcon} from './icons';

interface CreateHubProps {
  onClose: () => void;
  onSelect: (tab: Tab) => void;
  language: 'english' | 'arabic';
}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    title: 'What will you create?',
    close: 'Close',
  },
  arabic: {
    title: 'ماذا ستنشئ؟',
    close: 'إغلاق',
  },
};

export const CreateHub: React.FC<CreateHubProps> = ({
  onClose,
  onSelect,
  language,
}) => {
  const createTabs = TABS_CONFIG.filter((tab) => tab.group === 'Create');
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog">
      <div
        dir={dir}
        className="bg-component-dark w-full max-w-2xl rounded-t-xl shadow-2xl p-4 border-t border-border-dark animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-text-dark">{texts.title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-dark"
            aria-label={texts.close}>
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {createTabs.map((tab) => {
            const Icon = tab.icon;
            const label = language === 'english' ? tab.label.en : tab.label.ar;
            return (
              <button
                key={tab.id}
                onClick={() => onSelect(tab.id)}
                className="bg-background-dark p-4 rounded-lg text-center hover:bg-border-dark transition-colors group">
                <div className="flex items-center justify-center w-12 h-12 bg-border-dark rounded-full mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-text-secondary group-hover:text-primary transition-colors" />
                </div>
                <p className="font-semibold text-text-dark text-sm">{label}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};