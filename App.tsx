/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useEffect, useState} from 'react';
import {BrandIdentity} from './components/BrandIdentity';
import {Campaigns} from './components/Campaigns';
import {CompetitorAnalysis} from './components/CompetitorAnalysis';
import {ContentGenerator} from './components/ContentGenerator';
import {Dashboard} from './components/Dashboard';
import {ErrorModal} from './components/ErrorModal';
import {ImageEditor} from './components/ImageEditor';
import {ImageGenerator} from './components/ImageGenerator';
import {PostAssistant} from './components/PostAssistant';
import {PromptEnhancer} from './components/PromptEnhancer';
import {PromoVideo} from './components/PromoVideo';
import {SavingProgressPage} from './components/SavingProgressPage';
import {Settings} from './components/Settings';
import {UgcVideoCreator} from './components/UgcVideoCreator';
import {Welcome} from './components/Welcome';
import {useAuth} from './contexts/AuthContext';
import {Tab} from './components/navigationConfig';
import {AuthPage} from './pages/AuthPage';
import {PricingPage} from './pages/PricingPage';
import {AiMarketingCoach} from './components/AiMarketingCoach';
import {BottomNavBar} from './components/BottomNavBar';
import {CreateHub} from './components/CreateHub';
import {AiCoachIcon} from './components/icons';
import {Creations} from './components/Creations';
import {
  CreationJob,
  PromoVideoJobDetails,
  UgcVideoJobDetails,
} from './types';
import {
  getCreationJobs,
  saveVideoResult,
  updateCreationJob,
} from './services/creationManager';

export interface LanguageProps {
  language: 'english' | 'arabic';
  setLanguage?: (language: 'english' | 'arabic') => void;
}

export interface PageProps extends LanguageProps {
  setActiveTab?: (tab: Tab) => void;
  setShowPricing?: (show: boolean) => void;
  setShowAiCoach?: (show: boolean) => void;
}

const BRAND_IDENTITY_KEY = 'aiMarketingSuite_brandIdentity';
const WELCOME_SEEN_KEY = 'aiMarketingSuite_hasSeenWelcome';
const PENDING_BRAND_INFO_KEY = 'aiMarketingSuite_pendingBrandInfo';
const VEO_PROMO_MODEL = 'veo-3.1-generate-preview';

const TAB_COMPONENTS: Record<Tab, React.FC<PageProps>> = {
  dashboard: Dashboard,
  creations: Creations,
  ugc_video: UgcVideoCreator,
  campaigns: Campaigns,
  post_assistant: PostAssistant,
  image_editor: ImageEditor,
  content_generator: ContentGenerator,
  promo_video: PromoVideo,
  prompt_enhancer: PromptEnhancer,
  competitor_analysis: CompetitorAnalysis,
  image_generator: ImageGenerator,
  brand_identity: BrandIdentity,
  settings: Settings,
};

const TAB_TITLES: Record<Tab, {en: string; ar: string}> = {
  dashboard: {en: 'Dashboard', ar: 'لوحة التحكم'},
  creations: {en: 'My Creations', ar: 'إبداعاتي'},
  ugc_video: {en: 'UGC Video Creator', ar: 'صانع فيديو UGC'},
  campaigns: {en: 'Campaigns', ar: 'الحملات'},
  post_assistant: {en: 'Post Assistant', ar: 'مساعد المنشورات'},
  image_editor: {en: 'AI Image Editor', ar: 'محرر الصور بالذكاء الاصطناعي'},
  content_generator: {en: 'Content Generation', ar: 'توليد المحتوى'},
  promo_video: {en: 'Promo Video', ar: 'فيديو ترويجي'},
  prompt_enhancer: {en: 'Prompt Enhancer', ar: 'محسن الأوامر'},
  competitor_analysis: {en: 'Competitor Analysis', ar: 'تحليل المنافسين'},
  image_generator: {en: 'Image Generation', ar: 'توليد الصور'},
  brand_identity: {en: 'Brand Identity', ar: 'الهوية التجارية'},
  settings: {en: 'More', ar: 'المزيد'},
};

