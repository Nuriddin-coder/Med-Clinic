import { NextIntlClientProvider, useMessages } from "next-intl";

import { Providers } from "@/providers";
import { BaseLayout } from "@/components";
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
        <title>MED Clinic</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="icon" href="/favicon.ico?v=2" /> */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap" 
          rel="stylesheet" 
        />
        <meta property="og:image" content="/favicon.ico?v=2" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <BaseLayout>{children}</BaseLayout>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
