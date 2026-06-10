import React from "react";
import {
  FaUsers,
  FaPlus,
  FaRupeeSign,
  FaFileInvoiceDollar,
  FaMoneyCheckAlt,
  FaUserMinus,
  FaClock,
  FaChartBar,
  FaCalendarAlt,
  FaCalculator,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "./moduleCard.scss";

export const Employee_card = () => {
  return (
    <div className="module-card">
      <div className="module-card__header">
        <div className="module-card__title-section">
          <div className="module-card__icon">
            <FaUsers />
          </div>

          <h3>Employees Management</h3>
        </div>

        <Link to="employee/new" className="link-class_txtNone">
          <button className="module-card__action">
            <div>
              <span>Add New Employee</span>
              <small>Creating new employee record</small>
            </div>

            <div className="module-card__plus">
              <FaPlus />
            </div>
          </button>
        </Link>
      </div>

      <div className="module-card__stats">
        <div className="stat stat--green">
          <h4>Total Sites</h4>
          <p>Project locations</p>
        </div>

        <div className="stat stat--red">
          <h4>Departments</h4>
          <p>Active teams</p>
        </div>

        <Link to="employee/all-employees" className="link-class_txtNone">
          <div className="stat stat--blue">
            <h4>All Employees</h4>
            <p>Total active employees</p>
          </div>
        </Link>

        <div className="stat stat--yellow">
          <h4>Site Employees</h4>
          <p>Staff working onsite</p>
        </div>
      </div>
    </div>
  );
};

export const Salary_card = () => {
  return (
    <div className="module-card">
      <div className="module-card__header">
        <div className="module-card__title-section">
          <div className="module-card__icon">
            <FaRupeeSign />
          </div>

          <h3>Salary Management</h3>
        </div>

        <button className="module-card__action">
          <div>
            <span>Payroll History Records</span>
            <small>Viewing history, preview payslip model</small>
          </div>

          <div className="module-card__plus">
            <FaPlus />
          </div>
        </button>
      </div>

      <div className="module-card__stats">
        <div className="stat stat--blue">
          <h4>Payroll Overview</h4>
          <p>Smart editable salary computation</p>
        </div>

        <div className="stat stat--purple">
          <h4>Bulk Download Payslips</h4>
          <p>Monthly salary slips history</p>
        </div>

        <div className="stat stat--green">
          <h4>Salary Structure</h4>
          <p>Define pay components</p>
        </div>

        <div className="stat stat--red">
          <h4>Advances & Deductions</h4>
          <p>Manage salary adjustments</p>
        </div>
      </div>
    </div>
  );
};

export const Attendance_card = () => {
  return (
    <div className="module-card">
      <div className="module-card__header">
        <div className="module-card__title-section">
          <div className="module-card__icon">
            <FaClock />
          </div>

          <h3>Attendance Management</h3>
        </div>
      </div>

      <div className="module-card__stats">
        <div className="stat stat--yellow">
          <h4>View Attendance</h4>
          <p>All records overview</p>
        </div>

        <div className="stat stat--blue">
          <h4>Holidays Management</h4>
          <p>Adding and updating holidays</p>
        </div>
      </div>
    </div>
  );
};

export const OtherFeatures_card = () => {
  return (
    <div className="module-card">
      <div className="module-card__header">
        <div className="module-card__title-section">
          <div className="module-card__icon">
            <FaMoneyBillWave />
          </div>

          <h3>Other Features</h3>
        </div>
      </div>

      <div className="module-card__stats">
        <div className="stat stat--yellow">
          <h4>Salary Calculator</h4>
          <p>Before assigning rough calculation</p>
        </div>
      </div>
    </div>
  );
};
