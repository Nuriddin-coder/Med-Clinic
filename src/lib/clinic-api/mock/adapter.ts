import {
  Appointment,
  ClinicApi,
  CreateAppointmentInput,
  Doctor,
  DoctorListParams,
  DoctorSort,
  ServiceItem,
  ServiceListParams,
  ServiceSort,
} from "@/types/clinic";
import { wait } from "@/lib/clinic-api/delay";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { isUzbekPhone, normalizePhone } from "@/lib/clinic-api/phone";
import {
  currentTimeMinutes,
  minutesToTime,
  timeToMinutes,
  todayIsoDate,
  weekdayFromDate,
} from "@/lib/clinic-api/time";
import { clinicInfo, doctors, services, specialties } from "@/lib/clinic-api/mock/seed";
import { readMockDb, writeMockDb } from "@/lib/clinic-api/mock/storage";

const cancellableStatuses = new Set(["pending", "confirmed"]);
const blockingStatuses = new Set(["pending", "confirmed"]);

const compareDoctors = (sort: DoctorSort | undefined) => {
  return (a: Doctor, b: Doctor): number => {
    switch (sort) {
      case "name-desc":
        return b.fullName.localeCompare(a.fullName, "uz");
      case "rating-desc":
        return b.rating - a.rating;
      case "experience-desc":
        return b.experienceYears - a.experienceYears;
      case "price-asc":
        return a.consultationPrice - b.consultationPrice;
      case "price-desc":
        return b.consultationPrice - a.consultationPrice;
      case "name-asc":
      default:
        return a.fullName.localeCompare(b.fullName, "uz");
    }
  };
};

const compareServices = (sort: ServiceSort | undefined) => {
  return (a: ServiceItem, b: ServiceItem): number => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "duration-asc":
        return a.durationMinutes - b.durationMinutes;
      case "name-asc":
      default:
        return a.name.localeCompare(b.name, "uz");
    }
  };
};

const requireDoctor = (id: string): Doctor => {
  const doctor = doctors.find((item) => item.id === id);
  if (!doctor) {
    throw new ClinicApiError("Shifokor topilmadi", 404);
  }
  return doctor;
};

const requireService = (id: string): ServiceItem => {
  const service = services.find((item) => item.id === id);
  if (!service) {
    throw new ClinicApiError("Xizmat topilmadi", 404);
  }
  return service;
};

const slotsOverlap = (
  startA: number,
  durationA: number,
  startB: number,
  durationB: number
): boolean => startA < startB + durationB && startB < startA + durationA;

const computeSlots = (doctorId: string, date: string, serviceId: string) => {
  const doctor = requireDoctor(doctorId);
  const service = requireService(serviceId);
  const weekday = weekdayFromDate(date);
  const hours = doctor.schedule[weekday];
  if (!hours) {
    return [];
  }

  const start = timeToMinutes(hours.start);
  const end = timeToMinutes(hours.end);
  const duration = service.durationMinutes;
  const db = readMockDb();
  const taken = db.appointments.filter(
    (item) =>
      item.doctorId === doctorId &&
      item.date === date &&
      blockingStatuses.has(item.status)
  );
  const isToday = date === todayIsoDate();
  const now = currentTimeMinutes();

  const result = [];
  for (let cursor = start; cursor + duration <= end; cursor += 30) {
    const overlaps = taken.some((item) =>
      slotsOverlap(cursor, duration, timeToMinutes(item.time), item.durationMinutes)
    );
    const inPast = isToday && cursor <= now;
    result.push({
      time: minutesToTime(cursor),
      available: !overlaps && !inPast,
    });
  }
  return result;
};

