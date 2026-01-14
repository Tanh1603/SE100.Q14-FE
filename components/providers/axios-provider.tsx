"use client";

import { apiClient } from "@/lib/api/client";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export const AxiosProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // request interceptor to add token
    const requestInterceptor = apiClient.interceptors.request.use(
      async (config) => {
        try {
          // Retrieve the token from Clerk
          const token = await getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error attaching auth token:", error);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // response interceptor to handle 401s
    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Optional: Redirect to login or show modal
          // We can add custom logic here if needed
          console.warn("Unauthorized access - 401");
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [getToken]);

  return <>{children}</>;
};
