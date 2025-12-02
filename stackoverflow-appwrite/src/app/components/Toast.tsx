"use client";

import React, { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeStyles = {
    success: "bg-green-500/20 border-green-500/30 text-green-400 backdrop-blur-sm",
    error: "bg-red-500/20 border-red-500/30 text-red-400 backdrop-blur-sm", 
    info: "bg-blue-500/20 border-blue-500/30 text-blue-400 backdrop-blur-sm"
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️"
  };

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg border ${typeStyles[type]} animate-in slide-in-from-right duration-300`}>
      <div className="flex items-center gap-2">
        <span>{icons[type]}</span>
        <span className="font-medium">{message}</span>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default Toast;