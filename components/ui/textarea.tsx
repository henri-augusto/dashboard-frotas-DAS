import { TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={textareaId} className="text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <textarea
        id={textareaId}
        rows={3}
        className={`max-h-40 w-full resize-none rounded-xl border border-border bg-panel/85 px-3.5 py-2 text-primary shadow-inner shadow-primary/[0.03] transition duration-200 placeholder:text-muted/75 focus:border-primary/50 focus:bg-panel ${error ? "border-secondary bg-secondary/5" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-sm font-medium text-secondary">{error}</p>}
    </div>
  );
}
