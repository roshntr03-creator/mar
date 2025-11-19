/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {PageProps} from '../App';
import {useAuth} from '../contexts/AuthContext';
import {GROUP_LABELS, TABS_CONFIG, Group} from './navigationConfig';
import {
  UserIcon,
  CheckCircleIcon,
  BoltIcon,
  XMarkIcon
} from './icons';

type Language = 'english' | 'arabic';

const TEXTS: Record<Language, any> = {
  english: {
    title: 'More',
    settingsTitle: 'Settings',
    sections: {
      tools: 'All Tools',
      account: 'Account',
      app: 'Preferences',
      support: 'Support',
    },
    rows: {
      editProfile: 'Profile',
      changePassword: 'Password',
      manageSubscription: 'Subscription',
      logOut: 'Log Out',
      language: 'Language',
      notifications: 'Notifications',
      theme: 'Theme',
      help: 'Help Center',
      about: 'About',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    values: {
      english: 'English',
      arabic: 'العربية',
      dark: 'Dark',
      back: 'Back',
    },
  },
  arabic: {
    title: 'المزيد',
    settingsTitle: 'الإعدادات',
    sections: {
      tools: 'كل الأدوات',
      account: 'الحساب',
      app: 'التفضيلات',
      support: 'الدعم',
    },
    rows: {
      editProfile: 'الملف الشخصي',
      changePassword: 'كلمة المرور',
      manageSubscription: 'الاشتراك',
      logOut: 'تسجيل الخروج',
      language: 'اللغة',
      notifications: 'الإشعارات',
      theme: 'المظهر',
      help: 'مركز المساعدة',
      about: 'عنا',
      privacy: 'الخصوصية',
      terms: 'الشروط',
    },
    values: {
      english: 'English',
      arabic: 'العربية',
      dark: 'داكن',
      back: 'رجوع',
    },
  },
};

const SettingsSection: React.FC<{title: string; children: React.ReactNode}> = ({
  title,
  children,
}) => (
  <div className="mb-8">
    <h2 className="text-xs font-bold uppercase text-white/40 px-6 mb-3 tracking-widest">
      {title}
    </h2>
    <div className="glass-card rounded-[2rem] overflow-hidden border border-white/10 bg-white/[0.02]">
      {React.Children.map(children, (child, index) => (
        <>
          {child}
          {index < React.Children.count(children) - 1 && (
            <div className="h-[1px] bg-white/5 mx-6" />
          )}
        </>
      ))}
    </div>
  </div>
);

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isDestructive?: boolean;
  rightContent?: React.ReactNode;
}> = ({
  icon,
  label,
  onClick,
  isDestructive = false,
  rightContent,
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 h-[4.5rem] justify-between transition-colors active:bg-white/5 text-left group`}>
    <div className="flex items-center gap-5">
      <div
        className={`flex items-center justify-center shrink-0 size-10 rounded-2xl ${
          isDestructive ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/70 group-hover:text-white transition-colors border border-white/5'
        }`}>
        {typeof icon === 'string' ? (
          <span className="material-symbols-rounded text-xl">{icon}</span>
        ) : (
          icon
        )}
      </div>
      <p
        className={`text-base font-semibold ${
          isDestructive ? 'text-red-400' : 'text-white'
        }`}>
        {label}
      </p>
    </div>
    <div className="shrink-0">{rightContent}</div>
  </button>
);

export const Settings: React.FC<PageProps> = ({
  language,
  setLanguage,
  setShowPricing,
  setActiveTab,
}) => {
  const {logout} = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [view, setView] = useState<'main' | 'settings'>('main');
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  const handleLanguageClick = () => {
    if (setLanguage) {
      setLanguage(language === 'english' ? 'arabic' : 'english');
    }
  };

  const groupedTabs = TABS_CONFIG.reduce(
    (acc, tab) => {
      if (tab.id === 'dashboard') return acc;
      if (!acc[tab.group]) {
        acc[tab.group] = [];
      }
      acc[tab.group].push(tab);
      return acc;
    },
    {} as Record<Group, typeof TABS_CONFIG>,
  );
  const groupOrder: Group[] = ['Create', 'Refine', 'Strategy', 'General'];

  const renderMainView = () => (
    <div className="flex flex-col p-4 animate-slide-up pb-24 pt-8">
       <h1 className="text-3xl font-bold text-white mb-8 px-2">{texts.title}</h1>
      {groupOrder.map(
        (group) =>
          groupedTabs[group] &&
          groupedTabs[group].length > 0 && (
            <SettingsSection
              key={group}
              title={GROUP_LABELS[group][language === 'english' ? 'en' : 'ar']}>
              {groupedTabs[group].map((tab) => {
                const Icon = tab.icon;
                const isSettingsButton = tab.id === 'settings';
                return (
                  <SettingsRow
                    key={tab.id}
                    icon={<Icon className="w-5 h-5" />}
                    label={tab.label[language === 'english' ? 'en' : 'ar']}
                    onClick={() => {
                      if (isSettingsButton) {
                        setView('settings');
                      } else {
                        setActiveTab && setActiveTab(tab.id);
                      }
                    }}
                    rightContent={
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                         <span className="material-symbols-rounded text-white/40 text-sm">
                          arrow_forward
                        </span>
                      </div>
                    }
                  />
                );
              })}
            </SettingsSection>
          ),
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div className="animate-slide-up pb-24">
      <div className="flex items-center p-4 sticky top-0 z-10 bg-[#030014]/80 backdrop-blur-xl border-b border-white/5">
        <button
          onClick={() => setView('main')}
          className="w-10 h-10 glass-card rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors border border-white/10"
          aria-label={texts.values.back}>
          <span className="material-symbols-rounded">
            {dir === 'rtl' ? 'arrow_forward' : 'arrow_back'}
          </span>
        </button>
        <h2 className="text-lg font-bold text-white flex-1 text-center pr-10">
          {texts.settingsTitle}
        </h2>
      </div>

      <div className="p-4 space-y-6">
        <SettingsSection title={texts.sections.account}>
          <SettingsRow
            icon={<UserIcon className="w-5 h-5" />}
            label={texts.rows.editProfile}
            onClick={() => {}}
            rightContent={<span className="material-symbols-rounded text-white/30 text-sm">arrow_forward_ios</span>}
          />
          <SettingsRow
            icon={<BoltIcon className="w-5 h-5" />}
            label={texts.rows.manageSubscription}
            onClick={() => setShowPricing && setShowPricing(true)}
            rightContent={<span className="material-symbols-rounded text-white/30 text-sm">arrow_forward_ios</span>}
          />
        </SettingsSection>

        <SettingsSection title={texts.sections.app}>
          <SettingsRow
            icon={<span className="material-symbols-rounded">language</span>}
            label={texts.rows.language}
            onClick={handleLanguageClick}
            rightContent={
              <div className="flex items-center gap-2">
                <span className="text-sm text-white/60 font-medium">
                  {language === 'english' ? texts.values.english : texts.values.arabic}
                </span>
                <span className="material-symbols-rounded text-white/30 text-sm">arrow_forward_ios</span>
              </div>
            }
          />
          <SettingsRow
            icon={<span className="material-symbols-rounded">notifications</span>}
            label={texts.rows.notifications}
            rightContent={
              <button
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 flex items-center ${notificationsEnabled ? 'bg-primary' : 'bg-white/10 border border-white/10'}`}
              >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${notificationsEnabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            }
          />
        </SettingsSection>

        <div className="px-4">
           <button onClick={logout} className="w-full h-16 rounded-[2rem] bg-red-500/10 text-red-400 font-bold border border-red-500/20 hover:bg-red-500/20 transition-colors text-lg">
              {texts.rows.logOut}
           </button>
        </div>
      </div>
    </div>
  );

  return (
    <div dir={dir}>
      {view === 'main' ? renderMainView() : renderSettingsView()}
    </div>
  );
};
