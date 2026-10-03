import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast, setToast } = useApp();

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 shrink-0" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100 shadow-emerald-900/20';
      case 'error':
        return 'border-rose-500/30 bg-rose-950/90 text-rose-100 shadow-rose-900/20';
      default:
        return 'border-blue-500/30 bg-slate-900/95 text-slate-100 shadow-blue-900/20';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-in">
      <div className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl shadow-2xl transition-all ${getBg()}`}>
        {getIcon()}
        <div className="flex-1 text-sm font-medium pr-2">
          {toast.message}
        </div>
        <button
          onClick={() => setToast(null)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
