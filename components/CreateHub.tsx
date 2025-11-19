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
    title: 'Create New',
    close: 'Close',
  },
  arabic: {
    title: 'إنشاء جديد',
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
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-end justify-center animate-fade-in"
      onClick={onClose}>
      <div
        dir={dir}
        className="w-full max-w-2xl glass-card rounded-t-[3rem] p-8 pb-16 animate-slide-up shadow-2xl border-t border-white/20 bg-[#0a0a0f]/90"
        onClick={(e) => e.stopPropagation()}>
        
        <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8"></div>
        
        <div className="flex justify-between items-center mb-10 px-2">
          <h2 className="text-3xl font-bold text-white">{texts.title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/70 hover:bg-white/20 hover:text-white transition-colors border border-white/10">
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {createTabs.map((tab, index) => {
            const Icon = tab.icon;
            const label = language === 'english' ? tab.label.en : tab.label.ar;
            const colors = [
                'text-violet-200 bg-violet-500/20 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.2)]',
                'text-pink-200 bg-pink-500/20 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]',
                'text-blue-200 bg-blue-500/20 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]',
                'text-emerald-200 bg-emerald-500/20 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            ];
            const styleClass = colors[index % colors.length];

            return (
              <button
                key={tab.id}
                onClick={() => onSelect(tab.id)}
                className={`p-6 rounded-[2.5rem] border flex flex-col items-center justify-center gap-5 h-48 transition-all active:scale-95 ${styleClass} hover:brightness-110 hover:scale-[1.02]`}>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center shadow-inner backdrop-blur-sm">
                   <Icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-base text-white tracking-wide text-center">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
