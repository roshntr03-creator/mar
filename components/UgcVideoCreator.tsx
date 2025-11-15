/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {PageProps} from '../App';
import {addCreationJob} from '../services/creationManager';
import {CreationJob, UgcVideoJobDetails} from '../types';
import {ErrorModal} from './ErrorModal';
import {
  BoltIcon,
  BuildingOfficeIcon,
  FaceSmileIcon,
  HomeIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunIcon,
  UploadIcon,
} from './icons';

const SCRIPT_MODEL_NAME = 'gemini-2.5-flash';

type Status = 'idle' | 'generating_script' | 'script_ready' | 'error';
type VideoLengthOption = '10s' | '15s' | '2x15s';
type Gender = 'male' | 'female';
type Vibe = 'energetic' | 'calm' | 'luxurious' | 'playful';
type Setting = 'studio' | 'home' | 'outdoor' | 'urban';

interface UgcVideoCreatorProps extends PageProps {}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    videoReady: 'Your Video is Ready!',
    create_new: 'Create a New Version',
    start_over: 'Start Over',
    upload_title: '1. Upload Product Image',
    upload_cta: 'Click to upload an image',
    upload_formats: 'PNG, JPG, WEBP',
    script_title: '2. Generate Script',
    generate_script: 'Generate Script',
    generating: 'Generating...',
    customize_title: 'Customize Your Video',
    create_video_title: '3. Create Video',
    script_placeholder: 'Your generated script...',
    video_prompt_title: 'Prompt the Video',
    video_prompt_placeholder:
      "e.g., A blonde woman in a modern kitchen, smiling as she uses the product...",
    gender_label: 'Influencer Gender',
    gender_female: 'Female',
    gender_male: 'Male',
    structure_label: 'Video Length',
    structure_10s: '10 seconds',
    structure_15s: '15 seconds',
    structure_2x15s: '2 x 15s parts (30s total)',
    vibe_label: 'Vibe / Tone',
    vibe_energetic: 'Energetic',
    vibe_calm: 'Calm & Trustworthy',
    vibe_luxurious: 'Luxurious & Aspirational',
    vibe_playful: 'Playful & Fun',
    setting_label: 'Setting',
    setting_studio: 'Minimalist Studio',
    setting_home: 'Cozy Home',
    setting_outdoor: 'Outdoor Nature',
    setting_urban: 'Urban Cityscape',
    interaction_label: 'Interaction with Product',
    just_speaking: 'Just speaking',
    watermark_title: 'Optional: Add Watermark',
    watermark_cta:
      'Click to upload a logo (PNG with transparent background recommended)',
    generate_video: 'Generate Video',
    preparing_video: 'Preparing...',
    errors: {
      upload_first: 'Please upload a product image first.',
      api_key_invalid: 'Invalid API Key',
      api_key_cta: 'Please add your Gemini API key in the settings to proceed.',
      script_failed: 'Failed to generate script.',
      script_failed_cta: 'Please try again or use a different image.',
      missing_data: 'Missing product image or script.',
      video_failed: 'Failed to generate video.',
      video_failed_cta:
        'The service may be busy. Please try again in a moment.',
    },
    stepper: {
      upload: 'Upload',
      customize: 'Customize',
      generate: 'Generate',
    },
    buttons: {
      next: 'Next',
      back: 'Back',
    },
  },
  arabic: {
    videoReady: 'الفيديو الخاص بك جاهز!',
    create_new: 'إنشاء نسخة جديدة',
    start_over: 'ابدأ من جديد',
    upload_title: '١. رفع صورة المنتج',
    upload_cta: 'انقر لرفع صورة',
    upload_formats: 'PNG, JPG, WEBP',
    script_title: '٢. توليد السكربت',
    generate_script: 'توليد السكربت',
    generating: 'جاري التوليد...',
    customize_title: 'تخصيص الفيديو الخاص بك',
    create_video_title: '٣. إنشاء الفيديو',
    script_placeholder: 'السكربت الذي تم إنشاؤه...',
    video_prompt_title: 'وصف الفيديو',
    video_prompt_placeholder:
      'مثال: امرأة شقراء في مطبخ حديث، تبتسم وهي تستخدم المنتج...',
    gender_label: 'جنس المؤثر',
    gender_female: 'أنثى',
    gender_male: 'ذكر',
    structure_label: 'مدة الفيديو',
    structure_10s: '10 ثوانٍ',
    structure_15s: '15 ثانية',
    structure_2x15s: 'جزئين × 15 ثانية (إجمالي 30 ثانية)',
    vibe_label: 'الجو العام / النبرة',
    vibe_energetic: 'حيوي',
    vibe_calm: 'هادئ وموثوق',
    vibe_luxurious: 'فاخر وطموح',
    vibe_playful: 'مرح وممتع',
    setting_label: 'الموقع',
    setting_studio: 'استوديو بسيط',
    setting_home: 'منزل دافئ',
    setting_outdoor: 'طبيعة خارجية',
    setting_urban: 'منظر مدينة حضري',
    interaction_label: 'التفاعل مع المنتج',
    just_speaking: 'يتحدث فقط',
    watermark_title: 'اختياري: إضافة علامة مائية',
    watermark_cta: 'انقر لرفع شعار (يوصى بـ PNG بخلفية شفافة)',
    generate_video: 'توليد الفيديو',
    preparing_video: 'تحضير...',
    errors: {
      upload_first: 'يرجى رفع صورة المنتج أولاً.',
      api_key_invalid: 'مفتاح API غير صالح',
      api_key_cta: 'يرجى إضافة مفتاح Gemini API الخاص بك في الإعدادات للمتابعة.',
      script_failed: 'فشل في توليد السكربت.',
      script_failed_cta: 'يرجى المحاولة مرة أخرى أو استخدام صورة مختلفة.',
      missing_data: 'صورة المنتج أو السكربت مفقود.',
      video_failed: 'فشل في توليد الفيديو.',
      video_failed_cta: 'قد تكون الخدمة مشغولة. يرجى المحاولة مرة أخرى بعد لحظات.',
    },
    stepper: {
      upload: 'Upload',
      customize: 'Customize',
      generate: 'Generate',
    },
    buttons: {
      next: 'Next',
      back: 'Back',
    },
  },
};

