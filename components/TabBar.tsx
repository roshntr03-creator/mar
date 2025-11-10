/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  AnalysisIcon,
  ClapperboardIcon,
  DocumentTextIcon,
  LightbulbIcon,
  MegaphoneIcon,
  SparklesIcon,
  UgcVideoIcon,
  WandIcon,
} from './icons';

export type Tab =
  | 'ugc_video'
  | 'campaigns'
  | 'post_assistant'
  | 'image_editor'
  | 'content_generator'
  | 'promo_video'
  | 'prompt_enhancer'
  | 'competitor_analysis';

interface TabBarProps {
  activeTab: Tab;
  onTabClick: (tab: Tab) => void;
  language: 'english' | 'arabic';
}

const TABS_CONFIG: {
  id: Tab;
  label: {en: string; ar: string};
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}[] = [
  {
    id: 'ugc_video',
    label: {en: 'UGC Video', ar: 'فيديو UGC'},
    icon: UgcVideoIcon,
  },
  {
    id: 'campaigns',
    label: {en: 'Campaigns', ar: 'الحملات'},
    icon: MegaphoneIcon,
  },
  {
    id: 'post_assistant',
    label: {en: 'Post AI', ar: 'مساعد النشر'},
    icon: SparklesIcon,
  },
  {
    id: 'image_editor',
    label: {en: 'Image Editor', ar: 'محرر الصور'},
    icon: WandIcon,
  },
  {
    id: 'promo_video',
    label: {en: 'Promo Video', ar: 'فيديو ترويجي'},
    icon: ClapperboardIcon,
  },
  {
    id: 'prompt_enhancer',
    label: {en: 'Prompt AI', ar: 'محسن الأوامر'},
    icon: LightbulbIcon,
  },
  {
    id: 'competitor_analysis',
    label: {en: 'Analysis', ar: 'تحليل'},
    icon: AnalysisIcon,
  },
  {
    id: 'content_generator',
    label: {en: 'Content', ar: 'المحتوى'},
    icon: DocumentTextIcon,
  },
];

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabClick,
  language,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-lg border-t border-gray-700 shadow-lg">
      <div className="mx-auto max-w-[1080px] flex items-center h-16 overflow-x-auto whitespace-nowrap">
        {TABS_CONFIG.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          const label = language === 'arabic' ? tab.label.ar : tab.label.en;
          return (
            <button
              key={tab.id}
              onClick={() => onTabClick(tab.id)}
              className={`flex flex-col items-center justify-center h-full px-4 flex-shrink-0 w-1/4 min-w-[100px] transition-colors duration-200 ${
                isActive
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-current={isActive ? 'page' : undefined}>
              <Icon className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
