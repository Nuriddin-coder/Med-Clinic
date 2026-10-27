// "use client";

// import { FC } from "react";
// import { useLocale } from "next-intl";
// import { useSearchParams } from "next/navigation";
// import { usePathname, useRouter } from "@/components";

// import { TLocale } from "@/types";
// import { localesData } from "@/constants";

// /// ShadCN UI Components:
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from "@/components/ui/dropdown-menu";

// /// Icons:
// // import { LangIcon } from "@/assets/icons/lang-icon";
// // import { ChevronBlueDown } from "@/assets/icons/chevron-blue-down";

// interface ILocaleSwitcher {
//   className?: string;
// }

// export const LocaleSwitcher: FC<ILocaleSwitcher> = ({ className }) => {
//   const router = useRouter();
//   const locale = useLocale();
//   const pathname = usePathname();
//   const searchParams = useSearchParams().toString();

//   const pathnameWithParams = searchParams?.length
//     ? `${pathname}?${searchParams}`
//     : pathname;

//   const handleChange = (locale: TLocale) => {
//     router.replace(pathnameWithParams, { locale });
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <button
//           className={`flex items-center gap-x-3 bg-Light_background rounded-[12px] py-2 px-4 cursor-pointer ${className}`}
//         >
//           {/* <LangIcon /> */}
//           <span className="text-prm text-[14px] xlg:text-[16px]">
//             {localesData.find((item) => item.value === locale)?.label}
//           </span>
//           {/* <ChevronBlueDown /> */}
//         </button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         className="min-w-[140px] bg-white shadow-lg rounded-lg"
//         align="end"
//       >
//         {localesData.map((item) => (
//           <DropdownMenuItem
//             key={item.value}
//             onClick={() => handleChange(item.value)}
//             className="cursor-pointer text-sm hover:bg-gray-100"
//           >
//             {item.label} ({item.see})
//           </DropdownMenuItem>
//         ))}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// };