// --- Helper Functions ---

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

function getPersonaDescription(language: 'english' | 'arabic', gender: Gender): string {
  const commonDescription =
    gender === 'female'
      ? 'influencer in her late 20s, with long wavy dark brown hair and a warm, trustworthy smile'
      : 'influencer in his late 20s, with short, stylish dark hair and a warm, confident smile';

  if (language === 'arabic') {
    return `A charismatic and authentic Arab ${commonDescription}`;
  }
  return `A charismatic and authentic Caucasian ${commonDescription}`;
}

// --- API Functions ---
async function generateScriptAndOptions(
  base64Image: string,
  language: 'english' | 'arabic',
  ai: any,
): Promise<{script: string; options: string[]}> {
  const imagePart = {inlineData: {mimeType: 'image/jpeg', data: base64Image}};

  const scriptPrompt =
    language === 'arabic'
      ? 'Analyze this product image. Write a natural, short Arabic script (15-25 words, for an 8-second video) as if a real influencer is reviewing it. Tone: friendly, emotional, cinematic.'
      : 'Analyze this product image. Write a natural, short English script (15-25 words, for an 8-second video) as if a real influencer is reviewing it. Tone: friendly, emotional, cinematic.';
  const scriptResponse = await ai.models.generateContent({
    model: SCRIPT_MODEL_NAME,
    contents: {parts: [imagePart, {text: scriptPrompt}]},
  });
  const generatedScript = scriptResponse.text;

  const optionsPrompt = `Based on the product in this image and the script: "${generatedScript}", suggest 3-4 distinct, short, cinematic action phrases in ${language} for how an influencer should interact with it. Return ONLY a valid JSON array of strings.`;
  const optionsResponse = await ai.models.generateContent({
    model: SCRIPT_MODEL_NAME,
    contents: {parts: [imagePart, {text: optionsPrompt}]},
  });
  const cleanedText = optionsResponse.text.replace(/```json|```/g, '').trim();
  const options = JSON.parse(cleanedText);

  return {script: generatedScript, options};
}

