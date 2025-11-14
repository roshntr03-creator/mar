/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {openDB} from 'idb';
import {CreationJob, UgcVideoJobDetails} from '../types';

const JOBS_KEY = 'aiMarketingSuite_creationJobs';
const DB_NAME = 'AiMarketingSuiteDB';
const VIDEO_STORE_NAME = 'videoStore';
const ASSETS_STORE_NAME = 'jobAssets';

// --- DB Setup ---
async function getDB() {
  return openDB(DB_NAME, 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        db.createObjectStore(VIDEO_STORE_NAME);
      }
      if (oldVersion < 2) {
        db.createObjectStore(ASSETS_STORE_NAME);
      }
    },
  });
}

// --- IndexedDB Asset Management ---
async function saveAsset(key: string, data: string): Promise<void> {
  const db = await getDB();
  await db.put(ASSETS_STORE_NAME, data, key);
}

async function getAsset(key: string): Promise<string | undefined> {
  const db = await getDB();
  return db.get(ASSETS_STORE_NAME, key);
}

// --- LocalStorage Job Metadata Management (Internal) ---
function getRawCreationJobs(): CreationJob[] {
  try {
    const storedJobs = localStorage.getItem(JOBS_KEY);
    return storedJobs ? JSON.parse(storedJobs) : [];
  } catch (e) {
    console.error('Failed to parse creation jobs from localStorage', e);
    return [];
  }
}

function saveRawCreationJobs(jobs: CreationJob[]) {
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save creation jobs to localStorage', e);
  }
}

// --- Public API for Job Management ---

/**
 * Retrieves all creation jobs, hydrating them with large assets from IndexedDB.
 */
export async function getCreationJobs(): Promise<CreationJob[]> {
  const rawJobs = getRawCreationJobs();

  const hydratedJobs = await Promise.all(
    rawJobs.map(async (job) => {
      const hydratedJob = {...job};

      if (hydratedJob.thumbnailKey) {
        hydratedJob.thumbnailUrl = await getAsset(hydratedJob.thumbnailKey);
      }

      if (hydratedJob.type === 'ugc_video') {
        const details = hydratedJob.details as UgcVideoJobDetails;
        if (details.productImageKey) {
          details.productImageBase64 = await getAsset(details.productImageKey);
        }
        if (details.logoImageKey) {
          details.logoBase64 = await getAsset(details.logoImageKey);
        }
      }
      return hydratedJob;
    }),
  );

  return hydratedJobs;
}

/**
 * Adds a new creation job, storing large assets in IndexedDB and metadata in localStorage.
 */
export async function addCreationJob(newJob: CreationJob): Promise<void> {
  const jobToStore = JSON.parse(JSON.stringify(newJob));
  const jobId = jobToStore.id;

  // Handle and strip thumbnail
  if (jobToStore.thumbnailUrl) {
    const key = `${jobId}_thumbnail`;
    await saveAsset(key, jobToStore.thumbnailUrl);
    jobToStore.thumbnailKey = key;
    delete jobToStore.thumbnailUrl;
  }

  // Handle and strip UGC details
  if (jobToStore.type === 'ugc_video') {
    const details = jobToStore.details as UgcVideoJobDetails;
    if (details.productImageBase64) {
      const key = `${jobId}_productImage`;
      await saveAsset(key, details.productImageBase64);
      details.productImageKey = key;
      delete details.productImageBase64;
    }
    if (details.logoBase64) {
      const key = `${jobId}_logoImage`;
      await saveAsset(key, details.logoBase64);
      details.logoImageKey = key;
      delete details.logoBase64;
    }
  }

  const jobs = getRawCreationJobs();
  saveRawCreationJobs([jobToStore, ...jobs]);
}

/**
 * Updates a job's metadata in localStorage.
 */
export function updateCreationJob(
  jobId: string,
  updates: Partial<CreationJob>,
) {
  const jobs = getRawCreationJobs();
  const jobIndex = jobs.findIndex((job) => job.id === jobId);
  if (jobIndex > -1) {
    jobs[jobIndex] = {...jobs[jobIndex], ...updates};
    saveRawCreationJobs(jobs);
  }
}

// --- IndexedDB Video Blob Management ---

/**
 * Saves a video blob to IndexedDB and returns the key used to store it.
 */
export async function saveVideoResult(
  jobId: string,
  partIndex: number,
  videoBlob: Blob,
): Promise<string> {
  const db = await getDB();
  const key = `${jobId}_${partIndex}`;
  await db.put(VIDEO_STORE_NAME, videoBlob, key);
  return key;
}

/**
 * Retrieves a video blob from IndexedDB using its key and creates a valid,
 * temporary Object URL for playback.
 */
export async function getVideoUrlByKey(key: string): Promise<string> {
  const db = await getDB();
  const blob = await db.get(VIDEO_STORE_NAME, key);
  if (blob instanceof Blob) {
    return URL.createObjectURL(blob);
  }
  throw new Error(`Video blob not found for key: ${key}`);
}