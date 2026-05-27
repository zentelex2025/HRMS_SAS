import { useState } from "react";

const ROLES = [
  {
    id: "rm",
    label: "Immediate Boss",
    sub: "Reporting Manager",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    color: "#534AB7",
    bg: "#EEEDFE",
    accent: "#7B73E8",
  },
  {
    id: "hod",
    label: "Department Head",
    sub: "HOD",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </svg>
    ),
    color: "#3B6D11",
    bg: "#EAF3DE",
    accent: "#5A9E22",
  },
  {
    id: "hr",
    label: "HR Head",
    sub: "Human Resources",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
        <path d="M16 11l2 2 4-4"/>
      </svg>
    ),
    color: "#BE185D",
    bg: "#FFF0F6",
    accent: "#EC4899",
  },
  {
    id: "admin",
    label: "Admin",
    sub: "Administration",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    color: "#185FA5",
    bg: "#E6F1FB",
    accent: "#2B88E0",
  },
  {
    id: "finance",
    label: "Finance",
    sub: "Finance Department",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    ),
    color: "#4F46E5",
    bg: "#F1F5FF",
    accent: "#6366F1",
  },
];

// Mock credentials per role
const CREDENTIALS = {
  rm:      { username: "rm.manager",  password: "rm@1234"      },
  hod:     { username: "hod.head",    password: "hod@1234"     },
  hr:      { username: "hr.head",     password: "hr@1234"      },
  admin:   { username: "admin.user",  password: "admin@1234"   },
  finance: { username: "finance.mgr", password: "finance@1234" },
};