async function splitScript(
  script: string,
  language: 'english' | 'arabic',
  ai: any,
): Promise<[string, string]> {
  const prompt = `Split this script into two balanced parts for two 15s videos. Return ONLY a valid JSON array with two strings. Script: "${script}"`;
  const response = await ai.models.generateContent({
    model: SCRIPT_MODEL_NAME,
    contents: {parts: [{text: prompt}]},
  });
  try {
    const cleanedText = response.text.replace(/```json|```/g, '').trim();
    const parts = JSON.parse(cleanedText);
    if (Array.isArray(parts) && parts.length === 2) {
      return parts as [string, string];
    }
  } catch (e) {}
  const words = script.split(' ');
  const mid = Math.ceil(words.length / 2);
  return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
}

async function describeImageForPrompt(
  base64Image: string,
  ai: GoogleGenAI,
): Promise<string> {
  const imagePart = {inlineData: {mimeType: 'image/jpeg', data: base64Image}};
  const prompt =
    'Describe this product image in a single, descriptive sentence to be used as context in a video generation prompt. Focus on the main subject and its key visual characteristics.';
  const response = await ai.models.generateContent({
    model: SCRIPT_MODEL_NAME,
    contents: {parts: [imagePart, {text: prompt}]},
  });
  return response.text;
}

