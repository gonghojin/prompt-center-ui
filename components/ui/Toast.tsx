"use client"
import React, {useEffect} from "react";
import {CheckCircle, XCircle, Info, AlertTriangle, X} from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  type?: ToastType;
  message: string;
  onClose: () => void;
  duration?: number; // ms
}

const typeStyles: Record<ToastType, string> = {
  success: "border-green-400 text-green-200",
  error: "border-red-400 text-red-200",
  info: "border-blue-400 text-blue-200",
  warning: "border-yellow-400 text-yellow-200",
};

const typeIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5 text-green-400"/>,
  error: <XCircle className="w-5 h-5 text-red-400"/>,
  info: <Info className="w-5 h-5 text-blue-400"/>,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400"/>,
};

export const Toast: React.FC<ToastProps> = ({type = "info", message, onClose, duration = 2500}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
      <div
          className={`flex items-center gap-3 bg-white/10 border-l-4 px-4 py-3 rounded shadow-lg animate-fade-in ${typeStyles[type]} min-w-[240px] max-w-xs`}
          role="status"
          aria-live="polite"
      >
        {typeIcons[type]}
        <span className="flex-1 text-sm font-medium">{message}</span>
        <button
            className="ml-2 p-1 rounded hover:bg-white/20 focus:outline-none"
            aria-label="닫기"
            onClick={onClose}
            tabIndex={0}
        >
          <X className="w-4 h-4"/>
        </button>
      </div>
  );
};

export default Toast; 