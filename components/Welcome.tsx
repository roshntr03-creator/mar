/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';

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
      title: 'Unlock Your Marketing Potential',
      description:
        'Harness the power of AI to create, manage, and grow your brand with ease.',
      getStarted: 'Get Started',
    },
    step2: {
      title: 'Unlock Your Marketing Superpowers',
      ideasTitle: 'AI-Powered Ideas',
      ideasDesc: 'Generate social media posts, ad copy, and more in seconds.',
      schedulingTitle: 'Smart Scheduling',
      schedulingDesc: 'Plan and automate your content calendar effortlessly.',
      analyticsTitle: 'Performance Analytics',
      analyticsDesc: 'Track your growth with easy-to-understand insights.',
      next: 'Next',
      skip: 'Skip',
    },
    step3: {
      title: 'Personalize Your AI',
      description:
        "Define your brand's identity to help the AI generate more relevant and on-brand marketing materials.",
      startProfile: 'Continue',
      maybeLater: 'Maybe Later',
    },
    step4: {
      headerTitle: 'Define Your Brand',
      title: 'Tell us about your brand',
      description:
        'Enter your website URL or a brief description of your brand.',
      placeholder:
        "e.g., www.example.com or 'A cafe that sells coffee and pastries'",
      analyze: 'Analyze & Save Brand',
    },
  },
  arabic: {
    step1: {
      title: 'أطلق العنان لإمكانياتك التسويقية',
      description:
        'استغل قوة الذكاء الاصطناعي لإنشاء علامتك التجارية وإدارتها وتنميتها بكل سهولة.',
      getStarted: 'ابدأ الآن',
    },
    step2: {
      title: 'أطلق العنان لقواك التسويقية الخارقة',
      ideasTitle: 'أفكار مدعومة بالذكاء الاصطناعي',
      ideasDesc:
        'أنشئ منشورات لوسائل التواصل الاجتماعي، ونصوص إعلانية، والمزيد في ثوانٍ.',
      schedulingTitle: 'جدولة ذكية',
      schedulingDesc: 'خطط وأتمتة تقويم المحتوى الخاص بك دون عناء.',
      analyticsTitle: 'تحليلات الأداء',
      analyticsDesc: 'تتبع نموك من خلال رؤى سهلة الفهم.',
      next: 'التالي',
      skip: 'تخطي',
    },
    step3: {
      title: 'خصص الذكاء الاصطناعي الخاص بك',
      description:
        'حدد هوية علامتك التجارية لمساعدة الذكاء الاصطناعي على إنشاء مواد تسويقية أكثر صلة وعلامتك التجارية.',
      startProfile: 'متابعة',
      maybeLater: 'ربما لاحقًا',
    },
    step4: {
      headerTitle: 'حدد علامتك التجارية',
      title: 'أخبرنا عن علامتك التجارية',
      description:
        'أدخل عنوان URL لموقعك على الويب أو وصفًا موجزًا لعلامتك التجارية.',
      placeholder: "مثال: www.example.com أو 'مقهى يبيع القهوة والمعجنات'",
      analyze: 'تحليل وحفظ العلامة التجارية',
    },
  },
};

