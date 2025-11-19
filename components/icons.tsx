/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

// Common props for all icons
type IconProps = React.SVGProps<SVGSVGElement>;

// --- NEW PREMIUM ICON SET ---
// Consistent stroke width, rounded caps, modern aesthetic.

const BaseIcon: React.FC<IconProps & { path: React.ReactNode }> = ({ path, ...props }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth={1.5} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {path}
  </svg>
);

export const DashboardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /></>} />
);

export const UgcVideoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><rect x="4" y="2" width="16" height="20" rx="3" /><path d="M10 10l5 2.5-5 2.5V10z" /><path d="M8 18h8" /></>} />
);

export const ClapperboardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M4 11l2-6h14l-2 6" /><path d="M8 5l-2 6" /><path d="M16 5l-2 6" /></>} />
);

export const PhotoIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></>} />
);

export const DocumentTextIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><line x1="10" y1="9" x2="8" y2="9" /></>} />
);

export const WandIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M15 4l2 2-9.5 9.5a2.8 2.8 0 0 0 0 4 2.8 2.8 0 0 0 4 0L21 10l2 2" /><path d="M3 21l6-6" /></>} />
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M12 3l1.9 4.4L18 9l-4.1 1.6L12 15l-1.9-4.4L6 9l4.1-1.6L12 3z" /><path d="M5 17l1 2.5L8.5 20.5 6 22l-1 2.5L4 22l-2.5-1.5L4 19.5 5 17z" /><path d="M19 14l.7 1.8L21.5 16.5 19.7 18 19 19.8 18.3 18 16.5 16.5 18.3 15.7 19 14z" /></>} />
);

export const CreationsIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props} path={<><path d="M2 12h20" /><path d="M12 2v20" /><circle cx="12" cy="12" r="4" /></>} />
);

export const LightbulbIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-7 7c0 2 2 3 2 6h10c0-3 2-4 2-6a7 7 0 0 0-7-7z" /></>} />
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>} />
);

export const MegaphoneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M22 8c0-2.2-2-4-4.5-4h-8c-1.8 0-3.3 1-4 2.5L2 9v6l3.5 2.5c.7 1.5 2.2 2.5 4 2.5h8c2.5 0 4.5-1.8 4.5-4" /><path d="M18 4v16" /><line x1="2" y1="9" x2="2" y2="15" /></>} />
);

export const AnalysisIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></>} />
);

export const Cog6ToothIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></>} />
);

export const AiCoachIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props} path={<><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" /><path d="M12 16v-4" /><path d="M12 8h.01" /></>} />
);

export const XMarkIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>} />
);

export const PlusIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>} />
);

export const CheckCircleIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>} />
);

export const EnvelopeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>} />
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>} />
);

export const UserIcon: React.FC<IconProps> = (props) => (
    <BaseIcon {...props} path={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>} />
);

export const UploadIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>} />
);

export const ArrowDownTrayIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></>} />
);

export const ClipboardIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></>} />
);

export const MicrophoneIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>} />
);

export const BoltIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />} />
);

export const BuildingOfficeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></>} />
);

export const FaceSmileIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>} />
);

export const HomeIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>} />
);

export const SunIcon: React.FC<IconProps> = (props) => (
  <BaseIcon {...props} path={<><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></>} />
);

export const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.223 0-9.641-3.657-11.303-8.653l-6.571 4.819C9.656 39.663 16.318 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C43.021 36.697 44 34 44 31c0-5.202-2.699-9.713-6.852-12.22z" />
  </svg>
);
