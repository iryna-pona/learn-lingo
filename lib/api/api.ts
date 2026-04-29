import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export type ApiError = AxiosError<{ error?: string }>;

export const isApiError = (err: unknown): err is ApiError =>
  axios.isAxiosError(err);