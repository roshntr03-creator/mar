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
    greeting: 'Hello,',
    tipTitle: "Daily Insight",
    quickLinks: 'Create',
    recentActivity: 'Recent',
    errorFetchingTip:
      'Stay creative! Great things take time.',
    openAiCoach: 'Ask Coach',
    coachTitle: 'AI Coach',
    coachDescription: 'Stuck? Get instant marketing advice.',
  },
  arabic: {
    greeting: 'مرحباً،',
    tipTitle: 'رؤية اليوم',
    quickLinks: 'إنشاء',
    recentActivity: 'الأخيرة',
    errorFetchingTip:
      'كن مبدعاً! الأشياء العظيمة تأخذ وقتاً.',
    openAiCoach: 'اسأل المدرب',
    coachTitle: 'مدرب الذكاء',
    coachDescription: 'محتاج مساعدة؟ احصل على نصيحة فورية.',
  },
};

const QUICK_LINKS: {id: Tab; icon: React.FC<any>; color: string; bg: string}[] = [
  {id: 'ugc_video', icon: UgcVideoIcon, color: 'text-pink-300', bg: 'bg-pink-500/10 border-pink-500/20'},
  {id: 'image_generator', icon: PhotoIcon, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20'},
  {id: 'post_assistant', icon: SparklesIcon, color: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-500/20'},
  {id: 'campaigns', icon: MegaphoneIcon, color: 'text-amber-300', bg: 'bg-amber-500/10 border-amber-500/20'},
];

const RECENT_ACTIVITY: {
  id: Tab;
  icon: React.FC<any>;
  time: {en: string; ar: string};
}[] = [
  {
    id: 'ugc_video',
    icon: UgcVideoIcon,
    time: {en: '2m ago', ar: 'منذ دقيقتين'},
  },
  {
    id: 'image_editor',
    icon: WandIcon,
    time: {en: '1h ago', ar: 'منذ ساعة'},
  },
];

export const Dashboard: React.FC<PageProps> = ({
  language,
  setActiveTab,
  setShowAiCoach,
}) => {
  const [tip, setTip] = useState<string | null>(null);
  const [brandName, setBrandName] = useState<string | null>(null);
  const texts = TEXTS[language];
  const langKey = language === 'arabic' ? 'ar' : 'en';

  useEffect(() => {
    const storedProfile = localStorage.getItem('aiMarketingSuite_brandIdentity');
    if (storedProfile) {
      try {
        const profile = JSON.parse(storedProfile);
        setBrandName(profile.brandName);
      } catch (e) {}
    }

    const fetchTip = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedTipString = localStorage.getItem(DAILY_TIP_KEY);

      if (storedTipString) {
        try {
          const storedTip: DailyTip = JSON.parse(storedTipString);
          if (storedTip.date === today) {
            setTip(storedTip.tip);
            return;
          }
        } catch (e) {}
      }

      try {
        const prompt = language === 'arabic'
            ? 'نصيحة تسويقية قصيرة جداً (جملة واحدة) لشركة صغيرة.'
            : 'Give me a very short, one-sentence marketing tip.';

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
        setTip(texts.errorFetchingTip);
      }
    };

    fetchTip();
  }, [language, texts.errorFetchingTip]);

  return (
    <div className="p-6 space-y-8 animate-slide-up max-w-2xl mx-auto pt-8">
      
      {/* Header */}
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-base font-medium text-white/60 mb-0.5">{texts.greeting}</h1>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight">
               {brandName || (language === 'arabic' ? 'مبدع' : 'Creator')}
            </h2>
         </div>
         <button onClick={() => setShowAiCoach && setShowAiCoach(true)} className="w-12 h-12 rounded-full glass-card p-0.5 hover:bg-white/10 transition-colors flex items-center justify-center border border-white/20 shadow-lg hover:scale-105 duration-200">
             <AiCoachIcon className="w-6 h-6 text-primary" />
         </button>
      </div>

      {/* Daily Tip */}
      <div className="glass-card p-6 rounded-[2rem] relative overflow-hidden group border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
         <div className="absolute -right-6 -top-6 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl group-hover:bg-yellow-500/30 transition-colors"></div>
         <div className="flex items-start gap-5 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 shadow-sm">
               <LightbulbIcon className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
               <h3 className="text-xs font-bold text-yellow-200/80 uppercase tracking-wider mb-2">{texts.tipTitle}</h3>
               <p className="text-base font-medium text-white leading-relaxed">{tip || "..."}</p>
            </div>
         </div>
      </div>

      {/* Quick Links Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4 px-1 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5 text-primary" />
            {texts.quickLinks}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {QUICK_LINKS.map(({id, icon: Icon, color, bg}) => {
             const config = TABS_CONFIG.find((t) => t.id === id);
             return (
                <button 
                  key={id} 
                  onClick={() => setActiveTab && setActiveTab(id)}
                  className="glass-card p-5 rounded-[2rem] flex flex-col items-start justify-between h-40 hover:bg-white/5 transition-all active:scale-95 group border border-white/5 hover:border-white/20"
                >
                   <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform border shadow-inner`}>
                      <Icon className={`w-7 h-7 ${color}`} />
                   </div>
                   <div className="flex justify-between items-center w-full">
                      <span className="text-sm font-bold text-white">{config?.label[langKey]}</span>
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="material-symbols-rounded text-xs">arrow_forward</span>
                      </div>
                   </div>
                </button>
             )
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
         <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-bold text-white">{texts.recentActivity}</h3>
         </div>
         <div className="space-y-3">
            {RECENT_ACTIVITY.map(({id, icon: Icon, time}) => {
               const config = TABS_CONFIG.find((t) => t.id === id);
               return (
                  <button 
                     key={id}
                     onClick={() => setActiveTab && setActiveTab(id)}
                     className="w-full glass-card p-4 rounded-[1.5rem] flex items-center justify-between hover:bg-white/5 transition-colors border border-white/5 group"
                  >
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                           <Icon className="w-6 h-6 text-white/70" />
                        </div>
                        <div className="text-left">
                           <p className="font-bold text-white text-sm">{config?.label[langKey]}</p>
                           <p className="text-xs text-white/40 mt-0.5 font-medium">{time[langKey]}</p>
                        </div>
                     </div>
                     <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-primary/20 transition-colors">
                        <span className="material-symbols-rounded text-white/40 text-sm group-hover:text-primary">arrow_forward</span>
                     </div>
                  </button>
               )
            })}
         </div>
      </div>

    </div>
  );
};
