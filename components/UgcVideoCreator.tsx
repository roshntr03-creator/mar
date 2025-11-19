
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
    upload_cta: 'Upload Image',
    upload_formats: 'PNG, JPG, WEBP',
    script_title: '2. Generate Script',
    generate_script: 'Generate Script',
    generating: 'Generating...',
    customize_title: 'Customize Your Video',
    create_video_title: '3. Final Touches',
    script_label: 'Script (Spoken)',
    script_placeholder: 'Your generated script...',
    video_prompt_label: 'Scene Description (Visuals)',
    video_prompt_placeholder:
      "Describe the scene action (e.g. 'A woman holding the bottle up to the sunlight, smiling')...",
    gender_label: 'Influencer Gender',
    gender_female: 'Female',
    gender_male: 'Male',
    structure_label: 'Video Length',
    structure_10s: '10 seconds',
    structure_15s: '15 seconds',
    structure_2x15s: '2 x 15s parts (30s total)',
    vibe_label: 'Vibe / Tone',
    vibe_energetic: 'Energetic',
    vibe_calm: 'Calm',
    vibe_luxurious: 'Luxurious',
    vibe_playful: 'Playful',
    setting_label: 'Setting / Location',
    setting_studio: 'Studio',
    setting_home: 'Home',
    setting_outdoor: 'Outdoor',
    setting_urban: 'Urban',
    interaction_label: 'Recommended Action',
    just_speaking: 'Just speaking',
    watermark_title: 'Optional: Add Watermark',
    watermark_cta:
      'Click to upload a logo (PNG)',
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
    create_video_title: '٣. اللمسات الأخيرة',
    script_label: 'السكربت (منطوق)',
    script_placeholder: 'السكربت الذي تم إنشاؤه...',
    video_prompt_label: 'وصف المشهد (مرئي)',
    video_prompt_placeholder:
      'صف حركة المشهد (مثال: امرأة ترفع الزجاجة نحو ضوء الشمس وتبتسم)...',
    gender_label: 'جنس المؤثر',
    gender_female: 'أنثى',
    gender_male: 'ذكر',
    structure_label: 'مدة الفيديو',
    structure_10s: '10 ثوانٍ',
    structure_15s: '15 ثانية',
    structure_2x15s: 'جزئين × 15 ثانية',
    vibe_label: 'الجو العام',
    vibe_energetic: 'حيوي',
    vibe_calm: 'هادئ',
    vibe_luxurious: 'فاخر',
    vibe_playful: 'مرح',
    setting_label: 'الموقع',
    setting_studio: 'استوديو',
    setting_home: 'منزل',
    setting_outdoor: 'خارجي',
    setting_urban: 'حضري',
    interaction_label: 'الإجراء الموصى به',
    just_speaking: 'يتحدث فقط',
    watermark_title: 'اختياري: إضافة علامة مائية',
    watermark_cta: 'انقر لرفع شعار (PNG)',
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

