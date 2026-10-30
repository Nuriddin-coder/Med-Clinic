import { ClinicApi, PaginatedResponse } from "@/types/clinic";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { normalizePhone } from "@/lib/clinic-api/phone";
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  getClinicInfo,
  getDoctorById,
  getDoctors,
  getServiceById,
  getServices,
  getSlots,
  getSpecialties,
  loginAdmin,
  submitContact,
} from "@/lib/api";

const extractData = <T>(res: PaginatedResponse<T> | T[]): T[] => {
  if (Array.isArray(res)) return res;
  if (res && Array.isArray(res.data)) return res.data;
  return [];
};

export const restClinicApi: ClinicApi = {
  getClinicInfo: async () => {
    try {
      return await getClinicInfo();
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  listSpecialties: async (params) => {
    try {
      const res = await getSpecialties(params);
      return extractData(res);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  listDoctors: async (params = {}) => {
    try {
      const res = await getDoctors(params);
      return extractData(res);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  getDoctor: async (id) => {
    try {
      return await getDoctorById(id);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  listServices: async (params = {}) => {
    try {
      const res = await getServices(params);
      return extractData(res);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  getService: async (id) => {
    try {
      return await getServiceById(id);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  listSlots: async (params) => {
    try {
      return await getSlots(params);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  listAppointments: async (params) => {
    try {
      const res = await getAppointments(normalizePhone(params.phone), params);
      return extractData(res);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  createAppointment: async (input) => {
    try {
      return await createAppointment(input);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  cancelAppointment: async (input) => {
    try {
      return await cancelAppointment(input.id, input.phone);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  submitContact: async (input) => {
    try {
      return await submitContact(input);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },

  login: async (credentials) => {
    try {
      return await loginAdmin(credentials);
    } catch (error: any) {
      throw new ClinicApiError(error.message, error.statusCode);
    }
  },
};
