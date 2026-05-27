import { useState } from "react";

// ── Icons ──────────────────────────────────────────────────────────────────
const IconEmployees = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const IconLeave = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const IconTraining = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
  </svg>
);
const IconPortal = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.4 0 2.8 1.1 2.8 2.5S13.4 10 12 10c-1.4 0-2.8-1.1-2.8-2.5S10.6 5 12 5zm0 9c-2.3 0-4.3-1.1-5.5-2.9.7-1.1 3.8-1.6 5.5-1.6s4.8.5 5.5 1.6C16.3 12.9 14.3 14 12 14z" />
  </svg>
);
const IconBack = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
);

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  root: {
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    minHeight: "100vh",
    background: "#f0f4f8",
    color: "#1a2332",
  },
  navbar: {
    background: "#0f2847",
    padding: "0 2rem",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "white",
    fontWeight: 600,
    fontSize: "15px",
    letterSpacing: "0.01em",
  },
  navDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#4fc3f7",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "rgba(255,255,255,0.75)",
    fontSize: "13px",
  },
  navAvatar: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#1e5fa8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "white",
  },
  page: {
    maxWidth: "960px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem",
  },
  pageHeader: {
    marginBottom: "2rem",
  },
  pageTitle: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f2847",
    marginBottom: "4px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#64748b",
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#1e5fa8",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0",
    marginBottom: "1.5rem",
    fontFamily: "inherit",
  },
  // Dashboard grid
  dashGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "16px",
  },
  dashCard: {
    background: "white",
    borderRadius: "16px",
    padding: "28px 24px",
    cursor: "pointer",
    border: "1.5px solid #e2e8f0",
    transition: "all 0.18s ease",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    textAlign: "left",
  },
  cardIcon: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0f2847",
    marginBottom: "4px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.45",
  },
  cardArrow: {
    marginLeft: "auto",
    fontSize: "20px",
    color: "#cbd5e1",
    flexShrink: 0,
  },
  // Inner page table
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "white",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  th: {
    background: "#f8fafc",
    padding: "12px 16px",
    textAlign: "left",
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    letterSpacing: "0.05em",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "13px 16px",
    fontSize: "13px",
    color: "#334155",
    borderBottom: "1px solid #f1f5f9",
  },
  badge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 500,
  },
  actionBtn: {
    padding: "5px 14px",
    borderRadius: "8px",
    border: "none",
    fontSize: "12px",
    fontWeight: 500,
    cursor: "pointer",
    fontFamily: "inherit",
  },
  sectionCard: {
    background: "white",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    marginBottom: "16px",
  },
};

// ── Pages ──────────────────────────────────────────────────────────────────

