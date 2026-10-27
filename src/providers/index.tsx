"use client";

import { useLocale } from "next-intl";
import { FC, ReactNode } from "react";
import { Provider } from "react-redux";

import { ToastProvider } from "@/components/ui/toast";
import { store } from "@/store";
import { getQueryClient } from "@/utils";
import { QueryClientProvider } from "@tanstack/react-query";

interface IProvider {
  children: ReactNode;
}

export const Providers: FC<IProvider> = ({ children }) => {
  const locale = useLocale();
  const queryClient = getQueryClient();

  const recaptchaKey = process.env.NEXT_PUBLIC_CAPTCHA_KEY;

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ToastProvider>{children}</ToastProvider>
      </Provider>
    </QueryClientProvider>
  );
};
