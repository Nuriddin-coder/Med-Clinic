"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMounted } from "@/hooks/use-mounted";
import { clinicQueryKeys, getClinicApi } from "@/lib/clinic-api";
import {
  AppointmentListParams,
  CancelAppointmentInput,
  ContactInput,
  CreateAppointmentInput,
  DoctorListParams,
  ServiceListParams,
  SlotListParams,
} from "@/types/clinic";

export const useClinicInfo = () => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.info,
    queryFn: () => getClinicApi().getClinicInfo(),
    enabled: mounted,
  });
  return { ...query, isLoading: !mounted || query.isPending };
};

export const useSpecialties = () => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.specialties,
    queryFn: () => getClinicApi().listSpecialties(),
    enabled: mounted,
  });
  return { ...query, isLoading: !mounted || query.isPending };
};

export const useDoctors = (params: DoctorListParams = {}) => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.doctors(params),
    queryFn: () => getClinicApi().listDoctors(params),
    enabled: mounted,
  });
  return { ...query, isLoading: !mounted || query.isPending };
};

export const useDoctor = (id: string) => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.doctor(id),
    queryFn: () => getClinicApi().getDoctor(id),
    enabled: mounted && Boolean(id),
  });
  return { ...query, isLoading: !mounted || query.isPending };
};

export const useServices = (params: ServiceListParams = {}) => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.services(params),
    queryFn: () => getClinicApi().listServices(params),
    enabled: mounted,
  });
  return { ...query, isLoading: !mounted || query.isPending };
};

export const useSlots = (params: SlotListParams, enabled = true) => {
  const mounted = useMounted();
  const ready = Boolean(params.doctorId && params.date && params.serviceId);
  const query = useQuery({
    queryKey: clinicQueryKeys.slots(params),
    queryFn: () => getClinicApi().listSlots(params),
    enabled: mounted && enabled && ready,
  });
  return { ...query, isLoading: !mounted || (ready && enabled && query.isPending) };
};

export const useAppointments = (params: AppointmentListParams, enabled = false) => {
  const mounted = useMounted();
  const query = useQuery({
    queryKey: clinicQueryKeys.appointments(params.phone),
    queryFn: () => getClinicApi().listAppointments(params),
    enabled: mounted && enabled && Boolean(params.phone),
  });
  return { ...query, isLoading: mounted && enabled && query.isPending };
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => getClinicApi().createAppointment(input),
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({
        queryKey: clinicQueryKeys.appointments(appointment.patientPhone),
      });
      void queryClient.invalidateQueries({ queryKey: ["clinic", "slots"] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CancelAppointmentInput) => getClinicApi().cancelAppointment(input),
    onSuccess: (appointment) => {
      void queryClient.invalidateQueries({
        queryKey: clinicQueryKeys.appointments(appointment.patientPhone),
      });
      void queryClient.invalidateQueries({ queryKey: ["clinic", "slots"] });
    },
  });
};

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (input: ContactInput) => getClinicApi().submitContact(input),
  });
};
