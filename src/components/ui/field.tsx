import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
} from "react";
import { cn } from "@/lib/utils";

interface FieldShellProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  htmlFor?: string;
}

export const FieldShell = ({ label, error, hint, children, htmlFor }: FieldShellProps) => (
  <label className="flex flex-col gap-1.5 text-sm" htmlFor={htmlFor}>
    <span className="font-medium text-blackColor">{label}</span>
    {children}
    {hint && !error ? <span className="text-xs text-Navbar_Color">{hint}</span> : null}
    {error ? <span className="text-xs text-pink-badge">{error}</span> : null}
  </label>
);

const controlClass =
  "h-11 w-full rounded-xl border border-Input_border bg-white px-3 text-sm text-blackColor outline-none transition focus:border-Primary_app focus:ring-2 focus:ring-Primary_app/20 disabled:bg-Light_background";

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input ref={ref} className={cn(controlClass, className)} {...props} />
  )
);
TextInput.displayName = "TextInput";

export const TextArea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(controlClass, "h-28 resize-y py-2.5", className)}
      {...props}
    />
  )
);
TextArea.displayName = "TextArea";

export const SelectInput = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select ref={ref} className={cn(controlClass, className)} {...props}>
      {children}
    </select>
  )
);
SelectInput.displayName = "SelectInput";
