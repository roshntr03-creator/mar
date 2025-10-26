/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// Common props for all icons, allowing className and other SVG attributes.
type IconProps = React.SVGProps<SVGSVGElement>;

// --- NEW 3D GLASS ICON SYSTEM ---
// A vibrant, dimensional, and expressive icon set designed for a premium,
// modern user experience. This replaces the previous flat icon style.

// --- GENERAL UI ICONS ---

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export const Bars3Icon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);


// --- FEATURE ICONS (REDESIGNED FOR CLARITY & 3D STYLE) ---

export const AiCoachIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="ai-grad" x1="5.5" y1="4" x2="18.5" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#A855F7"/>
        <stop offset="1" stopColor="#EC4899"/>
      </linearGradient>
    </defs>
    <path d="M15 14.5C15 15.6046 14.1046 16.5 13 16.5H7.5L4 20V6.5C4 5.39543 4.89543 4.5 6 4.5H13C14.1046 4.5 15 5.39543 15 6.5V14.5Z" fill="#2A2A2A" stroke="#4A4A4A"/>
    <path d="M10.3396 11.534C10.7433 12.3524 10.3353 13.5 9.49994 13.5C8.66456 13.5 8.25651 12.3524 8.66023 11.534C8.85966 11.1292 9.07062 10.7412 9.49994 10.7412C9.92925 10.7412 10.1402 11.1292 10.3396 11.534Z" fill="url(#ai-grad)"/>
    <path d="M12.5 9.25C12.5 10.15 12.125 11 11.5 11C10.875 11 10.5 10.15 10.5 9.25C10.5 8.35 10.875 7.5 11.5 7.5C12.125 7.5 12.5 8.35 12.5 9.25Z" fill="url(#ai-grad)"/>
    <path d="M7.5 9.25C7.5 10.15 7.125 11 6.5 11C5.875 11 5.5 10.15 5.5 9.25C5.5 8.35 5.875 7.5 6.5 7.5C7.125 7.5 7.5 8.35 7.5 9.25Z" fill="url(#ai-grad)"/>
    <path d="M9.5 7C9.5 7.9 9.125 8.75 8.5 8.75C7.875 8.75 7.5 7.9 7.5 7C7.5 6.1 7.875 5.25 8.5 5.25C9.125 5.25 9.5 6.1 9.5 7Z" fill="url(#ai-grad)"/>
  </svg>
);


export const DashboardIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3" y="3" width="8" height="8" rx="2" fill="#C084FC" fillOpacity="0.3" />
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" fill="#C084FC" />
    <rect x="13" y="3" width="8" height="8" rx="2" fill="#2A2A2A" />
    <rect x="3" y="13" width="8" height="8" rx="2" fill="#2A2A2A" />
    <rect x="13" y="13" width="8" height="8" rx="2" fill="#2A2A2A" />
  </svg>
);

export const UgcVideoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="4" y="2" width="16" height="20" rx="3" fill="#2A2A2A" stroke="#4A4A4A"/>
    <circle cx="12" cy="8" r="3" fill="#C084FC"/>
    <path d="M17 14H7C7 14 7 18 12 18C17 18 17 14 17 14Z" fill="#C084FC"/>
    <circle cx="12" cy="12" r="8" fill="black" fillOpacity="0.2"/>
  </svg>
);


