import { NextIntlClientProvider, useMessages } from "next-intl";

import { Providers } from "@/providers";
import { BaseLayout } from "@/components";
import { SonnerToaster } from "@/components/ui/sonner-toaster";
import { IChildren, IParams } from "@/types";
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
    <html lang={locale} className="font-manrope">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <title>MED Clinic — Zamonaviy Tibbiyot Markazi</title>
        <meta
          name="description"
          content="Online shifokor qabuliga navbatsiz yozilish, yuqori malakali mutaxassislar va zamonaviy diagnostika xizmatlari."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <meta property="og:image" content="/favicon.ico?v=2" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#0284c7" />
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
