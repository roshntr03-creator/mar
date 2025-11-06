/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useState} from 'react';
import {PageProps} from '../App';
import {addCreationJob} from '../services/creationManager';
import {CreationJob, PromoVideoJobDetails} from '../types';
import {ErrorModal} from './ErrorModal';
import {ClapperboardIcon} from './icons';

const SCRIPT_MODEL_NAME = 'gemini-2.5-flash';

type AspectRatio = '9:16' | '16:9';
type VideoStyle =
  | 'Cinematic'
  | 'Realistic'
  | 'Documentary'
  | 'Vintage Film'
  | 'Hyper-realistic'
  | 'Animated';
type Pacing = 'Normal Pacing' | 'Slow Motion' | 'Fast-Paced' | 'Time-lapse';
type VideoLengthOption = '10s' | '15s' | '2x15s';

interface PromoVideoProps extends PageProps {}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    saving_title: 'Generating Your Promo Video...',
    saving_message:
      'This process can take a few minutes. Our AI is working hard on creating your visual masterpiece. Please keep this page open.',
    ready_title: 'Your Promo Video is Ready!',
    part: 'Part',
    create_another: 'Create Another Video',
    describe_title: '1. Describe Your Video',
    placeholder:
      'e.g., A dramatic slow-motion shot of a drop of water landing on a leaf, with morning sunlight filtering through trees.',
    details_title: '2. Set Video Details',
    aspect_ratio: 'Aspect Ratio',
    aspect_ratios: {
      '9:16': 'Vertical (9:16)',
      '16:9': 'Widescreen (16:9)',
    },
    style: 'Video Style',
    styles: {
      Cinematic: 'Cinematic',
      Realistic: 'Realistic',
      Documentary: 'Documentary',
      'Vintage Film': 'Vintage Film',
      'Hyper-realistic': 'Hyper-realistic',
      Animated: 'Animated',
    },
    pacing: 'Pacing',
    pacings: {
      'Normal Pacing': 'Normal Pacing',
      'Slow Motion': 'Slow Motion',
      'Fast-Paced': 'Fast-Paced',
      'Time-lapse': 'Time-lapse',
    },
    structure: 'Video Length',
    structures: {
      '10s': '10 seconds',
      '15s': '15 seconds',
      '2x15s': '2 parts x 15s (30s total)',
    },
    generate_title: '3. Generate Video',
    generate_button: 'Generate Video',
    error_title: 'Missing Prompt',
    error_message: 'Please describe the video you want to create.',
    error_failed: 'Failed to generate video.',
  },
  arabic: {
    saving_title: 'جاري إنشاء الفيديو الترويجي الخاص بك...',
    saving_message:
      'قد تستغرق هذه العملية بضع دقائق. يعمل الذكاء الاصطناعي لدينا بجد لإنشاء تحفتك البصرية. يرجى إبقاء هذه الصفحة مفتوحة.',
    ready_title: 'الفيديو الترويجي الخاص بك جاهز!',
    part: 'الجزء',
    create_another: 'إنشاء فيديو آخر',
    describe_title: '١. صف الفيديو الخاص بك',
    placeholder:
      'مثال: لقطة درامية بالحركة البطيئة لقطرة ماء تسقط على ورقة شجر، مع تسلل ضوء شمس الصباح من خلال الأشجار.',
    details_title: '٢. تعيين تفاصيل الفيديو',
    aspect_ratio: 'نسبة العرض إلى الارتفاع',
    aspect_ratios: {
      '9:16': 'عمودي (٩:١٦)',
      '16:9': 'شاشة عريضة (١٦:٩)',
    },
    style: 'نمط الفيديو',
    styles: {
      Cinematic: 'سينمائي',
      Realistic: 'واقعي',
      Documentary: 'وثائقي',
      'Vintage Film': 'فيلم قديم',
      'Hyper-realistic': 'واقعي للغاية',
      Animated: 'رسوم متحركة',
    },
    pacing: 'سرعة الإيقاع',
    pacings: {
      'Normal Pacing': 'إيقاع عادي',
      'Slow Motion': 'حركة بطيئة',
      'Fast-Paced': 'إيقاع سريع',
      'Time-lapse': 'فاصل زمني',
    },
    structure: 'مدة الفيديو',
    structures: {
      '10s': '10 ثوانٍ',
      '15s': '15 ثانية',
      '2x15s': 'جزئين × 15 ثانية (إجمالي 30 ثانية)',
    },
    generate_title: '٣. توليد الفيديو',
    generate_button: 'توليد الفيديو',
    error_title: 'الأمر مفقود',
    error_message: 'يرجى وصف الفيديو الذي تريد إنشاءه.',
    error_failed: 'فشل في توليد الفيديو.',
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

async function splitVideoPrompt(
  prompt: string,
  language: 'english' | 'arabic',
): Promise<[string, string]> {
  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
  const splitRequestPrompt = `You are a creative director. Split the following video concept into two balanced, logical parts for two separate 15-second videos. Return ONLY a valid JSON array with two strings. Video Concept: "${prompt}"`;

  try {
    const response = await ai.models.generateContent({
      model: SCRIPT_MODEL_NAME,
      contents: {parts: [{text: splitRequestPrompt}]},
      config: {
        responseMimeType: 'application/json',
        responseSchema: {type: Type.ARRAY, items: {type: Type.STRING}},
      },
    });

    const parts = JSON.parse(response.text);
    if (Array.isArray(parts) && parts.length === 2) {
      return parts as [string, string];
    }
  } catch (e) {
    console.error('Failed to parse split prompt from AI, splitting manually:', e);
  }
  const sentences = prompt.match(/[^.!?]+[.!?]+/g) || [prompt];
  if (sentences.length < 2) {
    const words = prompt.split(' ');
    const midPoint = Math.ceil(words.length / 2);
    return [words.slice(0, midPoint).join(' '), words.slice(midPoint).join(' ')];
  }
  const midPoint = Math.ceil(sentences.length / 2);
  return [sentences.slice(0, midPoint).join(' '), sentences.slice(midPoint).join(' ')];
}

export const PromoVideo: React.FC<PromoVideoProps> = ({
  language,
  setActiveTab,
}) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string[] | null>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('Cinematic');
  const [pacing, setPacing] = useState<Pacing>('Normal Pacing');
  const [videoLengthOption, setVideoLengthOption] =
    useState<VideoLengthOption>('10s');
  const texts = TEXTS[language];

  const handleGenerate = async () => {
    if (!prompt || !setActiveTab) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setError(null);

    const promptsToProcess: {prompt: string; part: number; total: number}[] =
      [];
    let n_frames = 10;

    if (videoLengthOption === '10s') {
      promptsToProcess.push({prompt, part: 1, total: 1});
      n_frames = 10;
    } else if (videoLengthOption === '15s') {
      promptsToProcess.push({prompt, part: 1, total: 1});
      n_frames = 15;
    } else {
      // 2x15s
      const [part1, part2] = await splitVideoPrompt(prompt, language);
      promptsToProcess.push({prompt: part1, part: 1, total: 2});
      promptsToProcess.push({prompt: part2, part: 2, total: 2});
      n_frames = 15;
    }

    const details: PromoVideoJobDetails = {
      prompts: promptsToProcess,
      aspectRatio,
      videoStyle,
      pacing,
      n_frames,
    };

    const newJob: CreationJob = {
      id: `promo_${new Date().toISOString()}`,
      type: 'promo_video',
      status: 'pending',
      createdAt: new Date().toISOString(),
      title: prompt.substring(0, 50) + '...',
      details,
      thumbnailUrl: '', // No image for promo video, handled in Creations component
    };

    addCreationJob(newJob);
    setActiveTab('creations');
    // Reset form
    setPrompt('');
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
            {texts.describe_title}
          </h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-40 focus:ring-primary/50 focus:border-primary"
            placeholder={texts.placeholder}
          />
          <h4 className="text-md font-semibold text-text-dark mt-6 mb-3">
            {texts.details_title}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.aspect_ratio}
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
                {(Object.keys(texts.aspect_ratios) as AspectRatio[]).map(
                  (ar) => (
                    <option key={ar} value={ar}>
                      {texts.aspect_ratios[ar]}
                    </option>
                  ),
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.style}
              </label>
              <select
                value={videoStyle}
                onChange={(e) => setVideoStyle(e.target.value as VideoStyle)}
                className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
                {(Object.keys(texts.styles) as VideoStyle[]).map((style) => (
                  <option key={style} value={style}>
                    {texts.styles[style]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.pacing}
              </label>
              <select
                value={pacing}
                onChange={(e) => setPacing(e.target.value as Pacing)}
                className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
                {(Object.keys(texts.pacings) as Pacing[]).map((pacing) => (
                  <option key={pacing} value={pacing}>
                    {texts.pacings[pacing]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.structure}
              </label>
              <select
                value={videoLengthOption}
                onChange={(e) =>
                  setVideoLengthOption(e.target.value as VideoLengthOption)
                }
                className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
                {(Object.keys(texts.structures) as VideoLengthOption[]).map(
                  (structure) => (
                    <option key={structure} value={structure}>
                      {texts.structures[structure]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.generate_title}
          </h3>
          <button
            onClick={handleGenerate}
            disabled={!prompt}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <ClapperboardIcon className="w-6 h-6" />
            <span>{texts.generate_button}</span>
          </button>
        </GlassCard>
      </div>
    </div>
  );
};