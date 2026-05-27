import { useState } from "react";
import ResignationFrom from "./ResignationFrom"; // Import your existing component

const roles = {
  rm: "Immediate Boss (RM)",
  hod: "Department Head",
  hr: "HR Head",
  admin: "Admin",
  finance: "Finance",
};

export default function RoleLoginPage() {
  const [currentRole, setCurrentRole] = useState(null); // null initially
  const [formData, setFormData] = useState({
    empId: "", name: "", email: "", designation: "", department: "", lastDate: "", // add other fields as needed
  });
  const [resignationId, setResignationId] = useState(null); // you can manage this as needed

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
      {!currentRole ? (
        // Show role selection if no role is chosen
        <div style={{ background: "#F8F8F8", padding: "1rem", borderRadius: 8, border: "1px solid #EBEBEB" }}>
          <h2 style={{ marginBottom: 16 }}>Select Your Role</h2>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(roles).map(([role, label]) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 8,
                  border: "1.5px solid",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all .15s",
                  background: "#fff",
                  borderColor: "#EBEBEB",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Show the form or content based on selected role
        <div>
          <h3 style={{ marginBottom: 16 }}>Role: {roles[currentRole]}</h3>
          {/* You could add your form here */}
          
          {/* For simplicity, let's pass dummy data */}
          <ResignationFrom
            form={formData}
            resignationId={resignationId}
            currentRole={currentRole}
          />

          {/* Add a button to go back and choose another role */}
          <button
            style={{ marginTop: 20, padding: "8px 16px", borderRadius: 8, background: "#E5E7EB", border: "none", cursor: "pointer" }}
            onClick={() => setCurrentRole(null)}
          >
            Change Role
          </button>
        </div>
      )}
    </div>
  );
}