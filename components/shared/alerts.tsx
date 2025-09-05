import React, { useState } from "react";
import { AlertCircle, CheckCircle, XCircle, Info, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types
export type AlertType = "error" | "success" | "warning" | "info";

export interface AlertConfig {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
  titleColor: string;
  textColor: string;
  buttonColor: string;
}

export interface AlertDialogProps {
  isOpen?: boolean;
  type?: AlertType;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
}

export interface AlertState {
  isOpen: boolean;
  type: AlertType;
  title: string;
  description?: string;
  confirmText: string;
  cancelText: string;
  showCancel: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface ShowAlertOptions {
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export interface UseAlertReturn {
  alert: AlertState;
  showAlert: (config: Partial<AlertState>) => void;
  hideAlert: () => void;
  showError: (
    title: string,
    description?: string,
    options?: ShowAlertOptions
  ) => void;
  showSuccess: (
    title: string,
    description?: string,
    options?: ShowAlertOptions
  ) => void;
  showWarning: (
    title: string,
    description?: string,
    options?: ShowAlertOptions
  ) => void;
  showInfo: (
    title: string,
    description?: string,
    options?: ShowAlertOptions
  ) => void;
  showConfirm: (
    title: string,
    description: string,
    onConfirm: () => void,
    options?: ShowAlertOptions
  ) => void;
}

// Alert types configuration
const alertTypes: Record<AlertType, AlertConfig> = {
  error: {
    icon: XCircle,
    bgColor: "bg-red-50 dark:bg-red-900/20",
    iconColor: "text-red-500",
    titleColor: "text-red-800 dark:text-red-200",
    textColor: "text-red-700 dark:text-red-300",
    buttonColor: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-green-50 dark:bg-green-900/20",
    iconColor: "text-green-500",
    titleColor: "text-green-800 dark:text-green-200",
    textColor: "text-green-700 dark:text-green-300",
    buttonColor: "bg-green-600 hover:bg-green-700 focus:ring-green-500",
  },
  warning: {
    icon: AlertCircle,
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    iconColor: "text-yellow-500",
    titleColor: "text-yellow-800 dark:text-yellow-200",
    textColor: "text-yellow-700 dark:text-yellow-300",
    buttonColor: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    iconColor: "text-blue-500",
    titleColor: "text-blue-800 dark:text-blue-200",
    textColor: "text-blue-700 dark:text-blue-300",
    buttonColor: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
  },
};

// Simple Alert Dialog Component
export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen = false,
  type = "info",
  title,
  description,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
  onConfirm,
  onCancel,
  onClose,
}) => {
  if (!isOpen) return null;

  const config = alertTypes[type];
  const IconComponent = config.icon;

  const handleConfirm = (): void => {
    onConfirm?.();
    onClose?.();
  };

  const handleCancel = (): void => {
    onCancel?.();
    onClose?.();
  };

  const handleClose = (): void => {
    onClose?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`top-[30%] sm:max-w-[425px] ${config.bgColor} border ${config.textColor}`}
      >
        <DialogHeader>
          <DialogTitle className={`text-xl font-semibold ${config.titleColor}`}>
            <div className="flex items-center gap-2">
              <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
              {title}
            </div>
          </DialogTitle>
        </DialogHeader>

        {description && (
          <p className={`text-sm mt-2 ${config.textColor}`}>{description}</p>
        )}

        <div className="mt-4 flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={() => {
                onCancel?.();
                onClose?.();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={() => {
              onConfirm?.();
              onClose?.();
            }}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${config.buttonColor}`}
          >
            {confirmText}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Custom hook for managing alert state
export const useAlert = (): UseAlertReturn => {
  const [alert, setAlert] = useState<AlertState>({
    isOpen: false,
    type: "info",
    title: "",
    description: "",
    confirmText: "OK",
    cancelText: "Cancel",
    showCancel: false,
    onConfirm: undefined,
    onCancel: undefined,
  });

  const showAlert = (config: Partial<AlertState>): void => {
    setAlert({
      isOpen: true,
      type: "info",
      title: "",
      confirmText: "OK",
      cancelText: "Cancel",
      showCancel: false,
      ...config,
    });
  };

  const hideAlert = (): void => {
    setAlert((prev) => ({ ...prev, isOpen: false }));
  };

  const showError = (
    title: string,
    description?: string,
    options: ShowAlertOptions = {}
  ): void => {
    showAlert({ type: "error", title, description, ...options });
  };

  const showSuccess = (
    title: string,
    description?: string,
    options: ShowAlertOptions = {}
  ): void => {
    showAlert({ type: "success", title, description, ...options });
  };

  const showWarning = (
    title: string,
    description?: string,
    options: ShowAlertOptions = {}
  ): void => {
    showAlert({ type: "warning", title, description, ...options });
  };

  const showInfo = (
    title: string,
    description?: string,
    options: ShowAlertOptions = {}
  ): void => {
    showAlert({ type: "info", title, description, ...options });
  };

  const showConfirm = (
    title: string,
    description: string,
    onConfirm: () => void,
    options: ShowAlertOptions = {}
  ): void => {
    showAlert({
      type: "warning",
      title,
      description,
      showCancel: true,
      onConfirm,
      confirmText: "Confirm",
      ...options,
    });
  };

  return {
    alert,
    showAlert,
    hideAlert,
    showError,
    showSuccess,
    showWarning,
    showInfo,
    showConfirm,
  };
};
