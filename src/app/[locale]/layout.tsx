import { NextIntlClientProvider, useMessages } from "next-intl";

import { Providers } from "@/providers";
import { BaseLayout } from "@/components";
import { SonnerToaster } from "@/components/ui/sonner-toaster";
import { IChildren, IParams } from "@/types";
import { manrope } from "@/lib/fonts";
import "@/styles/globals.scss";

interface IRootLayout extends IChildren {
  params: IParams;
}

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<IRootLayout>) {
  const messages = useMessages();

  return (
    <html lang={locale} className={`${manrope.variable} ${manrope.className} font-manrope`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <title>MED Clinic — Zamonaviy Tibbiyot Markazi</title>
        <meta
          name="description"
          content="Online shifokor qabuliga navbatsiz yozilish, yuqori malakali mutaxassislar va zamonaviy diagnostika xizmatlari."
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta property="og:image" content="/icon-512.png" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#872AFF" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <BaseLayout>{children}</BaseLayout>
            <SonnerToaster />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
