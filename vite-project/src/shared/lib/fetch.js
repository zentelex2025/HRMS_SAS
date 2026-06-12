import { api } from "@/shared/api/baseUrl";
export const getAllEmployees = async () => {
  const { data } = await api.get("/employees");

  return (await data) || [];
};
