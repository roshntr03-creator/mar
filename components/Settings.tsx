/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {PageProps} from '../App';
import {useAuth} from '../contexts/AuthContext';
import {GROUP_LABELS, TABS_CONFIG, Group} from './navigationConfig';

type Language = 'english' | 'arabic';

const TEXTS: Record<Language, any> = {
  english: {
    title: 'More',
    settingsTitle: 'Settings',
    sections: {
      tools: 'All Tools',
      account: 'Account Management',
      app: 'App Preferences',
      support: 'Support & About',
    },
    rows: {
      editProfile: 'Edit Profile',
      changePassword: 'Change Password',
      manageSubscription: 'Manage Subscription',
      logOut: 'Log Out',
      language: 'Language',
      notifications: 'Notifications',
      theme: 'Theme',
      help: 'Help & Support',
      about: 'About Us',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
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
      account: 'إدارة الحساب',
      app: 'تفضيلات التطبيق',
      support: 'الدعم وحول التطبيق',
    },
    rows: {
      editProfile: 'تعديل الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      manageSubscription: 'إدارة الاشتراك',
      logOut: 'تسجيل الخروج',
      language: 'اللغة',
      notifications: 'الإشعارات',
      theme: 'المظهر',
      help: 'المساعدة والدعم',
      about: 'عنا',
      privacy: 'سياسة الخصوصية',
      terms: 'شروط الخدمة',
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
  <div>
    <h2 className="text-sm font-bold uppercase text-text-secondary px-4 pb-2 pt-2">
      {title}
    </h2>
    <div className="flex flex-col bg-component-dark/30 rounded-xl overflow-hidden border border-white/10 backdrop-blur-lg shadow-lg">
      {children}
    </div>
  </div>
);

const SettingsRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  isDestructive?: boolean;
  rightContent?: React.ReactNode;
  hasDivider?: boolean;
}> = ({
  icon,
  label,
  onClick,
  isDestructive = false,
  rightContent,
  hasDivider = true,
}) => (
  <>
    <div
      onClick={onClick}
      className={`flex items-center gap-4 px-4 min-h-14 justify-between transition-colors duration-200 ${
        onClick
          ? isDestructive
            ? 'cursor-pointer hover:bg-destructive/10'
            : 'cursor-pointer hover:bg-white/5'
          : ''
      }`}>
      <div className="flex items-center gap-4">
        <div
          className={`flex items-center justify-center shrink-0 size-10 ${
            isDestructive ? 'text-destructive' : 'text-primary'
          }`}>
          {typeof icon === 'string' ? (
            <span className="material-symbols-outlined">{icon}</span>
          ) : (
            icon
          )}
        </div>
        <p
          className={`text-base flex-1 truncate ${
            isDestructive
              ? 'text-destructive font-semibold'
              : 'text-text-dark font-normal'
          }`}>
          {label}
        </p>
      </div>
      <div className="shrink-0">{rightContent}</div>
    </div>
    {hasDivider && <hr className="border-border-dark mx-4" />}
  </>
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
      // Exclude dashboard, but keep settings
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
    <div className="flex flex-col gap-8 p-4">
      {groupOrder.map(
        (group) =>
          groupedTabs[group] &&
          groupedTabs[group].length > 0 && (
            <SettingsSection
              key={group}
              title={GROUP_LABELS[group][language === 'english' ? 'en' : 'ar']}>
              {groupedTabs[group].map((tab, index) => {
                const Icon = tab.icon;
                const isSettingsButton = tab.id === 'settings';
                return (
                  <SettingsRow
                    key={tab.id}
                    icon={<Icon className="w-6 h-6 text-primary" />}
                    label={tab.label[language === 'english' ? 'en' : 'ar']}
                    onClick={() => {
                      if (isSettingsButton) {
                        setView('settings');
                      } else {
                        setActiveTab && setActiveTab(tab.id);
                      }
                    }}
                    rightContent={
                      <span className="material-symbols-outlined text-text-secondary">
                        chevron_right
                      </span>
                    }
                    hasDivider={index < groupedTabs[group].length - 1}
                  />
                );
              })}
            </SettingsSection>
          ),
      )}
    </div>
  );

  const renderSettingsView = () => (
    <div className="animate-fade-in">
      {/* Sub-header for Settings */}
      <div className="flex items-center p-2 border-b border-border-dark sticky top-[73px] bg-background-dark/80 backdrop-blur-md z-10">
        <button
          onClick={() => setView('main')}
          className="p-2 text-text-secondary hover:text-text-dark rounded-full transition-colors"
          aria-label={texts.values.back}>
          <span className="material-symbols-outlined">
            {dir === 'rtl' ? 'arrow_forward' : 'arrow_back'}
          </span>
        </button>
        <h2
          className={`text-lg font-bold text-text-dark ${
            dir === 'rtl' ? 'mr-auto' : 'ml-auto'
          }`}>
          {texts.settingsTitle}
        </h2>
      </div>

      {/* Settings content */}
      <div className="flex flex-col gap-8 p-4">
        <SettingsSection title={texts.sections.account}>
          <SettingsRow
            icon="person"
            label={texts.rows.editProfile}
            onClick={() => {}}
            rightContent={
              <span className="material-symbols-outlined text-text-secondary">
                chevron_right
              </span>
            }
          />
          <SettingsRow
            icon="lock"
            label={texts.rows.changePassword}
            onClick={() => {}}
            rightContent={
              <span className="material-symbols-outlined text-text-secondary">
                chevron_right
              </span>
            }
          />
          <SettingsRow
            icon="credit_card"
            label={texts.rows.manageSubscription}
            onClick={() => setShowPricing && setShowPricing(true)}
            rightContent={
              <span className="material-symbols-outlined text-text-secondary">
                chevron_right
              </span>
            }
          />
          <SettingsRow
            icon="logout"
            label={texts.rows.logOut}
            isDestructive
            onClick={logout}
            hasDivider={false}
          />
        </SettingsSection>

        <SettingsSection title={texts.sections.app}>
          <SettingsRow
            icon="language"
            label={texts.rows.language}
            onClick={handleLanguageClick}
            rightContent={
              <div className="shrink-0 flex items-center gap-2">
                <p className="text-text-secondary text-sm">
                  {language === 'english'
                    ? texts.values.english
                    : texts.values.arabic}
                </p>
                <div className="text-text-secondary flex size-7 items-center justify-center">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </div>
              </div>
            }
          />
          <SettingsRow
            icon="notifications"
            label={texts.rows.notifications}
            rightContent={
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={() => setNotificationsEnabled((prev) => !prev)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-border-dark rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r from-primary-start to-primary-end"></div>
              </label>
            }
          />
          <SettingsRow
            icon="dark_mode"
            label={texts.rows.theme}
            onClick={() => {}}
            hasDivider={false}
            rightContent={
              <div className="shrink-0 flex items-center gap-2">
                <p className="text-text-secondary text-sm">
                  {texts.values.dark}
                </p>
                <div className="text-text-secondary flex size-7 items-center justify-center">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </div>
              </div>
            }
          />
        </SettingsSection>

        <SettingsSection title={texts.sections.support}>
          <SettingsRow
            icon="help"
            label={texts.rows.help}
            onClick={() => {}}
            rightContent={
              <div className="text-text-secondary flex size-7 items-center justify-center">
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </div>
            }
          />
          <SettingsRow
            icon="info"
            label={texts.rows.about}
            onClick={() => {}}
            rightContent={
              <div className="text-text-secondary flex size-7 items-center justify-center">
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </div>
            }
          />
          <SettingsRow
            icon="shield"
            label={texts.rows.privacy}
            onClick={() => {}}
            rightContent={
              <div className="text-text-secondary flex size-7 items-center justify-center">
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </div>
            }
          />
          <SettingsRow
            icon="description"
            label={texts.rows.terms}
            onClick={() => {}}
            hasDivider={false}
            rightContent={
              <div className="text-text-secondary flex size-7 items-center justify-center">
                <span className="material-symbols-outlined">
                  chevron_right
                </span>
              </div>
            }
          />
        </SettingsSection>
      </div>
    </div>
  );

  return (
    <div
      className="relative h-auto min-h-screen w-full bg-background-dark text-text-dark"
      dir={dir}>
      {view === 'main' ? renderMainView() : renderSettingsView()}
    </div>
  );
};