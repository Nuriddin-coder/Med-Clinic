import { Manrope } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
  fallback: ['system-ui', 'arial'],
});
