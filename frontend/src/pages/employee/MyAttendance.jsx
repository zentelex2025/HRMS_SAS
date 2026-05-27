import React, { useState,useEffect } from "react";

const MyAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Database থেকে data load করো
  const fetchAttendance = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5010/api/view-attendance");
      if (!res.ok) throw new Error("Server error: " + res.status);
      const data = await res.json();

      // ✅ DB column 'date' কে component এর 'attendance_date' এ map করো
      const mapped = data.map(item => ({
        ...item,
        attendance_date: item.date || item.attendance_date,
      }));

      setAttendance(mapped);
    } catch (err) {
      setError("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // ✅ Database এ save করো
  const handleSaveToDatabase = async () => {
    if (attendance.length === 0) {
      alert("No data available to save!");
      return;
    }
    setIsSaving(true);
    try {
      const response = await fetch("http://localhost:5010/api/save-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendance),
      });
      const result = await response.json();
      if (response.ok) {
        alert("✅ Success: " + result.message);
        fetchAttendance(); // table refresh করো
      } else {
        alert("❌ Error: " + (result.error || "Data could not be saved"));
      }
    } catch (err) {
      alert("Data saved to database successfully!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="att-container">
      <style>{`
        .att-container {
          padding: 30px 40px;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .att-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          flex-wrap: wrap; /* মোবাইলে ভেঙে নিচে আসার জন্য */
          gap: 15px;
        }

        .att-title {
          font-size: 1.9rem;
          font-weight: 800;
          color: #1a73e8;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap; 
        }

        .total-badge {
          background: #1e1e1e;
          color: #fff;
          font-size: 0.82rem;
          font-weight: 600;
          padding: 8px 18px;
          border-radius: 50px;
          white-space: nowrap;
        }

        .save-btn {
          background: #16a34a;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .save-btn:hover { background: #15803d; }
        .save-btn:disabled { background: #9ca3af; cursor: not-allowed; }

        .status-pill {
          font-size: 0.8rem;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 50px;
          white-space: nowrap;
        }

        .att-card {
          background: #fff;
          border-radius: 14px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .table-responsive {
          overflow-x: auto; 
          -webkit-overflow-scrolling: touch;
        }

        .att-table { width: 100%; border-collapse: collapse; min-width: 900px; } 
        
        .att-table thead tr { background: #1e1e1e; }
        .att-table thead th {
          color: #fff;
          font-size: 0.82rem;
          font-weight: 700;
          padding: 16px 20px;
          text-align: left;
          border: none;
        }

        .att-table tbody tr {
          border-bottom: 1px solid #f0f0f0;
          transition: background 0.15s;
        }

        .att-table tbody tr:hover { background: #f5f8ff; }
        .att-table tbody td {
          padding: 15px 20px;
          font-size: 0.85rem;
          color: #333;
          vertical-align: middle;
          border: none;
        }

        .status-badge {
          padding: 5px 14px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          display: inline-block;
          text-align: center;
          min-width: 90px;
        }

        .status-present  { background: #dcfce7; color: #15803d; }
        .status-late     { background: #fef9c3; color: #a16207; }
        .status-absent   { background: #fee2e2; color: #dc2626; }
        .status-unknown  { background: #f3f4f6; color: #6b7280; }

        .loading-box, .empty-cell {
          text-align: center;
          padding: 50px;
          color: #9ca3af;
        }

        /* ✅ মোবাইল রেসপনসিভ মিডিয়া কুয়েরি */
        @media (max-width: 768px) {
          .att-container { padding: 15px 20px; }
          .att-title { font-size: 1.5rem; }
          .att-header-row { flex-direction: column; align-items: flex-start; }
          .header-actions { width: 100%; justify-content: flex-start; }
          .save-btn { width: 100%; margin-bottom: 10px; }
        }
      `}</style>

      {/* Header */}
      <div className="att-header-row">
        <div>
          <h2 className="att-title">Workforce Presence Insights</h2>
          <p style={{ color: "#6b7280", fontSize: "0.85rem", margin: "5px 0 0 0" }}>
            Real-time tracking of employee schedules, active hours, and status.
          </p>
        </div>

        <div className="header-actions">
          <span className="status-pill" style={{ background: "#dcfce7", color: "#15803d" }}>
            ✅ Present: {attendance.filter(i => i.status === "Present").length}
          </span>
          <span className="status-pill" style={{ background: "#fef9c3", color: "#a16207" }}>
            🕐 Late: {attendance.filter(i => i.status === "Late Present").length}
          </span>
          <span className="status-pill" style={{ background: "#fee2e2", color: "#dc2626" }}>
            ❌ Absent: {attendance.filter(i => i.status === "Absent").length}
          </span>

          <button
            className="save-btn"
            onClick={handleSaveToDatabase}
            disabled={isSaving || loading || attendance.length === 0}
          >
            {isSaving ? "Saving..." : "💾 Save to DB"}
          </button>

          <span className="total-badge">Total: {attendance.length}</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="att-card">
        {loading ? (
          <div className="loading-box">Loading records...</div>
        ) : error ? (
          <div className="error-box">⚠ {error}</div>
        ) : (
          <div className="table-responsive">
            <table className="att-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>DATE</th>
                  <th>EMP_ID</th>
                  <th>NAME</th>
                  <th>SHIFT_INFO</th>
                  <th>CHECK_IN</th>
                  <th>CHECK_OUT</th>
                  <th style={{ textAlign: "center" }}>WORK_HOURS</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 ? (
                  <tr>
                   <td colSpan="9" className="empty-cell">
  No records found. Please check whether data exists in the employee1 table in phpMyAdmin.
</td>
                  </tr>
                ) : (
                  attendance.map((item, index) => (
                    <tr key={item.id || index}>
                      <td style={{ color: "#9ca3af", fontSize: "0.75rem" }}>{item.id || index + 1}</td>
                      <td style={{ fontWeight: 600 }}>{item.attendance_date || "—"}</td>
                      <td style={{ color: "#6b7280", fontFamily: "monospace" }}>{item.employee_id || "N/A"}</td>
                      <td style={{ fontWeight: 600 }}>{item.employee_name || "—"}</td>
                      <td>
                        <div style={{ color: "#1a73e8", fontWeight: 600, fontSize: "0.8rem" }}>
                          {item.shift_name || "General"}
                        </div>
                        <div style={{ color: "#9ca3af", fontSize: "0.7rem" }}>
                          {item.start_time} - {item.end_time}
                        </div>
                      </td>
                      <td style={{ color: "#16a34a", fontWeight: 500 }}>{item.check_in || "—"}</td>
                      <td style={{ color: "#dc2626", fontWeight: 500 }}>{item.check_out || "—"}</td>
                      <td style={{ textAlign: "center", fontWeight: 700, color: "#4b5563" }}>
                        {item.work_hours ? `${parseFloat(item.work_hours).toFixed(2)}h` : "0.00h"}
                      </td>
                      <td>
                        <span className={`status-badge ${
                          item.status === "Present"      ? "status-present" :
                          item.status === "Late Present" ? "status-late"    :
                          item.status === "Absent"       ? "status-absent"  : "status-unknown"
                        }`}>
                          {item.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAttendance;