/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ArrowDownTrayIcon, PhotoIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
type Language = 'english' | 'arabic';

interface ImageGeneratorProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: '1. Describe Your Image',
    placeholder:
      'e.g., A cinematic, photorealistic image of an astronaut riding a horse on Mars.',
    aspect_ratio_label: 'Aspect Ratio',
    aspect_ratios: {
      '1:1': 'Square (1:1)',
      '16:9': 'Widescreen (16:9)',
      '9:16': 'Vertical (9:16)',
      '4:3': 'Landscape (4:3)',
      '3:4': 'Portrait (3:4)',
    },
    generate_title: '2. Generate',
    generate_button: 'Generate Image',
    generating: 'Generating...',
    result_title: 'Your Generated Image',
    prompt_label: 'Prompt:',
    error_title: 'Missing Prompt',
    error_message: 'Please enter a prompt to generate an image.',
    error_failed: 'Failed to generate image.',
  },
  arabic: {
    title: '١. صف صورتك',
    placeholder: 'مثال: صورة سينمائية واقعية لرائد فضاء يركب حصانًا على المريخ.',
    aspect_ratio_label: 'نسبة العرض إلى الارتفاع',
    aspect_ratios: {
      '1:1': 'مربع (١:١)',
      '16:9': 'شاشة عريضة (١٦:٩)',
      '9:16': 'عمودي (٩:١٦)',
      '4:3': 'أفقي (٤:٣)',
      '3:4': 'بورتريه (٣:٤)',
    },
    generate_title: '٢. توليد',
    generate_button: 'توليد الصورة',
    generating: 'جاري التوليد...',
    result_title: 'صورتك التي تم إنشاؤها',
    prompt_label: 'الأمر:',
    error_title: 'الأمر مفقود',
    error_message: 'يرجى إدخال أمر لتوليد صورة.',
    error_failed: 'فشل في توليد الصورة.',
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

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({language}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const texts = TEXTS[language];

  const handleGenerate = async () => {
    if (!prompt) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
      });

      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
      setGeneratedImage(imageUrl);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

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
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary"
            placeholder={texts.placeholder}
          />
          <div className="mt-4">
            <label className="block text-sm font-medium text-text-secondary mb-1">
              {texts.aspect_ratio_label}
            </label>
            <select
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
              className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
              {(Object.keys(texts.aspect_ratios) as AspectRatio[]).map((ar) => (
                <option key={ar} value={ar}>
                  {texts.aspect_ratios[ar]}
                </option>
              ))}
            </select>
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
                <PhotoIcon className="w-6 h-6" />
                <span>{texts.generate_button}</span>
              </>
            )}
          </button>
        </GlassCard>

        {generatedImage && (
          <GlassCard className="animate-fade-in">
            <h3 className="text-xl font-bold text-center text-text-dark mb-4">
              {texts.result_title}
            </h3>
            <div className="relative">
              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-auto rounded-lg"
              />
              <a
                href={generatedImage}
                download="generated-image.jpg"
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-primary-start transition-colors">
                <ArrowDownTrayIcon className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-4 p-3 bg-background-dark rounded-md">
              <p className="text-sm text-text-secondary">
                {texts.prompt_label}
              </p>
              <p className="text-text-dark italic">"{prompt}"</p>
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
};