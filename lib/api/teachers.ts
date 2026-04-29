import { api } from "./api";
import { Teacher } from "@/types/teacher";

export type GetTeachersResponse = {
  data: Teacher[];
  hasMore: boolean;
};

export const getTeachers = async (params: {
  page: number;
  language?: string;
  level?: string;
  price?: string;
}): Promise<GetTeachersResponse> => {
  const res = await api.get<GetTeachersResponse>("/teachers", {
    params,
  });

  return res.data;
};