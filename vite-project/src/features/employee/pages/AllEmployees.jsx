import FetchAllEmployee from "../components/FetchAllEmployee";
import "../components/fetchAllEmployee.scss";
import { api } from "@/shared/api/baseUrl.js";
import useEmployeeFetch from "../hooks/useEmployeeFetch";

const AllEmployees = () => {
  const { data, isLoading, error } = useEmployeeFetch();
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <main>
      <FetchAllEmployee employeeData={data.res} />
    </main>
  );
};

export default AllEmployees;
