import axios, { AxiosError, AxiosInstance } from "axios";
import {
  Appointment,
  AppointmentListParams,
  AuthResponse,
  CancelAppointmentInput,
  ClinicInfo,
  ContactInput,
  ContactMessage,
  CreateAppointmentInput,
  Doctor,
  DoctorListParams,
  LoginCredentials,
  PaginatedResponse,
  PaginationParams,
  ServiceItem,
  ServiceListParams,
  SlotListParams,
  Specialty,
  TimeSlot,
} from "@/types/clinic";
import { normalizePhone } from "@/lib/clinic-api/phone";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://med-clinic-back.onrender.com";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (attach token if available in localStorage/session)
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      localStorage.getItem("med_token") || sessionStorage.getItem("med_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Helper for error formatting
export class ApiError extends Error {
  statusCode?: number;
  data?: unknown;

  constructor(message: string, statusCode?: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

const formatError = (error: unknown): never => {
  if (error instanceof AxiosError) {
    const data = error.response?.data;
    const message =
      (typeof data === "object" && data !== null && "message" in data
        ? String(data.message)
        : undefined) ||
      error.message ||
      "Tarmoq xatosi yuz berdi";
    throw new ApiError(message, error.response?.status, data);
  }
  if (error instanceof Error) {
    throw new ApiError(error.message);
  }
  throw new ApiError("Kutilmagan xatolik yuz berdi");
};

// Clean undefined/empty parameters
const cleanParams = (params?: Record<string, unknown>) => {
  if (!params) return undefined;
  const cleaned: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key] = typeof value === "number" ? value : String(value);
    }
  }
  return cleaned;
};

/* =========================================================================
 * CLINIC API FUNCTIONS
 * ========================================================================= */

// 1. GET /clinic
export const getClinicInfo = async (): Promise<ClinicInfo> => {
  try {
    const response = await apiClient.get<ClinicInfo>("/clinic");
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 2. GET /specialties
export const getSpecialties = async (
  params?: PaginationParams
): Promise<PaginatedResponse<Specialty>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Specialty> | Specialty[]>(
      "/specialties",
      { params: cleanParams(params as Record<string, unknown>) }
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    return formatError(error);
  }
};

// 3. GET /doctors
export const getDoctors = async (
  params?: DoctorListParams
): Promise<PaginatedResponse<Doctor>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Doctor> | Doctor[]>(
      "/doctors",
      {
        params: cleanParams({
          search: params?.search,
          specialtyId: params?.specialtyId,
          sort: params?.sort,
          page: params?.page,
          limit: params?.limit,
        }),
      }
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    return formatError(error);
  }
};

// 4. GET /doctors/:id
export const getDoctorById = async (id: string): Promise<Doctor> => {
  try {
    const response = await apiClient.get<Doctor>(`/doctors/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 5. GET /services
export const getServices = async (
  params?: ServiceListParams
): Promise<PaginatedResponse<ServiceItem>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<ServiceItem> | ServiceItem[]>(
      "/services",
      {
        params: cleanParams({
          search: params?.search,
          specialtyId: params?.specialtyId,
          sort: params?.sort,
          page: params?.page,
          limit: params?.limit,
        }),
      }
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    return formatError(error);
  }
};

// 6. GET /services/:id
export const getServiceById = async (id: string): Promise<ServiceItem> => {
  try {
    const response = await apiClient.get<ServiceItem>(`/services/${id}`);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 7. GET /slots
export const getSlots = async (params: SlotListParams): Promise<TimeSlot[]> => {
  try {
    const response = await apiClient.get<TimeSlot[]>("/slots", {
      params: cleanParams({
        doctorId: params.doctorId,
        date: params.date,
        serviceId: params.serviceId,
      }),
    });
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 8. GET /appointments
export const getAppointments = async (
  phone: string,
  params?: PaginationParams
): Promise<PaginatedResponse<Appointment>> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Appointment> | Appointment[]>(
      "/appointments",
      {
        params: cleanParams({
          phone: normalizePhone(phone),
          page: params?.page,
          limit: params?.limit,
        }),
      }
    );
    const data = response.data;
    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
      };
    }
    return data;
  } catch (error) {
    return formatError(error);
  }
};

// 9. POST /appointments
export const createAppointment = async (
  input: CreateAppointmentInput
): Promise<Appointment> => {
  try {
    const payload = {
      doctorId: input.doctorId,
      serviceId: input.serviceId,
      date: input.date,
      time: input.time,
      patientName: input.patientName.trim(),
      patientPhone: normalizePhone(input.patientPhone),
      notes: input.notes?.trim() || "",
    };
    const response = await apiClient.post<Appointment>("/appointments", payload);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 10. PATCH /appointments/:id/cancel
export const cancelAppointment = async (
  id: string,
  phone: string
): Promise<Appointment> => {
  try {
    const response = await apiClient.patch<Appointment>(
      `/appointments/${id}/cancel`,
      {
        phone: normalizePhone(phone),
      }
    );
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 11. POST /contact
export const submitContact = async (
  input: ContactInput
): Promise<ContactMessage> => {
  try {
    const payload = {
      name: input.name.trim(),
      phone: normalizePhone(input.phone),
      email: input.email.trim(),
      message: input.message.trim(),
    };
    const response = await apiClient.post<ContactMessage>("/contact", payload);
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

// 12. POST /auth/login
export const loginAdmin = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials);
    if (response.data?.token || response.data?.accessToken) {
      const token = response.data.token || response.data.accessToken;
      if (typeof window !== "undefined" && token) {
        localStorage.setItem("med_token", token);
      }
    }
    return response.data;
  } catch (error) {
    return formatError(error);
  }
};

export const api = {
  getClinicInfo,
  getSpecialties,
  getDoctors,
  getDoctorById,
  getServices,
  getServiceById,
  getSlots,
  getAppointments,
  createAppointment,
  cancelAppointment,
  submitContact,
  loginAdmin,
};

export default api;

