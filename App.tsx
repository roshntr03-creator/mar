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

export const SORA_API_KEY = '8774ae5d8c69b9009c49a774e9b12555';
export const SORA_API_BASE_URL = 'https://api.kie.ai/api/v1/jobs';
const SORA_MODEL_NAME = 'sora-2-text-to-video';

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

async function processPendingJobs() {
  const jobs = await getCreationJobs();
  const pendingJobs = jobs.filter((job) => job.status === 'pending');
  if (pendingJobs.length === 0) return;

  for (const job of pendingJobs) {
    try {
      updateCreationJob(job.id, {status: 'generating'});

      // Special case for Image-to-Video Promo which has a different API structure and is always single-part.
      if (
        job.type === 'promo_video' &&
        (job.details as PromoVideoJobDetails).isImageToVideo
      ) {
        const details = job.details as PromoVideoJobDetails;
        const response = await fetch(`${SORA_API_BASE_URL}/createTask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SORA_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'sora-2-image-to-video',
            input: {
              prompt: details.prompts[0].prompt,
              image_urls: [
                'https://file.aiquickdraw.com/custom-page/akr/section-images/17594315607644506ltpf.jpg',
              ],
              aspect_ratio:
                details.aspectRatio === '9:16' ? 'portrait' : 'landscape',
              n_frames: details.n_frames.toString(),
              remove_watermark: true,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Sora API Error: ${errorData.msg || response.statusText}`,
          );
        }

        const taskData = await response.json();
        if (taskData?.data?.taskId) {
          updateCreationJob(job.id, {operations: [taskData.data.taskId]});
        } else {
          throw new Error(
            `Sora API did not return a valid task ID. Response: ${JSON.stringify(
              taskData,
            )}`,
          );
        }
        continue; // Job handled, move to the next one
      }

      // Existing logic for UGC and Text-to-Video Promo jobs
      const taskIds: string[] = [];
      const jobDetailsList: {prompt: string; aspect_ratio: string}[] = [];

      if (job.type === 'ugc_video') {
        const details = job.details as UgcVideoJobDetails;
        for (const scriptInfo of details.scripts) {
          let fullPrompt = `Product: ${details.productDescription}. Persona: ${details.personaDescription}. Action: ${details.interaction}. Dialogue: "${scriptInfo.script}". Vibe: ${details.vibe}. Setting: ${details.setting}.`;
          if (details.videoPrompt && details.videoPrompt.trim() !== '') {
            fullPrompt += ` Instructions: ${details.videoPrompt}.`;
          }
          jobDetailsList.push({
            prompt: fullPrompt,
            aspect_ratio:
              details.aspectRatio === '9:16' ? 'portrait' : 'landscape',
          });
        }
      } else if (job.type === 'promo_video') {
        const details = job.details as PromoVideoJobDetails;
        for (const promptInfo of details.prompts) {
          jobDetailsList.push({
            prompt: `Concept: "${promptInfo.prompt}". Style: ${details.videoStyle}. Pacing: ${details.pacing}.`,
            aspect_ratio:
              details.aspectRatio === '9:16' ? 'portrait' : 'landscape',
          });
        }
      }

      for (const details of jobDetailsList) {
        const response = await fetch(`${SORA_API_BASE_URL}/createTask`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${SORA_API_KEY}`,
          },
          body: JSON.stringify({
            model: SORA_MODEL_NAME,
            input: {
              prompt: details.prompt,
              aspect_ratio: details.aspect_ratio,
              n_frames: (
                job.details as UgcVideoJobDetails | PromoVideoJobDetails
              ).n_frames.toString(),
              remove_watermark: true,
            },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `Sora API Error: ${errorData.msg || response.statusText}`,
          );
        }

        const taskData = await response.json();
        if (taskData?.data?.taskId) {
          taskIds.push(taskData.data.taskId);
        } else {
          throw new Error(
            `Sora API did not return a valid task ID. Response: ${JSON.stringify(
              taskData,
            )}`,
          );
        }
      }
      updateCreationJob(job.id, {operations: taskIds});
    } catch (e: any) {
      console.error(`Failed to start job ${job.id}:`, e);
      updateCreationJob(job.id, {status: 'failed', error: e.message});
    }
  }
}

async function checkGeneratingJobs() {
  const jobs = await getCreationJobs();
  const generatingJobs = jobs.filter((job) => job.status === 'generating');
  if (generatingJobs.length === 0) return;

  for (const job of generatingJobs) {
    if (!job.operations || job.operations.length === 0) {
      continue;
    }

    try {
      const results = await Promise.all(
        (job.operations as string[]).map(async (taskId) => {
          const response = await fetch(
            `${SORA_API_BASE_URL}/recordInfo?taskId=${taskId}`,
            {
              headers: {
                Authorization: `Bearer ${SORA_API_KEY}`,
              },
            },
          );
          if (!response.ok) {
            return {
              data: {
                state: 'fail',
                failMsg: `Polling failed with status ${response.status}`,
              },
            };
          }
          return response.json();
        }),
      );

      const allDone = results.every(
        (res) => res.data.state === 'success' || res.data.state === 'fail',
      );

      if (allDone) {
        const firstErrorResult = results.find(
          (res) => res.data.state === 'fail',
        );
        if (firstErrorResult) {
          updateCreationJob(job.id, {
            status: 'failed',
            error:
              firstErrorResult.data.failMsg ||
              'Unknown error during generation.',
          });
          continue;
        }

        const videoBlobs: (Blob | null)[] = await Promise.all(
          results.map(async (res) => {
            const resultJson = res.data.resultJson
              ? JSON.parse(res.data.resultJson)
              : null;
            const uri = resultJson?.resultUrls?.[0];
            if (!uri) return null;

            // --- Robust video download with retries ---
            let videoBlob: Blob | null = null;
            const maxRetries = 3;
            const retryDelay = 2000; // 2 seconds

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
              try {
                const videoResponse = await fetch(uri);
                if (!videoResponse.ok) {
                  throw new Error(
                    `Fetch failed with status ${videoResponse.status}`,
                  );
                }
                const contentLengthHeader =
                  videoResponse.headers.get('content-length');
                const videoArrayBuffer = await videoResponse.arrayBuffer();

                if (contentLengthHeader) {
                  const expectedSize = parseInt(contentLengthHeader, 10);
                  if (videoArrayBuffer.byteLength < expectedSize) {
                    throw new Error(
                      `Incomplete download. Expected ${expectedSize} bytes, got ${videoArrayBuffer.byteLength}`,
                    );
                  }
                }

                if (videoArrayBuffer.byteLength === 0) {
                  throw new Error('Downloaded file is empty.');
                }

                const contentType =
                  videoResponse.headers.get('content-type') || 'video/mp4';
                videoBlob = new Blob([videoArrayBuffer], {type: contentType});
                break; // Success
              } catch (e) {
                console.error(
                  `Attempt ${attempt} to download video from ${uri} failed:`,
                  e,
                );
                if (attempt < maxRetries) {
                  await new Promise((resolve) =>
                    setTimeout(resolve, retryDelay),
                  );
                }
              }
            }
            return videoBlob;
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
              'Video generation finished, but failed to download the final video file.',
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