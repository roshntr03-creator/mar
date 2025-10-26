/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {MegaphoneIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

interface CampaignIdea {
  campaignName: string;
  description: string;
  channels: string[];
  keyMessaging: string;
}

type Language = 'english' | 'arabic';

interface CampaignsProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: '1. Describe Your Business',
    product_placeholder:
      'e.g., An eco-friendly subscription box for coffee lovers.',
    audience_placeholder:
      'e.g., Millennials aged 25-35 who live in urban areas and value sustainability.',
    generate_title: '2. Generate Strategy',
    generate_button: 'Generate Campaign Ideas',
    generating: 'Generating...',
    blueprints_title: 'Your Campaign Blueprints',
    key_messaging: 'Key Messaging',
    channels: 'Channels',
    error_title: 'Missing Information',
    error_message: 'Please describe your product and target audience.',
    error_failed: 'Failed to generate ideas.',
  },
  arabic: {
    title: '١. صف عملك',
    product_placeholder: 'مثال: صندوق اشتراك صديق للبيئة لعشاق القهوة.',
    audience_placeholder:
      'مثال: جيل الألفية الذين تتراوح أعمارهم بين 25-35 عامًا ويعيشون في المناطق الحضرية ويقدرون الاستدامة.',
    generate_title: '٢. توليد الاستراتيجية',
    generate_button: 'توليد أفكار الحملات',
    generating: 'جاري التوليد...',
    blueprints_title: 'مخططات حملتك',
    key_messaging: 'الرسائل الرئيسية',
    channels: 'القنوات',
    error_title: 'معلومات ناقصة',
    error_message: 'يرجى وصف منتجك والجمهور المستهدف.',
    error_failed: 'فشل في توليد الأفكار.',
  },
};

const GlassCard: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark/30 rounded-xl border border-white/10 backdrop-blur-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const Campaigns: React.FC<CampaignsProps> = ({language}) => {
  const [product, setProduct] = useState('');
  const [audience, setAudience] = useState('');
  const [ideas, setIdeas] = useState<CampaignIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);

  const texts = TEXTS[language];

  const handleGenerate = async () => {
    if (!product || !audience) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const prompt =
        language === 'arabic'
          ? `
        ابتكر 3 أفكار حملات تسويقية مميزة للمنتج والجمهور التاليين.
        المنتج/الخدمة: "${product}"
        الجمهور المستهدف: "${audience}"
        لكل فكرة، قدم اسم الحملة، وصفًا موجزًا، قنوات التسويق الرئيسية، والرسالة الأساسية.
      `
          : `
        Brainstorm 3 distinct marketing campaign ideas for the following product and audience.
        Product/Service: "${product}"
        Target Audience: "${audience}"
        For each idea, provide a campaign name, a brief description, the primary marketing channels, and the key messaging.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              campaignIdeas: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    campaignName: {type: Type.STRING},
                    description: {type: Type.STRING},
                    channels: {type: Type.ARRAY, items: {type: Type.STRING}},
                    keyMessaging: {type: Type.STRING},
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text);
      setIdeas(parsed.campaignIdeas);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-24">
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
        <GlassCard>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.title}
          </h3>
          <div className="space-y-4">
            <textarea
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-24 focus:ring-primary/50 focus:border-primary"
              placeholder={texts.product_placeholder}
            />
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-24 focus:ring-primary/50 focus:border-primary"
              placeholder={texts.audience_placeholder}
            />
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.generate_title}
          </h3>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>{texts.generating}</span>
              </>
            ) : (
              <>
                <MegaphoneIcon className="w-6 h-6" />
                <span>{texts.generate_button}</span>
              </>
            )}
          </button>
        </GlassCard>

        {ideas.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold text-center text-text-dark">
              {texts.blueprints_title}
            </h3>
            {ideas.map((idea, index) => (
              <GlassCard key={index}>
                <h4 className="text-xl font-bold text-gradient mb-2">
                  {idea.campaignName}
                </h4>
                <p className="text-text-secondary mb-4 text-base leading-relaxed">
                  {idea.description}
                </p>
                <div className="mb-4 p-4 bg-background-dark rounded-lg">
                  <h5 className="font-semibold text-text-dark text-sm uppercase tracking-wide">
                    {texts.key_messaging}
                  </h5>
                  <p className="text-text-secondary italic mt-1">
                    "{idea.keyMessaging}"
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-text-dark text-sm uppercase tracking-wide mb-2">
                    {texts.channels}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {idea.channels.map((channel) => (
                      <span
                        key={channel}
                        className="px-3 py-1 bg-border-dark text-text-dark text-sm rounded-full font-medium">
                        {channel}
                      </span>
                    ))}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};