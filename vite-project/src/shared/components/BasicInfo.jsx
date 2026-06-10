import React from "react";

export const BasicInfo = () => {
  return (
    <section>
      <div>
        <h2>Basic Info</h2>

        <div>
          <label>Trade ID</label>
          <input type="text" />
        </div>

        <div>
          <label>Employee Name</label>
          <input type="text" />
        </div>

        <div>
          <label>Site</label>
          <select>
            <option>Select</option>
          </select>
        </div>

        <div>
          <label>Department</label>
          <select>
            <option>Select</option>
          </select>
        </div>

        <div>
          <label>Designation</label>
          <input type="text" />
        </div>

        <div>
          <label>Date of Joining</label>
          <input type="date" />
        </div>

        <div>
          <label>Email</label>
          <input type="email" />
        </div>

        <div>
          <label>Gender</label>
          <select>
            <option>Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label>Date of Birth</label>
          <input type="date" />
        </div>

        <div>
          <label>Mobile</label>
          <input type="tel" />
        </div>
      </div>
    </section>
  );
};
