"use client";

import { Toaster as Sonner } from "sonner";

export const SonnerToaster = () => {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        className: "font-manrope text-sm",
      }}
    />
  );
};

