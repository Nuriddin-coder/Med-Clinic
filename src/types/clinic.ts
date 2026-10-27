export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export type DoctorGender = "male" | "female";

export type DoctorSort =
  | "name-asc"
  | "name-desc"
  | "rating-desc"
  | "experience-desc"
  | "price-asc"
  | "price-desc";

export type ServiceSort = "name-asc" | "price-asc" | "price-desc" | "duration-asc";

export interface WorkingHours {
  start: string;
  end: string;
}

export interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface DoctorReview {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  fullName: string;
  specialtyIds: string[];
  title: string;
  experienceYears: number;
  rating: number;
  reviewCount: number;
  consultationPrice: number;
  bio: string;
  education: string[];
  languages: string[];
  gender: DoctorGender;
  photoInitials: string;
  photoHue: number;
  schedule: Record<Weekday, WorkingHours | null>;
  reviews: DoctorReview[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  specialtyId: string;
  durationMinutes: number;
  price: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  durationMinutes: number;
  patientName: string;
  patientPhone: string;
  notes: string;
  status: AppointmentStatus;
  createdAt: string;
}

export interface ClinicInfo {
  name: string;
  tagline: string;
  about: string;
  address: string;
  phones: string[];
  email: string;
  workingHoursLabel: string;
  years: number;
  patientCount: number;
  doctorCount: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface DoctorListParams {
  search?: string;
  specialtyId?: string;
  sort?: DoctorSort;
}

export interface ServiceListParams {
  search?: string;
  specialtyId?: string;
  sort?: ServiceSort;
}

export interface SlotListParams {
  doctorId: string;
  date: string;
  serviceId: string;
}

export interface CreateAppointmentInput {
  doctorId: string;
  serviceId: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  notes?: string;
}

export interface CancelAppointmentInput {
  id: string;
  phone: string;
}

export interface AppointmentListParams {
  phone: string;
}

export interface ContactInput {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface ClinicApi {
  getClinicInfo: () => Promise<ClinicInfo>;
  listSpecialties: () => Promise<Specialty[]>;
  listDoctors: (params?: DoctorListParams) => Promise<Doctor[]>;
  getDoctor: (id: string) => Promise<Doctor>;
  listServices: (params?: ServiceListParams) => Promise<ServiceItem[]>;
  getService: (id: string) => Promise<ServiceItem>;
  listSlots: (params: SlotListParams) => Promise<TimeSlot[]>;
  listAppointments: (params: AppointmentListParams) => Promise<Appointment[]>;
  createAppointment: (input: CreateAppointmentInput) => Promise<Appointment>;
  cancelAppointment: (input: CancelAppointmentInput) => Promise<Appointment>;
  submitContact: (input: ContactInput) => Promise<ContactMessage>;
}
