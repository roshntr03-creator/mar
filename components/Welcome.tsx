/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import { 
  DashboardIcon, 
  SparklesIcon, 
  AnalysisIcon,
  ShieldCheckIcon,
  ClapperboardIcon,
  PhotoIcon,
  WandIcon
} from './icons';

type Language = 'english' | 'arabic';
interface WelcomeProps {
  onFinish: (brandInfo?: string) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  mode?: 'onboarding' | 'brandSetup';
}

const TEXTS: Record<Language, any> = {
  english: {
    step1: {
      title: 'Marketing Superpowers',
      description:
        'Unleash the power of AI to create, manage, and grow your brand effortlessly.',
      getStarted: 'Get Started',
    },
    step2: {
      title: 'Your AI Creator',
      ideasTitle: 'Create',
      ideasDesc: 'Generate video, images, and copy instantly.',
      schedulingTitle: 'Analyze',
      schedulingDesc: 'Outsmart competitors with AI insights.',
      analyticsTitle: 'Grow',
      analyticsDesc: 'Track performance and scale up.',
      next: 'Next',
      skip: 'Skip',
    },
    step3: {
      title: 'Personalize It',
      description:
        "Train your AI on your brand's voice and style for perfect content every time.",
      startProfile: 'Personalize Now',
      maybeLater: 'Skip for now',
    },
    step4: {
      headerTitle: 'Brand Identity',
      title: 'Tell us about your brand',
      description:
        'Paste your website URL or a short description.',
      placeholder:
        "e.g. www.mybrand.com or 'A sustainable coffee shop...'",
      analyze: 'Analyze & Save',
    },
  },
  arabic: {
    step1: {
      title: 'قوى تسويقية خارقة',
      description:
        'أطلق العنان لقوة الذكاء الاصطناعي لإنشاء علامتك التجارية وإدارتها بسهولة.',
      getStarted: 'ابدأ الآن',
    },
    step2: {
      title: 'مبدعك الذكي',
      ideasTitle: 'أنشئ',
      ideasDesc: 'ولد فيديو وصور ونصوص فوراً.',
      schedulingTitle: 'حلل',
      schedulingDesc: 'تفوق على المنافسين برؤى الذكاء الاصطناعي.',
      analyticsTitle: 'انمو',
      analyticsDesc: 'تتبع الأداء وتوسع.',
      next: 'التالي',
      skip: 'تخطي',
    },
    step3: {
      title: 'اجعله شخصياً',
      description:
        'درب الذكاء الاصطناعي على صوت وأسلوب علامتك التجارية للحصول على محتوى مثالي.',
      startProfile: 'خصص الآن',
      maybeLater: 'تخطي الآن',
    },
    step4: {
      headerTitle: 'هوية العلامة',
      title: 'أخبرنا عن علامتك',
      description:
        'الصق رابط موقعك أو وصفاً قصيراً.',
      placeholder: "مثال: www.example.com أو 'مقهى مستدام...'",
      analyze: 'تحليل وحفظ',
    },
  },
};