export const ClapperboardIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" fill="#2A2A2A" stroke="#4A4A4A"/>
    <path d="M4.17267 5.16116L5.58688 3.74695L9.5 7.6596L8.08579 9.07381L4.17267 5.16116Z" fill="#C084FC"/>
    <path d="M9.5 7.6596L10.9142 6.24539L14.8273 10.158L13.4131 11.5722L9.5 7.6596Z" fill="#C084FC"/>
    <path d="M14.8273 10.158L16.2415 8.74379L20.1542 12.6564L18.74 14.0706L14.8273 10.158Z" fill="#C084FC"/>
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="2" y="5" width="20" height="15" rx="3" fill="#2A2A2A" stroke="#4A4A4A"/>
    <path d="M21 8L15 14L11 10L3 18" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="8" cy="10" r="2" fill="#EC4899"/>
  </svg>
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M6 2H14L20 8V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" fill="#2A2A2A" stroke="#4A4A4A"/>
    <path d="M14 2V8H20" stroke="#4A4A4A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="13" x2="16" y2="13" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
    <line x1="8" y1="17" x2="13" y2="17" stroke="#C084FC" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 21L12.5 11.5M12.5 11.5L10 9M12.5 11.5L15 14" stroke="url(#wand-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12.5 3L15 5.5L18 4L19 7L21 9.5L18.5 12L19.5 15L17 17L14.5 16L12 18L9.5 16L7 17L6 14L3.5 12L6 9.5L7 6L9.5 5L12.5 3Z" fill="#A855F7"/>
    <defs>
      <linearGradient id="wand-grad" x1="3" y1="21" x2="15" y2="14" gradientUnits="userSpaceOnUse">
        <stop stopColor="#C0C0C0"/>
        <stop offset="1" stopColor="#808080"/>
      </linearGradient>
    </defs>
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L14.09 7.91L20 10L14.09 12.09L12 18L9.91 12.09L4 10L9.91 7.91L12 2Z" fill="#EC4899"/>
    <path d="M19 15L19.7 17.3L22 18L19.7 18.7L19 21L18.3 18.7L16 18L18.3 17.3L19 15Z" fill="#C084FC"/>
  </svg>
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M9 19C9 20.1046 9.89543 21 11 21H13C14.1046 21 15 20.1046 15 19V18H9V19Z" fill="#4A4A4A"/>
    <path d="M12 2C8.68629 2 6 4.68629 6 8C6 10.2618 7.1643 12.2155 8.87413 13.3333C8.95554 13.3932 9 13.4835 9 13.5786V17H15V13.5786C15 13.4835 15.0445 13.3932 15.1259 13.3333C16.8357 12.2155 18 10.2618 18 8C18 4.68629 15.3137 2 12 2Z" fill="url(#bulb-grad)"/>
    <rect x="9.5" y="6.5" width="5" height="5" rx="2.5" fill="white" fillOpacity="0.8"/>
    <defs>
      <linearGradient id="bulb-grad" x1="12" y1="2" x2="12" y2="17" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24"/>
        <stop offset="1" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 2L4 5V11C4 16.5 7.5 21.5 12 22C16.5 21.5 20 16.5 20 11V5L12 2Z" fill="url(#shield-grad)"/>
    <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
        <linearGradient id="shield-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7"/>
            <stop offset="1" stopColor="#6D28D9"/>
        </linearGradient>
    </defs>
  </svg>
);

export const MegaphoneIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 8H7V16H4V8Z" fill="#4A4A4A"/>
    <path d="M7 9L18 4V20L7 15V9Z" fill="url(#mega-grad)"/>
    <defs>
      <linearGradient id="mega-grad" x1="7" y1="12" x2="18" y2="12" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EC4899"/>
        <stop offset="1" stopColor="#D946EF"/>
      </linearGradient>
    </defs>
  </svg>
);

export const TelescopeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="11" cy="11" r="7" stroke="url(#scope-grad)" strokeWidth="3"/>
    <line x1="16" y1="16" x2="20" y2="20" stroke="#4A4A4A" strokeWidth="4" strokeLinecap="round"/>
    <defs>
        <linearGradient id="scope-grad" x1="11" y1="4" x2="11" y2="18" gradientUnits="userSpaceOnUse">
            <stop stopColor="#60A5FA"/>
            <stop offset="1" stopColor="#3B82F6"/>
        </linearGradient>
    </defs>
  </svg>
);

export const Cog6ToothIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" fill="#C084FC"/>
    <path d="M19.4 15L21.5 16.2C21.8 16.4 22 16.7 22 17.1V18.9C22 19.3 21.8 19.6 21.5 19.8L19.4 21C19 21.2 18.6 21.2 18.2 21L16 20.1V18.2L18.2 16C18.6 15.8 19 15.8 19.4 15Z" fill="#4A4A4A"/>
    <path d="M4.6 15L2.5 16.2C2.2 16.4 2 16.7 2 17.1V18.9C2 19.3 2.2 19.6 2.5 19.8L4.6 21C5 21.2 5.4 21.2 5.8 21L8 20.1V18.2L5.8 16C5.4 15.8 5 15.8 4.6 15Z" fill="#4A4A4A"/>
    <path d="M4.6 9L2.5 7.8C2.2 7.6 2 7.3 2 6.9V5.1C2 4.7 2.2 4.4 2.5 4.2L4.6 3C5 2.8 5.4 2.8 5.8 3L8 3.9V5.8L5.8 8C5.4 8.2 5 8.2 4.6 9Z" fill="#4A4A4A"/>
    <path d="M19.4 9L21.5 7.8C21.8 7.6 22 7.3 22 6.9V5.1C22 4.7 21.8 4.4 21.5 4.2L19.4 3C19 2.8 18.6 2.8 18.2 3L16 3.9V5.8L18.2 8C18.6 8.2 19 8.2 19.4 9Z" fill="#4A4A4A"/>
  </svg>
);


