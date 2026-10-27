import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { TLocale } from '@/types';
import { locales } from '@/constants';

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as TLocale)) notFound();

  return {
    messages: (await import(`../src/locales/${locale}.json`)).default
  };
});
