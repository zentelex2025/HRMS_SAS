import Employee from "@/features/employee/Employee";
import Employee_create from "@/features/employee/pages/Employee_create";
import AllEmployees from "./pages/AllEmployees";

export const EmployeeRoute = [
  { path: "/employee", element: <Employee />, roles: [""] },
  { path: "/employee/new", element: <Employee_create />, roles: [""] },
  {
    path: "/employee/all-employees",
    element: <AllEmployees />,
    roles: [""],
  },
];
