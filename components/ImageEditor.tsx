/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import {GoogleGenAI, Modality} from '@google/genai';
import React, {useEffect, useRef, useState} from 'react';
import {ErrorModal} from './ErrorModal';
import {
  ArrowDownTrayIcon,
  UploadIcon,
  WandIcon,
} from './icons';

type Language = 'english' | 'arabic';
interface ImageEditorProps {
  language: Language;
}

const TEXTS: Record<Language, any> = {
  english: {
    upload_title: '1. Upload an Image',
    upload_cta: 'Click to upload an image',
    edit_title: '2. Describe Your Edit',
    placeholder: 'Describe Your Edit',
    apply_button: 'Apply Edit',
    editing: 'Editing...',
    comparison_title: 'Result',
    original_label: 'Original',
    edited_label: 'Edited',
    error_process: 'Failed to process image.',
    error_missing_input_title: 'Missing Input',
    error_missing_input_message:
      'Please upload an image and provide an edit instruction.',
    error_failed: 'Failed to edit image.',
    go_back: 'Make Another Edit',
  },
  arabic: {
    upload_title: '١. ارفع صورة',
    upload_cta: 'انقر لرفع صورة',
    edit_title: '٢. صف التعديل',
    placeholder: 'صف التعديل الخاص بك',
    apply_button: 'تطبيق التعديل',
    editing: 'جاري التعديل...',
    comparison_title: 'النتيجة',
    original_label: 'الأصلية',
    edited_label: 'المعدلة',
    error_process: 'فشل في معالجة الصورة.',
    error_missing_input_title: 'مدخلات ناقصة',
    error_missing_input_message:
      'يرجى رفع صورة وتقديم تعليمات التعديل.',
    error_failed: 'فشل في تعديل الصورة.',
    go_back: 'إجراء تعديل آخر',
  },
};

// Converts any image file to a PNG data URL.
function fileToPngDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error('FileReader did not return a result.'));
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Could not get 2D context from canvas.'));
        }
        ctx.drawImage(img, 0, 0);
        // This will always be a PNG data URL
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => reject(new Error(`Image load error: ${error}`));
      img.src = event.target.result as string;
    };
    reader.onerror = (error) => reject(new Error(`File read error: ${error}`));
    reader.readAsDataURL(file);
  });
}

export const ImageEditor: React.FC<ImageEditorProps> = ({language}) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const texts = TEXTS[language];
  const dir = language === 'arabic' ? 'rtl' : 'ltr';

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      if (editedImageUrl) URL.revokeObjectURL(editedImageUrl);
    };
  }, [imagePreviewUrl, editedImageUrl]);

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    if (editedImageUrl) URL.revokeObjectURL(editedImageUrl);
    setImagePreviewUrl(null);
    setImageBase64(null);
    setEditedImageUrl(null);

    try {
      setImagePreviewUrl(URL.createObjectURL(file));
      const dataUrl = await fileToPngDataUrl(file);
      const base64 = dataUrl.split(',')[1];
      setImageBase64(base64);
    } catch (err: any) {
      setError([texts.error_process, err.message]);
    }
  };

  const handleEdit = async () => {
    if (!imageBase64 || !prompt) {
      setError([
        texts.error_missing_input_title,
        texts.error_missing_input_message,
      ]);
      return;
    }
    setIsLoading(true);
    setError(null);
    if (editedImageUrl) URL.revokeObjectURL(editedImageUrl);
    setEditedImageUrl(null);

    try {
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      const imagePart = {
        inlineData: {
          data: imageBase64,
          mimeType: 'image/png', // Always PNG due to conversion
        },
      };
      const textPart = {text: prompt};

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {parts: [imagePart, textPart]},
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

      let generatedImageFound = false;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const newBase64 = part.inlineData.data;
          const newMimeType = part.inlineData.mimeType;
          const newImageUrl = `data:${newMimeType};base64,${newBase64}`;
          setEditedImageUrl(newImageUrl);
          generatedImageFound = true;
          break;
        }
      }

      if (!generatedImageFound) {
        throw new Error(
          'The AI did not return an image. Please try a different prompt.',
        );
      }
    } catch (e: any) {
      console.error(e);
      setError([texts.error_failed, e.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir={dir}
      className="min-h-screen p-4 flex flex-col items-center justify-center">
      {error && (
        <ErrorModal
          title={error[0]}
          message={error.slice(1)}
          onClose={() => setError(null)}
          onSelectKey={() => setError(null)}
          addKeyButtonText="Close"
          closeButtonText="Close"
        />
      )}

      {/* Main Editor Card */}
      {!editedImageUrl && (
        <div className="w-full max-w-sm p-1 bg-transparent rounded-2xl border border-white/40">
          <div className="bg-black rounded-xl p-6 space-y-6">
            {/* Step 1 */}
            <div>
              <h2 className="text-lg font-semibold text-text-dark mb-4">
                {texts.upload_title}
              </h2>
              <div
                className="relative bg-component-dark rounded-xl p-1"
                onClick={() => imageInputRef.current?.click()}>
                <div className="border-2 border-dashed border-border-dark rounded-lg flex items-center justify-center aspect-square cursor-pointer hover:border-primary transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    ref={imageInputRef}
                    onChange={handleImageChange}
                  />
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain rounded-md p-1"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-text-secondary">
                      <UploadIcon className="w-12 h-12 text-text-secondary/50" />
                      <p className="mt-2 font-semibold text-text-dark text-sm">
                        {texts.upload_cta}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div>
              <h2 className="text-lg font-semibold text-text-dark mb-4">
                {texts.edit_title}
              </h2>
              <div className="relative bg-component-dark rounded-xl p-4">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full bg-transparent border-0 text-text-dark placeholder:text-text-secondary focus:ring-0 resize-none h-10"
                  placeholder={texts.placeholder}
                  disabled={!imageBase64}
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={handleEdit}
              disabled={isLoading || !imageBase64 || !prompt}
              className="w-full px-6 py-3.5 rounded-lg bg-[#111111] text-white font-semibold flex items-center justify-center gap-2 transition-all hover:bg-border-dark disabled:opacity-50">
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin"></div>
                  <span>{texts.editing}</span>
                </>
              ) : (
                <>
                  <span className="text-gradient">
                    <WandIcon className="w-6 h-6" />
                  </span>
                  <span className="text-gradient font-bold">
                    {texts.apply_button}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Result View */}
      {editedImageUrl && imagePreviewUrl && (
        <div className="w-full max-w-4xl animate-fade-in space-y-6">
          <h3 className="text-xl font-bold text-center text-text-dark">
            {texts.comparison_title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h4 className="text-center font-semibold text-text-secondary mb-2">
                {texts.original_label}
              </h4>
              <img
                src={imagePreviewUrl}
                alt={texts.original_label}
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="relative group">
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
                download={`edited-image.png`}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full hover:bg-primary-start transition-colors">
                <ArrowDownTrayIcon className="w-5 h-5" />
              </a>
            </div>
          </div>
          <button
            onClick={() => setEditedImageUrl(null)}
            className="w-full mt-4 px-6 py-3 rounded-lg bg-component-dark text-text-dark font-semibold transition-all hover:bg-border-dark">
            {texts.go_back}
          </button>
        </div>
      )}
    </div>
  );
};