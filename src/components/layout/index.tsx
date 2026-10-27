"use client";

import { FC } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { IChildren } from "@/types";

export const BaseLayout: FC<IChildren> = ({ children }) => (
  <div className="flex min-h-screen flex-col bg-default">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);
