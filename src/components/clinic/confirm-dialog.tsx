"use client";

import { Button } from "@/components/ui/button";

export const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  loading,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl" role="dialog" aria-modal>
        <h3 className="text-lg font-semibold text-blackColor">{title}</h3>
        <p className="mt-2 text-sm text-Navbar_Color">{description}</p>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Yo‘q, qoldirish
          </Button>
          <Button variant="danger" onClick={onConfirm} disabled={loading}>
            {loading ? "Kutilmoqda..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
