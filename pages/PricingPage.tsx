/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {CheckCircleIcon, XMarkIcon} from '../components/icons';

type Language = 'english' | 'arabic';
interface PricingPageProps {
  onClose: () => void;
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: 'Choose Your Plan',
    description: 'Unlock more features and grow your brand faster.',
    monthly: 'Monthly',
    annually: 'Annually',
    save: 'Save 20%',
    mostPopular: 'Most Popular',
    choosePlan: 'Choose Plan',
    features: {
      // Starter
      starter_tip: 'For individuals starting out',
      starter_generations: '10 generations/month',
      starter_brand: '1 Brand Identity profile',
      starter_analysis: 'Limited competitor analysis',
      starter_support: 'Community support',
      // Pro
      pro_tip: 'For professionals and creators',
      pro_generations: 'Unlimited generations',
      pro_ugc: 'UGC Video Creator',
      pro_brand: '5 Brand Identity profiles',
      pro_analysis: 'Full competitor analysis',
      pro_support: 'Priority email support',
      // Business
      business_tip: 'For teams and agencies',
      business_everything: 'Everything in Pro, plus:',
      business_collaboration: 'Team collaboration (3 seats)',
      business_sso: 'Single Sign-On (SSO)',
      business_support: 'Dedicated account manager',
    },
    plans: {
      starter: 'Starter',
      pro: 'Pro',
      business: 'Business',
    },
    pricing: {
      starter: 'Free',
      pro: '$29',
      business: '$79',
      per_month: '/ month',
    },
  },
  arabic: {
    title: 'اختر خطتك',
    description: 'افتح المزيد من الميزات وقم بتنمية علامتك التجارية بشكل أسرع.',
    monthly: 'شهريًا',
    annually: 'سنويًا',
    save: 'وفر 20٪',
    mostPopular: 'الأكثر شيوعًا',
    choosePlan: 'اختر الخطة',
    features: {
      // Starter
      starter_tip: 'للأفراد الذين بدأوا للتو',
      starter_generations: '10 عمليات توليد/شهر',
      starter_brand: 'ملف تعريف هوية تجارية واحد',
      starter_analysis: 'تحليل منافسين محدود',
      starter_support: 'دعم مجتمعي',
      // Pro
      pro_tip: 'للمحترفين والمبدعين',
      pro_generations: 'عمليات توليد غير محدودة',
      pro_ugc: 'صانع فيديو UGC',
      pro_brand: '5 ملفات تعريف هوية تجارية',
      pro_analysis: 'تحليل منافسين كامل',
      pro_support: 'دعم عبر البريد الإلكتروني ذو أولوية',
      // Business
      business_tip: 'للفرق والوكالات',
      business_everything: 'كل شيء في Pro، بالإضافة إلى:',
      business_collaboration: 'تعاون الفريق (3 مقاعد)',
      business_sso: 'تسجيل الدخول الموحد (SSO)',
      business_support: 'مدير حساب مخصص',
    },
    plans: {
      starter: 'مبتدئ',
      pro: 'محترف',
      business: 'أعمال',
    },
    pricing: {
      starter: 'مجانًا',
      pro: '٢٩ دولارًا',
      business: '٧٩ دولارًا',
      per_month: '/ شهر',
    },
  },
};

const Feature: React.FC<{text: string}> = ({text}) => (
  <li className="flex items-start gap-3">
    <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
    <span className="text-text-secondary">{text}</span>
  </li>
);

export const PricingPage: React.FC<PricingPageProps> = ({onClose, language}) => {
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  return (
    <div
      dir={dir}
      className="fixed inset-0 bg-background-dark/90 backdrop-blur-sm z-50 flex flex-col items-center justify-start p-4 animate-fade-in overflow-y-auto">
      <div className="w-full max-w-5xl">
        <div className="flex justify-end w-full mb-4">
          <button
            onClick={onClose}
            className="p-2 text-text-secondary rounded-full bg-component-dark/50 hover:bg-border-dark hover:text-text-dark transition-colors"
            aria-label={language === 'arabic' ? 'إغلاق' : 'Close'}>
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gradient">
            {texts.title}
          </h1>
          <p className="mt-2 text-lg text-text-secondary max-w-2xl mx-auto">
            {texts.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          {/* Starter Plan */}
          <div className="flex flex-col p-6 bg-component-dark/50 rounded-xl border border-border-dark backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-text-dark">
              {texts.plans.starter}
            </h3>
            <p className="mt-2 text-text-secondary">{texts.features.starter_tip}</p>
            <p className="mt-6 text-4xl font-extrabold text-text-dark">
              {texts.pricing.starter}
            </p>
            <button className="w-full mt-6 py-3 rounded-lg bg-border-dark hover:bg-border-dark/70 text-text-dark font-semibold transition-colors">
              {texts.choosePlan}
            </button>
            <ul className="mt-8 space-y-4 flex-grow">
              <Feature text={texts.features.starter_generations} />
              <Feature text={texts.features.starter_brand} />
              <Feature text={texts.features.starter_analysis} />
              <Feature text={texts.features.starter_support} />
            </ul>
          </div>

          {/* Pro Plan */}
          <div className="relative flex flex-col p-6 bg-component-dark/50 rounded-xl border-2 border-transparent shadow-2xl shadow-primary/30 bg-clip-padding 
            before:content-[''] before:absolute before:inset-0 before:z-[-10] before:bg-gradient-to-br before:from-primary-start before:to-primary-end before:rounded-[0.8rem] before:p-[2px] backdrop-blur-sm">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-primary-start to-primary-end text-white text-sm font-semibold rounded-full">
              {texts.mostPopular}
            </div>
            <h3 className="text-2xl font-bold text-text-dark">
              {texts.plans.pro}
            </h3>
            <p className="mt-2 text-text-secondary">{texts.features.pro_tip}</p>
            <p className="mt-6 text-4xl font-extrabold text-text-dark">
              {texts.pricing.pro}{' '}
              <span className="text-base font-medium text-text-secondary">
                {texts.pricing.per_month}
              </span>
            </p>
            <button className="w-full mt-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-opacity hover:opacity-90">
              {texts.choosePlan}
            </button>
            <ul className="mt-8 space-y-4 flex-grow">
              <Feature text={texts.features.pro_generations} />
              <Feature text={texts.features.pro_ugc} />
              <Feature text={texts.features.pro_brand} />
              <Feature text={texts.features.pro_analysis} />
              <Feature text={texts.features.pro_support} />
            </ul>
          </div>

          {/* Business Plan */}
          <div className="flex flex-col p-6 bg-component-dark/50 rounded-xl border border-border-dark backdrop-blur-sm">
            <h3 className="text-2xl font-bold text-text-dark">
              {texts.plans.business}
            </h3>
            <p className="mt-2 text-text-secondary">
              {texts.features.business_tip}
            </p>
            <p className="mt-6 text-4xl font-extrabold text-text-dark">
              {texts.pricing.business}{' '}
              <span className="text-base font-medium text-text-secondary">
                {texts.pricing.per_month}
              </span>
            </p>
            <button className="w-full mt-6 py-3 rounded-lg bg-border-dark hover:bg-border-dark/70 text-text-dark font-semibold transition-colors">
              {texts.choosePlan}
            </button>
            <ul className="mt-8 space-y-4 flex-grow">
              <p className="font-semibold text-text-dark">
                {texts.features.business_everything}
              </p>
              <Feature text={texts.features.business_collaboration} />
              <Feature text={texts.features.business_sso} />
              <Feature text={texts.features.business_support} />
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
