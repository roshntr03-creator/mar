/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ClipboardIcon, LightbulbIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

interface EnhancedPromptData {
  subject: string;
  style: string;
  composition: string;
  lighting: string;
  colorPalette: string;
  mood: string;
  negativePrompt: string;
}

type Language = 'english' | 'arabic';

interface PromptEnhancerProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: 'Your Simple Idea',
    placeholder: 'e.g., a cat in a library',
    enhance_button: 'Enhance Prompt',
    enhancing: 'Enhancing...',
    result_title: 'Enhanced Prompt Breakdown',
    copy_button: 'Copy Full Prompt',
    copied: 'Copied!',
    labels: {
      subject: 'Subject',
      style: 'Style',
      composition: 'Composition',
      lighting: 'Lighting',
      colorPalette: 'Color Palette',
      mood: 'Mood',
      negativePrompt: 'Negative Prompt',
    },
    error_title: 'Missing Prompt',
    error_message: 'Please enter a simple prompt or idea to enhance.',
    error_failed: 'Failed to enhance prompt.',
  },
  arabic: {
    title: 'فكرتك البسيطة',
    placeholder: 'مثال: قطة في مكتبة',
    enhance_button: 'تحسين الأمر',
    enhancing: 'جاري التحسين...',
    result_title: 'تفصيل الأمر المحسن',
    copy_button: 'نسخ الأمر بالكامل',
    copied: 'تم النسخ!',
    labels: {
      subject: 'الموضوع',
      style: 'النمط',
      composition: 'التكوين',
      lighting: 'الإضاءة',
      colorPalette: 'لوحة الألوان',
      mood: 'الحالة المزاجية',
      negativePrompt: 'أمر سلبي',
    },
    error_title: 'الأمر مفقود',
    error_message: 'يرجى إدخال أمر بسيط أو فكرة لتحسينها.',
    error_failed: 'فشل في تحسين الأمر.',
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

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({language}) => {
  const [simplePrompt, setSimplePrompt] = useState('');
  const [enhancedPromptData, setEnhancedPromptData] =
    useState<EnhancedPromptData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const texts = TEXTS[language];

  const handleEnhance = async () => {
    if (!simplePrompt) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setEnhancedPromptData(null);

    try {
      const systemInstruction =
        language === 'arabic'
          ? 'أنت خبير عالمي في هندسة الأوامر. مهمتك هي أخذ فكرة أو أمر بسيط من المستخدم وتحويله إلى أمر مفصل ومنظم وفعال لنموذج صور AI متقدم. قم بتقسيم الأمر إلى الفئات التالية: الموضوع، النمط، التكوين، الإضاءة، لوحة الألوان، الحالة المزاجية، والأمر السلبي. املأ كل فئة بتفاصيل غنية ووصفية بناءً على مدخلات المستخدم لضمان نتيجة فنية عالية الجودة.'
          : "You are a world-class prompt engineering expert. Your task is to take a user's simple idea or prompt and transform it into a detailed, structured, and effective prompt for an advanced generative AI image model. Break down the prompt into the following categories: subject, style, composition, lighting, color palette, mood, and negative prompt. Fill each category with rich, descriptive details based on the user's input to ensure a high-quality, artistic result.";

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `User's simple prompt: "${simplePrompt}"`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subject: {
                type: Type.STRING,
                description:
                  'The main subject of the prompt, described in detail.',
              },
              style: {
                type: Type.STRING,
                description:
                  'The artistic style (e.g., Photorealistic, Anime, Impressionistic, 3D Render).',
              },
              composition: {
                type: Type.STRING,
                description:
                  'The camera angle and composition (e.g., Close-up, Wide shot, Rule of thirds).',
              },
              lighting: {
                type: Type.STRING,
                description:
                  'The lighting conditions (e.g., Golden hour, Studio lighting, Cinematic lighting).',
              },
              colorPalette: {
                type: Type.STRING,
                description:
                  'The dominant colors or color scheme (e.g., Vibrant, Muted, Monochromatic).',
              },
              mood: {
                type: Type.STRING,
                description:
                  'The overall mood or atmosphere (e.g., Serene, Dramatic, Mysterious).',
              },
              negativePrompt: {
                type: Type.STRING,
                description: 'Elements to exclude from the result.',
              },
            },
            required: [
              'subject',
              'style',
              'composition',
              'lighting',
              'colorPalette',
              'mood',
              'negativePrompt',
            ],
          },
        },
      });
      const parsed = JSON.parse(response.text);
      setEnhancedPromptData(parsed);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!enhancedPromptData) return;
    const fullPrompt = [
      enhancedPromptData.subject,
      enhancedPromptData.style,
      enhancedPromptData.composition,
      enhancedPromptData.lighting,
      enhancedPromptData.colorPalette,
      enhancedPromptData.mood,
    ]
      .filter(Boolean)
      .join(', ');

    const finalPromptString = `${fullPrompt} --no ${enhancedPromptData.negativePrompt}`;
    navigator.clipboard.writeText(finalPromptString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const PromptDetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div className="px-4 py-4 sm:px-6 border-b border-border-dark sm:grid sm:grid-cols-3 sm:gap-4 last:border-b-0">
      <dt className="text-sm font-semibold text-gradient uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-text-dark sm:mt-0 sm:col-span-2">
        {value}
      </dd>
    </div>
  );

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
        <GlassCard>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.title}
          </h3>
          <textarea
            value={simplePrompt}
            onChange={(e) => setSimplePrompt(e.target.value)}
            className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary"
            placeholder={texts.placeholder}
          />
        </GlassCard>

        <div className="text-center">
          <button
            onClick={handleEnhance}
            disabled={isLoading}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>{texts.enhancing}</span>
              </>
            ) : (
              <>
                <LightbulbIcon className="w-6 h-6" />
                <span>{texts.enhance_button}</span>
              </>
            )}
          </button>
        </div>

        {enhancedPromptData && (
          <GlassCard className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-text-dark">
                {texts.result_title}
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-border-dark hover:bg-primary text-text-dark font-semibold rounded-md transition-colors">
                <ClipboardIcon className="w-4 h-4" />
                <span>{isCopied ? texts.copied : texts.copy_button}</span>
              </button>
            </div>

            <dl className="bg-background-dark rounded-lg overflow-hidden">
              <PromptDetailRow
                label={texts.labels.subject}
                value={enhancedPromptData.subject}
              />
              <PromptDetailRow
                label={texts.labels.style}
                value={enhancedPromptData.style}
              />
              <PromptDetailRow
                label={texts.labels.composition}
                value={enhancedPromptData.composition}
              />
              <PromptDetailRow
                label={texts.labels.lighting}
                value={enhancedPromptData.lighting}
              />
              <PromptDetailRow
                label={texts.labels.colorPalette}
                value={enhancedPromptData.colorPalette}
              />
              <PromptDetailRow
                label={texts.labels.mood}
                value={enhancedPromptData.mood}
              />
              <PromptDetailRow
                label={texts.labels.negativePrompt}
                value={enhancedPromptData.negativePrompt}
              />
            </dl>
          </GlassCard>
        )}
      </div>
    </div>
  );
};