// --- UI Components ---
const OptionButton: React.FC<{
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
}> = ({isSelected, onClick, icon, label}) => (
  <button
    onClick={onClick}
    className={`relative flex-grow basis-1/3 p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center justify-center gap-2 text-center overflow-hidden
      ${
        isSelected
          ? 'border-transparent text-white shadow-lg scale-105'
          : 'bg-component-dark border-border-dark text-text-secondary hover:bg-border-dark hover:border-border-dark/50'
      }`}>
    {isSelected && <div className="absolute inset-0 bg-gradient-to-r from-primary-start to-primary-end -z-10"></div>}
    {icon && <div className="w-7 h-7">{icon}</div>}
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

const Stepper: React.FC<{currentStep: number; texts: any}> = ({
  currentStep,
  texts,
}) => {
  const steps = [texts.upload, texts.customize, texts.generate];
  return (
    <div className="flex items-center justify-center w-full px-4 mb-8">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        return (
          <React.Fragment key={stepNumber}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all duration-300 border-2 relative overflow-hidden
                  ${
                    isActive
                      ? 'border-primary/50 text-white'
                      : isCompleted
                      ? 'border-transparent text-white'
                      : 'bg-component-dark border-border-dark text-text-secondary'
                  }`}>
                {(isActive || isCompleted) && <div className="absolute inset-0 bg-gradient-to-br from-primary-start to-primary-end -z-10"></div>}
                {isCompleted ? (
                  <span className="material-symbols-outlined">check</span>
                ) : (
                  stepNumber
                )}
              </div>
              <p
                className={`mt-2 text-xs font-semibold w-20 transition-colors ${
                  isActive || isCompleted
                    ? 'text-text-dark'
                    : 'text-text-secondary'
                }`}>
                {label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-grow h-1 mx-2 rounded relative">
                <div className="absolute inset-0 bg-border-dark rounded"></div>
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-primary-start to-primary-end rounded transition-transform duration-500 ease-out ${
                    isCompleted ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{transformOrigin: 'left'}}></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
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

// --- Main Component ---

export const UgcVideoCreator: React.FC<UgcVideoCreatorProps> = ({
  language,
  setActiveTab,
}) => {
  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string[] | null>(null);

  const [productImageUrl, setProductImageUrl] = useState<string | null>(null);
  const [productImageBase64, setProductImageBase64] = useState<string | null>(
    null,
  );
  const [script, setScript] = useState('');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [interactionOptions, setInteractionOptions] = useState<string[]>([]);
  const [selectedInteraction, setSelectedInteraction] = useState('');

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  const [logoMimeType, setLogoMimeType] = useState<string | null>(null);

  const [videoLengthOption, setVideoLengthOption] =
    useState<VideoLengthOption>('10s');
  const [gender, setGender] = useState<Gender>('female');
  const [vibe, setVibe] = useState<Vibe>('energetic');
  const [setting, setSetting] = useState<Setting>('studio');
  const [isPreparing, setIsPreparing] = useState(false);

  // Refs and constants
  const texts = TEXTS[language];
  const productImageInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Lifecycle
  useEffect(() => {
    // Clean up object URLs
    return () => {
      if (productImageUrl) URL.revokeObjectURL(productImageUrl);
      if (logoUrl) URL.revokeObjectURL(logoUrl);
    };
  }, [productImageUrl, logoUrl]);

  // Handlers
  const handleReset = () => {
    setCurrentStep(1);
    setStatus('idle');
    setProductImageUrl(null);
    setProductImageBase64(null);
    setScript('');
    setVideoPrompt('');
    setInteractionOptions([]);
    setLogoUrl(null);
    setLogoBase64(null);
    setLogoMimeType(null);
    setVideoLengthOption('10s');
    setGender('female');
    setVibe('energetic');
    setSetting('studio');
  };

  const handleProductImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleReset();
      if (productImageUrl) URL.revokeObjectURL(productImageUrl);
      const dataUrl = await fileToDataUrl(file);
      setProductImageUrl(dataUrl);
      setProductImageBase64(dataUrl.split(',')[1]);
    }
  };

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (logoUrl) URL.revokeObjectURL(logoUrl);
      const dataUrl = await fileToDataUrl(file);
      setLogoUrl(dataUrl);
      const [mime, data] = dataUrl.split(';base64,');
      setLogoBase64(data);
      setLogoMimeType(mime.replace('data:', ''));
    }
  };

  const handleGenerateScript = useCallback(async () => {
    if (!productImageBase64) {
      setError([texts.errors.upload_first]);
      setStatus('error');
      return;
    }
    setStatus('generating_script');
    setError(null);
    setScript('');
    setInteractionOptions([]);
    try {
      const ai = new GoogleGenAI({
        apiKey: process.env.API_KEY,
      });
      const {script: newScript, options} = await generateScriptAndOptions(
        productImageBase64,
        language,
        ai,
      );
      setScript(newScript);
      setInteractionOptions([texts.just_speaking, ...options]);
      setSelectedInteraction(texts.just_speaking);
      setStatus('script_ready');
      setCurrentStep(2);
    } catch (e: any) {
      console.error(e);
      setError([texts.errors.script_failed, e.message]);
      setStatus('error');
    }
  }, [productImageBase64, language, texts]);

  const handleGenerateVideo = useCallback(async () => {
    if (!productImageBase64 || !script || !setActiveTab) {
      setError([texts.errors.missing_data]);
      return;
    }
    setError(null);
    setIsPreparing(true);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

      const productDescription = await describeImageForPrompt(
        productImageBase64,
        ai,
      );

      const scriptsToProcess: {script: string; part: number; total: number}[] =
        [];
      let n_frames = 10;

      if (videoLengthOption === '10s') {
        scriptsToProcess.push({script, part: 1, total: 1});
        n_frames = 10;
      } else if (videoLengthOption === '15s') {
        scriptsToProcess.push({script, part: 1, total: 1});
        n_frames = 15;
      } else {
        // '2x15s'
        const [part1, part2] = await splitScript(script, language, ai);
        scriptsToProcess.push({script: part1, part: 1, total: 2});
        scriptsToProcess.push({script: part2, part: 2, total: 2});
        n_frames = 15;
      }

      const details: UgcVideoJobDetails = {
        productImageBase64,
        productDescription,
        aspectRatio: '9:16', // Default to portrait for mobile-first UGC
        scripts: scriptsToProcess,
        gender,
        interaction: selectedInteraction,
        personaDescription: getPersonaDescription(language, gender),
        vibe,
        setting,
        videoPrompt: videoPrompt || undefined,
        logoBase64: logoBase64 ?? undefined,
        logoMimeType: logoMimeType ?? undefined,
        n_frames,
      };

      const newJob: CreationJob = {
        id: `ugc_${new Date().toISOString()}`,
        type: 'ugc_video',
        status: 'pending',
        createdAt: new Date().toISOString(),
        title: script.substring(0, 50) + '...',
        details,
        thumbnailUrl: productImageUrl!,
      };

      await addCreationJob(newJob);
      setActiveTab('creations');
      handleReset();
    } catch (e: any) {
      console.error(e);
      setError([texts.errors.video_failed, e.message]);
    } finally {
      setIsPreparing(false);
    }
  }, [
    productImageBase64,
    productImageUrl,
    script,
    videoPrompt,
    logoBase64,
    logoMimeType,
    language,
    gender,
    selectedInteraction,
    videoLengthOption,
    vibe,
    setting,
    texts,
    setActiveTab,
  ]);

  const renderStep1_Upload = () => (
    <GlassCard>
      <h3 className="text-lg font-semibold text-text-dark mb-4 text-center">
        {texts.upload_title}
      </h3>
      <div
        className="relative border-2 border-dashed border-border-dark rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => productImageInputRef.current?.click()}>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={productImageInputRef}
          onChange={handleProductImageChange}
        />
        {productImageUrl ? (
          <img
            src={productImageUrl}
            alt="Product Preview"
            className="mx-auto max-h-48 rounded-md"
          />
        ) : (
          <div className="flex flex-col items-center text-text-secondary">
            <UploadIcon className="w-12 h-12 text-text-secondary/50" />
            <p className="mt-2 font-semibold text-text-dark">{texts.upload_cta}</p>
            <p className="text-xs text-text-secondary">{texts.upload_formats}</p>
          </div>
        )}
      </div>
      <button
        onClick={handleGenerateScript}
        disabled={!productImageBase64 || status === 'generating_script'}
        className="w-full mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed">
        {status === 'generating_script'
          ? texts.generating
          : texts.generate_script}
      </button>
    </GlassCard>
  );

  const renderStep2_Customize = () => (
    <GlassCard className="animate-fade-in">
      <h3 className="text-lg font-semibold text-text-dark mb-4 text-center">
        {texts.customize_title}
      </h3>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark mb-4 h-28 focus:ring-primary focus:border-primary"
        placeholder={texts.script_placeholder}
      />
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {texts.video_prompt_title}
        </label>
        <textarea
          value={videoPrompt}
          onChange={(e) => setVideoPrompt(e.target.value)}
          className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-24 focus:ring-primary focus:border-primary"
          placeholder={texts.video_prompt_placeholder}
        />
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {texts.gender_label}
          </label>
          <div className="flex gap-2">
            <OptionButton
              label={texts.gender_female}
              isSelected={gender === 'female'}
              onClick={() => setGender('female')}
            />
            <OptionButton
              label={texts.gender_male}
              isSelected={gender === 'male'}
              onClick={() => setGender('male')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {texts.vibe_label}
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton
              label={texts.vibe_energetic}
              icon={<BoltIcon />}
              isSelected={vibe === 'energetic'}
              onClick={() => setVibe('energetic')}
            />
            <OptionButton
              label={texts.vibe_calm}
              icon={<ShieldCheckIcon />}
              isSelected={vibe === 'calm'}
              onClick={() => setVibe('calm')}
            />
            <OptionButton
              label={texts.vibe_luxurious}
              icon={<SparklesIcon />}
              isSelected={vibe === 'luxurious'}
              onClick={() => setVibe('luxurious')}
            />
            <OptionButton
              label={texts.vibe_playful}
              icon={<FaceSmileIcon />}
              isSelected={vibe === 'playful'}
              onClick={() => setVibe('playful')}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {texts.setting_label}
          </label>
          <div className="flex flex-wrap gap-2">
            <OptionButton
              label={texts.setting_studio}
              icon={<BuildingOfficeIcon />}
              isSelected={setting === 'studio'}
              onClick={() => setSetting('studio')}
            />
            <OptionButton
              label={texts.setting_home}
              icon={<HomeIcon />}
              isSelected={setting === 'home'}
              onClick={() => setSetting('home')}
            />
            <OptionButton
              label={texts.setting_outdoor}
              icon={<SunIcon />}
              isSelected={setting === 'outdoor'}
              onClick={() => setSetting('outdoor')}
            />
            <OptionButton
              label={texts.setting_urban}
              icon={<BuildingOfficeIcon />}
              isSelected={setting === 'urban'}
              onClick={() => setSetting('urban')}
            />
          </div>
        </div>
        {interactionOptions.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              {texts.interaction_label}
            </label>
            <select
              value={selectedInteraction}
              onChange={(e) => setSelectedInteraction(e.target.value)}
              className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary focus:border-primary">
              {interactionOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setCurrentStep(1)}
          className="w-full px-6 py-3 rounded-lg bg-component-dark border border-border-dark hover:bg-border-dark text-text-dark font-semibold transition-colors">
          {texts.buttons.back}
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px">
          {texts.buttons.next}
        </button>
      </div>
    </GlassCard>
  );

  const renderStep3_Generate = () => (
    <GlassCard className="animate-fade-in">
      <h3 className="text-lg font-semibold text-text-dark mb-4 text-center">
        {texts.create_video_title}
      </h3>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            {texts.structure_label}
          </label>
          <div className="flex gap-2">
            <OptionButton
              label={texts.structure_10s}
              isSelected={videoLengthOption === '10s'}
              onClick={() => setVideoLengthOption('10s')}
            />
            <OptionButton
              label={texts.structure_15s}
              isSelected={videoLengthOption === '15s'}
              onClick={() => setVideoLengthOption('15s')}
            />
            <OptionButton
              label={texts.structure_2x15s}
              isSelected={videoLengthOption === '2x15s'}
              onClick={() => setVideoLengthOption('2x15s')}
            />
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium text-text-secondary mb-2">
            {texts.watermark_title}
          </h4>
          <div
            className="border border-dashed border-border-dark rounded-lg p-4 text-center cursor-pointer hover:border-primary"
            onClick={() => logoInputRef.current?.click()}>
            <input
              type="file"
              accept="image/png"
              hidden
              ref={logoInputRef}
              onChange={handleLogoChange}
            />
            {logoUrl ? (
              <img
                src={logoUrl}
                alt="Logo Preview"
                className="max-h-12 mx-auto"
              />
            ) : (
              <p className="text-text-secondary text-sm">{texts.watermark_cta}</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => setCurrentStep(2)}
          className="w-full px-6 py-3 rounded-lg bg-component-dark border border-border-dark hover:bg-border-dark text-text-dark font-semibold transition-colors">
          {texts.buttons.back}
        </button>
        <button
          onClick={handleGenerateVideo}
          disabled={isPreparing}
          className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed">
          {isPreparing ? texts.preparing_video : texts.generate_video}
        </button>
      </div>
    </GlassCard>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1_Upload();
      case 2:
        return renderStep2_Customize();
      case 3:
        return renderStep3_Generate();
      default:
        return renderStep1_Upload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in pb-24">
      {error && (
        <ErrorModal
          title={error[0]}
          message={error.slice(1)}
          onClose={() => setError(null)}
          onSelectKey={() => {
            /* Placeholder */
          }}
          addKeyButtonText="Add API Key"
          closeButtonText="Close"
        />
      )}

      <Stepper currentStep={currentStep} texts={texts.stepper} />
      {renderContent()}
    </div>
  );
};