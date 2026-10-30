"use client";

import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  hint?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({
  title,
  hint,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) => {
  const subtitle = description || hint;

  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <p className="text-lg font-bold text-slate-800">{title}</p>
      {subtitle ? <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">{subtitle}</p> : null}
      {actionLabel && onAction ? (
        <Button
          onClick={onAction}
          variant="outline"
          size="sm"
          className="mt-5 rounded-xl shrink-0 whitespace-nowrap"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
