/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai';
import React, {useEffect, useState} from 'react';
import {PageProps} from '../App';
import {
  AiCoachIcon,
  LightbulbIcon,
  MegaphoneIcon,
  PhotoIcon,
  SparklesIcon,
  UgcVideoIcon,
  WandIcon,
} from './icons';
import {TABS_CONFIG, Tab} from './navigationConfig';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const DAILY_TIP_KEY = 'aiMarketingSuite_dailyTip';

interface DailyTip {
  tip: string;
  date: string; // YYYY-MM-DD
}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    welcome: 'Welcome Back!',
    tipTitle: "Today's Marketing Tip",
    quickLinks: 'Jump Back In',
    recentActivity: 'Recent Activity',
    errorFetchingTip:
      'Could not load a tip right now. Please try again later.',
    openAiCoach: 'Open AI Coach',
    coachTitle: 'AI Marketing Coach',
    coachDescription: 'Need advice? Chat with your AI coach.',
  },
  arabic: {
    welcome: 'مرحباً بعودتك!',
    tipTitle: 'نصيحة اليوم التسويقية',
    quickLinks: 'الوصول السريع',
    recentActivity: 'النشاط الأخير',
    errorFetchingTip:
      'لا يمكن تحميل النصيحة الآن. يرجى المحاولة مرة أخرى لاحقًا.',
    openAiCoach: 'فتح مدرب الذكاء الاصطناعي',
    coachTitle: 'مدرب التسويق بالذكاء الاصطناعي',
    coachDescription:
      'هل تحتاج إلى نصيحة؟ تحدث مع مدرب الذكاء الاصطناعي الخاص بك.',
  },
};

const QUICK_LINKS: {id: Tab; icon: React.FC<any>}[] = [
  {id: 'ugc_video', icon: UgcVideoIcon},
  {id: 'campaigns', icon: MegaphoneIcon},
  {id: 'post_assistant', icon: SparklesIcon},
  {id: 'image_generator', icon: PhotoIcon},
];

const RECENT_ACTIVITY: {
  id: Tab;
  icon: React.FC<any>;
  time: {en: string; ar: string};
}[] = [
  {
    id: 'ugc_video',
    icon: UgcVideoIcon,
    time: {en: '3 minutes ago', ar: 'قبل 3 دقائق'},
  },
  {
    id: 'image_editor',
    icon: WandIcon,
    time: {en: '1 hour ago', ar: 'قبل ساعة'},
  },
  {
    id: 'campaigns',
    icon: MegaphoneIcon,
    time: {en: 'Yesterday', ar: 'أمس'},
  },
];

