import { auth } from "@clerk/nextjs/server";
import axios, { AxiosInstance } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

/**
 * Creates an authorized Axios instance for Server Components/Actions.
 * Each call creates a new instance to ensure request isolation and fresh tokens.
 */
export const getServerApiClient = async (): Promise<AxiosInstance> => {
  const { getToken } = await auth();
  const token = await getToken();

  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    timeout: 10000,
  });
};
