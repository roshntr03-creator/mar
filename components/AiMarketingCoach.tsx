/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, LiveServerMessage, Modality, Blob} from '@google/genai';
import React, {useEffect, useRef, useState} from 'react';
import {MicrophoneIcon, XMarkIcon} from './icons';

interface AiMarketingCoachProps {
  onClose: () => void;
  language: 'english' | 'arabic';
}

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

// --- Audio & Base64 Helper Functions ---

function encode(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- Avatars ---
const COACH_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDKnRL0_STMEFql9WXA9QfGnC304U3r65B0e118xiI_HNVNvnIhNKqz8A7XAWorXix_2UVEzhLzEdO8NozqF6D2tcAvNXRopty7QrwNMPypsyW_n3Re_-OVLJXKeP1Y3bAtjXTjNINbKljSwt0K4pkmMdWHI0O4e10IbtRSx85CBDT5MazXgLeeRWnUQrzw3e7sh1RHCxwM2IDh6oile5QBoxp5G45erMHyoZhavJ9a0ZhHlueY4vyy8Sq-7rTPr2iYAVEbH-UQjvnv';
const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCyrGnmxWsMX7j_Tnt48S4NrTbrS7Oxz-c4e0qdDm-MylcMXu6FrtXkSGR2TUiQo1O1BejPrRtdnnMk6aIYFIMRD6bEWC86MtGVP-aPujXT6xV-sAdFlXAlHAgBYnPDPcydMxg8oAM8O8hRn050KZ3pdls5eKWmXjUp_ZPo3xEqxanjnDZbF9c20jAqy6yIT7511EtGlpt_kLtN1HMd7JIjZQniCzl8gkXprHmxl1u0L6xl0PXbeufWKLBtKz9jDkp7I8tKA_XQ5l7t';

// --- Component ---
export const AiMarketingCoach: React.FC<AiMarketingCoachProps> = ({
  onClose,
  language,
}) => {
  const [connectionState, setConnectionState] = useState<
    'connecting' | 'connected' | 'error' | 'closed'
  >('connecting');
  const [currentInputTranscription, setCurrentInputTranscription] =
    useState('');
  const [currentOutputTranscription, setCurrentOutputTranscription] =
    useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState<
    {speaker: 'You' | 'Coach'; text: string}[]
  >([]);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const sessionPromiseRef = useRef<any>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let inputAudioContext: AudioContext | null = null;
    let outputAudioContext: AudioContext | null = null;
    let scriptProcessor: ScriptProcessorNode | null = null;
    const sources = new Set<AudioBufferSourceNode>();
    let nextStartTime = 0;

    const startSession = async () => {
      try {
        setConnectionState('connecting');
        stream = await navigator.mediaDevices.getUserMedia({audio: true});

        const systemInstruction =
          language === 'arabic'
            ? 'أنت مدرب تسويق ودود ومساعد. أنت متخصص في تقديم نصائح قابلة للتنفيذ للشركات الصغيرة والمبدعين. اجعل إجاباتك موجزة وعملية ومشجعة.'
            : 'You are a friendly and helpful marketing coach. You specialize in giving actionable advice for small businesses and creators. Keep your answers concise, practical, and encouraging.';

        sessionPromiseRef.current = ai.live.connect({
          model: 'gemini-2.5-flash-native-audio-preview-09-2025',
          callbacks: {
            onopen: () => {
              setConnectionState('connected');
              inputAudioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)({sampleRate: 16000});
              outputAudioContext = new (window.AudioContext ||
                (window as any).webkitAudioContext)({sampleRate: 24000});

              const source =
                inputAudioContext.createMediaStreamSource(stream!);
              scriptProcessor = inputAudioContext.createScriptProcessor(
                4096,
                1,
                1,
              );
              scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                const inputData =
                  audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromiseRef.current.then((session: any) => {
                  session.sendRealtimeInput({media: pcmBlob});
                });
              };
              source.connect(scriptProcessor);
              scriptProcessor.connect(inputAudioContext.destination);
            },
            onmessage: async (message: LiveServerMessage) => {
              // Handle transcriptions
              if (message.serverContent?.outputTranscription) {
                setCurrentOutputTranscription(
                  (prev) =>
                    prev + message.serverContent!.outputTranscription.text,
                );
              } else if (message.serverContent?.inputTranscription) {
                setCurrentInputTranscription(
                  (prev) =>
                    prev + message.serverContent!.inputTranscription.text,
                );
              }

              if (message.serverContent?.turnComplete) {
                const finalInput = currentInputTranscription;
                const finalOutput = currentOutputTranscription;

                setTranscriptionHistory((prev) => {
                  const newHistory = [...prev];
                  if (finalInput.trim()) {
                    newHistory.push({speaker: 'You', text: finalInput});
                  }
                  if (finalOutput.trim()) {
                    newHistory.push({speaker: 'Coach', text: finalOutput});
                  }
                  return newHistory;
                });
                setCurrentInputTranscription('');
                setCurrentOutputTranscription('');
              }

              // Handle audio output
              const base64Audio =
                message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
              if (base64Audio) {
                setIsModelSpeaking(true);
                nextStartTime = Math.max(
                  nextStartTime,
                  outputAudioContext!.currentTime,
                );
                const audioBuffer = await decodeAudioData(
                  decode(base64Audio),
                  outputAudioContext!,
                  24000,
                  1,
                );
                const source = outputAudioContext!.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outputAudioContext!.destination);
                source.addEventListener('ended', () => {
                  sources.delete(source);
                  if (sources.size === 0) {
                    setIsModelSpeaking(false);
                  }
                });
                source.start(nextStartTime);
                nextStartTime = nextStartTime + audioBuffer.duration;
                sources.add(source);
              }

              if (message.serverContent?.interrupted) {
                for (const source of sources.values()) {
                  source.stop();
                  sources.delete(source);
                }
                nextStartTime = 0;
                setIsModelSpeaking(false);
              }
            },
            onerror: (e: ErrorEvent) => {
              console.error('Session error:', e);
              setConnectionState('error');
            },
            onclose: (e: CloseEvent) => {
              setConnectionState('closed');
            },
          },
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {prebuiltVoiceConfig: {voiceName: 'Zephyr'}},
            },
            systemInstruction,
            inputAudioTranscription: {},
            outputAudioTranscription: {},
          },
        });
      } catch (err) {
        console.error('Failed to start session:', err);
        setConnectionState('error');
      }
    };

    startSession();

    return () => {
      sessionPromiseRef.current?.then((session: any) => session.close());
      stream?.getTracks().forEach((track) => track.stop());
      scriptProcessor?.disconnect();
      inputAudioContext?.close().catch(console.error);
      outputAudioContext?.close().catch(console.error);
    };
  }, [language]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
  }, [
    transcriptionHistory,
    currentInputTranscription,
    currentOutputTranscription,
  ]);

  const getStatusMessage = () => {
    const statusMap = {
      arabic: {
        connecting: 'جاري الاتصال...',
        connected: isModelSpeaking ? 'يتحدث...' : 'أستمع...',
        error: 'خطأ',
        closed: 'مغلق',
      },
      english: {
        connecting: 'Connecting...',
        connected: isModelSpeaking ? 'Speaking...' : 'Listening...',
        error: 'Error',
        closed: 'Closed',
      },
    };
    return statusMap[language][connectionState];
  };

  const title =
    language === 'arabic' ? 'مدرب التسويق بالذكاء الاصطناعي' : 'AI Marketing Coach';

  interface ChatMessageProps {
    speaker: string;
    text: string;
    avatarUrl: string;
  }
  const ChatMessage: React.FC<ChatMessageProps> = ({
    speaker,
    text,
    avatarUrl,
  }) => {
    const isUser = speaker === 'You';
    return (
      <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0"
          style={{backgroundImage: `url("${avatarUrl}")`}}></div>
        <div
          className={`flex flex-1 flex-col gap-2 ${
            isUser ? 'items-end' : 'items-start'
          }`}>
          <div
            className={`rounded-lg p-3 max-w-sm ${
              isUser
                ? 'bg-gradient-to-br from-primary-start to-primary-end'
                : 'bg-component-dark/50 border border-white/10 backdrop-blur-sm'
            }`}>
            <p className="text-text-dark text-base font-bold leading-tight">
              {isUser ? (language === 'arabic' ? 'أنت' : 'You') : title}
            </p>
            <p className="text-text-dark text-base font-normal leading-normal whitespace-pre-wrap">
              {text}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 bg-background-dark/80 backdrop-blur-xl z-50 flex flex-col items-center justify-center animate-fade-in"
      aria-modal="true"
      role="dialog"
      aria-labelledby="coach-title">
      <div className="flex flex-col h-full w-full max-w-2xl mx-auto">
        <header className="flex-shrink-0 flex items-center bg-transparent p-4 pb-2 justify-between">
          <div className="w-12">
            <button
              onClick={onClose}
              className="p-2 text-text-secondary rounded-full hover:bg-component-dark hover:text-text-dark transition-colors z-10"
              aria-label={language === 'arabic' ? 'إغلاق' : 'Close'}>
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <h2
            id="coach-title"
            className="text-text-dark text-lg font-bold leading-tight flex-1 text-center">
            {title}
          </h2>
          <div className="flex w-28 items-center justify-end">
            <p className="text-primary text-base font-bold leading-normal shrink-0">
              {getStatusMessage()}
            </p>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-2 space-y-6">
          {transcriptionHistory.map((entry, index) => (
            <ChatMessage
              key={index}
              speaker={entry.speaker}
              text={entry.text}
              avatarUrl={
                entry.speaker === 'You' ? USER_AVATAR_URL : COACH_AVATAR_URL
              }
            />
          ))}
          {currentInputTranscription && (
            <div className="opacity-70">
              <ChatMessage
                speaker="You"
                text={currentInputTranscription}
                avatarUrl={USER_AVATAR_URL}
              />
            </div>
          )}
          {currentOutputTranscription && (
            <div className="opacity-70">
              <ChatMessage
                speaker="Coach"
                text={currentOutputTranscription}
                avatarUrl={COACH_AVATAR_URL}
              />
            </div>
          )}
          <div ref={chatEndRef} />
        </main>

        <footer className="flex justify-center items-center p-5 bg-transparent">
          <button
            className={`flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-20 w-20 bg-gradient-to-br from-primary-start to-primary-end text-white text-base font-bold leading-normal tracking-[0.015em] min-w-0 transition-transform duration-300 ease-in-out
                        ${
                          connectionState === 'connected' && !isModelSpeaking
                            ? 'animate-pulse-glow'
                            : ''
                        }
                        ${isModelSpeaking ? 'scale-110' : ''}`}>
            <MicrophoneIcon className="w-9 h-9" />
          </button>
        </footer>
      </div>
    </div>
  );
};