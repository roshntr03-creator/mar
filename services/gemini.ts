/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

export async function analyzeCompetitor(url: string, language: 'english' | 'arabic'): Promise<AnalysisResult> {
  const prompt =
    language === 'arabic'
      ? `يرجى تقديم تحليل تسويقي مفصل باللغة العربية للشركة على الرابط التالي: ${url}. قم بتحليل استراتيجية المحتوى الخاصة بهم.

ركز على هذه المجالات وقدم المخرجات ككائن JSON:
1.  **الجمهور المستهدف:** وصف مفصل لمن يحاولون الوصول إليه.
2.  **نبرة الصوت:** صف كيفية تواصلهم (على سبيل المثال، احترافية، بارعة، غير رسمية).
3.  **نقاط قوة المحتوى:** اذكر 3-4 نقاط قوة رئيسية في محتواهم.
4.  **نقاط ضعف المحتوى:** اذكر 3-4 نقاط ضعف رئيسية أو فرص ضائعة في محتواهم.
5.  **كيفية المنافسة:** قدم 3-4 استراتيجيات قابلة للتنفيذ يمكن للمنافس استخدامها للتفوق عليهم.`
      : `Please provide a detailed marketing analysis in English for the company at the following URL: ${url}. Analyze its content strategy.

Focus on these areas and provide the output as a JSON object:
1.  **Target Audience:** A detailed description of who they are trying to reach.
2.  **Tone of Voice:** Describe how they communicate (e.g., professional, witty, casual).
3.  **Content Strengths:** List 3-4 key strengths of their content.
4.  **Content Weaknesses:** List 3-4 key weaknesses or missed opportunities in their content.
5.  **How to Compete:** Provide 3-4 actionable strategies a competitor could use to outperform them.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          targetAudience: {type: Type.STRING},
          toneOfVoice: {type: Type.STRING},
          contentStrengths: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
          },
          contentWeaknesses: {
            type: Type.ARRAY,
            items: {type: Type.STRING},
          },
          howToCompete: {type: Type.ARRAY, items: {type: Type.STRING}},
        },
        required: [
          'targetAudience',
          'toneOfVoice',
          'contentStrengths',
          'contentWeaknesses',
          'howToCompete',
        ],
      },
    },
  });
  
  const parsed = JSON.parse(response.text);
  return parsed;
}
