import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const typeConfig = {
    success: {
      border: 'border-emerald-200',
      bg: 'bg-emerald-50',
      text: 'text-emerald-900',
      icon: <CheckCircle2 className="text-emerald-600 shrink-0" size={18} />
    },
    warning: {
      border: 'border-amber-200',
      bg: 'bg-amber-50',
      text: 'text-amber-900',
      icon: <AlertTriangle className="text-amber-600 shrink-0" size={18} />
    },
    error: {
      border: 'border-rose-200',
      bg: 'bg-rose-50',
      text: 'text-rose-900',
      icon: <XCircle className="text-rose-600 shrink-0" size={18} />
    },
    info: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      icon: <Info className="text-blue-600 shrink-0" size={18} />
    }
  }[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 25, scale: 0.9, transition: { duration: 0.2, ease: [0.25, 0.1, 0.25, 1] } }}
      transition={{ type: 'spring', damping: 25, stiffness: 320 }}
      className={`pointer-events-auto flex items-start justify-between p-3.5 rounded-lg border shadow-lg ${typeConfig.bg} ${typeConfig.border} ${typeConfig.text}`}
    >
      <div className="flex items-start gap-2.5">
        {typeConfig.icon}
        <div className="space-y-0.5">
          <p className="text-xs font-bold leading-tight">{toast.title}</p>
          <p className="text-xs text-slate-700 leading-normal">{toast.message}</p>
        </div>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 p-0.5 ml-2 cursor-pointer"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
};
