import React from 'react';

export const LoadingSpinner = ({ fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-6 space-y-3">
      <div className="relative w-10 h-10">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 dark:border-emerald-950 animate-pulse"></div>
        <div className="w-10 h-10 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading financial data...</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-xs">
        {content}
      </div>
    );
  }

  return content;
};
