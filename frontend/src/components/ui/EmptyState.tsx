interface EmptyStateProps {
  message: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ message, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
        <svg
          className="w-6 h-6 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-medium text-slate-800">{message}</p>
        {description && (
          <p className="text-xs text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 text-sm font-medium text-cyan-600 border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}