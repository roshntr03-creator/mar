/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {
  GoogleIcon,
  EnvelopeIcon,
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
    email: 'Email',
    password: 'Password',
    or: 'OR',
    continueWithGoogle: 'Google',
    signInTitle: 'Welcome Back',
    signInSubtitle: 'Enter your details below',
    signIn: 'Sign In',
    signUpSubtitle: 'Start your AI journey',
    signUp: 'Sign Up',
    firstName: 'First Name',
    lastName: 'Last Name',
    confirmPassword: 'Confirm Password',
    signInError: 'Invalid credentials.',
    signUpError: 'Signup failed.',
    passwordMismatch: 'Passwords do not match.',
    slogan: 'Unlock the power of AI Marketing',
  },
  arabic: {
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    or: 'أو',
    continueWithGoogle: 'جوجل',
    signInTitle: 'مرحباً بعودتك',
    signInSubtitle: 'أدخل بياناتك أدناه',
    signIn: 'دخول',
    signUpSubtitle: 'ابدأ رحلتك',
    signUp: 'تسجيل',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    confirmPassword: 'تأكيد كلمة المرور',
    signInError: 'بيانات غير صحيحة.',
    signUpError: 'فشل التسجيل.',
    passwordMismatch: 'كلمتا المرور غير متطابقتين.',
    slogan: 'أطلق العنان لقوة التسويق بالذكاء الاصطناعي',
  },
};

const GlassInput: React.FC<{
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: React.ReactNode;
}> = ({id, type, placeholder, value, onChange, icon}) => (
  <div className="relative group mb-3">
    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
      <span className="text-white/40 group-focus-within:text-primary transition-colors duration-300">{icon}</span>
    </div>
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full h-14 glass-input rounded-2xl pl-12 pr-4 text-white placeholder:text-white/30 transition-all duration-300 text-base font-medium"
      required
    />
  </div>
);

export const AuthPage: React.FC<AuthPageProps> = ({
  onSignupSuccess,
  language,
  setLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<AuthTab>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {login, signup} = useAuth();
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

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

  return (
    <div dir={dir} className="min-h-screen flex flex-col items-center justify-center p-4 safe-area-bottom relative overflow-hidden">
       {/* Language Toggle */}
       <div className="absolute top-6 right-6 z-30 flex gap-2">
          <button onClick={() => setLanguage('english')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${language === 'english' ? 'bg-white text-black' : 'text-white/60 glass-card hover:bg-white/10'}`}>EN</button>
          <button onClick={() => setLanguage('arabic')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${language === 'arabic' ? 'bg-white text-black' : 'text-white/60 glass-card hover:bg-white/10'}`}>AR</button>
       </div>

       <div className="w-full max-w-md z-10 flex flex-col items-center animate-slide-up">
          
          {/* Header Text */}
          <div className="text-center mb-8 space-y-2">
             <h1 className="text-white/50 text-lg font-medium tracking-wide">
                {activeTab === 'signin' ? texts.signInSubtitle : texts.signUpSubtitle}
             </h1>
          </div>

          {/* Main Glass Card */}
          <div className="w-full relative">
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-b from-primary/20 to-transparent rounded-[2.5rem] blur-xl opacity-50 pointer-events-none"></div>
            
            <div className="glass-card p-1 rounded-[2.5rem] border border-white/10 bg-black/40 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
               {/* Inner Card Padding */}
               <div className="p-6 sm:p-8">

                   {/* Toggle Switch */}
                   <div className="bg-black/40 rounded-2xl p-1 mb-8 flex relative h-14 border border-white/5">
                      <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-gradient-to-b from-[#2a2a30] to-[#1a1a20] rounded-xl transition-all duration-500 shadow-lg border border-white/10 ${activeTab === 'signin' ? (dir === 'rtl' ? 'right-1' : 'left-1') : (dir === 'rtl' ? 'right-[calc(50%+2px)]' : 'left-[calc(50%+2px)]')}`}></div>
                      <button onClick={() => setActiveTab('signin')} className={`flex-1 z-10 text-sm font-bold transition-colors duration-300 ${activeTab === 'signin' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}>{texts.signIn}</button>
                      <button onClick={() => setActiveTab('signup')} className={`flex-1 z-10 text-sm font-bold transition-colors duration-300 ${activeTab === 'signup' ? 'text-white' : 'text-white/40 hover:text-white/60'}`}>{texts.signUp}</button>
                   </div>

                   <form onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp} className="space-y-2 animate-fade-in">
                      {activeTab === 'signup' && (
                         <div className="flex gap-3">
                            <div className="flex-1">
                              <GlassInput id="first" type="text" placeholder={texts.firstName} value={firstName} onChange={(e) => setFirstName(e.target.value)} icon={<UserIcon className="w-5 h-5"/>} />
                            </div>
                            <div className="flex-1">
                              <GlassInput id="last" type="text" placeholder={texts.lastName} value={lastName} onChange={(e) => setLastName(e.target.value)} icon={<UserIcon className="w-5 h-5"/>} />
                            </div>
                         </div>
                      )}
                      
                      <GlassInput id="email" type="email" placeholder={texts.email} value={email} onChange={(e) => setEmail(e.target.value)} icon={<EnvelopeIcon className="w-5 h-5"/>} />
                      <GlassInput id="pass" type="password" placeholder={texts.password} value={password} onChange={(e) => setPassword(e.target.value)} icon={<LockClosedIcon className="w-5 h-5"/>} />
                      
                      {activeTab === 'signup' && (
                         <GlassInput id="confirm" type="password" placeholder={texts.confirmPassword} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} icon={<LockClosedIcon className="w-5 h-5"/>} />
                      )}

                      {error && <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 mb-4"><p className="text-destructive text-xs text-center font-bold">{error}</p></div>}

                      <div className="pt-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#4c1d95] to-[#6d28d9] text-white font-bold text-lg shadow-[0_0_25px_rgba(109,40,217,0.5)] hover:shadow-[0_0_40px_rgba(109,40,217,0.7)] active:scale-[0.98] transition-all duration-300 flex items-center justify-center border-t border-white/20 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-2xl"></div>
                          <span className="relative z-10 flex items-center gap-2">
                             {isLoading ? <span className="material-symbols-rounded animate-spin">progress_activity</span> : (activeTab === 'signin' ? texts.signIn : texts.signUp)}
                          </span>
                        </button>
                      </div>
                   </form>

                   {activeTab === 'signin' && (
                      <div className="mt-8 space-y-6">
                         <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                            <span className="relative bg-[#050505] px-4 text-[10px] text-white/30 font-bold rounded-full uppercase tracking-widest">{texts.or}</span>
                         </div>
                         <button className="w-full h-14 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 font-semibold border border-white/10 flex items-center justify-center gap-3 group active:scale-[0.98]">
                            <GoogleIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" /> 
                            <span className="text-white/80 group-hover:text-white">{texts.continueWithGoogle}</span>
                         </button>
                      </div>
                   )}
               </div>
            </div>
          </div>
          
          <p className="mt-8 text-white/20 text-xs text-center max-w-xs leading-relaxed">
             {texts.slogan}
          </p>
       </div>
    </div>
  );
};
