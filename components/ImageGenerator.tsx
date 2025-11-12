/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useRef, useEffect, useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ArrowDownTrayIcon, PhotoIcon} from './icons';

const SORA_API_KEY = '8774ae5d8c69b9009c49a774e9b12555';
const SORA_API_BASE_URL = 'https://api.kie.ai/api/v1/jobs';

type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
type ImageResolution = '1K' | '2K' | '4K';
type SquareQuality = 'square' | 'square_hd';
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
    image_resolution_label: 'Image Resolution',
    square_quality_label: 'Square Quality',
    qualities: {
      standard: 'Standard',
      hd: 'HD',
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
    image_resolution_label: 'دقة الصورة',
    square_quality_label: 'جودة المربع',
    qualities: {
      standard: 'قياسي',
      hd: 'عالي الدقة',
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

const Card: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark rounded-xl border border-border-dark shadow-lg ${className}`}>
    {children}
  </div>
);

const OptionButton: React.FC<{
  isSelected: boolean;
  onClick: () => void;
  label: string;
}> = ({isSelected, onClick, label}) => (
  <button
    onClick={onClick}
    className={`relative flex-grow basis-1/2 p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center overflow-hidden
      ${
        isSelected
          ? 'border-transparent text-white shadow-lg scale-105'
          : 'bg-component-dark border-border-dark text-text-secondary hover:bg-border-dark hover:border-border-dark/50'
      }`}>
    {isSelected && (
      <div className="absolute inset-0 bg-gradient-to-r from-primary-start to-primary-end -z-10"></div>
    )}
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({language}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [imageResolution, setImageResolution] =
    useState<ImageResolution>('1K');
  const [squareQuality, setSquareQuality] = useState<SquareQuality>('square_hd');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const texts = TEXTS[language];

  const pollingIntervalRef = useRef<number | null>(null);
  const generatedImageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      if (generatedImageUrlRef.current) {
        URL.revokeObjectURL(generatedImageUrlRef.current);
      }
    };
  }, []);

  const handleGenerate = async () => {
    if (!prompt) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    if (generatedImageUrlRef.current) {
      URL.revokeObjectURL(generatedImageUrlRef.current);
      generatedImageUrlRef.current = null;
    }

    const imageSize =
      aspectRatio === '1:1'
        ? squareQuality
        : {
            '16:9': 'landscape_16_9',
            '9:16': 'portrait_16_9',
            '4:3': 'landscape_4_3',
            '3:4': 'portrait_4_3',
          }[aspectRatio];

    try {
      const createTaskResponse = await fetch(`${SORA_API_BASE_URL}/createTask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SORA_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'bytedance/seedream-v4-text-to-image',
          input: {
            prompt: prompt,
            image_size: imageSize,
            image_resolution: imageResolution,
            max_images: 1,
          },
        }),
      });

      if (!createTaskResponse.ok) {
        const errorData = await createTaskResponse.json();
        throw new Error(
          `API Error: ${errorData.msg || createTaskResponse.statusText}`,
        );
      }

      const taskData = await createTaskResponse.json();
      const taskId = taskData?.data?.taskId;

      if (!taskId) {
        throw new Error(`API did not return a valid task ID. Response: ${JSON.stringify(taskData)}`);
      }

      const pollStartTime = Date.now();
      const pollTimeout = 120000; // 2 minutes timeout

      pollingIntervalRef.current = window.setInterval(async () => {
        if (Date.now() - pollStartTime > pollTimeout) {
          clearInterval(pollingIntervalRef.current!);
          pollingIntervalRef.current = null;
          setError([texts.error_failed, 'Image generation timed out.']);
          setIsLoading(false);
          return;
        }

        try {
          const pollResponse = await fetch(
            `${SORA_API_BASE_URL}/recordInfo?taskId=${taskId}`,
            {
              headers: {
                Authorization: `Bearer ${SORA_API_KEY}`,
              },
            },
          );

          if (!pollResponse.ok) {
            console.error(`Polling failed with status ${pollResponse.status}`);
            return;
          }

          const pollData = await pollResponse.json();

          if (pollData.data.state === 'success') {
            clearInterval(pollingIntervalRef.current!);
            pollingIntervalRef.current = null;

            const resultJson = JSON.parse(pollData.data.resultJson);
            const imageUrl = resultJson?.resultUrls?.[0];

            if (!imageUrl) {
              throw new Error(
                'Generation succeeded but no image URL was found.',
              );
            }

            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
              throw new Error(
                `Failed to download the generated image from ${imageUrl}`,
              );
            }
            const imageBlob = await imageResponse.blob();
            const blobUrl = URL.createObjectURL(imageBlob);

            generatedImageUrlRef.current = blobUrl;
            setGeneratedImage(blobUrl);
            setIsLoading(false);
          } else if (pollData.data.state === 'fail') {
            clearInterval(pollingIntervalRef.current!);
            pollingIntervalRef.current = null;
            setError([
              texts.error_failed,
              pollData.data.failMsg || 'Unknown error during generation.',
            ]);
            setIsLoading(false);
          }
        } catch (pollError: any) {
          console.error('Error during polling:', pollError);
        }
      }, 3000);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
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
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.title}
          </h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
            placeholder={texts.placeholder}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.aspect_ratio_label}
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
                {texts.image_resolution_label}
              </label>
              <select
                value={imageResolution}
                onChange={(e) =>
                  setImageResolution(e.target.value as ImageResolution)
                }
                className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
                <option value="1K">1K</option>
                <option value="2K">2K</option>
                <option value="4K">4K</option>
              </select>
            </div>
          </div>
          {aspectRatio === '1:1' && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-secondary mb-2">
                {texts.square_quality_label}
              </label>
              <div className="flex gap-2">
                <OptionButton
                  label={texts.qualities.standard}
                  isSelected={squareQuality === 'square'}
                  onClick={() => setSquareQuality('square')}
                />
                <OptionButton
                  label={texts.qualities.hd}
                  isSelected={squareQuality === 'square_hd'}
                  onClick={() => setSquareQuality('square_hd')}
                />
              </div>
            </div>
          )}
        </Card>

        <Card>
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
        </Card>

        {generatedImage && (
          <Card className="animate-fade-in">
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
          </Card>
        )}
      </div>
    </div>
  );
};