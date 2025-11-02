/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {openDB} from 'idb';
import {CreationJob} from '../types';

const JOBS_KEY = 'aiMarketingSuite_creationJobs';
const DB_NAME = 'AiMarketingSuiteDB';
const STORE_NAME = 'videoStore';

// --- LocalStorage Job Metadata Management ---

export function getCreationJobs(): CreationJob[] {
  try {
    const storedJobs = localStorage.getItem(JOBS_KEY);
    return storedJobs ? JSON.parse(storedJobs) : [];
  } catch (e) {
    console.error('Failed to parse creation jobs from localStorage', e);
    return [];
  }
}

function saveCreationJobs(jobs: CreationJob[]) {
  try {
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
    // Dispatch a storage event so other tabs/components can react
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save creation jobs to localStorage', e);
  }
}

export function addCreationJob(newJob: CreationJob) {
  const jobs = getCreationJobs();
  // Add to the beginning of the list
  saveCreationJobs([newJob, ...jobs]);
}

export function updateCreationJob(
  jobId: string,
  updates: Partial<CreationJob>,
) {
  const jobs = getCreationJobs();
  const jobIndex = jobs.findIndex((job) => job.id === jobId);
  if (jobIndex > -1) {
    jobs[jobIndex] = {...jobs[jobIndex], ...updates};
    saveCreationJobs(jobs);
  }
}

// --- IndexedDB Video Blob Management ---

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE_NAME);
    },
  });
}

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
  await db.put(STORE_NAME, videoBlob, key);
  return key; // Return the key, not a temporary URL
}

/**
 * Retrieves a video blob from IndexedDB using its key and creates a valid,
 * temporary Object URL for playback.
 */
export async function getVideoUrlByKey(key: string): Promise<string> {
  const db = await getDB();
  const blob = await db.get(STORE_NAME, key);
  if (blob instanceof Blob) {
    return URL.createObjectURL(blob);
  }
  throw new Error(`Video blob not found for key: ${key}`);
}
