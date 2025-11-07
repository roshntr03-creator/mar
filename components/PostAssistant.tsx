/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Type} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ClipboardIcon, SparklesIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

type Platform = 'Instagram' | 'X (Twitter)' | 'Facebook' | 'LinkedIn';
type Language = 'english' | 'arabic';

interface Post {
  content: string;
}

interface PostAssistantProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: '1. Define Your Post',
    placeholder:
      'e.g., The launch of our new summer collection of sunglasses.',
    platform_label: 'Platform',
    generate_title: '2. Generate Magic',
    generate_button: 'Generate Post Ideas',
    generating: 'Generating...',
    favorite_title: 'Choose Your Favorite',
    copied: 'Copied!',
    error_title: 'Missing Topic',
    error_message: 'Please enter a topic for your social media post.',
    error_failed: 'Failed to generate posts.',
  },
  arabic: {
    title: '١. حدد منشورك',
    placeholder: 'مثال: إطلاق مجموعتنا الصيفية الجديدة من النظارات الشمسية.',
    platform_label: 'المنصة',
    generate_title: '٢. توليد السحر',
    generate_button: 'توليد أفكار المنشورات',
    generating: 'جاري التوليد...',
    favorite_title: 'اختر المفضل لديك',
    copied: 'تم النسخ!',
    error_title: 'الموضوع مفقود',
    error_message: 'يرجى إدخال موضوع لمنشورك على وسائل التواصل الاجتماعي.',
    error_failed: 'فشل في توليد المنشورات.',
  },
};

const Card: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark rounded-xl border border-border-dark shadow-lg ${className}`}>
    {children}
  </div>
);

export const PostAssistant: React.FC<PostAssistantProps> = ({language}) => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const texts = TEXTS[language];

  const handleGenerate = async () => {
    if (!topic) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setPosts([]);

    try {
      const prompt =
        language === 'arabic'
          ? `أنشئ 3 منشورات مميزة وجذابة لوسائل التواصل الاجتماعي على ${platform} حول الموضوع التالي: "${topic}". قم بتضمين الهاشتاجات ذات الصلة.`
          : `Generate 3 distinct and engaging social media posts for ${platform} about the following topic: "${topic}". Include relevant hashtags.`;

      const systemInstruction =
        language === 'arabic'
          ? 'أنت خبير تسويق على وسائل التواصل الاجتماعي ذكي ومبدع.'
          : 'You are a witty and creative social media marketing expert.';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              posts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    content: {type: Type.STRING},
                  },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text);
      setPosts(parsed.posts);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 animate-fade-in pb-24">
      {error && (
        <ErrorModal
          title={error[0]}
          message={error.slice(1)}
          onClose={() => setError(null)}
          onSelectKey={() => {}}
          addKeyButtonText="Add API Key"
          closeButtonText="Close"
        />
      )}
      <div className="space-y-6">
        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.title}
          </h3>
          <div className="space-y-4">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
              placeholder={texts.placeholder}
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.platform_label}
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full bg-border-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors">
                <option>Instagram</option>
                <option>X (Twitter)</option>
                <option>Facebook</option>
                <option>LinkedIn</option>
              </select>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.generate_title}
          </h3>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>{texts.generating}</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-6 h-6" />
                <span>{texts.generate_button}</span>
              </>
            )}
          </button>
        </Card>

        {posts.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-center text-text-dark">
              {texts.favorite_title}
            </h3>
            {posts.map((post, index) => (
              <div
                key={index}
                className="p-4 bg-component-dark rounded-xl shadow-md relative border border-border-dark">
                <p className="text-text-dark whitespace-pre-wrap pr-12">
                  {post.content}
                </p>
                <button
                  onClick={() => handleCopy(post.content, index)}
                  className="absolute top-3 right-3 p-2 text-text-secondary hover:text-text-dark bg-border-dark rounded-full transition-colors hover:bg-primary-start">
                  <ClipboardIcon className="w-5 h-5" />
                </button>
                {copiedIndex === index && (
                  <span className="absolute top-3.5 right-14 text-xs bg-green-600 text-white px-2 py-1 rounded-md animate-fade-in">
                    {texts.copied}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};