async function processPendingJobs() {
  const jobs = getCreationJobs();
  const pendingJobs = jobs.filter((job) => job.status === 'pending');
  if (pendingJobs.length === 0) return;

  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  for (const job of pendingJobs) {
    try {
      updateCreationJob(job.id, {status: 'generating'});
      const operations: (object | null)[] = [];

      if (job.type === 'ugc_video') {
        const details = job.details as UgcVideoJobDetails;
        for (const scriptInfo of details.scripts) {
          const prompt = `Persona: ${details.personaDescription}. Action: ${details.interaction}. Dialogue: "${scriptInfo.script}". Vibe: ${details.vibe}. Setting: ${details.setting}.`;
          const operation = await ai.models.generateVideos({
            model: details.model,
            prompt,
            image: {
              imageBytes: details.productImageBase64,
              mimeType: 'image/jpeg',
            },
            config: {numberOfVideos: 1},
          });
          operations.push(operation ?? null);
        }
      } else if (job.type === 'promo_video') {
        const details = job.details as PromoVideoJobDetails;
        for (const promptInfo of details.prompts) {
          const detailedPrompt = `Concept: "${promptInfo.prompt}". Style: ${details.videoStyle}. Pacing: ${details.pacing}.`;
          const operation = await ai.models.generateVideos({
            model: VEO_PROMO_MODEL,
            prompt: detailedPrompt,
            config: {
              numberOfVideos: 1,
              aspectRatio: details.aspectRatio,
              resolution: '720p',
            },
          });
          operations.push(operation ?? null);
        }
      }
      updateCreationJob(job.id, {operations});
    } catch (e: any) {
      console.error(`Failed to start job ${job.id}:`, e);
      updateCreationJob(job.id, {status: 'failed', error: e.message});
    }
  }
}

async function checkGeneratingJobs() {
  const jobs = getCreationJobs();
  const generatingJobs = jobs.filter((job) => job.status === 'generating');
  if (generatingJobs.length === 0) return;

  const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

  for (const job of generatingJobs) {
    if (!job.operations || job.operations.every((op) => !op)) {
      continue;
    }

    try {
      const results = await Promise.all(
        (job.operations as (object | null)[]).map(async (op) => {
          if (!op || !(op as any).name) {
            return {
              done: true,
              error: {message: 'Invalid operation data in job.'},
            };
          }

          const opName = (op as any).name;
          try {
            // Use the SDK to poll for the operation status.
            // Pass a minimal object containing only the name to avoid issues
            // with deserialized objects from localStorage.
            // FIX: Cast operation object to 'any' to bypass strict type checking.
            // The operation object is deserialized from localStorage and is a plain object,
            // not a class instance, which causes a type mismatch with the SDK's expected type.
            const polledOperation = await ai.operations.getVideosOperation({
              operation: {name: opName} as any,
            });
            return polledOperation; // This is a rich object with done, response, error.
          } catch (pollError: any) {
            const errorMessage = (pollError.message || '').toLowerCase();
            // Check for transient server-side errors to enable retries.
            if (
              errorMessage.includes('500') ||
              errorMessage.includes('503') ||
              errorMessage.includes('internal') ||
              errorMessage.includes('server error')
            ) {
              console.warn(
                `Server error polling job ${job.id} (name: ${opName}): ${pollError.message}. Will retry.`,
              );
              return {done: false}; // Treat as a temporary failure.
            }
            // Assume other errors are permanent.
            console.error(
              `Permanent error polling job ${job.id} (name: ${opName}):`,
              pollError,
            );
            return {
              done: true,
              error: {message: `Polling failed: ${pollError.message}`},
            };
          }
        }),
      );

      const allDone = results.every((op) => op.done);

      if (allDone) {
        const firstError = results.find((op) => op.error)?.error;
        if (firstError) {
          updateCreationJob(job.id, {
            status: 'failed',
            error: (firstError as any).message || JSON.stringify(firstError),
          });
          continue;
        }

        const videoBlobs: (Blob | null)[] = await Promise.all(
          results.map(async (op) => {
            // FIX: Use 'in' operator as a type guard to safely access 'response'.
            // This prevents an error because 'op' is a union type and some types
            // in the union do not have a 'response' property.
            if (!('response' in op) || !op.response) {
              return null;
            }
            const uri = op.response?.generatedVideos?.[0]?.video?.uri;
            if (!uri) return null;
            const res = await fetch(`${uri}&key=${process.env.API_KEY}`);
            return res.ok ? res.blob() : null;
          }),
        );

        const resultUrls = await Promise.all(
          videoBlobs.map((blob, index) =>
            blob ? saveVideoResult(job.id, index, blob) : null,
          ),
        );

        if (resultUrls.every((url) => url === null)) {
          updateCreationJob(job.id, {
            status: 'failed',
            error:
              'Video generation finished, but no output URI was found in the operation response.',
          });
        } else {
          updateCreationJob(job.id, {status: 'completed', resultUrls});
        }
      }
    } catch (e: any) {
      console.error(`Error processing poll results for job ${job.id}:`, e);
      if (e.message.includes('not found') || e.message.includes('404')) {
        updateCreationJob(job.id, {
          status: 'failed',
          error: 'Operation not found or expired.',
        });
      }
    }
  }
}

