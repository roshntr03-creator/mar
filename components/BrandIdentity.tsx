/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useEffect, useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ShieldCheckIcon} from './icons';

// Define the structure of the brand identity
interface BrandIdentityProfile {
  brandName: string;
  missionStatement: string;
  targetAudience: string;
  toneOfVoice: string[];
  coreValues: string[];
  keyKeywords: string[];
}

type Language = 'english' | 'arabic';

interface BrandIdentityProps {
  language: Language;
}

// Local storage key
const BRAND_IDENTITY_KEY = 'aiMarketingSuite_brandIdentity';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

const TEXTS: Record<Language, any> = {
  english: {
    analyzeNewBrand: 'Analyze New Brand',
    targetAudience: 'Target Audience',
    toneOfVoice: 'Tone of Voice',
    coreValues: 'Core Values',
    keyKeywords: 'Key Keywords',
    provideInfoTitle: '1. Provide Brand Information',
    provideInfoDesc:
      "Enter your company's website URL or paste a description of your brand, mission, and products.",
    placeholder:
      "e.g., https://www.example.com or 'We sell sustainable, high-quality basics for modern professionals...'",
    defineIdentityTitle: '2. Define Your Brand Identity',
    analyzeAndSave: 'Analyze & Save Brand',
    analyzing: 'Analyzing...',
    inputRequiredTitle: 'Input Required',
    inputRequiredDesc: 'Please provide a website URL or company description.',
    analysisFailed: 'Analysis Failed',
  },
  arabic: {
    analyzeNewBrand: 'تحليل علامة تجارية جديدة',
    targetAudience: 'الجمهور المستهدف',
    toneOfVoice: 'نبرة الصوت',
    coreValues: 'القيم الأساسية',
    keyKeywords: 'الكلمات المفتاحية الرئيسية',
    provideInfoTitle: '١. قدم معلومات العلامة التجارية',
    provideInfoDesc:
      'أدخل عنوان موقع شركتك أو الصق وصفًا لعلامتك التجارية ورسالتها ومنتجاتها.',
    placeholder:
      'مثال: https://www.example.com أو "نحن نبيع أساسيات مستدامة وعالية الجودة للمهنيين العصريين..."',
    defineIdentityTitle: '٢. حدد هوية علامتك التجارية',
    analyzeAndSave: 'تحليل وحفظ العلامة التجارية',
    analyzing: 'جاري التحليل...',
    inputRequiredTitle: 'الإدخال مطلوب',
    inputRequiredDesc: 'يرجى تقديم عنوان موقع ويب أو وصف للشركة.',
    analysisFailed: 'فشل التحليل',
  },
};

const Card: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark rounded-xl border border-border-dark shadow-lg ${className}`}>
    {children}
  </div>
);

export const BrandIdentity: React.FC<BrandIdentityProps> = ({language}) => {
  // State variables
  const [analysisInput, setAnalysisInput] = useState('');
  const [savedProfile, setSavedProfile] =
    useState<BrandIdentityProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const texts = TEXTS[language];

  // Load saved profile from localStorage on component mount
  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(BRAND_IDENTITY_KEY);
      if (storedProfile) {
        setSavedProfile(JSON.parse(storedProfile));
      }
    } catch (e) {
      console.error('Failed to parse brand identity from local storage', e);
      localStorage.removeItem(BRAND_IDENTITY_KEY);
    }
  }, []);

  // Gemini API call logic
  const handleAnalyze = async () => {
    if (!analysisInput.trim()) {
      setError([texts.inputRequiredTitle, texts.inputRequiredDesc]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro', // Using pro for better analysis
        contents: `Analyze the following company information to define its brand identity. The information could be a URL or a block of text. Extract the key elements of their brand.

        Company Information: "${analysisInput}"`,
        config: {
          systemInstruction:
            'You are a senior brand strategist. Your task is to analyze company information and distill it into a structured brand identity profile. Be concise and insightful.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              brandName: {type: Type.STRING},
              missionStatement: {type: Type.STRING},
              targetAudience: {type: Type.STRING},
              toneOfVoice: {type: Type.ARRAY, items: {type: Type.STRING}},
              coreValues: {type: Type.ARRAY, items: {type: Type.STRING}},
              keyKeywords: {type: Type.ARRAY, items: {type: Type.STRING}},
            },
            required: [
              'brandName',
              'missionStatement',
              'targetAudience',
              'toneOfVoice',
              'coreValues',
              'keyKeywords',
            ],
          },
        },
      });

      const parsedProfile = JSON.parse(response.text) as BrandIdentityProfile;
      setSavedProfile(parsedProfile);
      // Automatically save the new profile
      localStorage.setItem(BRAND_IDENTITY_KEY, JSON.stringify(parsedProfile));
    } catch (e: any) {
      console.error(e);
      setError([texts.analysisFailed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearProfile = () => {
    localStorage.removeItem(BRAND_IDENTITY_KEY);
    setSavedProfile(null);
    setAnalysisInput('');
  };

  const AnalysisCard = ({
    title,
    content,
  }: {
    title: string;
    content: string | string[];
  }) => (
    <div className="bg-background-dark rounded-lg p-4">
      <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mb-2">
        {title}
      </h4>
      {Array.isArray(content) ? (
        <ul className="space-y-1 list-disc list-inside">
          {content.map((item, index) => (
            <li key={index} className="text-text-secondary">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-text-secondary">{content}</p>
      )}
    </div>
  );

  if (savedProfile && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-24">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-3xl font-bold text-gradient flex items-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-primary" />
              <span>{savedProfile.brandName}</span>
            </h3>
            <button
              onClick={handleClearProfile}
              className="px-4 py-2 rounded-lg bg-border-dark hover:bg-border-dark/70 text-text-dark font-semibold text-sm transition-colors flex-shrink-0">
              {texts.analyzeNewBrand}
            </button>
          </div>
          <p className="text-text-secondary italic text-center mb-6 p-4 bg-background-dark rounded-md">
            "{savedProfile.missionStatement}"
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnalysisCard
              title={texts.targetAudience}
              content={savedProfile.targetAudience}
            />
            <AnalysisCard
              title={texts.toneOfVoice}
              content={savedProfile.toneOfVoice}
            />
            <AnalysisCard
              title={texts.coreValues}
              content={savedProfile.coreValues}
            />
            <AnalysisCard
              title={texts.keyKeywords}
              content={savedProfile.keyKeywords}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in pb-24">
      {error && (
        <ErrorModal
          title={error[0]}
          message={error.slice(1)}
          onClose={() => setError(null)}
          onSelectKey={() => {}}
          addKeyButtonText="Add API Key"
          closeButtonText="Close"
        />
      )}
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-3">
            {texts.provideInfoTitle}
          </h3>
          <p className="text-sm text-text-secondary mb-4">
            {texts.provideInfoDesc}
          </p>
          <textarea
            value={analysisInput}
            onChange={(e) => setAnalysisInput(e.target.value)}
            className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-40 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
            placeholder={texts.placeholder}
          />
        </Card>
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.defineIdentityTitle}
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>{texts.analyzing}</span>
              </>
            ) : (
              <>
                <ShieldCheckIcon className="w-6 h-6" />
                <span>{texts.analyzeAndSave}</span>
              </>
            )}
          </button>
        </Card>
      </div>
    </div>
  );
};