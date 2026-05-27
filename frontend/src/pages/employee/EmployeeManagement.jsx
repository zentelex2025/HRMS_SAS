// src/pages/admin/EmployeeManagement.jsx
import React, {useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --teal: #0ABFA3;
    --teal-dark: #089982;
    --navy: #0A1628;
    --navy-mid: #0F2044;
    --navy-card: #0D1E3A;
    --accent: #F5A623;
    --danger: #FF5C6A;
    --text-muted: #8BA3C7;
  }

  * { box-sizing: border-box; }

  .emp-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%);
    font-family: 'DM Sans', sans-serif;
    color: #fff;
    padding: 0;
  }

  /* ── TOPBAR ── */
  .emp-topbar {
    background: rgba(15,32,68,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 16px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: sticky; top: 0; z-index: 100;
  }

  .topbar-brand {
    display: flex; align-items: center; gap: 10px;
  }

  .topbar-logo {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1rem;
    box-shadow: 0 4px 14px rgba(10,191,163,0.35);
  }

  .topbar-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #fff;
  }

  .topbar-title span { color: var(--teal); }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .topbar-badge {
    background: rgba(10,191,163,0.12);
    border: 1px solid rgba(10,191,163,0.25);
    color: var(--teal);
    font-size: 0.75rem;
    font-weight: 600;
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.5px;
  }

  .btn-logout {
    background: rgba(255,92,106,0.1);
    border: 1px solid rgba(255,92,106,0.25);
    color: var(--danger);
    font-size: 0.8rem;
    font-weight: 600;
    padding: 6px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    font-family: 'Syne', sans-serif;
  }

  .btn-logout:hover { background: rgba(255,92,106,0.2); }

  /* ── MAIN ── */
  .emp-main { padding: 32px; max-width: 1200px; margin: 0 auto; }

  .page-header {
    display: flex; align-items: flex-end; justify-content: space-between;
    margin-bottom: 28px; flex-wrap: wrap; gap: 16px;
  }

  .page-eyebrow {
    font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase;
    color: var(--teal); margin-bottom: 4px;
  }

  .page-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.9rem; font-weight: 800; color: #fff; margin: 0;
  }

  .btn-add {
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    color: #fff;
    font-family: 'Syne', sans-serif;
    font-weight: 700; font-size: 0.88rem;
    padding: 12px 24px; border: none; border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(10,191,163,0.4);
    transition: all 0.25s ease;
    display: flex; align-items: center; gap: 8px;
    white-space: nowrap;
  }

  .btn-add:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(10,191,163,0.55); }

  /* ── STATS ── */
  .stats-row {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px; margin-bottom: 28px;
  }

  .stat-card {
    background: var(--navy-card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px; padding: 20px;
    display: flex; align-items: center; gap: 14px;
    transition: border-color 0.2s;
  }

  .stat-card:hover { border-color: rgba(10,191,163,0.25); }

  .stat-icon {
    width: 44px; height: 44px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center; font-size: 1.2rem;
  }

  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 1.6rem; font-weight: 800; color: #fff; line-height: 1;
  }

  .stat-lbl { font-size: 0.75rem; color: var(--text-muted); margin-top: 2px; }

  /* ── SEARCH ── */
  .search-bar-wrap {
    display: flex; gap: 12px; margin-bottom: 20px; flex-wrap: wrap;
  }

  .search-input {
    flex: 1; min-width: 220px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 12px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    padding: 11px 16px; outline: none; transition: all 0.2s;
  }

  .search-input:focus {
    border-color: var(--teal);
    background: rgba(10,191,163,0.05);
    box-shadow: 0 0 0 3px rgba(10,191,163,0.12);
  }

  .search-input::placeholder { color: rgba(139,163,199,0.45); }

  /* ── TABLE ── */
  .table-card {
    background: var(--navy-card);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px; overflow: hidden;
  }

  .emp-table { width: 100%; border-collapse: collapse; }

  .emp-table thead tr {
    background: rgba(10,191,163,0.06);
    border-bottom: 1px solid rgba(255,255,255,0.06);
  }

  .emp-table th {
    font-family: 'Syne', sans-serif;
    font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 1.5px; color: var(--text-muted);
    padding: 16px 20px; text-align: left;
  }

  .emp-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.2s;
  }

  .emp-table tbody tr:hover { background: rgba(255,255,255,0.02); }
  .emp-table tbody tr:last-child { border-bottom: none; }

  .emp-table td { padding: 16px 20px; font-size: 0.88rem; color: #d0e0f5; }

  .emp-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: linear-gradient(135deg, rgba(10,191,163,0.25), rgba(10,191,163,0.1));
    border: 1px solid rgba(10,191,163,0.25);
    display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem;
    color: var(--teal); flex-shrink: 0;
  }

  .emp-name-cell { display: flex; align-items: center; gap: 12px; }

  .emp-name { font-weight: 600; color: #fff; font-size: 0.9rem; }
  .emp-email { font-size: 0.78rem; color: var(--text-muted); }

  .dept-badge {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #c0d4f0; font-size: 0.75rem; font-weight: 500;
    padding: 4px 10px; border-radius: 8px;
    display: inline-block;
  }

  .status-badge {
    font-size: 0.72rem; font-weight: 600; padding: 4px 12px;
    border-radius: 100px; display: inline-flex; align-items: center; gap: 5px;
  }

  .status-active {
    background: rgba(10,191,163,0.12);
    border: 1px solid rgba(10,191,163,0.3);
    color: var(--teal);
  }

  .status-inactive {
    background: rgba(255,92,106,0.1);
    border: 1px solid rgba(255,92,106,0.25);
    color: var(--danger);
  }

  .status-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 5px currentColor;
  }

  .action-btns { display: flex; gap: 8px; }

  .btn-edit, .btn-delete {
    padding: 7px 14px; border-radius: 8px;
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.78rem;
    cursor: pointer; border: none; transition: all 0.2s;
  }

  .btn-edit {
    background: rgba(10,191,163,0.1);
    border: 1px solid rgba(10,191,163,0.25);
    color: var(--teal);
  }

  .btn-edit:hover { background: rgba(10,191,163,0.2); transform: translateY(-1px); }

  .btn-delete {
    background: rgba(255,92,106,0.08);
    border: 1px solid rgba(255,92,106,0.2);
    color: var(--danger);
  }

  .btn-delete:hover { background: rgba(255,92,106,0.18); transform: translateY(-1px); }

  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--text-muted);
  }

  .empty-icon { font-size: 2.5rem; margin-bottom: 12px; }
  .empty-text { font-size: 0.9rem; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0;
    background: rgba(5,14,31,0.85);
    backdrop-filter: blur(8px);
    display: flex; align-items: center; justify-content: center;
    z-index: 200; padding: 20px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  .modal-card {
    background: #0D1E3A;
    border: 1px solid rgba(10,191,163,0.2);
    border-radius: 24px;
    padding: 2.2rem;
    width: 100%; max-width: 520px;
    max-height: 90vh; overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 30px 80px rgba(0,0,0,0.6);
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .modal-card::before {
    content: '';
    position: absolute; top: 0; left: 10%; right: 10%; height: 2px;
    background: linear-gradient(90deg, transparent, var(--teal), transparent);
  }

  .modal-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.3rem; font-weight: 800; color: #fff; margin-bottom: 1.6rem;
  }

  .modal-close {
    position: absolute; top: 20px; right: 20px;
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted); width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1rem; transition: all 0.2s;
  }

  .modal-close:hover { background: rgba(255,92,106,0.15); color: var(--danger); }

  .modal-form-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
  }

  .modal-form-grid .full-col { grid-column: 1 / -1; }

  .modal-label {
    display: block; font-size: 0.72rem; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--text-muted); margin-bottom: 6px;
    font-weight: 500;
  }

  .modal-input, .modal-select {
    width: 100%;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.09);
    border-radius: 10px; color: #fff;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    padding: 11px 14px; outline: none; transition: all 0.2s;
  }

  .modal-input:focus, .modal-select:focus {
    border-color: var(--teal);
    background: rgba(10,191,163,0.05);
    box-shadow: 0 0 0 3px rgba(10,191,163,0.12);
  }

  .modal-input::placeholder { color: rgba(139,163,199,0.4); }
  .modal-select option { background: #0D1E3A; color: #fff; }

  .modal-footer {
    display: flex; gap: 10px; justify-content: flex-end; margin-top: 1.6rem;
  }

  .btn-cancel {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    color: var(--text-muted); padding: 11px 22px; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.85rem;
    cursor: pointer; transition: all 0.2s;
  }

  .btn-cancel:hover { background: rgba(255,255,255,0.08); color: #fff; }

  .btn-save {
    background: linear-gradient(135deg, var(--teal), var(--teal-dark));
    color: #fff; padding: 11px 28px; border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem;
    cursor: pointer; box-shadow: 0 6px 18px rgba(10,191,163,0.35);
    transition: all 0.25s;
  }

  .btn-save:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(10,191,163,0.5); }

  /* confirm delete modal */
  .confirm-msg { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1.5rem; line-height: 1.6; }
  .confirm-name { color: #fff; font-weight: 600; }

  .btn-confirm-delete {
    background: linear-gradient(135deg, var(--danger), #c0392b);
    color: #fff; padding: 11px 24px; border: none; border-radius: 10px;
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.88rem;
    cursor: pointer; box-shadow: 0 6px 18px rgba(255,92,106,0.35);
    transition: all 0.25s;
  }

  .btn-confirm-delete:hover { transform: translateY(-2px); }

  /* scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(10,191,163,0.3); border-radius: 3px; }

  @media (max-width: 640px) {
    .emp-main { padding: 16px; }
    .emp-topbar { padding: 12px 16px; }
    .modal-form-grid { grid-template-columns: 1fr; }
    .modal-form-grid .full-col { grid-column: 1; }
    .emp-table th:nth-child(3),
    .emp-table td:nth-child(3),
    .emp-table th:nth-child(4),
    .emp-table td:nth-child(4) { display: none; }
  }
`;

const EMPTY_FORM = {
  name: "", email: "", phone: "", department: "",
  designation: "", salary: "", status: "active",
};

const DEPARTMENTS = ["Engineering", "HR", "Finance", "Marketing", "Sales", "Operations", "Design"];

const EmployeeManagement = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  const token = localStorage.getItem("token");
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  // ── Fetch Employees ──
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/employees", authHeader);
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  // ── Handlers ──
  const openCreate = () => {
    setFormData(EMPTY_FORM);
    setEditMode(false);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setFormData({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      department: emp.department || "",
      designation: emp.designation || "",
      salary: emp.salary || "",
      status: emp.status || "active",
    });
    setEditMode(true);
    setEditId(emp._id);
    setShowModal(true);
  };

  const handleFormChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editMode) {
        await axios.put(`http://localhost:5000/api/employees/${editId}`, formData, authHeader);
        alert("Employee updated ✔");
      } else {
        await axios.post("http://localhost:5000/api/employees", formData, authHeader);
        alert("Employee created ✔");
      }
      setShowModal(false);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`http://localhost:5000/api/employees/${deleteTarget._id}`, authHeader);
      alert("Employee deleted");
      setDeleteTarget(null);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const initials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0,2) : "?";

  const filtered = employees.filter(emp =>
    `${emp.name} ${emp.email} ${emp.department} ${emp.designation}`
      .toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = employees.filter(e => e.status === "active").length;

  return (
    <div className="emp-page">
      <style>{styles}</style>

      {/* ── TOPBAR ── */}
      <div className="emp-topbar">
        <div className="topbar-brand">
          <div className="topbar-logo">👥</div>
          <span className="topbar-title">HR<span>MS</span></span>
        </div>
        <div className="topbar-right">
          <span className="topbar-badge">🛡️ Admin Panel</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="emp-main">

        {/* ── PAGE HEADER ── */}
        <div className="page-header">
          <div>
            <p className="page-eyebrow">Admin Dashboard</p>
            <h1 className="page-title">Employee Management</h1>
          </div>
          <button className="btn-add" onClick={openCreate}>
            <span>＋</span> Add Employee
          </button>
        </div>

        {/* ── STATS ── */}
        <div className="stats-row">
          {[
            { icon: "👥", bg: "rgba(10,191,163,0.12)", label: "Total Employees", val: employees.length },
            { icon: "✅", bg: "rgba(10,191,163,0.12)", label: "Active", val: activeCount },
            { icon: "⏸️", bg: "rgba(255,92,106,0.1)", label: "Inactive", val: employees.length - activeCount },
            { icon: "🏢", bg: "rgba(245,166,35,0.1)", label: "Departments", val: [...new Set(employees.map(e => e.department).filter(Boolean))].length },
          ].map((s, i) => (
            <div className="stat-card" key={i}>
              <div className="stat-icon" style={{ background: s.bg }}>{s.icon}</div>
              <div>
                <div className="stat-num">{loading ? "—" : s.val}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div className="search-bar-wrap">
          <input
            className="search-input"
            placeholder="🔍  Search by name, email, department..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* ── TABLE ── */}
        <div className="table-card">
          {loading ? (
            <div className="empty-state">
              <div className="empty-icon">⏳</div>
              <p className="empty-text">Loading employees...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👤</div>
              <p className="empty-text">No employees found. Add one to get started!</p>
            </div>
          ) : (
            <table className="emp-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => (
                  <tr key={emp._id}>
                    <td>
                      <div className="emp-name-cell">
                        <div className="emp-avatar">{initials(emp.name)}</div>
                        <div>
                          <div className="emp-name">{emp.name}</div>
                          <div className="emp-email">{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="dept-badge">{emp.department || "—"}</span></td>
                    <td style={{ color: "var(--text-muted)" }}>{emp.designation || "—"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{emp.phone || "—"}</td>
                    <td>
                      <span className={`status-badge ${emp.status === "active" ? "status-active" : "status-inactive"}`}>
                        <span className="status-dot" />
                        {emp.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button className="btn-edit" onClick={() => openEdit(emp)}>✏️ Edit</button>
                        <button className="btn-delete" onClick={() => setDeleteTarget(emp)}>🗑️ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ── CREATE / EDIT MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal-card">
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <h3 className="modal-title">{editMode ? "✏️ Edit Employee" : "➕ Add New Employee"}</h3>

            <div className="modal-form-grid">
              <div>
                <label className="modal-label">Full Name</label>
                <input className="modal-input" name="name" placeholder="John Doe"
                  value={formData.name} onChange={handleFormChange} />
              </div>
              <div>
                <label className="modal-label">Phone</label>
                <input className="modal-input" name="phone" placeholder="+880..."
                  value={formData.phone} onChange={handleFormChange} />
              </div>
              <div className="full-col">
                <label className="modal-label">Email</label>
                <input className="modal-input" name="email" type="email" placeholder="john@company.com"
                  value={formData.email} onChange={handleFormChange} />
              </div>
              <div>
                <label className="modal-label">Department</label>
                <select className="modal-select" name="department"
                  value={formData.department} onChange={handleFormChange}>
                  <option value="">Select...</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="modal-label">Designation</label>
                <input className="modal-input" name="designation" placeholder="Software Engineer"
                  value={formData.designation} onChange={handleFormChange} />
              </div>
              <div>
                <label className="modal-label">Salary (৳)</label>
                <input className="modal-input" name="salary" type="number" placeholder="50000"
                  value={formData.salary} onChange={handleFormChange} />
              </div>
              <div>
                <label className="modal-label">Status</label>
                <select className="modal-select" name="status"
                  value={formData.status} onChange={handleFormChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={saving}>
                {saving ? "Saving..." : editMode ? "Update Employee" : "Create Employee"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal-card" style={{ maxWidth: "400px" }}>
            <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            <h3 className="modal-title">🗑️ Delete Employee</h3>
            <p className="confirm-msg">
              Are you sure you want to delete{" "}
              <span className="confirm-name">{deleteTarget.name}</span>?{" "}
              This action cannot be undone.
            </p>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
              <button className="btn-confirm-delete" onClick={handleDelete}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;