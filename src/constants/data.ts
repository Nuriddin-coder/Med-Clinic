import { ISelectData, TLocale } from "@/types";

export const fileUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

//// Icon's :

export const locales: TLocale[] = ["uz", "en", "ru"];

export const localesData: ISelectData<TLocale>[] = [
  { value: "uz", label: "UZ", see: "Uzbek" },
  { value: "ru", label: "RU", see: "Russian" },
  { value: "en", label: "EN", see: "English" },
];