export default function LoginPage({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [showPass,  setShowPass]        = useState(false);
  const [error,     setError]           = useState("");
  const [loading,   setLoading]         = useState(false);
  const [step,      setStep]            = useState("role"); // "role" | "creds"

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    setError("");
    setUsername("");
    setPassword("");
    setStep("creds");
  };

  const handleBack = () => {
    setStep("role");
    setSelectedRole(null);
    setError("");
  };

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please enter username and password.");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise(r => setTimeout(r, 800)); // simulate auth
    const cred = CREDENTIALS[selectedRole.id];
    if (username === cred.username && password === cred.password) {
      onLogin(selectedRole.id);
    } else {
      setError("Invalid credentials. Please try again.");
    }
    setLoading(false);
  };

  const role = ROLES.find(r => r.id === selectedRole?.id);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F0F0F 0%, #1A1A2E 50%, #16213E 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "2rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;600&display=swap');
        * { box-sizing: border-box; }

        .login-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,0.5);
        }

        .login-header {
          padding: 2.5rem 2.5rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          text-align: center;
        }

        .login-logo {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: linear-gradient(135deg, #1A1A1A, #333);
          border: 1px solid rgba(255,255,255,0.15);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
        }

        .login-title {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          color: #fff;
          margin: 0 0 6px;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .login-subtitle {
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          letter-spacing: 0.04em;
        }

        .login-body { padding: 2rem 2.5rem 2.5rem; }

        .step-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 1.25rem;
        }

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .role-card {
          padding: 14px 12px;
          border-radius: 14px;
          border: 1.5px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .role-card:hover {
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.07);
          transform: translateY(-2px);
        }

        .role-icon-wrap {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s;
        }

        .role-card:hover .role-icon-wrap { transform: scale(1.05); }

        .role-name {
          font-size: 12px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          line-height: 1.3;
        }

        .role-sub {
          font-size: 10px;
          color: rgba(255,255,255,0.35);
          margin-top: 1px;
        }

        /* Credentials step */
        .selected-role-banner {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1.5px solid;
        }

        .input-field {
          width: 100%;
          padding: 12px 14px;
          border-radius: 11px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.05);
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color 0.15s, background 0.15s;
          margin-bottom: 12px;
        }

        .input-field::placeholder { color: rgba(255,255,255,0.25); }
        .input-field:focus {
          border-color: rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.08);
        }

        .input-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: .07em;
          color: rgba(255,255,255,0.4);
          margin-bottom: 6px;
          display: block;
        }

        .pass-wrap { position: relative; }
        .pass-wrap .input-field { margin-bottom: 0; padding-right: 46px; }
        .pass-toggle {
          position: absolute;
          right: 14px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 4px;
          display: flex; align-items: center;
        }
        .pass-toggle:hover { color: rgba(255,255,255,0.7); }

        .error-msg {
          background: rgba(220, 38, 38, 0.12);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 8px;
          padding: 9px 12px;
          font-size: 12px;
          color: #F87171;
          margin: 12px 0 0;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .hint-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: 14px;
          font-size: 11px;
          color: rgba(255,255,255,0.3);
          line-height: 1.7;
        }

        .hint-box strong { color: rgba(255,255,255,0.5); }

        .btn-login {
          width: 100%;
          margin-top: 18px;
          padding: 13px;
          border-radius: 12px;
          border: none;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: .02em;
        }

        .btn-back {
          background: none;
          border: 1.5px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.5);
          padding: 8px 16px;
          border-radius: 9px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1.5rem;
        }
        .btn-back:hover {
          border-color: rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.8);
        }

        .footer-note {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
        }

        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-in { animation: fadeSlideIn 0.3s ease forwards; }
      `}</style>

      <div className="login-card">
        {/* Header */}
        <div className="login-header">
          <div className="login-logo">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <h1 className="login-title">Resignation Portal</h1>
          <p className="login-subtitle">HR Management System</p>
        </div>

        {/* Body */}
        <div className="login-body">

          {/* STEP 1: Role Selection */}
          {step === "role" && (
            <div className="animate-in">
              <div className="step-label">Step 1 — Select your role</div>
              <div className="role-grid">
                {ROLES.map(r => (
                  <div key={r.id} className="role-card" onClick={() => handleRoleSelect(r)}>
                    <div className="role-icon-wrap" style={{ background: r.bg, color: r.color }}>
                      {r.icon}
                    </div>
                    <div>
                      <div className="role-name">{r.label}</div>
                      <div className="role-sub">{r.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="footer-note">Select a role to proceed with login</div>
            </div>
          )}

          {/* STEP 2: Credentials */}
          {step === "creds" && role && (
            <div className="animate-in">
              <button className="btn-back" onClick={handleBack}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to roles
              </button>

              {/* Selected role banner */}
              <div
                className="selected-role-banner"
                style={{
                  background: role.bg + "22",
                  borderColor: role.bg,
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: 9, background: role.bg, color: role.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {role.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{role.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{role.sub}</div>
                </div>
                <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: role.accent, boxShadow: `0 0 8px ${role.accent}` }} />
              </div>

              {/* Username */}
              <div>
                <label className="input-label">Username</label>
                <input
                  className="input-field"
                  placeholder="Enter username"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(""); }}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  autoFocus
                />
              </div>

              {/* Password */}
              <div style={{ marginTop: 4 }}>
                <label className="input-label">Password</label>
                <div className="pass-wrap">
                  <input
                    className="input-field"
                    type={showPass ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    onKeyDown={e => e.key === "Enter" && handleLogin()}
                  />
                  <button className="pass-toggle" onClick={() => setShowPass(p => !p)}>
                    {showPass
                      ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="error-msg">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              {/* Demo hint */}
              <div className="hint-box">
                <strong>Demo credentials for {role.label}:</strong><br/>
                Username: <strong>{CREDENTIALS[role.id].username}</strong><br/>
                Password: <strong>{CREDENTIALS[role.id].password}</strong>
              </div>

              {/* Login button */}
              <button
                className="btn-login"
                onClick={handleLogin}
                disabled={loading}
                style={{
                  background: loading ? "rgba(255,255,255,0.1)" : `linear-gradient(135deg, ${role.accent}, ${role.color})`,
                  color: "#fff",
                  opacity: loading ? 0.7 : 1,
                  boxShadow: loading ? "none" : `0 8px 24px ${role.accent}44`,
                }}
              >
                {loading ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    Login as {role.label}
                  </>
                )}
              </button>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}