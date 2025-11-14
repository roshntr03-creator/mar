/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useEffect, useRef, useState} from 'react';
import {PageProps} from '../App';
import {addCreationJob} from '../services/creationManager';
import {CreationJob, PromoVideoJobDetails} from '../types';
import {ErrorModal} from './ErrorModal';
import {ClapperboardIcon, UploadIcon} from './icons';

const SCRIPT_MODEL_NAME = 'gemini-2.5-flash';

type Mode = 'text' | 'image';
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

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    mode: {
      text: 'Text to Video',
      image: 'Image to Video',
    },
    describe_title: '1. Describe Your Video',
    image_prompt_placeholder: 'e.g., A dog wearing sunglasses on a skateboard.',
    text_prompt_placeholder:
      'e.g., A dramatic slow-motion shot of a drop of water landing on a leaf, with morning sunlight filtering through trees.',
    upload_cta: 'Click to upload an image',
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
    error_title_prompt: 'Missing Prompt',
    error_message_prompt: 'Please describe the video you want to create.',
    error_title_image: 'Missing Image',
    error_message_image: 'Please upload an image to generate the video from.',
    error_failed: 'Failed to generate video.',
  },
  arabic: {
    mode: {
      text: 'نص إلى فيديو',
      image: 'صورة إلى فيديو',
    },
    describe_title: '١. صف الفيديو الخاص بك',
    image_prompt_placeholder: 'مثال: كلب يرتدي نظارة شمسية على لوح تزلج.',
    text_prompt_placeholder:
      'مثال: لقطة درامية بالحركة البطيئة لقطرة ماء تسقط على ورقة شجر، مع تسلل ضوء شمس الصباح من خلال الأشجار.',
    upload_cta: 'انقر لرفع صورة',
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
    error_title_prompt: 'الأمر مفقود',
    error_message_prompt: 'يرجى وصف الفيديو الذي تريد إنشاءه.',
    error_title_image: 'الصورة مفقودة',
    error_message_image: 'يرجى رفع صورة لتوليد الفيديو منها.',
    error_failed: 'فشل في توليد الفيديو.',
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
    console.error(
      'Failed to parse split prompt from AI, splitting manually:',
      e,
    );
  }
  const sentences = prompt.match(/[^.!?]+[.!?]+/g) || [prompt];
  if (sentences.length < 2) {
    const words = prompt.split(' ');
    const midPoint = Math.ceil(words.length / 2);
    return [
      words.slice(0, midPoint).join(' '),
      words.slice(midPoint).join(' '),
    ];
  }
  const midPoint = Math.ceil(sentences.length / 2);
  return [
    sentences.slice(0, midPoint).join(' '),
    sentences.slice(midPoint).join(' '),
  ];
}