export const Dashboard: React.FC<PageProps> = ({
  language,
  setActiveTab,
  setShowAiCoach,
}) => {
  const [tip, setTip] = useState<string | null>(null);
  const [isLoadingTip, setIsLoadingTip] = useState(true);
  const [brandName, setBrandName] = useState<string | null>(null);
  const texts = TEXTS[language];
  const langKey = language === 'arabic' ? 'ar' : 'en';

  useEffect(() => {
    // Load brand name from local storage
    const storedProfile = localStorage.getItem('aiMarketingSuite_brandIdentity');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setBrandName(profile.brandName);
      } catch (e) {
        console.error('Failed to parse brand profile', e);
      }
    }

    // Fetch daily tip
    const fetchTip = async () => {
      setIsLoadingTip(true);
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD
      const storedTipString = localStorage.getItem(DAILY_TIP_KEY);

      if (storedTipString) {
        try {
          const storedTip: DailyTip = JSON.parse(storedTipString);
          if (storedTip.date === today) {
            setTip(storedTip.tip);
            setIsLoadingTip(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse stored tip', e);
        }
      }

      // If no valid tip is stored for today, fetch a new one
      try {
        const prompt =
          language === 'arabic'
            ? 'أعطني نصيحة تسويقية قصيرة وقابلة للتنفيذ لشركة صغيرة أو مبدع. يجب أن تكون النصيحة موجزة وأقل من 280 حرفًا.'
            : 'Give me a short, actionable marketing tip for a small business or creator. The tip should be concise and under 280 characters.';

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        const newTip = response.text;
        setTip(newTip);
        localStorage.setItem(
          DAILY_TIP_KEY,
          JSON.stringify({tip: newTip, date: today}),
        );
      } catch (error) {
        console.error('Error fetching daily tip:', error);
        setTip(texts.errorFetchingTip);
      } finally {
        setIsLoadingTip(false);
      }
    };

    fetchTip();
  }, [language, texts.errorFetchingTip]);

  const TipCardSkeleton = () => (
    <div className="relative overflow-hidden bg-component-dark p-5 rounded-xl border border-border-dark">
      <div className="animate-pulse">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-8 rounded-full bg-border-dark"></div>
          <div className="h-5 w-48 bg-border-dark rounded-md"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full bg-border-dark rounded-md"></div>
          <div className="h-4 w-3/4 bg-border-dark rounded-md"></div>
        </div>
      </div>
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-24 space-y-8">
      <div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gradient">
          {texts.welcome}
        </h1>
        {brandName && (
          <p className="text-lg text-text-secondary mt-1">
            {language === 'arabic'
              ? `هنا لوحة تحكم ${brandName}.`
              : `Here's the dashboard for ${brandName}.`}
          </p>
        )}
      </div>

      {/* Daily Tip Card */}
      {isLoadingTip ? (
        <TipCardSkeleton />
      ) : (
        <div className="bg-component-dark p-5 rounded-xl border border-border-dark shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <LightbulbIcon className="w-7 h-7 text-primary" />
            <h2 className="text-lg font-bold text-text-dark">
              {texts.tipTitle}
            </h2>
          </div>
          <p className="text-text-secondary text-base leading-relaxed italic">
            "{tip}"
          </p>
        </div>
      )}

      {/* AI Coach CTA */}
      <div className="bg-gradient-to-br from-primary-start/20 to-primary-end/20 p-6 rounded-xl border border-primary/30 shadow-glow flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-start to-primary-end flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <AiCoachIcon className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-dark">
              {texts.coachTitle}
            </h2>
            <p className="text-text-secondary mt-1">
              {texts.coachDescription}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAiCoach && setShowAiCoach(true)}
          className="w-full sm:w-auto px-8 py-3 rounded-lg bg-component-dark text-text-dark font-semibold transition-all hover:bg-border-dark flex-shrink-0 border border-border-dark">
          {texts.openAiCoach}
        </button>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-text-dark mb-4">
          {texts.quickLinks}
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {QUICK_LINKS.map(({id, icon: Icon}) => {
            const config = TABS_CONFIG.find((tab) => tab.id === id);
            if (!config) return null;
            return (
              <button
                key={id}
                onClick={() => setActiveTab && setActiveTab(id)}
                className="bg-component-dark p-4 rounded-xl border border-border-dark text-center hover:border-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 group hover:shadow-glow">
                <div className="flex items-center justify-center w-12 h-12 bg-border-dark rounded-full mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="w-7 h-7 text-text-secondary group-hover:text-primary transition-colors" />
                </div>
                <p className="font-semibold text-text-dark text-sm">
                  {config.label[langKey]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-bold text-text-dark mb-4">
          {texts.recentActivity}
        </h2>
        <div className="bg-component-dark p-4 rounded-xl border border-border-dark shadow-lg">
          <ul className="divide-y divide-border-dark">
            {RECENT_ACTIVITY.map(({id, icon: Icon, time}, index) => {
              const config = TABS_CONFIG.find((tab) => tab.id === id);
              if (!config) return null;
              return (
                <li
                  key={id}
                  className={`flex items-center justify-between py-3 ${index === 0 ? 'pt-0' : ''} ${index === RECENT_ACTIVITY.length - 1 ? 'pb-0' : ''}`}>
                  <div className="flex items-center gap-4">
                    <Icon className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-semibold text-text-dark">
                        {config.label[langKey]}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {time[langKey]}
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setActiveTab && setActiveTab(id)}>
                    <span className="material-symbols-outlined text-text-secondary hover:text-text-dark">
                      arrow_forward_ios
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
