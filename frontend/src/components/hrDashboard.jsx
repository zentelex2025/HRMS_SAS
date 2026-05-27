import { useState } from "react";
import { useNavigate } from "react-router-dom";

const IconEmployees = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
  </svg>
);
const IconLeave = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
  </svg>
);
const IconTraining = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
  </svg>
);
const IconPortal = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.4 0 2.8 1.1 2.8 2.5S13.4 10 12 10c-1.4 0-2.8-1.1-2.8-2.5S10.6 5 12 5zm0 9c-2.3 0-4.3-1.1-5.5-2.9.7-1.1 3.8-1.6 5.5-1.6s4.8.5 5.5 1.6C16.3 12.9 14.3 14 12 14z" />
  </svg>
);

const navItems = [
  {
    key: "employees",
    label: "Employee List",
    desc: "View and manage all employee records across departments",
    icon: <IconEmployees />,
    iconBg: "#dbeafe",
    iconColor: "#1d4ed8",
    accentColor: "#3b82f6",
    route: "/manage-employee",
    pills: [
      { label: "124 records", bg: "#dbeafe", color: "#1e40af" },
      { label: "12 new", bg: "#dcfce7", color: "#166534" },
    ],
  },
  {
    key: "leave",
    label: "Leave Portal",
    desc: "Approve and track employee leave requests efficiently",
    icon: <IconLeave />,
    iconBg: "#dcfce7",
    iconColor: "#15803d",
    accentColor: "#22c55e",
    route: "/admin/leaves",
    pills: [
      { label: "8 pending", bg: "#fef9c3", color: "#854d0e" },
      { label: "5 approved", bg: "#dcfce7", color: "#166534" },
    ],
  },
  {
    key: "training",
    label: "Training & Awareness",
    desc: "Schedule and manage training programs and events",
    icon: <IconTraining />,
    iconBg: "#fef9c3",
    iconColor: "#b45309",
    accentColor: "#f59e0b",
    route: "/onboarding",
    pills: [
      { label: "3 active", bg: "#fef9c3", color: "#854d0e" },
      { label: "Next: Mon", bg: "#e0e7ff", color: "#3730a3" },
    ],
  },
  {
    key: "portal",
    label: "Employee Portal Activation",
    desc: "Activate and control employee portal access",
    icon: <IconPortal />,
    iconBg: "#ede9fe",
    iconColor: "#6d28d9",
    accentColor: "#8b5cf6",
    route: "/loginPage",
    pills: [
      { label: "98 active", bg: "#ede9fe", color: "#5b21b6" },
      { label: "26 inactive", bg: "#fee2e2", color: "#991b1b" },
    ],
  },
];

const styles = {
  root: {
    fontFamily: "'Plus Jakarta Sans', 'Segoe UI', system-ui, sans-serif",
    minHeight: "100vh",
    background: "#f1f5f9",
    color: "#1a2332",
  },
  navbar: {
    background: "#0a1628",
    padding: "0 2rem",
    height: "60px",
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
  },
  brandBadge: {
    background: "linear-gradient(135deg, #3b82f6, #6366f1)",
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navUser: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.6)",
  },
  navAvatar: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 600,
    color: "white",
    border: "2px solid rgba(255,255,255,0.15)",
  },
  page: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2.5rem 1.5rem 3rem",
  },
  greetingTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "20px",
    padding: "4px 12px",
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "12px",
  },
  dot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#22c55e",
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0f172a",
    margin: "0 0 6px",
  },
  pageSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "2rem",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
    marginBottom: "2rem",
  },
  stat: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px 18px",
  },
  statLabel: {
    fontSize: "11px",
    color: "#94a3b8",
    marginBottom: "6px",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    fontWeight: 600,
  },
  statVal: {
    fontSize: "26px",
    fontWeight: 700,
    color: "#0f172a",
  },
  statUp: { fontSize: "12px", color: "#16a34a", marginTop: "4px" },
  statDown: { fontSize: "12px", color: "#dc2626", marginTop: "4px" },
  sectionLabel: {
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: "12px",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "14px",
  },
  card: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "22px 20px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.18s ease",
  },
  cardTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  cardIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardArrow: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "16px",
  },
  cardLabel: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#0f172a",
    margin: "0 0 4px",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0,
  },
  cardFooter: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    paddingTop: "12px",
    borderTop: "1px solid #f1f5f9",
  },
  pill: {
    fontSize: "11px",
    fontWeight: 500,
    borderRadius: "20px",
    padding: "3px 10px",
  },
  accentBar: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "3px",
    borderRadius: "16px 16px 0 0",
  },
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function HRDashboard() {
  const [hovered, setHovered] = useState(null);
  const navigate = useNavigate();

  const userName = localStorage.getItem("userName") || "HR Manager";
  const avatarText = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={styles.root}>
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.brandBadge}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
            </svg>
          </div>
          Employee Onboarding System
        </div>
        <div style={styles.navRight}>
          <div style={styles.navUser}>{userName} · HR Admin</div>
          <div style={styles.navAvatar}>{avatarText}</div>
        </div>
      </nav>

      <div style={styles.page}>
        {/* Greeting */}
        <div style={{ marginBottom: "2rem" }}>
          <div style={styles.greetingTag}>
            <div style={styles.dot} />
            System Active
          </div>
          <h1 style={styles.pageTitle}>
            {getGreeting()}, {userName}
          </h1>
          <p style={styles.pageSubtitle}>
            Here's your workspace overview for today.
          </p>
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Total Employees</div>
            <div style={styles.statVal}>124</div>
            <div style={styles.statUp}>↑ 4 this month</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Pending Leaves</div>
            <div style={styles.statVal}>8</div>
            <div style={styles.statDown}>↓ 2 from last week</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statLabel}>Active Trainings</div>
            <div style={styles.statVal}>3</div>
            <div style={styles.statUp}>↑ 1 new session</div>
          </div>
        </div>

        {/* Cards */}
        <div style={styles.sectionLabel}>Quick Actions</div>
        <div style={styles.cardsGrid}>
          {navItems.map((item) => (
            <div
              key={item.key}
              style={{
                ...styles.card,
                borderColor: hovered === item.key ? "#cbd5e1" : "#e2e8f0",
                transform: hovered === item.key ? "translateY(-2px)" : "none",
                boxShadow:
                  hovered === item.key
                    ? "0 8px 24px rgba(0,0,0,0.07)"
                    : "none",
              }}
              onClick={() => navigate(item.route)}
              onMouseEnter={() => setHovered(item.key)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Accent top bar */}
              <div
                style={{
                  ...styles.accentBar,
                  background: item.accentColor,
                  opacity: hovered === item.key ? 1 : 0,
                  transition: "opacity 0.15s",
                }}
              />

              <div style={styles.cardTop}>
                <div
                  style={{
                    ...styles.cardIconWrap,
                    background: item.iconBg,
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </div>
                <div style={styles.cardArrow}>›</div>
              </div>

              <div>
                <p style={styles.cardLabel}>{item.label}</p>
                <p style={styles.cardDesc}>{item.desc}</p>
              </div>

              <div style={styles.cardFooter}>
                {item.pills.map((pill, i) => (
                  <span
                    key={i}
                    style={{
                      ...styles.pill,
                      background: pill.bg,
                      color: pill.color,
                    }}
                  >
                    {pill.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}