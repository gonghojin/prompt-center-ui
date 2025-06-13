"use client"
import React, {createContext, useCallback, useContext, useState} from "react";
import ToastContainer, {ToastItem} from "./ToastContainer";
import {ToastType} from "./Toast";

interface ToastContextType {
  showToast: (toast: Omit<ToastItem, "id"> & { id?: string }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let toastId = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id"> & { id?: string }) => {
    const id = toast.id || `toast-${Date.now()}-${toastId++}`;
    setToasts((prev) => [...prev, {...toast, id}]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
      <ToastContext.Provider value={{showToast}}>
        {children}
        <ToastContainer toasts={toasts} onRemove={removeToast}/>
      </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}; 