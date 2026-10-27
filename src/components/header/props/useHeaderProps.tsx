"use client";
import { useLocale, useTranslations } from "next-intl";

export const useHeaderProps = () => {
  const t = useTranslations();
  const locale = useLocale();

  return {
    t,
    locale,
  };
};
