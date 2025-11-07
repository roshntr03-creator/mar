/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {
  EnvelopeIcon,
  GoogleIcon,
  LockClosedIcon,
  UserIcon,
} from '../components/icons';
import {useAuth} from '../contexts/AuthContext';

type Language = 'english' | 'arabic';
type AuthTab = 'signin' | 'signup';

interface AuthPageProps {
  onSignupSuccess: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  setShowPricing: (show: boolean) => void;
}

const TEXTS: Record<Language, any> = {
  english: {
    // General
    email: 'Email Address',
    password: 'Password',
    or: 'OR',
    continueWithGoogle: 'Continue with Google',
    subscriptions: 'Subscriptions',
    // Sign In
    signInTitle: 'Welcome Back!',
    signInSubtitle: 'Sign in to access your marketing suite.',
    signIn: 'Sign In',
    forgotPassword: 'Forgot Password?',
    // Sign Up
    signUpTitle: 'Create Your Account',
    signUpSubtitle: 'Start your journey with AI-powered marketing.',
    signUp: 'Create Account',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    // Errors
    signInError: 'Login failed. Please check your credentials.',
    signUpError: 'Signup failed. Please try again.',
    passwordMismatch: 'Passwords do not match.',
  },
  arabic: {
    // General
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    or: 'أو',
    continueWithGoogle: 'متابعة باستخدام جوجل',
    subscriptions: 'الاشتراكات',
    // Sign In
    signInTitle: 'مرحباً بعودتك!',
    signInSubtitle: 'سجل الدخول للوصول إلى مجموعة التسويق الخاصة بك.',
    signIn: 'تسجيل الدخول',
    forgotPassword: 'هل نسيت كلمة المرور؟',
    // Sign Up
    signUpTitle: 'أنشئ حسابك',
    signUpSubtitle: 'ابدأ رحلتك مع التسويق المدعوم بالذكاء الاصطناعي.',
    signUp: 'إنشاء حساب',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    confirmPassword: 'تأكيد كلمة المرور',
    // Errors
    signInError: 'فشل تسجيل الدخول. يرجى التحقق من بياناتك.',
    signUpError: 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
  },
};

const LanguageSwitcher: React.FC<{
  language: Language;
  setLanguage: (lang: Language) => void;
}> = ({language, setLanguage}) => (
  <div className="flex w-fit items-center gap-1 rounded-full bg-component-dark p-1 border border-border-dark">
    <button
      onClick={() => setLanguage('english')}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
        language === 'english'
          ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
          : 'text-text-secondary hover:bg-border-dark'
      }`}>
      EN
    </button>
    <button
      onClick={() => setLanguage('arabic')}
      className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
        language === 'arabic'
          ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
          : 'text-text-secondary hover:bg-border-dark'
      }`}>
      AR
    </button>
  </div>
);

const InputField: React.FC<{
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
  required?: boolean;
}> = ({id, type, label, value, onChange, icon, required = true}) => (
  <div>
    <label
      className="block text-sm font-medium text-text-secondary mb-1"
      htmlFor={id}>
      {label}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-secondary">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full bg-border-dark border-border-dark rounded-md p-3 pl-10 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
        required={required}
      />
    </div>
  </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({
  onSignupSuccess,
  language,
  setLanguage,
  setShowPricing,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Control state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {login, signup} = useAuth();
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setError(null);
    // Clear form fields
    setEmail('');
    setPassword('');
    setFirstName('');
    setLastName('');
    setConfirmPassword('');
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login(email, password);
    } catch (e) {
      setError(texts.signInError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(texts.passwordMismatch);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await signup(firstName, lastName, email, password);
      onSignupSuccess();
    } catch (e) {
      setError(texts.signUpError);
    } finally {
      setIsLoading(false);
    }
  };

  const title =
    activeTab === 'signin' ? texts.signInTitle : texts.signUpTitle;
  const subtitle =
    activeTab === 'signin' ? texts.signInSubtitle : texts.signUpSubtitle;

  return (
    <div
      dir={dir}
      className="min-h-screen bg-background-dark text-text-dark flex flex-col items-center justify-center p-4 font-display">
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <button
          onClick={() => setShowPricing(true)}
          className="px-4 py-2 rounded-lg bg-component-dark border border-border-dark text-text-secondary font-semibold hover:bg-border-dark hover:text-text-dark transition-colors text-sm">
          {texts.subscriptions}
        </button>
        <LanguageSwitcher language={language} setLanguage={setLanguage} />
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-text-dark">{title}</h1>
          <p className="text-text-secondary mt-2">{subtitle}</p>
        </div>

        <div className="bg-component-dark rounded-xl shadow-2xl border border-border-dark overflow-hidden">
          <div className="flex">
            <button
              onClick={() => handleTabChange('signin')}
              className={`w-1/2 py-3 font-semibold transition-colors ${
                activeTab === 'signin'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'bg-transparent text-text-secondary hover:bg-border-dark'
              }`}>
              {texts.signIn}
            </button>
            <button
              onClick={() => handleTabChange('signup')}
              className={`w-1/2 py-3 font-semibold transition-colors ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                  : 'bg-transparent text-text-secondary hover:bg-border-dark'
              }`}>
              {texts.signUp}
            </button>
          </div>

          <div className="p-8">
            {/* Sign In Form */}
            {activeTab === 'signin' && (
              <div className="animate-fade-in">
                <form onSubmit={handleSignIn} className="space-y-6">
                  <InputField
                    id="email"
                    type="email"
                    label={texts.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className="w-5 h-5" />}
                  />
                  <InputField
                    id="password"
                    type="password"
                    label={texts.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockClosedIcon className="w-5 h-5" />}
                  />
                  <div className="flex items-center justify-end">
                    <a
                      href="#"
                      className="text-sm font-medium text-primary/80 hover:text-primary">
                      {texts.forgotPassword}
                    </a>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm text-center">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed">
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                    ) : (
                      texts.signIn
                    )}
                  </button>
                </form>

                <div className="relative my-6">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true">
                    <div className="w-full border-t border-border-dark" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-component-dark px-2 text-text-secondary">
                      {texts.or}
                    </span>
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-center gap-3 rounded-lg bg-border-dark hover:bg-border-dark/70 text-text-dark font-semibold transition-colors disabled:opacity-50">
                  <GoogleIcon className="w-5 h-5" />
                  <span>{texts.continueWithGoogle}</span>
                </button>
              </div>
            )}

            {/* Sign Up Form */}
            {activeTab === 'signup' && (
              <div className="animate-fade-in">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      id="firstName"
                      type="text"
                      label={texts.firstName}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      icon={<UserIcon className="w-5 h-5" />}
                    />
                    <InputField
                      id="lastName"
                      type="text"
                      label={texts.lastName}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      icon={<UserIcon className="w-5 h-5" />}
                    />
                  </div>
                  <InputField
                    id="signup-email"
                    type="email"
                    label={texts.email}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<EnvelopeIcon className="w-5 h-5" />}
                  />
                  <InputField
                    id="signup-password"
                    type="password"
                    label={texts.password}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockClosedIcon className="w-5 h-5" />}
                  />
                  <InputField
                    id="confirmPassword"
                    type="password"
                    label={texts.confirmPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<LockClosedIcon className="w-5 h-5" />}
                  />

                  {error && (
                    <p className="text-destructive text-sm text-center pt-2">
                      {error}
                    </p>
                  )}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed">
                      {isLoading ? (
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-white"></div>
                      ) : (
                        texts.signUp
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};