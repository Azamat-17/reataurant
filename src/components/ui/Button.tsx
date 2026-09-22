import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "green" | "accent";
type Size = "sm" | "md";

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-foreground text-white hover:bg-black",
  outline: "border border-border bg-white text-foreground hover:border-foreground",
  ghost: "bg-transparent text-foreground hover:bg-gray-100",
  green: "bg-accent-green text-white hover:bg-accent-green-dark",
  accent: "bg-accent text-white hover:bg-accent-dark",
};

const SIZE_CLASSES: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5",
  md: "text-sm px-4 py-2.5",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    />
  );
}