export const PromoVideo: React.FC<PromoVideoProps> = ({
  language,
  setActiveTab,
}) => {
  const [mode, setMode] = useState<Mode>('text');
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string[] | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('Cinematic');
  const [pacing, setPacing] = useState<Pacing>('Normal Pacing');
  const [videoLengthOption, setVideoLengthOption] =
    useState<VideoLengthOption>('10s');
  const texts = TEXTS[language];

  useEffect(() => {
    // When switching to image mode, if 2x15s is selected, reset to a compatible option.
    if (mode === 'image' && videoLengthOption === '2x15s') {
      setVideoLengthOption('10s');
    }
  }, [mode, videoLengthOption]);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imagePreviewUrl) {
        // Assuming data URL, no revoke needed unless it was from createObjectURL
      }
      const dataUrl = await fileToDataUrl(file);
      setImagePreviewUrl(dataUrl);
    }
  };

  const handleGenerate = async () => {
    if (!prompt || !setActiveTab) {
      setError([texts.error_title_prompt, texts.error_message_prompt]);
      return;
    }
    if (mode === 'image' && !imagePreviewUrl) {
      setError([texts.error_title_image, texts.error_message_image]);
      return;
    }
    setError(null);

    const promptsToProcess: {prompt: string; part: number; total: number}[] =
      [];
    let n_frames = 10;

    if (mode === 'text' && videoLengthOption === '2x15s') {
      const [part1, part2] = await splitVideoPrompt(prompt, language);
      promptsToProcess.push({prompt: part1, part: 1, total: 2});
      promptsToProcess.push({prompt: part2, part: 2, total: 2});
      n_frames = 15;
    } else {
      promptsToProcess.push({prompt, part: 1, total: 1});
      n_frames = videoLengthOption === '15s' ? 15 : 10;
    }

    const details: PromoVideoJobDetails = {
      prompts: promptsToProcess,
      aspectRatio,
      videoStyle: mode === 'text' ? videoStyle : undefined,
      pacing: mode === 'text' ? pacing : undefined,
      n_frames,
      isImageToVideo: mode === 'image',
    };

    const newJob: CreationJob = {
      id: `promo_${new Date().toISOString()}`,
      type: 'promo_video',
      status: 'pending',
      createdAt: new Date().toISOString(),
      title: prompt.substring(0, 50) + '...',
      details,
      thumbnailUrl: mode === 'image' ? imagePreviewUrl || '' : undefined,
    };

    await addCreationJob(newJob);
    setActiveTab('creations');
    // Reset form
    setPrompt('');
    setImagePreviewUrl(null);
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
        <Card>
          {/* Mode Switcher */}
          <div className="flex w-fit items-center gap-1 rounded-full bg-background-dark p-1 border border-border-dark mb-6">
            <button
              onClick={() => setMode('text')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                mode === 'text'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'text-text-secondary hover:bg-border-dark'
              }`}>
              {texts.mode.text}
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                mode === 'image'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'text-text-secondary hover:bg-border-dark'
              }`}>
              {texts.mode.image}
            </button>
          </div>

          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.describe_title}
          </h3>

          {mode === 'image' && (
            <div
              className="relative border-2 border-dashed border-border-dark rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors mb-4"
              onClick={() => imageInputRef.current?.click()}>
              <input
                type="file"
                accept="image/*"
                hidden
                ref={imageInputRef}
                onChange={handleImageChange}
              />
              {imagePreviewUrl ? (
                <img
                  src={imagePreviewUrl}
                  alt="Preview"
                  className="mx-auto max-h-48 rounded-md"
                />
              ) : (
                <div className="flex flex-col items-center text-text-secondary">
                  <UploadIcon className="w-12 h-12 text-text-secondary/50" />
                  <p className="mt-2 font-semibold text-text-dark">
                    {texts.upload_cta}
                  </p>
                </div>
              )}
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-40 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
            placeholder={
              mode === 'image'
                ? texts.image_prompt_placeholder
                : texts.text_prompt_placeholder
            }
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
                className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
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
                {texts.structure}
              </label>
              <select
                value={videoLengthOption}
                onChange={(e) =>
                  setVideoLengthOption(e.target.value as VideoLengthOption)
                }
                className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
                {(
                  Object.keys(texts.structures) as VideoLengthOption[]
                ).map((structure) => (
                  <option
                    key={structure}
                    value={structure}
                    disabled={mode === 'image' && structure === '2x15s'}>
                    {texts.structures[structure]}
                  </option>
                ))}
              </select>
            </div>
            {mode === 'text' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    {texts.style}
                  </label>
                  <select
                    value={videoStyle}
                    onChange={(e) =>
                      setVideoStyle(e.target.value as VideoStyle)
                    }
                    className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
                    {(Object.keys(texts.styles) as VideoStyle[]).map(
                      (style) => (
                        <option key={style} value={style}>
                          {texts.styles[style]}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    {texts.pacing}
                  </label>
                  <select
                    value={pacing}
                    onChange={(e) => setPacing(e.target.value as Pacing)}
                    className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
                    {(Object.keys(texts.pacings) as Pacing[]).map(
                      (pacing) => (
                        <option key={pacing} value={pacing}>
                          {texts.pacings[pacing]}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </>
            )}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.generate_title}
          </h3>
          <button
            onClick={handleGenerate}
            disabled={!prompt || (mode === 'image' && !imagePreviewUrl)}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <ClapperboardIcon className="w-6 h-6" />
            <span>{texts.generate_button}</span>
          </button>
        </Card>
      </div>
    </div>
  );
};