function EmployeeListPage({ onBack }) {
  const employees = [
    { id: 1, name: "Rahul Sharma", dept: "Engineering", role: "Developer", email: "rahul@hrms.com", status: "Active" },
    { id: 2, name: "Priya Das", dept: "HR", role: "HR Executive", email: "priya@hrms.com", status: "Active" },
    { id: 3, name: "Amit Roy", dept: "Finance", role: "Accountant", email: "amit@hrms.com", status: "Active" },
    { id: 4, name: "Sneha Bose", dept: "Marketing", role: "Manager", email: "sneha@hrms.com", status: "Inactive" },
    { id: 5, name: "Tonu Dey Sarkar", dept: "Admin", role: "HR Admin", email: "tonu@gmail.com", status: "Active" },
  ];
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}><IconBack /> Back to Dashboard</button>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Employee List</div>
        <div style={styles.pageSubtitle}>All registered employees in the system</div>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td style={styles.td}>EMP-{String(e.id).padStart(3, "0")}</td>
              <td style={{ ...styles.td, fontWeight: 500 }}>{e.name}</td>
              <td style={styles.td}>{e.dept}</td>
              <td style={styles.td}>{e.role}</td>
              <td style={{ ...styles.td, color: "#1e5fa8" }}>{e.email}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  background: e.status === "Active" ? "#dcfce7" : "#fee2e2",
                  color: e.status === "Active" ? "#166534" : "#991b1b",
                }}>
                  {e.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeavePortalPage({ onBack }) {
  const [leaves, setLeaves] = useState([
    { id: 1, name: "Priya Das", type: "Sick Leave", from: "2025-04-28", to: "2025-04-29", status: "Pending" },
    { id: 2, name: "Amit Roy", type: "Casual Leave", from: "2025-05-01", to: "2025-05-02", status: "Pending" },
    { id: 3, name: "Sneha Bose", type: "Earned Leave", from: "2025-04-20", to: "2025-04-22", status: "Approved" },
    { id: 4, name: "Rahul Sharma", type: "Sick Leave", from: "2025-04-15", to: "2025-04-15", status: "Rejected" },
  ]);

  const handle = (id, action) => {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: action } : l));
  };

  const statusColor = (s) => ({
    Pending:  { background: "#fef9c3", color: "#854d0e" },
    Approved: { background: "#dcfce7", color: "#166534" },
    Rejected: { background: "#fee2e2", color: "#991b1b" },
  }[s]);

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}><IconBack /> Back to Dashboard</button>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Leave Portal</div>
        <div style={styles.pageSubtitle}>Review and manage employee leave requests</div>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Employee</th>
            <th style={styles.th}>Leave Type</th>
            <th style={styles.th}>From</th>
            <th style={styles.th}>To</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map(l => (
            <tr key={l.id}>
              <td style={{ ...styles.td, fontWeight: 500 }}>{l.name}</td>
              <td style={styles.td}>{l.type}</td>
              <td style={styles.td}>{l.from}</td>
              <td style={styles.td}>{l.to}</td>
              <td style={styles.td}>
                <span style={{ ...styles.badge, ...statusColor(l.status) }}>{l.status}</span>
              </td>
              <td style={styles.td}>
                {l.status === "Pending" && (
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      style={{ ...styles.actionBtn, background: "#dcfce7", color: "#166534" }}
                      onClick={() => handle(l.id, "Approved")}
                    >Approve</button>
                    <button
                      style={{ ...styles.actionBtn, background: "#fee2e2", color: "#991b1b" }}
                      onClick={() => handle(l.id, "Rejected")}
                    >Reject</button>
                  </div>
                )}
                {l.status !== "Pending" && <span style={{ color: "#94a3b8", fontSize: "12px" }}>Done</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TrainingPage({ onBack }) {
  const events = [
    { id: 1, title: "Fire Safety Awareness", date: "2025-05-05", trainer: "Safety Dept.", enrolled: 24, capacity: 30, status: "Upcoming" },
    { id: 2, title: "HR Policy Orientation", date: "2025-05-10", trainer: "HR Team", enrolled: 18, capacity: 20, status: "Upcoming" },
    { id: 3, title: "Excel Advanced Training", date: "2025-04-20", trainer: "IT Dept.", enrolled: 15, capacity: 15, status: "Completed" },
    { id: 4, title: "Leadership Workshop", date: "2025-04-10", trainer: "External", enrolled: 12, capacity: 15, status: "Completed" },
  ];
  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}><IconBack /> Back to Dashboard</button>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Training & Awareness Events</div>
        <div style={styles.pageSubtitle}>Manage and track all training programs</div>
      </div>
      {events.map(ev => (
        <div key={ev.id} style={styles.sectionCard}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "#0f2847", marginBottom: "6px" }}>{ev.title}</div>
              <div style={{ fontSize: "13px", color: "#64748b" }}>
                Trainer: {ev.trainer} &nbsp;|&nbsp; Date: {ev.date}
              </div>
            </div>
            <span style={{
              ...styles.badge,
              background: ev.status === "Upcoming" ? "#dbeafe" : "#f1f5f9",
              color: ev.status === "Upcoming" ? "#1e40af" : "#475569",
              fontSize: "12px",
            }}>{ev.status}</span>
          </div>
          <div style={{ marginTop: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#64748b", marginBottom: "6px" }}>
              <span>Enrollment: {ev.enrolled} / {ev.capacity}</span>
              <span>{Math.round((ev.enrolled / ev.capacity) * 100)}%</span>
            </div>
            <div style={{ background: "#f1f5f9", borderRadius: "4px", height: "6px" }}>
              <div style={{
                background: ev.status === "Upcoming" ? "#3b82f6" : "#22c55e",
                width: `${(ev.enrolled / ev.capacity) * 100}%`,
                height: "100%",
                borderRadius: "4px",
                transition: "width 0.3s",
              }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PortalActivationPage({ onBack }) {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Kiran Mehta", email: "kiran@hrms.com", dept: "Sales", activated: false },
    { id: 2, name: "Suresh Nair", email: "suresh@hrms.com", dept: "Support", activated: false },
    { id: 3, name: "Dipika Sen", email: "dipika@hrms.com", dept: "Finance", activated: true },
    { id: 4, name: "Mohan Das", email: "mohan@hrms.com", dept: "IT", activated: false },
    { id: 5, name: "Rina Paul", email: "rina@hrms.com", dept: "Marketing", activated: true },
  ]);

  const toggle = (id) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, activated: !e.activated } : e));
  };

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}><IconBack /> Back to Dashboard</button>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>Employee Portal Activation</div>
        <div style={styles.pageSubtitle}>Activate or deactivate employee portal access</div>
      </div>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Portal Status</th>
            <th style={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(e => (
            <tr key={e.id}>
              <td style={{ ...styles.td, fontWeight: 500 }}>{e.name}</td>
              <td style={{ ...styles.td, color: "#1e5fa8" }}>{e.email}</td>
              <td style={styles.td}>{e.dept}</td>
              <td style={styles.td}>
                <span style={{
                  ...styles.badge,
                  background: e.activated ? "#dcfce7" : "#fef3c7",
                  color: e.activated ? "#166534" : "#92400e",
                }}>
                  {e.activated ? "Activated" : "Pending"}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  style={{
                    ...styles.actionBtn,
                    background: e.activated ? "#fee2e2" : "#dbeafe",
                    color: e.activated ? "#991b1b" : "#1e40af",
                  }}
                  onClick={() => toggle(e.id)}
                >
                  {e.activated ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Dashboard Home ─────────────────────────────────────────────────────────
const navItems = [
  {
    key: "employees",
    label: "Employee List",
    desc: "View and manage all employee records",
    icon: <IconEmployees />,
    iconBg: "#dbeafe",
    iconColor: "#1e40af",
  },
  {
    key: "leave",
    label: "Leave Portal",
    desc: "Approve and track leave requests",
    icon: <IconLeave />,
    iconBg: "#dcfce7",
    iconColor: "#166534",
  },
  {
    key: "training",
    label: "Training & Awareness Events",
    desc: "Schedule and manage training programs",
    icon: <IconTraining />,
    iconBg: "#fef9c3",
    iconColor: "#854d0e",
  },
  {
    key: "portal",
    label: "Employee Portal Activation",
    desc: "Activate and control employee portal access",
    icon: <IconPortal />,
    iconBg: "#ede9fe",
    iconColor: "#6d28d9",
  },
];

function Dashboard({ onNavigate }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div style={styles.pageTitle}>HR Dashboard</div>
        <div style={styles.pageSubtitle}>Welcome back, Tonu. Select a section to get started.</div>
      </div>
      <div style={styles.dashGrid}>
        {navItems.map(item => (
          <div
            key={item.key}
            style={{
              ...styles.dashCard,
              boxShadow: hovered === item.key ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
              borderColor: hovered === item.key ? "#93c5fd" : "#e2e8f0",
              transform: hovered === item.key ? "translateY(-2px)" : "none",
            }}
            onClick={() => onNavigate(item.key)}
            onMouseEnter={() => setHovered(item.key)}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ ...styles.cardIcon, background: item.iconBg, color: item.iconColor }}>
              {item.icon}
            </div>
            <div>
              <div style={styles.cardLabel}>{item.label}</div>
              <div style={styles.cardDesc}>{item.desc}</div>
            </div>
            <div style={styles.cardArrow}>›</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── App Root ───────────────────────────────────────────────────────────────
export default function HRDashboard() {
  const [page, setPage] = useState("dashboard");

  const renderPage = () => {
    const back = () => setPage("dashboard");
    switch (page) {
      case "employees": return <EmployeeListPage onBack={back} />;
      case "leave":     return <LeavePortalPage onBack={back} />;
      case "training":  return <TrainingPage onBack={back} />;
      case "portal":    return <PortalActivationPage onBack={back} />;
      default:          return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <div style={styles.root}>
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navDot} />
          Employee Onboarding System
        </div>
        <div style={styles.navRight}>
          <div style={styles.navAvatar}>TD</div>
          Tonu Dey Sarkar &nbsp;|&nbsp; HR Admin
        </div>
      </nav>
      {renderPage()}
    </div>
  );
}