export const Welcome: React.FC<WelcomeProps> = ({
  onFinish,
  language,
  setLanguage,
  mode = 'onboarding',
}) => {
  const [step, setStep] = useState(mode === 'brandSetup' ? 4 : 1);
  const [brandInput, setBrandInput] = useState('');
  const dir = language === 'arabic' ? 'rtl' : 'ltr';
  const texts = TEXTS[language];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div dir={dir} className="h-full w-full flex flex-col justify-between p-6 safe-area-bottom animate-slide-up relative overflow-hidden">
             {/* Background Gradients */}
             <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none opacity-50"></div>
             
             <div className="flex justify-between items-center z-10 pt-4">
                <div className="w-12 h-12 rounded-2xl glass-card flex items-center justify-center text-white border border-white/20 shadow-glow-sm">
                   <SparklesIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="glass-card rounded-full p-1.5 flex gap-1 border border-white/10">
                   <button onClick={() => setLanguage('english')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'english' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'}`}>EN</button>
                   <button onClick={() => setLanguage('arabic')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${language === 'arabic' ? 'bg-white text-black shadow-sm' : 'text-white/50 hover:text-white'}`}>AR</button>
                </div>
             </div>
             
             <div className="flex flex-col items-center text-center space-y-10 my-auto z-10">
                <div className="relative w-56 h-56">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary to-purple-500 blur-[80px] rounded-full opacity-40 animate-pulse-glow"></div>
                  <div className="relative w-full h-full glass-card rounded-[3rem] border border-white/10 flex items-center justify-center shadow-2xl animate-float backdrop-blur-xl bg-white/5">
                     <WandIcon className="w-24 h-24 text-white drop-shadow-[0_0_30px_rgba(139,92,246,0.6)]" />
                  </div>
                </div>
                <div className="space-y-4 max-w-sm">
                  <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 tracking-tight leading-tight">
                    {texts.step1.title}
                  </h1>
                  <p className="text-lg text-white/60 font-medium leading-relaxed">
                    {texts.step1.description}
                  </p>
                </div>
             </div>

             <button
                onClick={() => setStep(2)}
                className="w-full h-16 rounded-[2rem] bg-white text-black font-bold text-lg shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all z-10 flex items-center justify-center gap-3 group">
                <span>{texts.step1.getStarted}</span>
                <span className="material-symbols-rounded group-hover:translate-x-1 transition-transform">arrow_forward</span>
             </button>
          </div>
        );
      case 2:
        return (
          <div dir={dir} className="h-full w-full flex flex-col p-6 safe-area-bottom animate-slide-up pt-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">{texts.step2.title}</h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar px-2">
                {[
                  { Icon: ClapperboardIcon, title: texts.step2.ideasTitle, desc: texts.step2.ideasDesc, color: 'text-pink-300', bg: 'bg-pink-500/10 border-pink-500/20' },
                  { Icon: AnalysisIcon, title: texts.step2.schedulingTitle, desc: texts.step2.schedulingDesc, color: 'text-purple-300', bg: 'bg-purple-500/10 border-purple-500/20' },
                  { Icon: DashboardIcon, title: texts.step2.analyticsTitle, desc: texts.step2.analyticsDesc, color: 'text-cyan-300', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                ].map((item, i) => (
                  <div key={i} className="glass-card p-6 rounded-[2.5rem] flex items-center gap-6 animate-slide-up border border-white/5 hover:border-white/20 transition-all duration-300 group hover:-translate-y-1" style={{animationDelay: `${i * 0.1}s`}}>
                    <div className={`w-16 h-16 rounded-2xl ${item.bg} border flex items-center justify-center shadow-lg shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                      <item.Icon className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                      <p className="text-white/50 text-sm font-medium leading-snug mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>

            <div className="mt-6 space-y-4">
               <button
                onClick={() => setStep(3)}
                className="w-full h-16 rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold text-lg shadow-glow hover:opacity-90 active:scale-95 transition-all border border-white/20">
                {texts.step2.next}
              </button>
              <button
                onClick={() => onFinish()}
                className="w-full py-2 text-white/40 font-semibold text-sm hover:text-white transition-colors">
                {texts.step2.skip}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div dir={dir} className="h-full w-full flex flex-col justify-between p-6 safe-area-bottom animate-slide-up pt-12">
             <div className="flex-1 flex flex-col items-center justify-center text-center space-y-10">
                <div className="w-64 h-64 rounded-full relative animate-float">
                   <div className="absolute inset-0 bg-gradient-to-tr from-primary to-pink-600 blur-[80px] opacity-40 animate-pulse-glow"></div>
                   <div className="absolute inset-4 glass-card rounded-[3rem] flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-2xl">
                      <ShieldCheckIcon className="w-28 h-28 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]" />
                   </div>
                </div>
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold text-white">{texts.step3.title}</h2>
                  <p className="text-white/60 text-lg max-w-xs mx-auto leading-relaxed">{texts.step3.description}</p>
                </div>
             </div>

             <div className="space-y-4">
               <button
                onClick={() => setStep(4)}
                className="w-full h-16 rounded-full bg-white text-black font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                {texts.step3.startProfile}
              </button>
              <button
                onClick={() => onFinish()}
                className="w-full py-2 text-white/40 font-semibold text-sm hover:text-white transition-colors">
                {texts.step3.maybeLater}
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div dir={dir} className="h-full w-full flex flex-col p-6 safe-area-bottom animate-slide-up pt-8">
            <div className="flex items-center justify-between mb-6">
               <button onClick={() => setStep(3)} className="w-12 h-12 glass-card rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10">
                  <span className="material-symbols-rounded">arrow_back</span>
               </button>
            </div>

            <div className="flex-1 flex flex-col justify-center">
               <h2 className="text-4xl font-bold text-white mb-3">{texts.step4.title}</h2>
               <p className="text-white/50 mb-10 text-lg leading-relaxed">{texts.step4.description}</p>
               
               <div className="relative mb-10 group">
                 <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-[2.2rem] opacity-50 blur group-focus-within:opacity-100 transition-opacity duration-500"></div>
                 <textarea
                    value={brandInput}
                    onChange={(e) => setBrandInput(e.target.value)}
                    className="w-full h-56 glass-card bg-black/60 rounded-[2rem] p-6 text-lg text-white placeholder:text-white/20 resize-none transition-all relative z-10 focus:outline-none"
                    placeholder={texts.step4.placeholder}
                 />
                 <div className="absolute bottom-6 right-6 z-20 pointer-events-none">
                    <PhotoIcon className="w-6 h-6 text-white/20" />
                 </div>
               </div>
               
               <button
                  onClick={() => onFinish(brandInput)}
                  className="w-full h-16 rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold text-xl shadow-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3 border border-white/10 group">
                  <SparklesIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  {texts.step4.analyze}
               </button>
            </div>
          </div>
        );
    }
  };

  return renderStep();
};
