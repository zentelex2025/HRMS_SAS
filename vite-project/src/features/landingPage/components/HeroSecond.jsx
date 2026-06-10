import "../components/heroSecond.scss";
import {
  Attendance_card,
  Employee_card,
  OtherFeatures_card,
  Salary_card,
} from "./ModuleCard";

const cards = [
  {
    title: "Employee Management",
    description:
      "Easily manage employee data, designations, departments and records in one place.",
    button: "Explore Dashboard",
  },
  {
    title: "Leave Management",
    description:
      "Apply, track, and approve leaves with a smooth and automated workflow.",
    button: "Apply Leave",
  },
  {
    title: "Attendance Tracker",
    description:
      "Monitor daily check-ins, office hours, and real-time attendance logs.",
    button: "View Attendance",
  },
  {
    title: "Payroll System",
    description:
      "Manage salary structures, payslips, and employee payroll processing.",
    button: "Manage Payroll",
  },
  {
    title: "Admin Controls",
    description:
      "Administrative access for attendance oversight and system settings.",
    button: "Review Logs",
  },
  {
    title: "Leave Approvals",
    description:
      "Admin section to review and approve/reject employee leave requests.",
    button: "Manage Requests",
  },
];
const HeroSecond = () => {
  return (
    <section className="core-modules">
      <div className="container">
        <h2>Our Core Modules</h2>

        <div className="module-grid">
          <Employee_card />
          <Salary_card />
          <Attendance_card />
          <OtherFeatures_card />
        </div>
      </div>
    </section>
  );
};

export default HeroSecond;
