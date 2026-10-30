"use client";

import { Button } from "@/components/ui/button";

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Tasdiqlash",
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100" role="dialog" aria-modal>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed">{description}</p>
        <div className="mt-6 flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl shrink-0 whitespace-nowrap"
          >
            Yo‘q, qoldirish
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl shrink-0 whitespace-nowrap"
          >
            {loading ? "Kutilmoqda..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
