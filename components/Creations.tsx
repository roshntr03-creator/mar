/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import {PageProps} from '../App';
import {getCreationJobs} from '../services/creationManager';
import {CreationJob, CreationJobStatus} from '../types';
import {ClapperboardIcon, SparklesIcon, UgcVideoIcon} from './icons';

interface CreationsProps extends PageProps {}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    noCreations: 'No Creations Yet',
    noCreationsDesc:
      'Your generated videos and content will appear here once you create them.',
    createNow: 'Create Now',
    status: {
      pending: 'Pending...',
      generating: 'Generating...',
      completed: 'Completed',
      failed: 'Failed',
    },
    part: 'Part',
    error: 'Error',
  },
  arabic: {
    noCreations: 'لا توجد إبداعات بعد',
    noCreationsDesc:
      'ستظهر مقاطع الفيديو والمحتوى الذي تم إنشاؤه هنا بمجرد إنشائها.',
    createNow: 'أنشئ الآن',
    status: {
      pending: 'قيد الانتظار...',
      generating: 'جاري التوليد...',
      completed: 'مكتمل',
      failed: 'فشل',
    },
    part: 'الجزء',
    error: 'خطأ',
  },
};

const JobStatusIndicator: React.FC<{
  status: CreationJobStatus;
  language: 'english' | 'arabic';
}> = ({status, language}) => {
  const texts = TEXTS[language].status;
  const statusConfig = {
    pending: {
      text: texts.pending,
      color: 'bg-yellow-500/20 text-yellow-400',
      icon: <div className="w-2 h-2 rounded-full bg-yellow-400"></div>,
    },
    generating: {
      text: texts.generating,
      color: 'bg-blue-500/20 text-blue-400',
      icon: (
        <div className="w-2.5 h-2.5 border-2 border-dashed rounded-full animate-spin border-blue-400"></div>
      ),
    },
    completed: {
      text: texts.completed,
      color: 'bg-green-500/20 text-green-400',
      icon: <div className="w-2 h-2 rounded-full bg-green-400"></div>,
    },
    failed: {
      text: texts.failed,
      color: 'bg-destructive/20 text-destructive',
      icon: <div className="w-2 h-2 rounded-full bg-destructive"></div>,
    },
  };

  const {text, color, icon} = statusConfig[status];

  return (
    <div
      className={`inline-flex items-center gap-2 px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

const CreationCard: React.FC<{
  job: CreationJob;
  language: 'english' | 'arabic';
}> = ({job, language}) => {
  const texts = TEXTS[language];
  const [videoUrls, setVideoUrls] = useState<(string | null)[]>([]);

  useEffect(() => {
    // Revoke old URLs on cleanup
    return () => {
      videoUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [videoUrls]);

  useEffect(() => {
    if (job.status === 'completed' && job.resultUrls) {
      setVideoUrls(job.resultUrls);
    }
  }, [job.status, job.resultUrls]);

  const Icon = job.type === 'ugc_video' ? UgcVideoIcon : ClapperboardIcon;
  const date = new Date(job.createdAt).toLocaleString(
    language === 'arabic' ? 'ar' : 'en-US',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  );

  return (
    <div className="bg-component-dark/30 rounded-xl border border-white/10 backdrop-blur-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-lg bg-background-dark flex-shrink-0 flex items-center justify-center">
              {job.thumbnailUrl ? (
                <img
                  src={job.thumbnailUrl}
                  alt="Thumbnail"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Icon className="w-8 h-8 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-text-dark leading-tight">
                {job.title}
              </h3>
              <p className="text-xs text-text-secondary mt-1">{date}</p>
            </div>
          </div>
          <JobStatusIndicator status={job.status} language={language} />
        </div>
      </div>

      {job.status === 'completed' && videoUrls.length > 0 && (
        <div
          className={`grid gap-4 p-4 pt-0 ${
            videoUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
          {videoUrls.map(
            (url, index) =>
              url && (
                <div key={index} className="rounded-lg overflow-hidden bg-black">
                  {videoUrls.length > 1 && (
                    <p className="text-center text-xs font-semibold text-text-secondary py-1 bg-background-dark">
                      {texts.part} {index + 1}
                    </p>
                  )}
                  <video
                    src={url}
                    controls
                    playsInline
                    className="w-full aspect-[9/16] object-cover"
                  />
                </div>
              ),
          )}
        </div>
      )}

      {job.status === 'failed' && (
        <div className="bg-destructive/10 p-4 border-t border-destructive/20">
          <p className="text-destructive font-semibold text-sm">{texts.error}:</p>
          <p className="text-destructive/80 text-xs mt-1">{job.error}</p>
        </div>
      )}
    </div>
  );
};

export const Creations: React.FC<CreationsProps> = ({language, setActiveTab}) => {
  const [jobs, setJobs] = useState<CreationJob[]>([]);
  const texts = TEXTS[language];

  useEffect(() => {
    const updateJobs = () => setJobs(getCreationJobs());
    updateJobs();

    // Listen for storage events to update in real-time
    window.addEventListener('storage', updateJobs);
    const intervalId = setInterval(updateJobs, 2000); // Also poll just in case

    return () => {
      window.removeEventListener('storage', updateJobs);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in pb-24">
      {jobs.length === 0 ? (
        <div className="text-center mt-16 flex flex-col items-center">
          <div className="w-24 h-24 flex items-center justify-center bg-component-dark/30 rounded-full border border-white/10 backdrop-blur-lg">
            <SparklesIcon className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-text-dark mt-6">
            {texts.noCreations}
          </h2>
          <p className="text-text-secondary mt-2 max-w-xs">
            {texts.noCreationsDesc}
          </p>
          <button
            onClick={() => setActiveTab && setActiveTab('ugc_video')}
            className="mt-8 px-8 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px">
            {texts.createNow}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <CreationCard key={job.id} job={job} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};