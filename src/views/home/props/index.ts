"use client";


import { useLocale, useTranslations } from "next-intl";
import { fileUrl } from "@/constants/data";
import { Link } from "@/components";

export const useHomePageProps = () => {
  const t = useTranslations();
  const locale = useLocale();

  return {
    t,
    fileUrl,
    locale,
    Link,
  };
};
