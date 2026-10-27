import { cn } from "@/lib/utils";

export const InitialsAvatar = ({
  initials,
  hue,
  size = "md",
}: {
  initials: string;
  hue: number;
  size?: "sm" | "md" | "lg";
}) => (
  <div
    className={cn(
      "flex shrink-0 items-center justify-center rounded-2xl font-semibold text-white",
      size === "sm" && "h-12 w-12 text-sm",
      size === "md" && "h-16 w-16 text-lg",
      size === "lg" && "h-24 w-24 text-2xl"
    )}
    style={{ background: `hsl(${hue} 42% 42%)` }}
    aria-hidden
  >
    {initials}
  </div>
);
