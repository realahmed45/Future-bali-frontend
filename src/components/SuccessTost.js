import React, { useState, useEffect } from "react";

const SuccessToast = ({ message, isVisible, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-white border-l-4 border-green-500 shadow-lg rounded-lg p-4 max-w-md flex items-center space-x-3">
        {/* Success Icon */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Message Content */}
        <div className="flex-grow">
          <div className="text-sm font-medium text-gray-900">Success!</div>
          <div className="text-sm text-gray-600">{message}</div>
        </div>

        {/* Close Button */}
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Progress Bar */}
        <div
          className="absolute bottom-0 left-0 h-1 bg-green-500 rounded-bl-lg animate-progress"
          style={{
            animation: `progress ${duration}ms linear forwards`,
            width: "100%",
          }}
        ></div>
      </div>

      {/* Custom CSS Animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }

        .animate-progress {
          animation: progress ${duration}ms linear forwards;
        }
      `}</style>
    </div>
  );
};

// Enhanced version with different types
const Toast = ({
  type = "success",
  message,
  isVisible,
  onClose,
  duration = 4000,
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev - 100 / (duration / 100);
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      const timer = setTimeout(() => {
        onClose();
        setProgress(100);
      }, duration);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const configs = {
    success: {
      bgColor: "bg-green-50",
      borderColor: "border-green-400",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      progressColor: "bg-green-500",
      title: "Success!",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
    },
    error: {
      bgColor: "bg-red-50",
      borderColor: "border-red-400",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      progressColor: "bg-red-500",
      title: "Error!",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ),
    },
    info: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-400",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      progressColor: "bg-blue-500",
      title: "Info",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const config = configs[type];

  return (
    <div className="fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out">
      <div
        className={`${config.bgColor} border-l-4 ${config.borderColor} shadow-xl rounded-lg p-4 max-w-md min-w-[320px] relative overflow-hidden`}
      >
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div
              className={`w-10 h-10 ${config.iconBg} rounded-full flex items-center justify-center ${config.iconColor}`}
            >
              {config.icon}
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow pt-1">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              {config.title}
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {message}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex-shrink-0">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="absolute bottom-0 left-0 h-1 bg-gray-200 w-full">
          <div
            className={`h-full ${config.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

// Hook for easy usage
const useToast = () => {
  const [toast, setToast] = useState({
    isVisible: false,
    message: "",
    type: "success",
  });

  const showToast = (message, type = "success", duration = 4000) => {
    setToast({
      isVisible: true,
      message,
      type,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const showSuccess = (message) => showToast(message, "success");
  const showError = (message) => showToast(message, "error");
  const showInfo = (message) => showToast(message, "info");

  return {
    toast,
    showToast,
    showSuccess,
    showError,
    showInfo,
    hideToast,
  };
};

export { Toast, SuccessToast, useToast };
