/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Modality} from '@google/genai';
import React, {useRef, useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {ArrowDownTrayIcon, UploadIcon, WandIcon} from './icons';

const ai = new GoogleGenAI({apiKey: process.env.API_KEY});

type Language = 'english' | 'arabic';

interface ImageEditorProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    upload_title: '1. Upload Image',
    upload_cta: 'Click to upload an image',
    edit_title: '2. Describe Your Edit',
    placeholder:
      'e.g., Change the background to a sunny beach, add a red bow on the gift, make the sky dramatic and cloudy...',
    apply_button: 'Apply Edit',
    editing: 'Editing...',
    comparison_title: 'Comparison',
    original_label: 'Original',
    edited_label: 'Edited',
    error_process: 'Failed to process image.',
    error_missing_input_title: 'Missing Input',
    error_missing_input_message:
      'Please upload an image and provide an edit instruction.',
    error_failed: 'Failed to edit image.',
  },
  arabic: {
    upload_title: '١. رفع الصورة',
    upload_cta: 'انقر لرفع صورة',
    edit_title: '٢. صف التعديل',
    placeholder:
      'مثال: غير الخلفية إلى شاطئ مشمس، أضف فيونكة حمراء على الهدية، اجعل السماء درامية وغائمة...',
    apply_button: 'تطبيق التعديل',
    editing: 'جاري التعديل...',
    comparison_title: 'مقارنة',
    original_label: 'الأصلية',
    edited_label: 'المعدلة',
    error_process: 'فشل في معالجة الصورة.',
    error_missing_input_title: 'مدخلات ناقصة',
    error_missing_input_message: 'يرجى رفع صورة وتقديم تعليمات التعديل.',
    error_failed: 'فشل في تعديل الصورة.',
  },
};

function fileToBase64(file: File): Promise<{base64: string; mimeType: string}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const [mimeType, data] = result.split(';base64,');
      resolve({base64: data, mimeType: mimeType.replace('data:', '')});
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

const Card: React.FC<{children: React.ReactNode; className?: string}> = ({
  children,
  className,
}) => (
  <div
    className={`p-6 bg-component-dark rounded-xl border border-border-dark shadow-lg ${className}`}>
    {children}
  </div>
);

export const ImageEditor: React.FC<ImageEditorProps> = ({language}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const texts = TEXTS[language];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditedImageUrl(null);
      setOriginalImageUrl(URL.createObjectURL(file));
      try {
        const {base64, mimeType} = await fileToBase64(file);
        setImageBase64(base64);
        setMimeType(mimeType);
      } catch (err) {
        setError([texts.error_process]);
      }
    }
  };

  const handleEdit = async () => {
    if (!imageBase64 || !mimeType || !prompt) {
      setError([
        texts.error_missing_input_title,
        texts.error_missing_input_message,
      ]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImageUrl(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {inlineData: {data: imageBase64, mimeType}},
            {text: prompt},
          ],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      const imagePart = response.candidates?.[0]?.content?.parts?.find(
        (p) => p.inlineData,
      );
      if (imagePart?.inlineData) {
        const editedMimeType = imagePart.inlineData.mimeType;
        const editedBase64 = imagePart.inlineData.data;
        setEditedImageUrl(`data:${editedMimeType};base64,${editedBase64}`);
      } else {
        throw new Error('No image was returned by the model.');
      }
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
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
            {texts.upload_title}
          </h3>
          <div
            className="relative border-2 border-dashed border-border-dark rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              accept="image/*"
              hidden
              ref={fileInputRef}
              onChange={handleImageChange}
            />
            {originalImageUrl ? (
              <img
                src={originalImageUrl}
                alt="Original"
                className="mx-auto max-h-48 rounded-md"
              />
            ) : (
              <div className="flex flex-col items-center text-text-secondary">
                <UploadIcon className="w-12 h-12 text-text-secondary/50" />
                <p className="mt-2 font-semibold text-text-dark">
                  {texts.upload_cta}
                </p>
              </div>
            )}
          </div>
        </Card>

        <Card
          className={`transition-opacity ${
            originalImageUrl ? 'opacity-100' : 'opacity-50'
          }`}>
          <h3 className="text-lg font-semibold text-text-dark mb-4">
            {texts.edit_title}
          </h3>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-border-dark border-border-dark rounded-md p-3 text-text-dark h-24 focus:ring-primary/50 focus:border-primary focus:bg-component-dark transition-colors"
            placeholder={texts.placeholder}
            disabled={!originalImageUrl}
          />
          <button
            onClick={handleEdit}
            disabled={isLoading || !originalImageUrl || !prompt}
            className="w-full mt-4 px-6 py-3 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>
                <span>{texts.editing}</span>
              </>
            ) : (
              <>
                <WandIcon className="w-6 h-6" />
                <span>{texts.apply_button}</span>
              </>
            )}
          </button>
        </Card>

        {editedImageUrl && (
          <Card className="animate-fade-in">
            <h3 className="text-xl font-bold text-center text-text-dark mb-4">
              {texts.comparison_title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-center font-semibold text-text-secondary mb-2">
                  {texts.original_label}
                </h4>
                <img
                  src={originalImageUrl!}
                  alt={texts.original_label}
                  className="w-full h-auto rounded-lg"
                />
              </div>
              <div className="relative">
                <h4 className="text-center font-semibold text-text-secondary mb-2">
                  {texts.edited_label}
                </h4>
                <img
                  src={editedImageUrl}
                  alt={texts.edited_label}
                  className="w-full h-auto rounded-lg"
                />
                <a
                  href={editedImageUrl}
                  download="edited-image.png"
                  className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-primary-start transition-colors">
                  <ArrowDownTrayIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};