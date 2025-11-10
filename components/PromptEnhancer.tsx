/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {Chat, GoogleGenAI, Type} from '@google/genai';
import React, {useEffect, useRef, useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ClipboardIcon, LightbulbIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// Data structure for the detailed prompt
interface EnhancedPromptData {
  subject: string;
  style: string;
  composition: string;
  lighting: string;
  colorPalette: string;
  mood: string;
  negativePrompt: string;
}

// Data structure for the AI's JSON response in chat
interface ChatResponse {
  responseText: string;
  prompt: EnhancedPromptData;
}

type Language = 'english' | 'arabic';

interface PromptEnhancerProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    // Initial View
    initialTitle: 'Start with a simple idea',
    initialPlaceholder: 'e.g., a cat in a library',
    initialButton: 'Start Enhancing',
    // Chat View
    chatTitle: 'Prompt Chatbot',
    chatPlaceholder:
      'e.g., "make the cat ginger" or "change the style to watercolor"',
    send: 'Send',
    startOver: 'Start Over',
    thinking: 'Thinking...',
    resultTitle: 'Current Prompt Breakdown',
    copyButton: 'Copy Full Prompt',
    copied: 'Copied!',
    labels: {
      subject: 'Subject',
      style: 'Style',
      composition: 'Composition',
      lighting: 'Lighting',
      colorPalette: 'Color Palette',
      mood: 'Mood',
      negativePrompt: 'Negative Prompt',
    },
    // Errors
    errorTitle: 'Missing Idea',
    errorMessage: 'Please enter a simple idea to start.',
    errorFailed: 'An error occurred.',
  },
  arabic: {
    // Initial View
    initialTitle: 'ابدأ بفكرة بسيطة',
    initialPlaceholder: 'مثال: قطة في مكتبة',
    initialButton: 'ابدأ التحسين',
    // Chat View
    chatTitle: 'شات بوت الأوامر',
    chatPlaceholder:
      'مثال: "اجعل القطة برتقالية" أو "غير النمط إلى ألوان مائية"',
    send: 'إرسال',
    startOver: 'البدء من جديد',
    thinking: 'يفكر...',
    resultTitle: 'تفاصيل الأمر الحالي',
    copyButton: 'نسخ الأمر بالكامل',
    copied: 'تم النسخ!',
    labels: {
      subject: 'الموضوع',
      style: 'النمط',
      composition: 'التكوين',
      lighting: 'الإضاءة',
      colorPalette: 'لوحة الألوان',
      mood: 'الحالة المزاجية',
      negativePrompt: 'أمر سلبي',
    },
    // Errors
    errorTitle: 'الفكرة مفقودة',
    errorMessage: 'يرجى إدخال فكرة بسيطة للبدء.',
    errorFailed: 'حدث خطأ ما.',
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

export const PromptEnhancer: React.FC<PromptEnhancerProps> = ({language}) => {
  // --- STATE ---
  const [initialIdea, setInitialIdea] = useState('');
  const [userInput, setUserInput] = useState('');

  const [chat, setChat] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<
    {author: 'user' | 'model'; text: string}[]
  >([]);
  const [enhancedPromptData, setEnhancedPromptData] =
    useState<EnhancedPromptData | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  // --- EFFECTS ---
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [chatHistory]);

  // --- API & CHAT LOGIC ---
  const responseSchema: any = {
    type: Type.OBJECT,
    properties: {
      responseText: {
        type: Type.STRING,
        description: `A short, friendly, conversational response in ${language} acknowledging the user's request and briefly explaining the changes made to the prompt.`,
      },
      prompt: {
        type: Type.OBJECT,
        properties: {
          subject: {
            type: Type.STRING,
            description: 'A highly detailed, vivid description...',
          },
          style: {
            type: Type.STRING,
            description: "The specific artistic style...",
          },
          composition: {
            type: Type.STRING,
            description: 'Detailed camera and composition settings...',
          },
          lighting: {
            type: Type.STRING,
            description: 'Precise lighting conditions...',
          },
          colorPalette: {
            type: Type.STRING,
            description: 'The specific color scheme...',
          },
          mood: {type: Type.STRING, description: 'The overall atmosphere...'},
          negativePrompt: {
            type: Type.STRING,
            description: 'A comprehensive list of elements to exclude...',
          },
        },
        required: [
          'subject',
          'style',
          'composition',
          'lighting',
          'colorPalette',
          'mood',
          'negativePrompt',
        ],
      },
    },
    required: ['responseText', 'prompt'],
  };

  const systemInstruction =
    language === 'arabic'
      ? `أنت خبير عالمي ومحادث في هندسة الأوامر متخصص في إنشاء أوامر احترافية ومفصلة للغاية لنماذج صور الذكاء الاصطناعي التوليدية. مهمتك هي أخذ فكرة بسيطة من المستخدم وصقلها بشكل تعاوني.

- في ردك الأول، قم بإنشاء أمر كامل ومفصل بناءً على فكرة المستخدم الأولية.
- في الأدوار اللاحقة، قم بتعديل الأمر بناءً على ملاحظات المستخدم.
- **هام جدًا: يجب أن يكون كل رد تقدمه كائن JSON صالحًا يطابق المخطط المقدم.** يجب أن يحتوي كائن JSON على التفاصيل الكاملة والمحدثة للأمر. كن مبدعًا وتوسع إلى ما هو أبعد من مدخلات المستخدم الأولية.`
      : `You are a conversational, world-class prompt engineering expert specializing in creating hyper-detailed, professional prompts for generative AI image models. Your task is to take a user's simple idea and collaboratively refine it.

- In your first response, generate a complete, detailed prompt based on the user's initial idea.
- In subsequent turns, modify the prompt based on the user's feedback.
- **Crucially, every single response you provide MUST be a valid JSON object matching the provided schema.** The JSON object should contain the complete, updated prompt details. Be creative and elaborate far beyond the user's initial input.`;

  const handleStartChat = async () => {
    if (!initialIdea.trim()) {
      setError([texts.errorTitle, texts.errorMessage]);
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: responseSchema,
        },
      });
      setChat(newChat);

      const firstUserMessage = `User's simple idea: "${initialIdea}"`;
      setChatHistory([{author: 'user', text: initialIdea}]);

      const response = await newChat.sendMessage({message: firstUserMessage});
      const parsed = JSON.parse(response.text) as ChatResponse;

      setEnhancedPromptData(parsed.prompt);
      setChatHistory((prev) => [
        ...prev,
        {author: 'model', text: parsed.responseText},
      ]);
    } catch (e: any) {
      console.error(e);
      setError([texts.errorFailed, e.message]);
      setChat(null); // Reset on failure
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chat || isLoading) return;

    const currentInput = userInput;
    setChatHistory((prev) => [...prev, {author: 'user', text: currentInput}]);
    setUserInput('');
    setIsLoading(true);

    try {
      const response = await chat.sendMessage({message: currentInput});
      const parsed = JSON.parse(response.text) as ChatResponse;

      setEnhancedPromptData(parsed.prompt);
      setChatHistory((prev) => [
        ...prev,
        {author: 'model', text: parsed.responseText},
      ]);
    } catch (e: any) {
      console.error(e);
      setError([texts.errorFailed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setChat(null);
    setChatHistory([]);
    setEnhancedPromptData(null);
    setInitialIdea('');
    setUserInput('');
    setError(null);
  };

  const handleCopy = () => {
    if (!enhancedPromptData) return;
    const fullPrompt = [
      enhancedPromptData.subject,
      enhancedPromptData.style,
      enhancedPromptData.composition,
      enhancedPromptData.lighting,
      enhancedPromptData.colorPalette,
      enhancedPromptData.mood,
    ]
      .filter(Boolean)
      .join(', ');

    const finalPromptString = `${fullPrompt} --no ${enhancedPromptData.negativePrompt}`;
    navigator.clipboard.writeText(finalPromptString);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // --- RENDER ---
  const PromptDetailRow = ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => (
    <div className="px-4 py-3 sm:px-6 border-b border-border-dark sm:grid sm:grid-cols-3 sm:gap-4 last:border-b-0">
      <dt className="text-sm font-semibold text-gradient uppercase tracking-wider">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-text-dark sm:mt-0 sm:col-span-2">
        {value}
      </dd>
    </div>
  );

  const ChatMessage = ({
    author,
    text,
  }: {
    author: 'user' | 'model';
    text: string;
  }) => (
    <div
      className={`flex gap-3 ${
        author === 'user' ? 'flex-row-reverse' : 'flex-row'
      }`}>
      <div
        className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          author === 'user' ? 'bg-primary/20' : 'bg-border-dark'
        }`}>
        <span className="material-symbols-outlined text-lg text-text-dark">
          {author === 'user' ? 'person' : 'auto_awesome'}
        </span>
      </div>
      <div
        className={`rounded-xl p-3 max-w-sm w-fit ${
          author === 'user'
            ? 'bg-gradient-to-br from-primary-start to-primary-end text-white'
            : 'bg-border-dark text-text-dark'
        }`}>
        <p className="text-base font-normal leading-normal whitespace-pre-wrap">
          {text}
        </p>
      </div>
    </div>
  );

  if (!chat) {
    // Initial view to start the chat
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
              {texts.initialTitle}
            </h3>
            <textarea
              value={initialIdea}
              onChange={(e) => setInitialIdea(e.target.value)}
              className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-28 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
              placeholder={texts.initialPlaceholder}
            />
          </Card>
          <div className="text-center">
            <button
              onClick={handleStartChat}
              disabled={isLoading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                  <span>{texts.thinking}</span>
                </>
              ) : (
                <>
                  <LightbulbIcon className="w-6 h-6" />
                  <span>{texts.initialButton}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div
      className="max-w-3xl mx-auto p-4 animate-fade-in pb-4 flex flex-col h-[calc(100vh-150px)]"
      dir={dir}>
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

      {/* Prompt Breakdown Section */}
      <details
        className="bg-component-dark rounded-xl border border-border-dark shadow-lg mb-4"
        open>
        <summary className="p-4 cursor-pointer flex justify-between items-center">
          <h3 className="text-lg font-bold text-text-dark">
            {texts.resultTitle}
          </h3>
          <span className="material-symbols-outlined text-text-secondary transition-transform duration-300 open:rotate-180">
            expand_more
          </span>
        </summary>
        {enhancedPromptData && (
          <div className="border-t border-border-dark p-2">
            <dl className="bg-background-dark rounded-lg overflow-hidden">
              <PromptDetailRow
                label={texts.labels.subject}
                value={enhancedPromptData.subject}
              />
              <PromptDetailRow
                label={texts.labels.style}
                value={enhancedPromptData.style}
              />
              <PromptDetailRow
                label={texts.labels.composition}
                value={enhancedPromptData.composition}
              />
              <PromptDetailRow
                label={texts.labels.lighting}
                value={enhancedPromptData.lighting}
              />
              <PromptDetailRow
                label={texts.labels.colorPalette}
                value={enhancedPromptData.colorPalette}
              />
              <PromptDetailRow
                label={texts.labels.mood}
                value={enhancedPromptData.mood}
              />
              <PromptDetailRow
                label={texts.labels.negativePrompt}
                value={enhancedPromptData.negativePrompt}
              />
            </dl>
            <div className="p-4 flex gap-4">
              <button
                onClick={handleCopy}
                className="flex-grow flex items-center justify-center gap-2 px-3 py-2 text-sm bg-border-dark hover:bg-primary/20 text-text-dark font-semibold rounded-md transition-colors">
                <ClipboardIcon className="w-4 h-4" />
                <span>{isCopied ? texts.copied : texts.copyButton}</span>
              </button>
              <button
                onClick={handleStartOver}
                className="flex-grow flex items-center justify-center gap-2 px-3 py-2 text-sm bg-border-dark hover:bg-destructive/20 text-text-dark font-semibold rounded-md transition-colors">
                <span className="material-symbols-outlined text-base">
                  refresh
                </span>
                <span>{texts.startOver}</span>
              </button>
            </div>
          </div>
        )}
      </details>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {chatHistory.map((msg, index) => (
          <ChatMessage key={index} author={msg.author} text={msg.text} />
        ))}
        {isLoading &&
          chatHistory.length > 0 &&
          chatHistory[chatHistory.length - 1].author === 'user' && (
            <div className="flex gap-3 flex-row">
              <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-border-dark">
                <span className="material-symbols-outlined text-lg text-text-dark animate-spin">
                  progress_activity
                </span>
              </div>
              <div className="rounded-xl p-3 max-w-sm w-fit bg-border-dark text-text-dark">
                <p className="text-base font-normal leading-normal">
                  {texts.thinking}
                </p>
              </div>
            </div>
          )}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={texts.chatPlaceholder}
          className="flex-1 w-full bg-component-dark border-border-dark rounded-lg p-3 text-text-dark focus:ring-primary/50 focus:border-primary transition-colors"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !userInput.trim()}
          className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  );
};
