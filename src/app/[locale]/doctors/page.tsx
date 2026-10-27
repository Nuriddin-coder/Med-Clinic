import { Suspense } from "react";
import { PageLoader } from "@/components/ui/skeleton";
import { DoctorsListPage } from "@/views";

export default function DoctorsRoute() {
  return (
    <Suspense fallback={<PageLoader label="Shifokorlar yuklanmoqda..." />}>
      <DoctorsListPage />
    </Suspense>
  );
}
