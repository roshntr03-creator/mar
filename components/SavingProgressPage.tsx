/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface SavingProgressPageProps {
  title: string;
  message: string;
}

/**
 * A fullscreen overlay that displays a loading animation and text.
 */
export const SavingProgressPage: React.FC<SavingProgressPageProps> = ({
  title,
  message,
}) => {
  return (
    <div
      className="fixed inset-0 bg-background-dark/90 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in"
      aria-live="polite"
      aria-busy="true">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      <h2 className="text-2xl font-bold text-text-dark mt-8">{title}</h2>
      <p className="text-text-secondary mt-2 text-center max-w-sm">{message}</p>
    </div>
  );
};
