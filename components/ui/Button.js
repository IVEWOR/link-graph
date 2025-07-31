import { cn } from "@/lib/utils";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-rgb(var(--primary)) text-rgb(var(--primary-foreground)) hover:opacity-90 shadow-lg hover:shadow-xl",
    secondary:
      "bg-rgb(var(--secondary)) text-rgb(var(--secondary-foreground)) hover:bg-opacity-80 border border-rgb(var(--border))",
    outline:
      "border border-rgb(var(--border)) text-rgb(var(--foreground)) hover:bg-rgb(var(--secondary))",
    ghost: "text-rgb(var(--foreground)) hover:bg-rgb(var(--secondary))",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
