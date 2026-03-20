import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "danger";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-cyan-600 text-white hover:bg-cyan-700 border-transparent",
  secondary: "bg-white text-slate-600 hover:bg-slate-50 border-slate-200",
  danger: "bg-red-50 text-red-700 hover:bg-red-100 border-red-200",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 font-medium border rounded-lg transition-colors cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}