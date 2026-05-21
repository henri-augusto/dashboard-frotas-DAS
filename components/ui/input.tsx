import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <input
        id={inputId}
        className={`min-h-11 w-full rounded-xl border border-border bg-panel/85 px-3.5 py-2 text-primary shadow-inner shadow-primary/[0.03] transition duration-200 placeholder:text-muted/75 focus:border-primary/50 focus:bg-panel ${error ? "border-secondary bg-secondary/5" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-secondary">{error}</p>}
    </div>
  );
}
