/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import {XMarkIcon} from './icons';

interface ErrorModalProps {
  message: string[];
  onClose: () => void;
  onSelectKey: () => void;
  title: string;
  addKeyButtonText: string;
  closeButtonText: string;
}

/**
 * A modal component that displays an error message to the user.
 * It includes a title, the error message, a close button, and a visual error icon.
 */
export const ErrorModal: React.FC<ErrorModalProps> = ({
  message,
  onClose,
  onSelectKey,
  title,
  addKeyButtonText,
  closeButtonText,
}) => {
  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="error-modal-title">
      <div
        className="bg-component-dark/30 rounded-xl shadow-2xl w-full max-w-md relative p-8 m-4 text-center border border-white/10 backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-text-secondary hover:text-text-dark z-10 p-2 rounded-full bg-transparent hover:bg-border-dark transition-colors"
          aria-label="Close error message">
          <XMarkIcon className="w-6 h-6" />
        </button>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/20 mb-4">
          <svg
            className="h-6 w-6 text-destructive"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            aria-hidden="true">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
        <h2
          id="error-modal-title"
          className="text-xl font-bold text-text-dark mb-2">
          {title}
        </h2>
        {message.map((m, index) => (
          <p key={index} className="text-text-secondary">
            {m}
          </p>
        ))}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onSelectKey}
            className="px-8 py-2 rounded-lg bg-gradient-to-r from-primary-start to-primary-end text-white font-semibold transition-all hover:opacity-90 hover:-translate-y-px focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-component-dark">
            {addKeyButtonText}
          </button>
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-lg bg-border-dark hover:bg-border-dark/70 text-text-dark font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 focus-visible:ring-offset-component-dark">
            {closeButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};