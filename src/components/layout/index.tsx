"use client";

import { FC } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IChildren } from "@/types";

export const BaseLayout: FC<IChildren> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-slate-50/30 text-slate-900 antialiased">
    <Header />
    <main className="flex-1 w-full">
      {children}
    </main>
    <Footer />
  </div>
);
