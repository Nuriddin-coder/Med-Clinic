import { Appointment, ContactMessage } from "@/types/clinic";
import { addDaysIso } from "@/lib/clinic-api/time";

const STORAGE_KEY = "med-clinic-db-v1";

export interface MockDb {
  appointments: Appointment[];
  contactMessages: ContactMessage[];
}

const seedAppointments = (): Appointment[] => [
  {
    id: "apt-seed-1",
    doctorId: "doc-1",
    serviceId: "srv-consult-therapy",
    date: addDaysIso(2),
    time: "10:00",
    durationMinutes: 30,
    patientName: "Demo Bemor",
    patientPhone: "+998901234567",
    notes: "Bosim ko‘tarilishi",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt-seed-2",
    doctorId: "doc-8",
    serviceId: "srv-stoma-clean",
    date: addDaysIso(5),
    time: "11:00",
    durationMinutes: 45,
    patientName: "Demo Bemor",
    patientPhone: "+998901234567",
    notes: "",
    status: "pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt-seed-3",
    doctorId: "doc-5",
    serviceId: "srv-pedia",
    date: addDaysIso(-12),
    time: "09:30",
    durationMinutes: 30,
    patientName: "Demo Bemor",
    patientPhone: "+998901234567",
    notes: "Bolam shamollagan edi",
    status: "completed",
    createdAt: new Date().toISOString(),
  },
];

const initialDb = (): MockDb => ({
  appointments: seedAppointments(),
  contactMessages: [],
});

const assertBrowser = (): void => {
  if (typeof window === "undefined") {
    throw new Error("Mock database is available only in the browser");
  }
};

export const readMockDb = (): MockDb => {
  assertBrowser();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const db = initialDb();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }
  try {
    const parsed = JSON.parse(raw) as MockDb;
    if (!Array.isArray(parsed.appointments) || !Array.isArray(parsed.contactMessages)) {
      const db = initialDb();
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
      return db;
    }
    return parsed;
  } catch {
    const db = initialDb();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    return db;
  }
};

export const writeMockDb = (db: MockDb): void => {
  assertBrowser();
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};
