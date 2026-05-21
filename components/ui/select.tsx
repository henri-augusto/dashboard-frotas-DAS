import { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
};

export function Select({
  label,
  error,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={selectId} className="text-sm font-semibold text-ink-soft">
        {label}
      </label>
      <select
        id={selectId}
        className={`min-h-11 w-full rounded-xl border border-border bg-panel/85 px-3.5 py-2 text-primary shadow-inner shadow-primary/[0.03] transition duration-200 focus:border-primary/50 focus:bg-panel ${error ? "border-secondary bg-secondary/5" : ""} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-sm font-medium text-secondary">{error}</p>}
    </div>
  );
}
