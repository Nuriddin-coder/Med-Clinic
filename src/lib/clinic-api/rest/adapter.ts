import { AxiosError } from "axios";
import { ClinicApi } from "@/types/clinic";
import { httpClient } from "@/utils";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { normalizePhone } from "@/lib/clinic-api/phone";

const unwrapError = (error: unknown): never => {
  if (error instanceof ClinicApiError) {
    throw error;
  }
  if (error instanceof AxiosError) {
    const message =
      (typeof error.response?.data === "object" &&
        error.response.data &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string" &&
        error.response.data.message) ||
      error.message ||
      "Tarmoq xatosi";
    throw new ClinicApiError(message, error.response?.status ?? 500);
  }
  if (error instanceof Error) {
    throw new ClinicApiError(error.message);
  }
  throw new ClinicApiError("Noma’lum xatolik");
};

const compactParams = (params?: Record<string, string | undefined>) => {
  if (!params) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );
};

const get = async <T>(url: string, params?: Record<string, string | undefined>) => {
  try {
    const { data } = await httpClient.get<T>(url, { params: compactParams(params) });
    return data;
  } catch (error) {
    return unwrapError(error);
  }
};

const post = async <T>(url: string, body: unknown) => {
  try {
    const { data } = await httpClient.post<T>(url, body);
    return data;
  } catch (error) {
    return unwrapError(error);
  }
};

const patch = async <T>(url: string, body: unknown) => {
  try {
    const { data } = await httpClient.patch<T>(url, body);
    return data;
  } catch (error) {
    return unwrapError(error);
  }
};

export const restClinicApi: ClinicApi = {
  getClinicInfo: () => get("/clinic"),
  listSpecialties: () => get("/specialties"),
  listDoctors: (params = {}) =>
    get("/doctors", {
      search: params.search,
      specialtyId: params.specialtyId,
      sort: params.sort,
    }),
  getDoctor: (id) => get(`/doctors/${id}`),
  listServices: (params = {}) =>
    get("/services", {
      search: params.search,
      specialtyId: params.specialtyId,
      sort: params.sort,
    }),
  getService: (id) => get(`/services/${id}`),
  listSlots: (params) =>
    get("/slots", {
      doctorId: params.doctorId,
      date: params.date,
      serviceId: params.serviceId,
    }),
  listAppointments: (params) =>
    get("/appointments", { phone: normalizePhone(params.phone) }),
  createAppointment: (input) =>
    post("/appointments", {
      ...input,
      patientPhone: normalizePhone(input.patientPhone),
    }),
  cancelAppointment: (input) =>
    patch(`/appointments/${input.id}/cancel`, {
      phone: normalizePhone(input.phone),
    }),
  submitContact: (input) =>
    post("/contact", {
      ...input,
      phone: normalizePhone(input.phone),
    }),
};