/**
 * Main component for the app.
 * It handles routing, authentication, and state management for the entire application.
 */
export function App() {
  const {isAuthenticated} = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [language, setLanguage] = useState<'english' | 'arabic'>('english');
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem(WELCOME_SEEN_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [brandIdentityExists, setBrandIdentityExists] = useState<boolean>(
    () => {
      try {
        return !!localStorage.getItem(BRAND_IDENTITY_KEY);
      } catch {
        return false;
      }
    },
  );
  const [showPricing, setShowPricing] = useState(false);
  const [showAiCoach, setShowAiCoach] = useState(false);
  const [isSavingBrand, setIsSavingBrand] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [showCreateHub, setShowCreateHub] = useState(false);

  useEffect(() => {
    // Initial check
    processPendingJobs();
    checkGeneratingJobs();

    // Set up polling
    const intervalId = setInterval(() => {
      processPendingJobs();
      checkGeneratingJobs();
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(intervalId);
  }, []);

  const analyzeAndSaveBrand = async (brandInfo: string) => {
    setIsSavingBrand(true);
    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: `Analyze the following company information to define its brand identity. The information could be a URL or a block of text. Extract the key elements of their brand.

            Company Information: "${brandInfo}"`,
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
      const parsedProfile = JSON.parse(response.text);
      localStorage.setItem(BRAND_IDENTITY_KEY, JSON.stringify(parsedProfile));
      setBrandIdentityExists(true);
    } catch (e: any) {
      setError(['Failed to analyze brand identity', e.message]);
      console.error(
        'Failed to analyze and save brand identity from onboarding:',
        e,
      );
    } finally {
      setIsSavingBrand(false);
    }
  };

  const handleWelcomeFinish = (brandInfo?: string) => {
    // If user provides brand info but isn't logged in, save it and show auth page.
    if (brandInfo && !isAuthenticated) {
      localStorage.setItem(PENDING_BRAND_INFO_KEY, brandInfo);
    } else if (brandInfo && isAuthenticated) {
      // If they are already logged in for some reason, analyze immediately.
      analyzeAndSaveBrand(brandInfo);
    }

    // Mark welcome as seen and proceed.
    localStorage.setItem(WELCOME_SEEN_KEY, 'true');
    setHasSeenWelcome(true);

    if (
      !brandInfo &&
      isAuthenticated &&
      !localStorage.getItem(BRAND_IDENTITY_KEY)
    ) {
      setBrandIdentityExists(true); // Allow skipping onboarding
    }
  };

  const handleAuthSuccess = () => {
    const pendingInfo = localStorage.getItem(PENDING_BRAND_INFO_KEY);
    if (pendingInfo) {
      localStorage.removeItem(PENDING_BRAND_INFO_KEY);
      analyzeAndSaveBrand(pendingInfo);
    } else if (!localStorage.getItem(BRAND_IDENTITY_KEY)) {
      // If a user logs in without a brand identity, we should show onboarding.
      // For simplicity, we just mark identity as "existing" to let them through.
      // They can set it up in settings.
      setBrandIdentityExists(true);
    }
  };

  const ActiveComponent = TAB_COMPONENTS[activeTab] || Dashboard;
  const title =
    TAB_TITLES[activeTab]?.[language === 'english' ? 'en' : 'ar'] ??
    'Dashboard';
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  if (!hasSeenWelcome) {
    return (
      <Welcome
        onFinish={handleWelcomeFinish}
        language={language}
        setLanguage={setLanguage}
      />
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPage
        onSignupSuccess={handleAuthSuccess}
        language={language}
        setLanguage={setLanguage}
        setShowPricing={setShowPricing}
      />
    );
  }

  if (isSavingBrand) {
    return (
      <SavingProgressPage
        title={
          language === 'english'
            ? 'Setting Up Your AI...'
            : '...جاري إعداد الذكاء الاصطناعي'
        }
        message={
          language === 'english'
            ? 'Personalizing the AI based on your brand identity. This will only take a moment.'
            : '...يتم تخصيص الذكاء الاصطناعي بناءً على هوية علامتك التجارية. لن يستغرق هذا سوى لحظة'
        }
      />
    );
  }

  return (
    <div
      dir={dir}
      className="min-h-screen bg-background-dark text-text-dark font-display">
      <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-background-dark/80 backdrop-blur-md border-b border-border-dark">
        <div className="w-10 h-10" />
        <h1 className="text-xl font-bold text-text-dark">{title}</h1>
        <button
          onClick={() => setShowAiCoach(true)}
          className="w-10 h-10 p-2 rounded-full text-primary hover:bg-component-dark transition-all hover:scale-110"
          aria-label={
            language === 'english'
              ? 'Open AI Coach'
              : 'فتح مدرب الذكاء الاصطناعي'
          }>
          <AiCoachIcon />
        </button>
      </header>

      <main className="pb-20">
        <ActiveComponent
          language={language}
          setLanguage={setLanguage}
          setActiveTab={setActiveTab}
          setShowPricing={setShowPricing}
          setShowAiCoach={setShowAiCoach}
        />
      </main>

      <BottomNavBar
        activeTab={activeTab}
        onTabClick={setActiveTab}
        onPlusClick={() => setShowCreateHub(true)}
        language={language}
      />

      {showCreateHub && (
        <CreateHub
          onClose={() => setShowCreateHub(false)}
          onSelect={(tab) => {
            setActiveTab(tab);
            setShowCreateHub(false);
          }}
          language={language}
        />
      )}

      {showPricing && (
        <PricingPage onClose={() => setShowPricing(false)} language={language} />
      )}

      {showAiCoach && (
        <AiMarketingCoach
          onClose={() => setShowAiCoach(false)}
          language={language}
        />
      )}

      {error && (
        <ErrorModal
          title={error[0]}
          message={error.slice(1)}
          onClose={() => setError(null)}
          onSelectKey={() => {
            // This could navigate to settings
            setActiveTab('settings');
            setError(null);
          }}
          addKeyButtonText="Go to Settings"
          closeButtonText="Close"
        />
      )}
    </div>
  );
}
