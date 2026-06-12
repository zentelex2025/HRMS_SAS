import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAllEmployees } from "@/shared/lib/fetch";

const useEmployeeFetch = () => {
  return useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    refetchOnWindowFocus: true,
  });
};

export default useEmployeeFetch;
