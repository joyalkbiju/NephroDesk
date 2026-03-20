interface SpinnerProps {
  message?: string;
}

export default function Spinner({ message = "Loading..." }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3">
      <div className="w-8 h-8 border-2 border-cyan-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  );
}