/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useEffect, useState} from 'react';
import {PageProps} from '../App';
import {getCreationJobs, getVideoUrlByKey} from '../services/creationManager';
import {CreationJob, CreationJobStatus} from '../types';
import {ClapperboardIcon, SparklesIcon, UgcVideoIcon} from './icons';

interface CreationsProps extends PageProps {}

const TEXTS: Record<'english' | 'arabic', any> = {
  english: {
    noCreations: 'No Creations Yet',
    noCreationsDesc:
      'Your masterpiece is waiting to be made.',
    createNow: 'Start Creating',
    status: {
      pending: 'Pending',
      generating: 'Creating',
      completed: 'Ready',
      failed: 'Failed',
    },
    part: 'Part',
    error: 'Error',
  },
  arabic: {
    noCreations: 'لا إبداعات',
    noCreationsDesc:
      'تحفتك الفنية بانتظارك.',
    createNow: 'ابدأ الإنشاء',
    status: {
      pending: 'قيد الانتظار',
      generating: 'جاري الإنشاء',
      completed: 'جاهز',
      failed: 'فشل',
    },
    part: 'جزء',
    error: 'خطأ',
  },
};

const JobStatusIndicator: React.FC<{
  status: CreationJobStatus;
  language: 'english' | 'arabic';
}> = ({status, language}) => {
  const texts = TEXTS[language].status;
  const statusConfig = {
    pending: { text: texts.pending, color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
    generating: { text: texts.generating, color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    completed: { text: texts.completed, color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    failed: { text: texts.failed, color: 'bg-red-500/20 text-red-300 border-red-500/30' },
  };

  const {text, color} = statusConfig[status];

  return (
    <div className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${color}`}>
      {text}
    </div>
  );
};

const CreationCard: React.FC<{
  job: CreationJob;
  language: 'english' | 'arabic';
}> = ({job, language}) => {
  const texts = TEXTS[language];
  const [displayUrls, setDisplayUrls] = useState<(string | null)[]>([]);

  useEffect(() => {
    let isMounted = true;
    const loadedUrls: string[] = [];

    const loadVideoUrls = async () => {
      if (job.status === 'completed' && job.resultUrls) {
        const urls = await Promise.all(
          job.resultUrls.map(async (key) => {
            if (!key) return null;
            try {
              const url = await getVideoUrlByKey(key);
              loadedUrls.push(url); 
              return url;
            } catch (error) {
              return null;
            }
          }),
        );
        if (isMounted) {
          setDisplayUrls(urls);
        }
      }
    };

    loadVideoUrls();

    return () => {
      isMounted = false;
      loadedUrls.forEach((url) => {
        if (url) URL.revokeObjectURL(url);
      });
    };
  }, [job.status, job.resultUrls]);

  const Icon = job.type === 'ugc_video' ? UgcVideoIcon : ClapperboardIcon;
  const date = new Date(job.createdAt).toLocaleDateString(
    language === 'arabic' ? 'ar-EG' : 'en-US',
    { month: 'short', day: 'numeric' }
  );
  const hasThumbnail = job.thumbnailUrl && job.thumbnailUrl.startsWith('data:');

  return (
    <div className="glass-card rounded-[2rem] overflow-hidden animate-slide-up border border-white/10 hover:bg-white/5 transition-colors">
      <div className="p-5 flex items-start gap-5">
         <div className="w-20 h-20 rounded-2xl bg-white/5 flex-shrink-0 overflow-hidden border border-white/5 relative">
            {hasThumbnail ? (
                <img src={job.thumbnailUrl} alt="Thumb" className="w-full h-full object-cover opacity-90" />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white/30" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
         </div>
         <div className="flex-1 min-w-0 py-1">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white truncate pr-2 text-lg">{job.title}</h3>
                <span className="text-xs text-white/40 whitespace-nowrap mt-1 font-medium bg-white/5 px-2 py-1 rounded-lg">{date}</span>
            </div>
            <div className="flex justify-between items-center mt-4">
               <p className="text-xs text-white/50 truncate max-w-[120px] font-bold uppercase tracking-wider">
                  {job.type === 'ugc_video' ? 'UGC Video' : 'Promo Video'}
               </p>
               <JobStatusIndicator status={job.status} language={language} />
            </div>
         </div>
      </div>

      {job.status === 'completed' && displayUrls.length > 0 && (
        <div className={`grid gap-2 px-2 pb-2 ${displayUrls.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {displayUrls.map(
            (url, index) =>
              url && (
                <div key={index} className="relative rounded-[1.5rem] overflow-hidden bg-black aspect-[9/16] border border-white/10 shadow-lg">
                  <video
                    src={url}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              ),
          )}
        </div>
      )}

      {job.status === 'failed' && (
        <div className="px-5 pb-5">
          <div className="bg-red-500/10 p-4 rounded-2xl border border-red-500/20 flex items-center gap-3">
            <span className="material-symbols-rounded text-red-400">error</span>
            <p className="text-red-300 text-sm font-medium">{job.error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const Creations: React.FC<CreationsProps> = ({language, setActiveTab}) => {
  const [jobs, setJobs] = useState<CreationJob[]>([]);
  const texts = TEXTS[language];

  useEffect(() => {
    const updateJobs = async () => {
      const newJobs = await getCreationJobs();
      setJobs((prevJobs) => {
        if (JSON.stringify(newJobs) === JSON.stringify(prevJobs)) {
          return prevJobs;
        }
        return newJobs;
      });
    };

    updateJobs();
    window.addEventListener('storage', updateJobs);
    const intervalId = setInterval(updateJobs, 2000);
    return () => {
      window.removeEventListener('storage', updateJobs);
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="p-4 pb-24 space-y-6 animate-slide-up max-w-2xl mx-auto pt-8">
      <h1 className="text-3xl font-bold text-white px-2 mb-6">{language === 'arabic' ? 'إبداعاتي' : 'My Creations'}</h1>
      
      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-32 h-32 rounded-[3rem] bg-white/5 flex items-center justify-center mb-8 animate-pulse border border-white/10 shadow-lg">
             <SparklesIcon className="w-16 h-16 text-white/30" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">{texts.noCreations}</h2>
          <p className="text-white/50 mb-10 max-w-xs mx-auto text-base leading-relaxed font-medium">
            {texts.noCreationsDesc}
          </p>
          <button
            onClick={() => setActiveTab && setActiveTab('ugc_video')}
            className="px-10 py-5 rounded-full bg-gradient-to-r from-primary-start to-primary-end text-white font-bold text-lg shadow-glow hover:scale-105 transition-transform border border-white/10">
            {texts.createNow}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {jobs.map((job) => (
            <CreationCard key={job.id} job={job} language={language} />
          ))}
        </div>
      )}
    </div>
  );
};
