"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-Primary_app/40 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-Primary_app text-white shadow-md shadow-Primary_app/25 hover:bg-[#7424db] hover:shadow-lg hover:shadow-Primary_app/30 border border-transparent",
        primary:
          "bg-Primary_app text-white shadow-md shadow-Primary_app/25 hover:bg-[#7424db] hover:shadow-lg hover:shadow-Primary_app/30 border border-transparent",
        secondary:
          "border-2 border-Primary_app text-Primary_app bg-white shadow-sm hover:bg-Primary_app/10 hover:border-Primary_app hover:text-Primary_app",
        outline:
          "border-2 border-Primary_app text-Primary_app bg-white shadow-sm hover:bg-Primary_app/10 hover:border-Primary_app hover:text-Primary_app",
        dark: "bg-prm text-white hover:bg-[#2f1494] shadow-md border border-transparent",
        ghost: "text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent",
        danger: "bg-pink-badge text-white hover:bg-[#d93a4d] shadow-sm border border-transparent",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3.5 text-xs rounded-xl",
        lg: "h-12 px-6 text-base rounded-2xl",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        type={type}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/**
 * 1. PrimaryButton — to'liq fonli asosiy CTA tugma (Primary_app)
 */
export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => (
    <Button ref={ref} variant={variant} className={className} {...props} />
  )
);
PrimaryButton.displayName = "PrimaryButton";

/**
 * 2. SecondaryButton — chegaralangan (border-2 border-Primary_app), oq fonli, toza va aniq tugma
 */
export const SecondaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "secondary", ...props }, ref) => (
    <Button ref={ref} variant={variant} className={className} {...props} />
  )
);
SecondaryButton.displayName = "SecondaryButton";
