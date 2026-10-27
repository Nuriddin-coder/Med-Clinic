import { createSharedPathnamesNavigation } from "next-intl/navigation";

import { locales } from "@/constants";

export const { Link, useRouter, usePathname } = createSharedPathnamesNavigation(
  { locales }
);

export { Footer } from "./footer";
export { BaseLayout } from "./layout";
export { Header } from "./header";
export { scrollToTop } from "./scroll-top";
