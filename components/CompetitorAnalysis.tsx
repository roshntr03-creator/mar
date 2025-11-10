/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, {useState} from 'react';
import {analyzeCompetitor} from '../services/gemini';
import {AnalysisResult} from '../types';
import {ErrorModal} from './ErrorModal';
import {AnalysisIcon} from './icons';

type Language = 'english' | 'arabic';
interface CompetitorAnalysisProps {
  language: Language;
}

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => (
  <div
    className={`p-6 bg-component-dark rounded-xl border border-border-dark shadow-lg ${className}`}
    {...props}>
    {children}
  </div>
);

interface AnalysisSectionProps {
  title: string;
  children?: React.ReactNode;
}
const AnalysisSection = ({
  title,
  children,
}: AnalysisSectionProps) => (
  <div className="bg-background-dark rounded-lg p-4">
    <h4 className="font-semibold text-text-dark text-sm uppercase tracking-wide mb-2">
      {title}
    </h4>
    {children}
  </div>
);

interface AnalysisListProps {
  items: string[];
}
const AnalysisList = ({items}: AnalysisListProps) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        <span className="text-primary mr-2 mt-1">&#10140;</span>
        <p className="text-text-secondary">{item}</p>
      </li>
    ))}
  </ul>
);

export const CompetitorAnalysis: React.FC<CompetitorAnalysisProps> = ({
  language,
}) => {
  const [url, setUrl] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleAnalyze = async () => {
    const errorTitle =
      language === 'arabic' ? 'رابط غير صالح' : 'Invalid URL';
    const errorMessage =
      language === 'arabic'
        ? 'يرجى إدخال رابط منافس صالح (مثال: https://www.example.com).'
        : 'Please enter a valid competitor URL (e.g., https://www.example.com).';

    if (!url || !isValidUrl(url)) {
      setError([errorTitle, errorMessage]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await analyzeCompetitor(url, language);
      setAnalysis(result);
    } catch (e: any) {
      console.error(e);
      const failedTitle =
        language === 'arabic' ? 'فشل التحليل' : 'Analysis Failed.';
      setError([failedTitle, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fade-in pb-24">
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
            {language === 'arabic'
              ? '١. أدخل رابط المنافس'
              : '1. Enter Competitor URL'}
          </h3>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
            placeholder="https://www.example.com"
          />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {language === 'arabic' ? '٢. ابدأ التحليل' : '2. Start Analysis'}
          </h3>
          <button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>
                  {language === 'arabic' ? 'جاري التحليل...' : 'Analyzing...'}
                </span>
              </>
            ) : (
              <>
                <AnalysisIcon className="w-6 h-6" />
                <span>
                  {language === 'arabic'
                    ? 'تحليل المنافس'
                    : 'Analyze Competitor'}
                </span>
              </>
            )}
          </button>
        </Card>

        {analysis && (
          <Card
            className="animate-fade-in"
            dir={language === 'arabic' ? 'rtl' : 'ltr'}>
            <h3 className="text-2xl font-bold text-text-dark mb-4">
              {language === 'arabic' ? 'تقرير التحليل' : 'Analysis Report'}
            </h3>
            <div className="space-y-4">
              <AnalysisSection
                title={
                  language === 'arabic' ? 'الجمهور المستهدف' : 'Target Audience'
                }>
                <p className="text-text-secondary">{analysis.targetAudience}</p>
              </AnalysisSection>

              <AnalysisSection
                title={
                  language === 'arabic' ? 'نبرة الصوت' : 'Tone of Voice'
                }>
                <p className="text-text-secondary">{analysis.toneOfVoice}</p>
              </AnalysisSection>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnalysisSection
                  title={
                    language === 'arabic'
                      ? 'نقاط قوة المحتوى'
                      : 'Content Strengths'
                  }>
                  <AnalysisList items={analysis.contentStrengths} />
                </AnalysisSection>
                <AnalysisSection
                  title={
                    language === 'arabic'
                      ? 'نقاط ضعف المحتوى'
                      : 'Content Weaknesses'
                  }>
                  <AnalysisList items={analysis.contentWeaknesses} />
                </AnalysisSection>
              </div>

              <AnalysisSection
                title={
                  language === 'arabic' ? 'كيفية المنافسة' : 'How to Compete'
                }>
                <AnalysisList items={analysis.howToCompete} />
              </AnalysisSection>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
