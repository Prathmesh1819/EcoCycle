import React from 'react';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start p-4 rounded-xl shadow-2xl backdrop-blur-md border transition-all transform translate-y-0 duration-300 ${
              isSuccess
                ? 'bg-emerald-900/90 text-emerald-100 border-emerald-500/50'
                : isError
                ? 'bg-rose-900/90 text-rose-100 border-rose-500/50'
                : 'bg-dark-800/90 text-gray-100 border-gray-700/50'
            }`}
          >
            <div className="mr-3 mt-0.5">
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : isError ? (
                <AlertCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <Info className="w-5 h-5 text-sky-400" />
              )}
            </div>
            <div className="flex-1 text-sm">
              {toast.title && <h4 className="font-semibold text-white mb-0.5">{toast.title}</h4>}
              <p className="opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
