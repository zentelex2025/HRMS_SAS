import { useState } from "react";

const CLEARANCE_SECTIONS = [
  {
    id: "library",
    title: "Library Clearance",
    color: "#3B6D11", bg: "#EAF3DE",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3B6D11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
    ),
    items: [
      { id: "lib1", label: "All books returned", sub: "No borrowed books pending", note: true },
      { id: "lib2", label: "Library card deactivated", sub: "Access card surrendered to library", note: false },
    ],
  },
  {
    id: "it",
    title: "IT Clearance",
    color: "#185FA5", bg: "#E6F1FB",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    items: [
      { id: "it1", label: "Laptop / Desktop returned", sub: "Company hardware handed over to IT", note: true, notePlaceholder: "Asset tag / serial number..." },
      { id: "it2", label: "Office email deactivated", sub: "Email access revoked, auto-reply set", note: false },
      { id: "it3", label: "Software licenses released", sub: "All software & VPN access removed", note: false },
      { id: "it4", label: "Other hardware returned", sub: "Mouse, keyboard, headset, charger etc.", note: true, notePlaceholder: "List items returned..." },
    ],
  },
  {
    id: "dept",
    title: "Other Department Clearance",
    color: "#534AB7", bg: "#EEEDFE",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#534AB7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    items: [
      { id: "dept1", label: "Finance / Accounts cleared", sub: "No pending dues, loans, or advances", note: true },
      { id: "dept2", label: "Admin clearance", sub: "ID card, access card, locker key returned", note: false },
      { id: "dept3", label: "Project handover complete", sub: "All ongoing work handed over to team", note: true, notePlaceholder: "Handover notes..." },
    ],
  },
];

const ALL_IDS = CLEARANCE_SECTIONS.flatMap(s => s.items.map(i => i.id));

function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${parseInt(day)} ${months[+m - 1]}, ${y}`;
}

export default function HRClearance({ form, onBack }) {
  const [checked, setChecked] = useState({});
  const [notes, setNotes] = useState({});
  const [cleared, setCleared] = useState(false);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  const doneCount = ALL_IDS.filter(id => checked[id]).length;
  const total = ALL_IDS.length;
  const allDone = doneCount === total;

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2rem 1rem", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Top Bar ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "#fff", border: "1px solid #E8E5E0", borderRadius: 10,
            padding: "8px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, color: "#1A1A1A", fontFamily: "inherit"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
            Back
          </button>
        )}
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1A1A1A" }}>HR Clearance Form</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#9A9693" }}>Employee exit clearance — all departments must sign off</p>
        </div>
      </div>

      {/* ── Employee Info ── */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10,
        background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16,
        padding: "1.25rem 1.5rem", marginBottom: "1.5rem"
      }}>
        {[
          ["Employee Name", form?.name],
          ["Designation",   form?.designation],
          ["Department",    form?.department],
          ["Last Working Day", fmtDate(form?.lastDate)],
        ].map(([label, val]) => (
          <div key={label}>
            <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".06em", color: "#9A9693", fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A", marginTop: 3 }}>{val || "—"}</div>
          </div>
        ))}
      </div>

      {/* ── Sections ── */}
      {CLEARANCE_SECTIONS.map(section => (
        <div key={section.id} style={{
          background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16,
          marginBottom: "1rem", overflow: "hidden"
        }}>
          {/* Section Header */}
          <div style={{ padding: "0.875rem 1.5rem", borderBottom: "1px solid #F0EDE8", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: section.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {section.icon}
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>{section.title}</span>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "#9A9693" }}>
              {section.items.filter(i => checked[i.id]).length} / {section.items.length} done
            </span>
          </div>

          {/* Items */}
          <div style={{ padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 10 }}>
            {section.items.map(item => (
              <div key={item.id} style={{
                display: "flex", alignItems: "flex-start", gap: 12,
                padding: "10px 12px", borderRadius: 10,
                border: `1.5px solid ${checked[item.id] ? "#6EE7B7" : "#EBEBEB"}`,
                background: checked[item.id] ? "#ECFDF5" : "#FAFAF9",
                transition: "all .15s"
              }}>
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  style={{ marginTop: 2, width: 16, height: 16, cursor: "pointer", accentColor: "#1A1A1A", flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1A1A1A" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#9A9693", marginTop: 2 }}>{item.sub}</div>
                  {item.note && (
                    <textarea
                      placeholder={item.notePlaceholder || "Remarks (optional)..."}
                      value={notes[item.id] || ""}
                      onChange={e => setNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                      style={{
                        width: "100%", marginTop: 8, padding: "6px 10px",
                        borderRadius: 8, border: "1.5px solid #E8E5E0",
                        background: "#fff", fontFamily: "inherit",
                        fontSize: 12, color: "#1A1A1A", resize: "vertical",
                        minHeight: 52, outline: "none"
                      }}
                    />
                  )}
                </div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 10px",
                  borderRadius: 100, textTransform: "uppercase", letterSpacing: ".04em", flexShrink: 0,
                  background: checked[item.id] ? "#ECFDF5" : "#FFFBEB",
                  color: checked[item.id] ? "#059669" : "#D97706",
                  border: `1px solid ${checked[item.id] ? "#6EE7B7" : "#FCD34D"}`,
                }}>
                  {checked[item.id] ? "Done" : "Pending"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Footer ── */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "#fff", border: "1px solid #EBEBEB", borderRadius: 16,
        padding: "1.25rem 1.5rem", marginTop: "0.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 160, height: 6, background: "#F0EDE8", borderRadius: 3, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "#1A1A1A", borderRadius: 3,
              width: `${(doneCount / total) * 100}%`, transition: "width .3s"
            }} />
          </div>
          <span style={{ fontSize: 12, color: "#9A9693" }}>{doneCount} / {total} completed</span>
        </div>

        {cleared ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "#ECFDF5", border: "1px solid #6EE7B7",
            color: "#059669", borderRadius: 10, padding: "10px 18px",
            fontSize: 13, fontWeight: 600
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Clearance Submitted!
          </div>
        ) : (
          <button
            disabled={!allDone}
            onClick={() => setCleared(true)}
            style={{
              background: allDone ? "#1A1A1A" : "#E8E5E0",
              color: allDone ? "#fff" : "#9A9693",
              border: "none", padding: "11px 24px", borderRadius: 12,
              fontSize: 13, fontWeight: 600, fontFamily: "inherit",
              cursor: allDone ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center", gap: 7,
              transition: "all .15s"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Submit Clearance
          </button>
        )}
      </div>
    </div>
  );
}