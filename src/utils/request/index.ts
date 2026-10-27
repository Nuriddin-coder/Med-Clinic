import axios, {
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_BASE_URL;

const httpClient: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
});

const setRequestHeaders = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  if (!config.headers) {
    config.headers = new AxiosHeaders();
  }

  // Don't override Content-Type for FormData requests
  if (!(config.data instanceof FormData)) {
    config.headers.set("Content-Type", "application/json");
  }

  return config;
};

const handleTokenRefresh = async (): Promise<void> => {
  const tokenAPI: AxiosInstance = axios.create({
    baseURL,
    withCredentials: true,
  });

  tokenAPI.interceptors.request.use(setRequestHeaders);

  await tokenAPI.post("/users/refresh-token");
};

const setupResponseInterceptors = () => {
  return [
    (response: AxiosResponse) => response,
    async (error: any) => {
      const config = error.config as InternalAxiosRequestConfig & {
        _attempted?: boolean;
      };
      const errorCode = error?.response?.data?.error?.code;
      if (errorCode === "TOKEN_EXPIRED" && !config._attempted) {
        config._attempted = true;

        await handleTokenRefresh();

        return axios(config);
      }

      const rejectionError = new Error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.error?.data ||
          "An error occurred"
      );

      return Promise.reject(rejectionError);
    },
  ];
};

httpClient.interceptors.request.use(setRequestHeaders);
httpClient.interceptors.response.use(...setupResponseInterceptors());

export { httpClient };
