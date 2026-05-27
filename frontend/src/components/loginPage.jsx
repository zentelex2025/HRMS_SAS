import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SimpleLogin() {
  const [form, setForm] = useState({
    name: "",
    designation: "",
    empId: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { name, designation, empId, email, phone, password } = form;

    if (!name || !designation || !empId || !email || !phone || !password) {
      setError("All fields are required!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5007/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("empId", data.employee?.employee_id || form.empId);
        localStorage.setItem("userName", form.name); // ✅ form থেকে
        localStorage.setItem("designation", form.designation); // ✅ form থেকে
        localStorage.setItem("department", data.employee?.department || "N/A");
        localStorage.setItem("email", form.email); // ✅ form থেকে
        localStorage.setItem("phone", form.phone); // ✅ form থেকে
        localStorage.setItem(
          "joining_date",
          data.employee?.joining_date || "N/A",
        );
        localStorage.setItem("status", data.employee?.status || "Active");
        localStorage.setItem("report_to", "HR Manager"); // ✅ সবসময়

        navigate("/employee/dashboard");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Unable to connect to the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      label: "Full Name",
      name: "name",
      placeholder: "Rahul Sharma",
      type: "text",
    },
    {
      label: "Designation",
      name: "designation",
      placeholder: "Software Engineer",
      type: "text",
    },
    {
      label: "Employee ID",
      name: "empId",
      placeholder: "EMP-101",
      type: "text",
    },
    {
      label: "Email Address",
      name: "email",
      placeholder: "name@company.com",
      type: "email",
    },
    {
      label: "Phone Number",
      name: "phone",
      placeholder: "9876543210",
      type: "tel",
    },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.header}>
          <h2 style={styles.title}>Employee Login</h2>
          <p style={styles.subtitle}>Portal access using employee details</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.inputGrid}>
            {fields.map((field) => (
              <div key={field.name} style={styles.inputGroup}>
                <label style={styles.label}>{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  placeholder={field.placeholder}
                  style={styles.input}
                  value={form[field.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            {/* Password Field with show/hide toggle */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  style={styles.passwordInput}
                  value={form.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6c757d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#6c757d"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f7f6",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  box: {
    width: "100%",
    maxWidth: "450px",
    background: "#ffffff",
    padding: "35px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  header: { textAlign: "center", marginBottom: "30px" },
  title: {
    margin: "0",
    fontSize: "24px",
    color: "#1a2e4a",
    fontWeight: "bold",
  },
  subtitle: { fontSize: "14px", color: "#6c757d", marginTop: "8px" },
  inputGrid: {},
  inputGroup: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    marginBottom: "6px",
    color: "#495057",
  },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    boxSizing: "border-box",
    fontSize: "14px",
    outline: "none",
  },
  passwordWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordInput: {
    width: "100%",
    padding: "12px",
    paddingRight: "44px",
    borderRadius: "8px",
    border: "1px solid #dee2e6",
    boxSizing: "border-box",
    fontSize: "14px",
    outline: "none",
  },
  eyeBtn: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    display: "flex",
    alignItems: "center",
  },
  button: {
    width: "100%",
    padding: "14px",
    backgroundColor: "#1a2e4a",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
  },
  error: {
    color: "#d9534f",
    fontSize: "13px",
    textAlign: "center",
    backgroundColor: "#f8d7da",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "15px",
  },
};
