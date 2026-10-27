import { Suspense } from "react";
import { PageLoader } from "@/components/ui/skeleton";
import { BookPage } from "@/views";

export default function BookRoute() {
  return (
    <Suspense fallback={<PageLoader label="Yozilish formasi yuklanmoqda..." />}>
      <BookPage />
    </Suspense>
  );
}