export const mockClinicApi: ClinicApi = {
  async getClinicInfo() {
    await wait();
    return clinicInfo;
  },

  async listSpecialties() {
    await wait();
    return specialties;
  },

  async listDoctors(params: DoctorListParams = {}) {
    await wait();
    const search = params.search?.trim().toLowerCase() ?? "";
    const specialtyId = params.specialtyId;

    return doctors
      .filter((doctor) => {
        const matchesSpecialty = specialtyId
          ? doctor.specialtyIds.includes(specialtyId)
          : true;
        if (!matchesSpecialty) {
          return false;
        }
        if (!search) {
          return true;
        }
        const specialtyNames = specialties
          .filter((item) => doctor.specialtyIds.includes(item.id))
          .map((item) => item.name.toLowerCase())
          .join(" ");
        const haystack = `${doctor.fullName} ${doctor.title} ${doctor.bio} ${specialtyNames}`.toLowerCase();
        return haystack.includes(search);
      })
      .slice()
      .sort(compareDoctors(params.sort));
  },

  async getDoctor(id) {
    await wait();
    return requireDoctor(id);
  },

  async listServices(params: ServiceListParams = {}) {
    await wait();
    const search = params.search?.trim().toLowerCase() ?? "";
    return services
      .filter((service) => {
        const matchesSpecialty = params.specialtyId
          ? service.specialtyId === params.specialtyId
          : true;
        if (!matchesSpecialty) {
          return false;
        }
        if (!search) {
          return true;
        }
        return `${service.name} ${service.description}`.toLowerCase().includes(search);
      })
      .slice()
      .sort(compareServices(params.sort));
  },

  async getService(id) {
    await wait();
    return requireService(id);
  },

  async listSlots({ doctorId, date, serviceId }) {
    await wait();
    return computeSlots(doctorId, date, serviceId);
  },

  async listAppointments({ phone }) {
    await wait();
    const normalized = normalizePhone(phone);
    if (!isUzbekPhone(normalized)) {
      throw new ClinicApiError("Telefon raqami noto‘g‘ri. Format: +998XXXXXXXXX");
    }
    const db = readMockDb();
    return db.appointments
      .filter((item) => item.patientPhone === normalized)
      .slice()
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  },

  async createAppointment(input: CreateAppointmentInput) {
    await wait();
    const doctor = requireDoctor(input.doctorId);
    const service = requireService(input.serviceId);
    const phone = normalizePhone(input.patientPhone);
    if (!isUzbekPhone(phone)) {
      throw new ClinicApiError("Telefon raqami noto‘g‘ri. Format: +998XXXXXXXXX");
    }
    if (!input.patientName.trim()) {
      throw new ClinicApiError("Ism familiya kiritilishi shart");
    }
    if (!input.date || !input.time) {
      throw new ClinicApiError("Sana va vaqt tanlang");
    }

    const weekday = weekdayFromDate(input.date);
    const hours = doctor.schedule[weekday];
    if (!hours) {
      throw new ClinicApiError("Bu kunda shifokor qabul qilmaydi");
    }

    const slots = computeSlots(input.doctorId, input.date, input.serviceId);
    const slot = slots.find((item) => item.time === input.time);
    if (!slot?.available) {
      throw new ClinicApiError("Bu vaqt band yoki mavjud emas. Boshqa slot tanlang.");
    }

    const appointment: Appointment = {
      id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      doctorId: input.doctorId,
      serviceId: input.serviceId,
      date: input.date,
      time: input.time,
      durationMinutes: service.durationMinutes,
      patientName: input.patientName.trim(),
      patientPhone: phone,
      notes: input.notes?.trim() ?? "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const db = readMockDb();
    db.appointments.push(appointment);
    writeMockDb(db);
    return appointment;
  },

  async cancelAppointment({ id, phone }) {
    await wait();
    const normalized = normalizePhone(phone);
    const db = readMockDb();
    const appointment = db.appointments.find((item) => item.id === id);
    if (!appointment) {
      throw new ClinicApiError("Qabul topilmadi", 404);
    }
    if (appointment.patientPhone !== normalized) {
      throw new ClinicApiError("Bu qabul boshqa telefon raqamiga tegishli", 403);
    }
    if (!cancellableStatuses.has(appointment.status)) {
      throw new ClinicApiError("Bu holatdagi qabulni bekor qilib bo‘lmaydi");
    }
    appointment.status = "cancelled";
    writeMockDb(db);
    return appointment;
  },

  async submitContact(input) {
    await wait();
    const phone = normalizePhone(input.phone);
    if (!isUzbekPhone(phone)) {
      throw new ClinicApiError("Telefon raqami noto‘g‘ri");
    }
    const message = {
      id: `msg-${Date.now()}`,
      name: input.name.trim(),
      phone,
      email: input.email.trim(),
      message: input.message.trim(),
      createdAt: new Date().toISOString(),
    };
    const db = readMockDb();
    db.contactMessages.push(message);
    writeMockDb(db);
    return message;
  },
};
