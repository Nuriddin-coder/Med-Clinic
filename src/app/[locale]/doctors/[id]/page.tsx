import { DoctorDetailPage } from "@/views";

interface DoctorRouteProps {
  params: { id: string };
}

export default function DoctorRoute({ params }: DoctorRouteProps) {
  return <DoctorDetailPage doctorId={params.id} />;
}