// --- OTHER UTILITY ICONS (SOLID STYLE) ---

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
);

export const EnvelopeIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3A5.25 5.25 0 0012 1.5zm-3.75 5.25a3.75 3.75 0 107.5 0v3h-7.5v-3z" clipRule="evenodd" />
  </svg>
);

export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.697 44 34 44 31c0-5.202-2.699-9.713-6.852-12.22z" />
  </svg>
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
);

export const BoltIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="url(#bolt-grad)" stroke="#FBBF24" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FDE047"/>
        <stop offset="1" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
  </svg>
);

export const BuildingOfficeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 22V8L12 2L20 8V22H4Z" fill="#2A2A2A"/>
    <path d="M12 22V14M8 22V12L12 8L16 12V22" stroke="#4A4A4A" strokeWidth="1.5"/>
    <rect x="10" y="16" width="4" height="6" fill="#C084FC"/>
  </svg>
);


export const FaceSmileIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="10" fill="url(#face-grad)"/>
    <circle cx="9" cy="10" r="1.5" fill="black"/>
    <circle cx="15" cy="10" r="1.5" fill="black"/>
    <path d="M8 14C8 14 9.5 16 12 16C14.5 16 16 14 16 14" stroke="black" strokeWidth="2" strokeLinecap="round"/>
    <defs>
      <linearGradient id="face-grad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FBBF24"/>
        <stop offset="1" stopColor="#F59E0B"/>
      </linearGradient>
    </defs>
  </svg>
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" fill="#2A2A2A" stroke="#4A4A4A" strokeWidth="1.5"/>
    <path d="M9 21V12H15V21" fill="#C084FC" />
  </svg>
);


export const SunIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="12" r="5" fill="url(#sun-grad)"/>
    <line x1="12" y1="2" x2="12" y2="4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="12" y1="20" x2="12" y2="22" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="4" y1="12" x2="2" y2="12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="22" y1="12" x2="20" y2="12" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="5.63672" y1="5.63672" x2="7.05093" y2="7.05093" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16.9492" y1="16.9492" x2="18.3634" y2="18.3634" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="5.63672" y1="18.3633" x2="7.05093" y2="16.9491" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16.9492" y1="7.05078" x2="18.3634" y2="5.63657" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <defs>
        <radialGradient id="sun-grad" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(5)">
            <stop stopColor="#FDE047"/>
            <stop offset="1" stopColor="#F97316"/>
        </radialGradient>
    </defs>
  </svg>
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M11.25 2.25a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75z" clipRule="evenodd" />
    <path d="M12.75 12.75a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0v-4.5zM12 15.342l-3.22 3.22a.75.75 0 001.06 1.06l2.75-2.75 2.75 2.75a.75.75 0 101.06-1.06L12 15.342z" />
    <path fillRule="evenodd" d="M3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12z" clipRule="evenodd" />
  </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 1.5a.75.75 0 01.75.75V15a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5z" />
    <path d="M12 15.342l-3.22-3.22a.75.75 0 00-1.06 1.06l4.5 4.5a.75.75 0 001.06 0l4.5-4.5a.75.75 0 00-1.06-1.06L12 15.342z" />
    <path d="M3.75 18.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z" />
  </svg>
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M10.5 3A2.5 2.5 0 008 5.5V6h8v-.5A2.5 2.5 0 0013.5 3h-3z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M8.25 7.5A2.25 2.25 0 006 9.75v9.75A2.25 2.25 0 008.25 21.75h7.5A2.25 2.25 0 0018 19.5V9.75A2.25 2.25 0 0015.75 7.5h-7.5zm-1.5 2.25a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v9.75a.75.75 0 01-.75-.75h-7.5a.75.75 0 01-.75-.75V9.75z" clipRule="evenodd" />
  </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="8" y="2" width="8" height="14" rx="4" fill="url(#mic-grad)"/>
    <path d="M12 19V22M8 22H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="mic-grad" x1="12" y1="2" x2="12" y2="16" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E5E7EB"/>
        <stop offset="1" stopColor="#9CA3AF"/>
      </linearGradient>
    </defs>
  </svg>
);