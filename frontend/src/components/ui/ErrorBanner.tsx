interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">Something went wrong</p>
        <p className="text-xs text-slate-400 mt-1">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 text-sm font-medium bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}