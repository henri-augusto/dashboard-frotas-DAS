import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  fullWidth?: boolean;
  loading?: boolean;
};

export function Button({
  children,
  variant = "primary",
  fullWidth,
  loading,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-base font-semibold shadow-sm transition duration-200 ease-out cursor-pointer active:translate-y-px active:scale-[0.99] disabled:translate-y-0 disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary text-white shadow-primary/10 hover:bg-[#332822]",
    secondary: "bg-secondary text-white shadow-secondary/20 hover:bg-[#9f2c33]",
    ghost:
      "border border-border bg-panel/60 text-primary shadow-none hover:border-primary/30 hover:bg-panel",
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}
