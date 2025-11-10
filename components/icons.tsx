/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// Common props for all icons, allowing className and other SVG attributes.
type IconProps = React.SVGProps<SVGSVGElement>;

// --- NEW GRADIENT LINE ICON SYSTEM ---
// A complete rewrite based on user feedback for a modern, clear, and unique aesthetic.
// Feature icons use a subtle gradient stroke, integrating them with the app's branding.
// Utility icons are clean, single-color line art for maximum clarity and function.

// --- GRADIENT FEATURE ICONS ---

export const AiCoachIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-aicoach" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" stroke="url(#grad-aicoach)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8v4" stroke="url(#grad-aicoach)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 16h.01" stroke="url(#grad-aicoach)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-dashboard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="6" height="6" rx="1" stroke="url(#grad-dashboard)" strokeWidth="1.5"/>
    <rect x="4" y="14" width="6" height="6" rx="1" stroke="url(#grad-dashboard)" strokeWidth="1.5"/>
    <rect x="14" y="4" width="6" height="6" rx="1" stroke="url(#grad-dashboard)" strokeWidth="1.5"/>
    <rect x="14" y="14" width="6" height="6" rx="1" stroke="url(#grad-dashboard)" strokeWidth="1.5"/>
  </svg>
);

export const UgcVideoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-ugc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <rect x="7" y="2" width="10" height="20" rx="2" stroke="url(#grad-ugc)" strokeWidth="1.5"/>
    <path d="m10.5 11 3 2-3 2v-4Z" stroke="url(#grad-ugc)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ClapperboardIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-clapperboard" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M4 8h16M4 12h16M4 16h16M16 4 8 8" stroke="url(#grad-clapperboard)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 4h16v16H4V4Z" stroke="url(#grad-clapperboard)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-photo" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="url(#grad-photo)" strokeWidth="1.5"/>
    <circle cx="8.5" cy="8.5" r="1.5" stroke="url(#grad-photo)" strokeWidth="1.5"/>
    <path d="m21 15-5-5-11 11" stroke="url(#grad-photo)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-doc" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="url(#grad-doc)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="url(#grad-doc)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-wand" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="m3 21 6-6m4-4 6-6-4-4-6 6-4 4Zm0 0-3 3" stroke="url(#grad-wand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-sparkles" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M12 3v3m0 15v-3m9-9h-3M6 12H3m16.5-7.5-2.12 2.12M8.62 15.38 6.5 17.5M17.5 6.5 15.38 8.62M8.62 8.62 6.5 6.5" stroke="url(#grad-sparkles)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const CreationsIcon: React.FC<IconProps> = (props) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
          <linearGradient id="grad-creations" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2Z" stroke="url(#grad-creations)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-lightbulb" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M9 18h6v2a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-2Z" stroke="url(#grad-lightbulb)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 18h6M12 2a6 6 0 0 1 6 6c0 2-1 4-3 5H9c-2-1-3-3-3-5a6 6 0 0 1 6-6Z" stroke="url(#grad-lightbulb)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-shield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" stroke="url(#grad-shield)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="m9 12 2 2 4-4" stroke="url(#grad-shield)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const MegaphoneIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-megaphone" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M10 10H4c-1.1 0-2 .9-2 2v0a2 2 0 0 0 2 2h6m0-4 8-4v12l-8-4m0-4v4" stroke="url(#grad-megaphone)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 10v4" stroke="url(#grad-megaphone)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AnalysisIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-analysis" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <path d="M8 12v5m4-7v7m4-9v9" stroke="url(#grad-analysis)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="11" cy="8" r="5" stroke="url(#grad-analysis)" strokeWidth="1.5"/>
    <path d="m14.5 11.5 3 3" stroke="url(#grad-analysis)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

export const Cog6ToothIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="grad-cog" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A855F7" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="3" stroke="url(#grad-cog)" strokeWidth="1.5"/>
    <path d="M12 2v2m0 16v2M22 12h-2m-16 0H2m17.5-7.5-1.414 1.414M4.929 19.071 3.515 20.485m14.142 0-1.414-1.414M4.929 4.929 3.515 3.515" stroke="url(#grad-cog)" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);


// --- UTILITY & ACTION ICONS ---
// Simple, single-color line art for clarity and flexibility.

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const Bars3Icon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
  </svg>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 00-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
  </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 01-2.25 2.25h-1.5a2.25 2.25 0 01-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
  </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m12 0v-1.5a6 6 0 00-12 0v1.5m6 7.5v4.5m-3.75-10.5a7.5 7.5 0 0115 0v1.5a7.5 7.5 0 01-15 0v-1.5z" />
  </svg>
);

// --- BRAND ICONS (UNCHANGED) ---

export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.697 44 34 44 31c0-5.202-2.699-9.713-6.852-12.22z" />
  </svg>
);

// --- DEPRECATED ICONS (Filled Style) - Kept for reference, not used in main UI ---

export const BoltIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m13.06 3.1-.38 2.26c.72.21 1.4.55 2 .98l2.2-1a.75.75 0 0 1 .94.3l.03.05.8 1.39-12.78 7.37.28 1.54 5.3-3.06-2.58 4.47h6.6L13.06 3.1Z" fillOpacity=".4"/>
    <path d="M8.25 2.5a.5.5 0 0 0-.87.5l4 8a.5.5 0 0 0 .87-.5l-4-8ZM10.5 13H7.8l6.3-10.9A1.5 1.5 0 0 1 15.45 3l.05.02L12 11h3.33a.5.5 0 0 1 .43.75l-5 9a.5.5 0 0 1-.9-.32l1.64-9.18Z"/>
  </svg>
);

