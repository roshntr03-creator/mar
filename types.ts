/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
/**
 * Interface defining the structure of a video object, including its ID, URL,
 * title, and description.
 */
export interface Video {
  id: string;
  videoUrl: string;
  title: string;
  description: string;
}

/**
 * Interface for the structured result of a competitor analysis.
 */
export interface AnalysisResult {
  targetAudience: string;
  toneOfVoice: string;
  contentStrengths: string[];
  contentWeaknesses: string[];
  howToCompete: string[];
}

// --- Creation Job System Types ---

export type CreationJobStatus =
  | 'pending'
  | 'generating'
  | 'completed'
  | 'failed';
export type CreationJobType = 'ugc_video' | 'promo_video';

export interface UgcVideoJobDetails {
  productImageBase64: string;
  productDescription: string;
  aspectRatio: '9:16' | '16:9';
  scripts: {script: string; part: number; total: number}[];
  gender: 'male' | 'female';
  interaction: string;
  personaDescription: string;
  vibe: string;
  setting: string;
  logoBase64?: string;
  logoMimeType?: string;
}

export interface PromoVideoJobDetails {
  prompts: {prompt: string; part: number; total: number}[];
  aspectRatio: '9:16' | '16:9';
  videoStyle: string;
  pacing: string;
}

export interface CreationJob {
  id: string;
  type: CreationJobType;
  status: CreationJobStatus;
  createdAt: string; // ISO string
  title: string; // The main user prompt
  details: UgcVideoJobDetails | PromoVideoJobDetails;
  operations?: string[];
  resultUrls?: (string | null)[];
  error?: string;
  thumbnailUrl: string; // Base64 data URL for UGC, or a placeholder
}