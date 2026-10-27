import { z } from "zod";
import { isUzbekPhone, normalizePhone } from "@/lib/clinic-api/phone";

const phoneField = z
  .string()
  .min(1, "Telefon raqami majburiy")
  .transform((value) => normalizePhone(value))
  .refine((value) => isUzbekPhone(value), "Format: +998 XX XXX XX XX");

export const appointmentSchema = z.object({
  doctorId: z.string().min(1, "Shifokorni tanlang"),
  serviceId: z.string().min(1, "Xizmatni tanlang"),
  date: z.string().min(1, "Sanani tanlang"),
  time: z.string().min(1, "Vaqtni tanlang"),
  patientName: z
    .string()
    .trim()
    .min(3, "Ism familiya kamida 3 ta belgidan iborat bo‘lsin")
    .max(80, "Ism familiya juda uzun"),
  patientPhone: phoneField,
  notes: z.string().max(500, "Izoh 500 belgidan oshmasin").optional().or(z.literal("")),
});

export type AppointmentFormValues = z.input<typeof appointmentSchema>;

export const lookupSchema = z.object({
  phone: phoneField,
});

export type LookupFormValues = z.input<typeof lookupSchema>;

export const contactSchema = z.object({
  name: z.string().trim().min(3, "Ism familiya majburiy"),
  phone: phoneField,
  email: z.string().trim().email("Email noto‘g‘ri"),
  message: z.string().trim().min(10, "Xabar kamida 10 ta belgi bo‘lsin").max(1000),
});

export type ContactFormValues = z.input<typeof contactSchema>;
