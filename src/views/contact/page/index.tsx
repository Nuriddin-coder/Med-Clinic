"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PageHero } from "@/components/clinic/page-hero";
import { Button } from "@/components/ui/button";
import { FieldShell, TextArea, TextInput } from "@/components/ui/field";
import { PageLoader } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useClinicInfo, useSubmitContact } from "@/hooks/clinic/use-clinic-query";
import { ClinicApiError } from "@/lib/clinic-api/errors";
import { contactSchema, ContactFormValues } from "@/lib/validations/schemas";

export const ContactPage = () => {
  const info = useClinicInfo();
  const submit = useSubmitContact();
  const { notify } = useToast();
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
    return <PageLoader />;
  }

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await submit.mutateAsync(contactSchema.parse(values));
      notify("success", "Xabaringiz yuborildi. Tez orada qo‘ng‘iroq qilamiz.");
      form.reset({ name: "", phone: "+998", email: "", message: "" });
    } catch (error) {
      const message = error instanceof ClinicApiError ? error.message : "Yuborish amalga oshmadi";
      notify("error", message);
    }
  });

  const clinic = info.data;

  return (
    <div>
      <PageHero
        eyebrow="Aloqa"
        title="Savolingiz bormi?"
        description="Formani to‘ldiring yoki to‘g‘ridan-to‘g‘ri qo‘ng‘iroq qiling. Bu bemor sayti — xodim paneli bu yerda yo‘q."
      />
      <div className="container grid gap-8 py-10 lg:grid-cols-2">
        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-Input_border bg-white p-6 shadow-cardShadow">
          <FieldShell label="Ism familiya" error={form.formState.errors.name?.message}>
            <TextInput {...form.register("name")} />
          </FieldShell>
          <FieldShell label="Telefon" error={form.formState.errors.phone?.message}>
            <TextInput {...form.register("phone")} />
          </FieldShell>
          <FieldShell label="Email" error={form.formState.errors.email?.message}>
            <TextInput type="email" {...form.register("email")} />
          </FieldShell>
          <FieldShell label="Xabar" error={form.formState.errors.message?.message}>
            <TextArea {...form.register("message")} />
          </FieldShell>
          <Button type="submit" disabled={submit.isPending}>
            {submit.isPending ? "Yuborilmoqda..." : "Yuborish"}
          </Button>
        </form>
        <div className="rounded-2xl border border-Input_border bg-white p-6">
          <h2 className="text-lg font-semibold">{clinic?.name}</h2>
          <p className="mt-2 text-sm text-Navbar_Color">{clinic?.address}</p>
          <p className="mt-3 text-sm text-Navbar_Color">{clinic?.workingHoursLabel}</p>
          <div className="mt-4 space-y-2 text-sm">
            {(clinic?.phones ?? []).map((phone) => (
              <a key={phone} className="block font-medium text-Primary_app" href={`tel:${phone}`}>
                {phone}
              </a>
            ))}
            <a className="block font-medium text-Primary_app" href={`mailto:${clinic?.email}`}>
              {clinic?.email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
