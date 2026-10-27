import { queryFn } from "@/utils";
import { IFetchingProps } from "@/types";
import { useQuery, QueryKey } from "@tanstack/react-query";

interface IUseFetchData<T> extends IFetchingProps {
  initialData?: T;
}

export const useFetchData = <T>(props: IUseFetchData<T>) => {
  const { url, params, initialData, enabled = true } = props;
  const queryKey: QueryKey = params ? [url, params] : [url];

  return useQuery<T>({
    enabled,
    queryKey,
    initialData,
    queryFn: (context) => queryFn<T>(context, params),
  });
};