const OptionButton: React.FC<{
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
}> = ({isSelected, onClick, icon, label}) => (
  <button
    onClick={onClick}
    className={`relative flex-grow basis-1/3 p-3 rounded-[1.2rem] border transition-all duration-300 flex flex-col items-center justify-center gap-1.5 text-center overflow-hidden group min-h-[5rem]
      ${
        isSelected
          ? 'border-primary bg-primary/20 text-white shadow-glow-sm'
          : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
      }`}>
    {icon && <div className={`${isSelected ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{icon}</div>}
    <span className="text-[11px] font-bold uppercase tracking-wide">{label}</span>
  </button>
);

const Stepper: React.FC<{currentStep: number; texts: any}> = ({
  currentStep,
  texts,
}) => {
  const steps = [texts.upload, texts.customize, texts.generate];
  return (
    <div className="flex items-center justify-between w-full px-8 mb-8 relative">
      <div className="absolute left-10 right-10 top-1/2 h-0.5 bg-white/10 -z-10"></div>
      <div className="absolute left-10 top-1/2 h-0.5 bg-primary transition-all duration-500" style={{width: `${((currentStep - 1) / (steps.length - 1)) * 80}%`}}></div>
      
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        return (
          <div key={stepNumber} className="flex flex-col items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 border-2 
                ${
                  isActive
                    ? 'bg-black border-primary text-primary shadow-glow-sm scale-110'
                    : isCompleted
                    ? 'bg-primary border-primary text-white'
                    : 'bg-black border-white/20 text-white/30'
                }`}>
              {isCompleted ? (
                <span className="material-symbols-rounded text-sm">check</span>
              ) : (
                stepNumber
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

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
        aspectRatio: '9:16',
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
    <div className="glass-card p-6 rounded-[2.5rem] animate-slide-up border border-white/10">
      <h3 className="text-xl font-bold text-white mb-6 text-center">
        {texts.upload_title}
      </h3>
      <div
        className="relative border-2 border-dashed border-white/10 rounded-3xl p-8 text-center cursor-pointer hover:border-primary hover:bg-white/5 transition-all group"
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
            className="mx-auto max-h-64 rounded-xl shadow-2xl"
          />
        ) : (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <UploadIcon className="w-10 h-10 text-white/40" />
            </div>
            <p className="font-bold text-white">{texts.upload_cta}</p>
            <p className="text-xs text-white/40 mt-1">{texts.upload_formats}</p>
          </div>
        )}
      </div>
      <button
        onClick={handleGenerateScript}
        disabled={!productImageBase64 || status === 'generating_script'}
        className="w-full mt-8 h-14 rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold shadow-glow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-white/10">
        {status === 'generating_script' ? (
            <>
             <span className="material-symbols-rounded animate-spin">progress_activity</span>
             {texts.generating}
            </>
        ) : texts.generate_script}
      </button>
    </div>
  );

  const renderStep2_Customize = () => (
    <div className="glass-card p-6 rounded-[2.5rem] animate-slide-up space-y-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-2 text-center">
        {texts.customize_title}
      </h3>
      
      {/* Script Input */}
      <div>
         <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">{texts.script_label}</label>
         <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            className="w-full glass-input rounded-2xl p-4 text-sm text-white placeholder:text-white/20 min-h-[100px] resize-none focus:ring-1 focus:ring-primary/50"
            placeholder={texts.script_placeholder}
        />
      </div>

      {/* Scene Prompt Input */}
      <div>
         <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">{texts.video_prompt_label}</label>
         <textarea
            value={videoPrompt}
            onChange={(e) => setVideoPrompt(e.target.value)}
            className="w-full glass-input rounded-2xl p-4 text-sm text-white placeholder:text-white/20 min-h-[80px] resize-none focus:ring-1 focus:ring-primary/50"
            placeholder={texts.video_prompt_placeholder}
        />
      </div>

      {/* Gender Selection */}
      <div>
        <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">
            {texts.gender_label}
        </label>
        <div className="flex gap-3">
            <OptionButton
              label={texts.gender_female}
              isSelected={gender === 'female'}
              onClick={() => setGender('female')}
              icon={<span className="material-symbols-rounded text-2xl">female</span>}
            />
            <OptionButton
              label={texts.gender_male}
              isSelected={gender === 'male'}
              onClick={() => setGender('male')}
              icon={<span className="material-symbols-rounded text-2xl">male</span>}
            />
        </div>
      </div>

      {/* Interaction Selection (From AI) */}
      {interactionOptions.length > 0 && (
        <div>
          <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">
            {texts.interaction_label}
          </label>
          <select
            value={selectedInteraction}
            onChange={(e) => setSelectedInteraction(e.target.value)}
            className="w-full glass-input rounded-2xl p-4 text-sm text-white appearance-none focus:ring-1 focus:ring-primary/50 cursor-pointer">
            {interactionOptions.map((opt, i) => (
              <option key={i} value={opt} className="bg-[#1a1a20] text-white">{opt}</option>
            ))}
          </select>
        </div>
      )}

      {/* Setting Selection */}
      <div>
          <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">
            {texts.setting_label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <OptionButton
              label={texts.setting_studio}
              icon={<span className="material-symbols-rounded">videocam</span>}
              isSelected={setting === 'studio'}
              onClick={() => setSetting('studio')}
            />
            <OptionButton
              label={texts.setting_home}
              icon={<HomeIcon className="w-5 h-5" />}
              isSelected={setting === 'home'}
              onClick={() => setSetting('home')}
            />
            <OptionButton
              label={texts.setting_outdoor}
              icon={<SunIcon className="w-5 h-5" />}
              isSelected={setting === 'outdoor'}
              onClick={() => setSetting('outdoor')}
            />
            <OptionButton
              label={texts.setting_urban}
              icon={<BuildingOfficeIcon className="w-5 h-5" />}
              isSelected={setting === 'urban'}
              onClick={() => setSetting('urban')}
            />
          </div>
      </div>

      {/* Vibe Selection */}
      <div>
          <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">
            {texts.vibe_label}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <OptionButton
              label={texts.vibe_energetic}
              icon={<BoltIcon className="w-5 h-5" />}
              isSelected={vibe === 'energetic'}
              onClick={() => setVibe('energetic')}
            />
            <OptionButton
              label={texts.vibe_calm}
              icon={<ShieldCheckIcon className="w-5 h-5" />}
              isSelected={vibe === 'calm'}
              onClick={() => setVibe('calm')}
            />
            <OptionButton
              label={texts.vibe_luxurious}
              icon={<SparklesIcon className="w-5 h-5" />}
              isSelected={vibe === 'luxurious'}
              onClick={() => setVibe('luxurious')}
            />
            <OptionButton
              label={texts.vibe_playful}
              icon={<FaceSmileIcon className="w-5 h-5" />}
              isSelected={vibe === 'playful'}
              onClick={() => setVibe('playful')}
            />
          </div>
        </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setCurrentStep(1)}
          className="flex-1 h-14 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10">
          {texts.buttons.back}
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="flex-1 h-14 rounded-full bg-white text-black font-bold hover:opacity-90">
          {texts.buttons.next}
        </button>
      </div>
    </div>
  );

  const renderStep3_Generate = () => (
    <div className="glass-card p-6 rounded-[2.5rem] animate-slide-up space-y-6 border border-white/10">
      <h3 className="text-xl font-bold text-white mb-2 text-center">
        {texts.create_video_title}
      </h3>
      
      <div>
          <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">
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
         <label className="text-[10px] font-bold uppercase text-white/40 mb-2 block tracking-wider">{texts.watermark_title}</label>
         <div
            className="border border-dashed border-white/10 rounded-3xl p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
            onClick={() => logoInputRef.current?.click()}>
            <input
              type="file"
              accept="image/png"
              hidden
              ref={logoInputRef}
              onChange={handleLogoChange}
            />
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="max-h-12 mx-auto" />
            ) : (
              <p className="text-white/40 text-xs">{texts.watermark_cta}</p>
            )}
          </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => setCurrentStep(2)}
          className="flex-1 h-14 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10">
          {texts.buttons.back}
        </button>
        <button
          onClick={handleGenerateVideo}
          disabled={isPreparing}
          className="flex-[2] h-14 rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold shadow-glow hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 border border-white/10">
          {isPreparing ? texts.preparing_video : texts.generate_video}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 pb-32 max-w-xl mx-auto pt-8">
      <Stepper currentStep={currentStep} texts={texts.stepper} />
      {currentStep === 1 && renderStep1_Upload()}
      {currentStep === 2 && renderStep2_Customize()}
      {currentStep === 3 && renderStep3_Generate()}
    </div>
  );
};
