import Link from "next/link";
import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "tertiary"
  | "dark"
  | "ghost"
  | "danger";
type Size = "md" | "sm" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-button-md transition-[background-color,color,transform,box-shadow] duration-fast ease-out-soft select-none disabled:pointer-events-none disabled:bg-canvas-soft disabled:text-body disabled:shadow-none disabled:border-transparent active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-active shadow-card",
  secondary: "bg-canvas text-ink hover:bg-canvas-soft shadow-card",
  tertiary: "bg-canvas text-ink border border-ink hover:bg-primary-pale",
  dark: "bg-ink text-primary hover:bg-ink/90",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
  danger: "bg-negative text-canvas hover:bg-negative-deep",
};

const sizes: Record<Size, string> = {
  md: "px-6 py-3 min-h-12",
  sm: "px-4 py-2 min-h-10 text-body-sm-strong rounded-lg",
  icon: "h-11 w-11 rounded-full p-0",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children?: ReactNode;
  className?: string;
}

interface ButtonProps extends CommonProps {
  ref?: React.Ref<HTMLButtonElement>;
}

type ButtonNativeProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className"
>;

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  type = "button",
  ref,
  ...rest
}: ButtonProps & ButtonNativeProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-5 w-5 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

interface LinkButtonProps extends CommonProps {
  href: string;
  ariaLabel?: string;
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  children,
  className = "",
  ariaLabel,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </Link>
  );
}