export const BuildingOfficeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3.5 21.5h17v-13a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v13Z" fillOpacity=".4"/>
    <path d="M8.5 2.5h-4a1 1 0 0 0-1 1v17h6v-18Zm-4 2h3v2h-3v-2Zm0 4h3v2h-3v-2Zm0 4h3v2h-3v-2Zm11 6h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2v-2h-2v2Zm-4 8h2v-2h-2v2Zm0-4h2v-2h-2v2Zm0-4h2v-2h-2v2Z"/>
  </svg>
);

export const FaceSmileIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 21.5a9.5 9.5 0 1 1 0-19 9.5 9.5 0 0 1 0 19Z" fillOpacity=".4"/>
    <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19ZM2 12a10 10 0 1 1 20 0 10 10 0 0 1-20 0Zm7-2a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm6 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0Zm-1.5 3.5a3.5 3.5 0 0 1-5 0 .5.5 0 0 1 .4-.8h4.2a.5.5 0 0 1 .4.8Z"/>
  </svg>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4.5 10.5v10h15v-10l-7.5-6-7.5 6Z" fillOpacity=".4"/>
    <path d="M9.5 20.5v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h4v-9l-7-5.25-7 5.25v9h4Z"/>
  </svg>
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 17.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11Z" fillOpacity=".4"/>
    <path d="M12 5.5a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2a.5.5 0 0 1 .5-.5ZM12 18.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 1 0v2a.5.5 0 0 1-.5.5ZM17.2 7.87a.5.5 0 0 1 0-.7l1.42-1.42a.5.5 0 1 1 .7.7l-1.41 1.42a.5.5 0 0 1-.71 0ZM6.8 18.27a.5.5 0 0 1 0-.7l1.41-1.42a.5.5 0 0 1 .71.71l-1.42 1.41a.5.5 0 0 1-.7 0ZM18.5 12.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 0 1ZM8.5 12.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 0 1ZM17.2 17.27a.5.5 0 0 1-.7 0l-1.42-1.41a.5.5 0 0 1 .7-.71l1.42 1.42a.5.5 0 0 1 0 .7ZM6.8 7.87a.5.5 0 0 1-.7 0L4.68 6.46a.5.5 0 1 1 .7-.7l1.42 1.4a.5.5 0 0 1 0 .71Z"/>
  </svg>
);
