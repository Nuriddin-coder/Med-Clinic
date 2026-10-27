import {usePathname, useRouter, useSearchParams} from 'next/navigation';

import {TObject} from "@/types";

export const useQueryParams = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const buildQueryString = (params: TObject): string => {
    const urlSearchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== null && value !== undefined) {
        urlSearchParams.append(key, String(value));
      }
    }
    return urlSearchParams.toString();
  };

  const getQueryParams = (excludeKeys?: string[]): TObject<string> => {
    const params: TObject<string> = {};
    const excludedKeysSet = new Set(excludeKeys);

    for (const [key, value] of searchParams.entries()) {
      if (!excludedKeysSet.has(key)) {
        params[key] = value;
      }
    }

    return params;
  };

  const setQueryParams = (newParams: TObject): void => {
    const queryString = buildQueryString(newParams);
    router.push(`${pathname}?${queryString}`);
  };

  return {
    getQueryParams,
    setQueryParams,
  };
};
