"use client"
import React, {useEffect} from "react";
import Toast, {ToastType} from "./Toast";

export type ToastItem = {
  id: string;
  type?: ToastType;
  message: string;
  duration?: number;
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({toasts, onRemove}) => {
  return (
      <div className="fixed z-50 bottom-6 right-6 flex flex-col gap-3 items-end">
        {toasts.map((toast) => (
            <Toast
                key={toast.id}
                type={toast.type}
                message={toast.message}
                duration={toast.duration}
                onClose={() => onRemove(toast.id)}
            />
        ))}
      </div>
  );
};

export default ToastContainer; 