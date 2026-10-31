"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { PageHero } from "@/components/clinic/page-hero";
import { Button } from "@/components/ui/button";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";
import { ContactSkeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useClinicInfo, useSubmitContact } from "@/hooks/clinic/use-clinic-query";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { contactSchema, ContactFormValues } from "@/lib/validations/schemas";

export const ContactPage = () => {
  const info = useClinicInfo();
  const submit = useSubmitContact();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "+998",
      email: "",
      message: "",
    },
  });

  if (info.isLoading) {
    return <ContactSkeleton />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await submit.mutateAsync(contactSchema.parse(values));
      toast.success("Xabaringiz yuborildi. Tez orada siz bilan bog‘lanamiz.");
      form.reset({ name: "", phone: "+998", email: "", message: "" });
    } catch (error) {
      const message =
        error instanceof ClinicApiError ? error.message : "Xabar yuborishda xatolik yuz berdi";
      toast.error(message);
    }
  });

  const clinic = info.data;

  return (
    <div className="min-h-[calc(100vh-72px-300px)]">
      <PageHero
        eyebrow="Bog‘lanish"
        title="Biz bilan aloqa"
        description="Savollaringiz yoki takliflaringiz bo‘lsa, quyidagi forma orqali xabar qoldiring yoki to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling."
      />

      <div className="container grid gap-8 py-10 lg:grid-cols-2 px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={onSubmit}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
        >
          <h2 className="text-xl font-bold text-slate-900">Xabar yuborish</h2>
          <FieldShell label="Ism familiya" error={form.formState.errors.name?.message}>
            <TextInput placeholder="Ismingizni kiriting" {...form.register("name")} />
          </FieldShell>

          <FieldShell label="Telefon raqami" error={form.formState.errors.phone?.message}>
            <TextInput placeholder="+998XXXXXXXXX" {...form.register("phone")} />
          </FieldShell>

          <FieldShell label="Email manzili" error={form.formState.errors.email?.message}>
            <TextInput type="email" placeholder="example@mail.uz" {...form.register("email")} />
          </FieldShell>

          <FieldShell label="Xabar matni" error={form.formState.errors.message?.message}>
            <TextArea
              rows={4}
              placeholder="Savolingiz yoki fikringizni yozing..."
              {...form.register("message")}
            />
          </FieldShell>

          <Button
            type="submit"
            disabled={submit.isPending}
            size="lg"
            className="rounded-2xl px-6 shrink-0 whitespace-nowrap shadow-md shadow-Primary_app/20 flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            {submit.isPending ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </form>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-5">
            <h2 className="text-xl font-bold text-slate-900">{clinic?.name}</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-Primary_app shrink-0 mt-0.5" />
                <p className="text-slate-600">{clinic?.address}</p>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <p className="text-slate-600">{clinic?.workingHoursLabel}</p>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {(clinic?.phones ?? []).map((phone) => (
                    <a
                      key={phone}
                      className="block font-medium text-slate-800 hover:text-Primary_app"
                      href={`tel:${phone}`}
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <a
                  className="font-medium text-slate-800 hover:text-Primary_app"
                  href={`mailto:${clinic?.email}`}
                >
                  {clinic?.email}
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm min-h-[220px]">
            <iframe
              title="Clinic Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2995.845456247957!2d69.281895!3d41.333333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDIwJzAwLjAiTiA2OcKwMTYnNTQuOCJF!5e0!3m2!1sen!2s!4v1620000000000!5m2!1sen!2s"
              className="h-64 w-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