const LanguageSwitcher: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
}> = ({language, setLanguage}) => (
  <div className="flex w-fit items-center gap-1 rounded-full bg-component-dark/50 p-1 border border-border-dark">
    <button
      onClick={() => setLanguage('english')}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
        language === 'english'
          ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
          : 'text-text-secondary hover:bg-border-dark'
      }`}>
      EN
    </button>
    <button
      onClick={() => setLanguage('arabic')}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
        language === 'arabic'
          ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
          : 'text-text-secondary hover:bg-border-dark'
      }`}>
      AR
    </button>
  </div>
);

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
          <div
            dir={dir}
            className="relative flex h-screen min-h-screen w-full flex-col bg-background-dark text-text-dark group/design-root overflow-hidden font-display">
            <div className="flex-grow flex flex-col justify-center items-center p-4">
              <div className="flex items-center p-4 pb-2 justify-between w-full">
                <LanguageSwitcher
                  language={language}
                  setLanguage={setLanguage}
                />
                <div className="text-primary flex size-12 shrink-0 items-center justify-end">
                  <span className="material-symbols-outlined text-3xl">
                    auto_awesome
                  </span>
                </div>
              </div>
              <div className="flex-grow flex flex-col justify-center items-center px-4">
                <h1 className="text-text-dark tracking-light text-4xl font-bold leading-tight text-center pb-3 pt-6">
                  {texts.step1.title}
                </h1>
                <p className="text-text-secondary text-base font-normal leading-normal pb-3 pt-1 text-center max-w-sm">
                  {texts.step1.description}
                </p>
              </div>
            </div>
            <div className="pb-8">
              <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
              </div>
              <div className="flex px-4 py-3 justify-center">
                <button
                  onClick={() => setStep(2)}
                  className="flex w-full max-w-sm cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-gradient-to-r from-primary-start to-primary-end text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                  <span className="truncate">{texts.step1.getStarted}</span>
                </button>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div
            dir={dir}
            className="relative flex flex-col h-screen w-full bg-background-dark text-text-dark overflow-x-hidden font-display">
            <div className="flex-grow flex flex-col justify-center px-4">
              <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
              </div>
              <h1 className="text-text-dark tracking-tight text-3xl font-bold leading-tight px-4 text-center pb-8 pt-6">
                {texts.step2.title}
              </h1>
              <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-component-dark/30 border border-white/10 backdrop-blur-lg shadow-lg">
                    <div className="text-primary flex items-center justify-center rounded-lg bg-border-dark shrink-0 size-12">
                      <span className="material-symbols-outlined">psychology</span>
                    </div>
                    <div>
                      <p className="text-text-dark text-base font-medium leading-normal">{texts.step2.ideasTitle}</p>
                      <p className="text-text-secondary text-sm font-normal leading-normal">{texts.step2.ideasDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-component-dark/30 border border-white/10 backdrop-blur-lg shadow-lg">
                    <div className="text-primary flex items-center justify-center rounded-lg bg-border-dark shrink-0 size-12">
                      <span className="material-symbols-outlined">calendar_month</span>
                    </div>
                    <div>
                      <p className="text-text-dark text-base font-medium leading-normal">{texts.step2.schedulingTitle}</p>
                      <p className="text-text-secondary text-sm font-normal leading-normal">{texts.step2.schedulingDesc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-component-dark/30 border border-white/10 backdrop-blur-lg shadow-lg">
                    <div className="text-primary flex items-center justify-center rounded-lg bg-border-dark shrink-0 size-12">
                      <span className="material-symbols-outlined">analytics</span>
                    </div>
                    <div>
                      <p className="text-text-dark text-base font-medium leading-normal">{texts.step2.analyticsTitle}</p>
                      <p className="text-text-secondary text-sm font-normal leading-normal">{texts.step2.analyticsDesc}</p>
                    </div>
                  </div>
              </div>
            </div>
            <div className="px-4 pb-8 pt-4">
              <button
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold py-4 px-4 rounded-xl text-lg hover:opacity-90 transition-opacity">
                {texts.step2.next}
              </button>
              <button
                onClick={() => onFinish()}
                className="w-full text-text-secondary font-semibold py-4 px-4 rounded-lg text-base">
                {texts.step2.skip}
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div
            dir={dir}
            className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark group/design-root overflow-hidden font-display">
            <div className="flex-grow flex flex-col justify-center items-center px-4">
              <div className="flex w-full justify-center items-center aspect-square max-h-64 my-8">
                 <div className="w-64 h-64 rounded-full bg-gradient-to-br from-primary-start to-primary-end animate-aurora"></div>
              </div>
              <h1 className="text-text-dark tracking-light text-4xl font-bold leading-tight px-4 text-center pb-3 pt-6">
                {texts.step3.title}
              </h1>
              <p className="text-text-secondary text-base font-normal leading-normal pb-3 pt-1 px-4 text-center">
                {texts.step3.description}
              </p>
            </div>
            <div className="w-full pb-4">
              <div className="flex w-full flex-row items-center justify-center gap-3 py-5">
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
                <div className="h-2 w-2 rounded-full bg-border-dark"></div>
                <div className="h-2 w-2 rounded-full bg-primary"></div>
              </div>
              <div className="flex px-4 py-3 justify-center">
                <button
                  onClick={() => setStep(4)}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 flex-1 bg-gradient-to-r from-primary-start to-primary-end text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                  <span className="truncate">{texts.step3.startProfile}</span>
                </button>
              </div>
              <div className="flex justify-center px-4 py-2">
                <button
                  onClick={() => onFinish()}
                  className="text-text-secondary text-sm font-medium">
                  {texts.step3.maybeLater}
                </button>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div
            dir={dir}
            className="relative flex h-auto min-h-screen w-full flex-col bg-background-dark text-text-dark group/design-root overflow-x-hidden font-display">
            <div className="flex items-center p-4 pb-2 justify-between">
              <h2 className="text-text-dark text-lg font-bold">
                {texts.step4.headerTitle}
              </h2>
              <LanguageSwitcher
                  language={language}
                  setLanguage={setLanguage}
                />
            </div>
            <div className="flex-grow p-4 flex flex-col justify-center">
              <h1
                className={`text-text-dark tracking-light text-4xl font-bold leading-tight pb-3 ${
                  language === 'arabic' ? 'text-right' : 'text-left'
                }`}>
                {texts.step4.title}
              </h1>
              <p
                className={`text-text-secondary text-base font-normal leading-normal pb-6 ${
                  language === 'arabic' ? 'text-right' : 'text-left'
                }`}>
                {texts.step4.description}
              </p>
              <textarea
                value={brandInput}
                onChange={(e) => setBrandInput(e.target.value)}
                className={`form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-dark bg-component-dark/50 backdrop-blur-sm focus:border-primary min-h-36 placeholder:text-text-secondary p-4 text-base font-normal leading-normal ${
                  language === 'arabic' ? 'text-right' : 'text-left'
                }`}
                placeholder={texts.step4.placeholder}
              />
              <button
                onClick={() => onFinish(brandInput)}
                className="flex min-w-[84px] max-w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 mt-6 bg-gradient-to-r from-primary-start to-primary-end text-white text-base font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity">
                {texts.step4.analyze}
              </button>
            </div>
          </div>
        );
    }
  };

  return renderStep();
};