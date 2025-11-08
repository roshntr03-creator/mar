/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {
  ClapperboardIcon,
  Cog6ToothIcon,
  DashboardIcon,
  DocumentTextIcon,
  LightbulbIcon,
  MegaphoneIcon,
  PhotoIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TelescopeIcon,
  UgcVideoIcon,
  WandIcon,
} from './icons';

export type Tab =
  | 'dashboard'
  | 'creations'
  | 'ugc_video'
  | 'campaigns'
  | 'post_assistant'
  | 'image_editor'
  | 'content_generator'
  | 'promo_video'
  | 'prompt_enhancer'
  | 'competitor_analysis'
  | 'image_generator'
  | 'brand_identity'
  | 'settings';

export type Group = 'Home' | 'Create' | 'Refine' | 'Strategy' | 'General';

export const GROUP_LABELS: Record<Group, {en: string; ar: string}> = {
  Home: {en: 'Home', ar: 'الرئيسية'},
  Create: {en: 'Create', ar: 'إنشاء'},
  Refine: {en: 'Refine', ar: 'تحسين'},
  Strategy: {en: 'Strategy', ar: 'استراتيجية'},
  General: {en: 'General', ar: 'عام'},
};

export const TABS_CONFIG: {
  id: Tab;
  label: {en: string; ar: string};
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  group: Group;
}[] = [
  {
    id: 'dashboard',
    label: {en: 'Dashboard', ar: 'لوحة التحكم'},
    icon: DashboardIcon,
    group: 'Home',
  },
  {
    id: 'creations',
    label: {en: 'Creations', ar: 'إبداعاتي'},
    icon: SparklesIcon,
    group: 'Home',
  },
  {
    id: 'ugc_video',
    label: {en: 'UGC Video Creator', ar: 'صانع فيديو UGC'},
    icon: UgcVideoIcon,
    group: 'Create',
  },
  {
    id: 'promo_video',
    label: {en: 'Promo Video', ar: 'فيديو ترويجي'},
    icon: ClapperboardIcon,
    group: 'Create',
  },
  {
    id: 'image_generator',
    label: {en: 'Image Generation', ar: 'توليد الصور'},
    icon: PhotoIcon,
    group: 'Create',
  },
  {
    id: 'content_generator',
    label: {en: 'Content Generation', ar: 'توليد المحتوى'},
    icon: DocumentTextIcon,
    group: 'Create',
  },
  {
    id: 'image_editor',
    label: {en: 'Image Editor', ar: 'محرر الصور'},
    icon: WandIcon,
    group: 'Refine',
  },
  {
    id: 'post_assistant',
    label: {en: 'Post Assistant', ar: 'مساعد النشر'},
    icon: SparklesIcon,
    group: 'Refine',
  },
  {
    id: 'prompt_enhancer',
    label: {en: 'Prompt Enhancer', ar: 'محسن الأوامر'},
    icon: LightbulbIcon,
    group: 'Refine',
  },
  {
    id: 'brand_identity',
    label: {en: 'Brand Identity', ar: 'الهوية التجارية'},
    icon: ShieldCheckIcon,
    group: 'Strategy',
  },
  {
    id: 'campaigns',
    label: {en: 'Campaigns', ar: 'الحملات'},
    icon: MegaphoneIcon,
    group: 'Strategy',
  },
  {
    id: 'competitor_analysis',
    label: {en: 'Competitor Analysis', ar: 'تحليل المنافسين'},
    icon: TelescopeIcon,
    group: 'Strategy',
  },
  {
    id: 'settings',
    label: {en: 'Settings', ar: 'الإعدادات'},
    icon: Cog6ToothIcon,
    group: 'General',
  },
];