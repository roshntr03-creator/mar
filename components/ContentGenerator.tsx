/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI} from '@google/genai';
import React, {useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ClipboardIcon, DocumentTextIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

type ContentType =
  | 'Blog Post'
  | 'Ad Copy'
  | 'Product Description'
  | 'Email Newsletter';
type Language = 'english' | 'arabic';

interface ContentGeneratorProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    title: '1. Define Your Content',
    placeholder: 'e.g., The benefits of using natural skincare products.',
    content_type_label: 'Content Type',
    content_types: {
      'Blog Post': 'Blog Post',
      'Ad Copy': 'Ad Copy',
      'Product Description': 'Product Description',
      'Email Newsletter': 'Email Newsletter',
    },
    generate_title: '2. Generate Content',
    generate_button: 'Generate Content',
    generating: 'Generating...',
    result_title: 'Generated Content',
    copied: 'Copied!',
    error_title: 'Missing Topic',
    error_message: 'Please enter a topic to generate content about.',
    error_failed: 'Failed to generate content.',
  },
  arabic: {
    title: '١. حدد المحتوى الخاص بك',
    placeholder: 'مثال: فوائد استخدام منتجات العناية بالبشرة الطبيعية.',
    content_type_label: 'نوع المحتوى',
    content_types: {
      'Blog Post': 'منشور مدونة',
      'Ad Copy': 'نص إعلاني',
      'Product Description': 'وصف منتج',
      'Email Newsletter': 'رسالة إخبارية بالبريد الإلكتروني',
    },
    generate_title: '٢. توليد المحتوى',
    generate_button: 'توليد المحتوى',
    generating: 'جاري التوليد...',
    result_title: 'المحتوى المُنشأ',
    copied: 'تم النسخ!',
    error_title: 'الموضوع مفقود',
    error_message: 'يرجى إدخال موضوع لتوليد محتوى عنه.',
    error_failed: 'فشل في توليد المحتوى.',
  },
};

const GlassCard: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark/30 rounded-xl border border-white/10 backdrop-blur-lg shadow-lg ${className}`}>
    {children}
  </div>
);

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  language,
}) => {
  const [topic, setTopic] = useState('');
  const [contentType, setContentType] = useState<ContentType>('Blog Post');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const texts = TEXTS[language];

  const handleGenerate = async () => {
    if (!topic) {
      setError([texts.error_title, texts.error_message]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult('');

    try {
      const prompt =
        language === 'arabic'
          ? `اكتب ${texts.content_types[contentType]} باللغة العربية حول الموضوع التالي: "${topic}". استخدم التنسيق المناسب، مثل العناوين والقوائم، عند الاقتضاء.`
          : `Write a ${contentType} about the following topic: "${topic}". Use appropriate formatting, such as headings and lists, where applicable.`;
      const systemInstruction =
        language === 'arabic'
          ? 'أنت كاتب نصوص وخبير في إنشاء المحتوى، معروف بكتابتك الواضحة والجذابة والفعالة.'
          : 'You are an expert copywriter and content creator, known for clear, engaging, and effective writing.';

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      setResult(response.text);
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
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
        <GlassCard>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.title}
          </h3>
          <div className="space-y-4">
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-background-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary"
              placeholder={texts.placeholder}
            />
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1">
                {texts.content_type_label}
              </label>
              <select
                value={contentType}
                onChange={(e) =>
                  setContentType(e.target.value as ContentType)
                }
                className="w-full bg-background-dark border-border-dark rounded-md py-2 px-3 text-text-dark focus:ring-primary/50 focus:border-primary">
                {(Object.keys(texts.content_types) as ContentType[]).map(
                  (type) => (
                    <option key={type} value={type}>
                      {texts.content_types[type]}
                    </option>
                  ),
                )}
              </select>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
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
                <DocumentTextIcon className="w-6 h-6" />
                <span>{texts.generate_button}</span>
              </>
            )}
          </button>
        </GlassCard>

        {result && (
          <GlassCard className="animate-fade-in">
            <h3 className="text-xl font-bold text-text-dark mb-3">
              {texts.result_title}
            </h3>
            <pre className="text-text-dark whitespace-pre-wrap font-display bg-background-dark p-4 rounded-lg leading-relaxed">
              {result}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 p-2 text-text-secondary hover:text-text-dark bg-component-dark rounded-full transition-colors hover:bg-primary-start">
              <ClipboardIcon className="w-5 h-5" />
            </button>
            {isCopied && (
              <span className="absolute top-3.5 right-14 text-xs bg-green-600 text-white px-2 py-1 rounded-md animate-fade-in">
                {texts.copied}
              </span>
            )}
          </GlassCard>
        )}
      </div>
    </div>
  );
};