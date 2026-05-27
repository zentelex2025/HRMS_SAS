import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  const [cardStatus, setCardStatus] = useState({
    1: "Active", 2: "Active", 3: "Active", 4: "Active",
    5: "Active", 6: "Active", 7: "Active", 8: "Active", 9: "Active",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/loginPage"); return; }

    const empId = localStorage.getItem("empId") || "N/A";

    fetch(`http://localhost:5014/api/employee/${empId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const emp = data.employee;
          const liveStatus = emp.status || "Active";
          localStorage.setItem("status", liveStatus);

          setEmployee({
            name:        localStorage.getItem("userName")    || emp.first_name || "Employee",
            empId:       emp.employee_id                     || empId,
            designation: localStorage.getItem("designation") || emp.designation || "N/A",
            email:       localStorage.getItem("email")       || emp.email       || "N/A",
            phone:       localStorage.getItem("phone")       || emp.phone_no    || "N/A",
            department:  emp.department                      || "N/A",
            joiningDate: emp.joining_date                    || "N/A",
            reportTo:    "HR Manager",
            status:      liveStatus,
            avatar:      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
          });
        }
      })
      .catch(() => {
        setEmployee({
          name:        localStorage.getItem("userName")     || "Employee",
          empId:       localStorage.getItem("empId")        || "N/A",
          designation: localStorage.getItem("designation")  || "N/A",
          email:       localStorage.getItem("email")        || "N/A",
          phone:       localStorage.getItem("phone")        || "N/A",
          department:  localStorage.getItem("department")   || "N/A",
          joiningDate: localStorage.getItem("joining_date") || "N/A",
          reportTo:    "HR Manager",
          status:      localStorage.getItem("status")       || "Active",
          avatar:      "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        });
      });
  }, [navigate]);

  if (!employee) return null;

  const isAccountActive = employee.status === "Active";

  const handleLogout = () => {
    ["token", "empId", "userName", "designation", "email", "phone",
     "department", "joining_date", "report_to", "status"]
      .forEach(k => localStorage.removeItem(k));
    navigate("/loginPage");
  };

  const formatDate = (d) => {
    if (!d || d === "N/A") return "N/A";
    try {
      return new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit", month: "short", year: "numeric"
      });
    } catch { return d; }
  };

  const handleCardStatusChange = (id, value) => {
    setCardStatus(prev => ({ ...prev, [id]: value }));
  };

  const quickActions = [
    {
      id: 1,
      title: "Attendance",
      desc: "Track your daily work hours",
      btnText: "Check In/Out",
      btnIcon: "bi-fingerprint",
      gradient: "linear-gradient(145deg, #ffffff, #f8f9ff)",
      btnStyle: { background: 'linear-gradient(45deg, #0d6efd, #0dcaf0)', color: '#fff' },
      btnVariant: "primary",
      textColor: "text-dark",
      descColor: "text-muted",
      numColor: "#0d6efd",
      avatar: employee.avatar,
      onClick: () => navigate('/attendance'),
    },
    {
      id: 2,
      title: "Leave Requests",
      desc: "Apply for time-off easily",
      btnText: "Apply Leave",
      btnIcon: "bi-plus-lg",
      gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      isLink: true,
      linkTo: "/employee/leave",
    },
    {
      id: 3,
      title: "Payroll & Salary",
      desc: "View payslips and tax info",
      btnText: "View Payroll",
      btnIcon: "bi-wallet2",
      gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      onClick: () => navigate('/payroll'),
    },
    {
      id: 4,
      title: "Holiday List",
      desc: "Check upcoming holidays",
      btnText: "View Holidays",
      btnIcon: "bi-calendar3",
      gradient: "linear-gradient(135deg, #FF512F, #DD2476)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: "https://cdn-icons-png.flaticon.com/512/2693/2693507.png",
      onClick: () => navigate('/holidaymanager'),
    },
    {
      id: 5,
      title: "Resignation",
      desc: "Submit resignation request",
      btnText: "Apply",
      btnIcon: "bi-file-earmark-text",
      gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
      btnVariant: "light",
      textColor: "text-dark",
      descColor: "text-dark opacity-75",
      numColor: "#333",
      avatar: employee.avatar,
      onClick: () => navigate('/resignation'),
    },
    {
      id: 6,
      title: "Appraisal",
      desc: "View your salary appraisal",
      btnText: "View Appraisal",
      btnIcon: "bi-award",
      gradient: "linear-gradient(135deg, #c94b4b, #4b134f)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      onClick: () => navigate('/appraisal'),
    },
    // ✅ NEW: Training & Awareness
    {
      id: 7,
      title: "Training & Awareness",
      desc: "View assigned training modules",
      btnText: "Go to Training",
      btnIcon: "bi-mortarboard",
      gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      onClick: () => navigate('/onboarding'),
    },
    // ✅ NEW: Recruitment
    {
      id: 8,
      title: "Recruitment",
      desc: "Refer candidates & track status",
      btnText: "View",
      btnIcon: "bi-people",
      gradient: "linear-gradient(135deg, #1565C0, #42A5F5)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      onClick: () => navigate('/recruitment'),
    },
    // ✅ NEW: Leave Approval
    {
      id: 9,
      title: "Leave Approval",
      desc: "Approve or reject team leave",
      btnText: "Manage",
      btnIcon: "bi-check2-circle",
      gradient: "linear-gradient(135deg, #134e5e, #71b280)",
      btnVariant: "light",
      textColor: "text-white",
      descColor: "text-white opacity-75",
      numColor: "#fff",
      avatar: employee.avatar,
      onClick: () => navigate('/admin/leaves'),
    },
  ];

  return (
    <Container className="py-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold m-0 text-primary">Employee Dashboard</h2>
        <div className="d-flex gap-2">
          <Button variant="outline-danger" className="rounded-pill px-4" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </Button>
          <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => navigate('/register')}>
            <i className="bi bi-pencil-square me-2"></i>Update Profile
          </Button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <Card className="p-4 shadow-sm mb-4 border-0 rounded-4">
        <Row className="align-items-center">
          <Col md={2} className="text-center mb-3 mb-md-0">
            <img
              src={employee.avatar}
              alt="profile"
              width="100"
              className="rounded-circle border border-3 border-primary shadow-sm"
            />
          </Col>
          <Col md={10}>
            <div className="d-flex align-items-center gap-3 mb-2">
              <h3 className="fw-bold m-0">{employee.name}</h3>
              <Badge bg={isAccountActive ? "success" : "danger"} className="px-3">
                {isAccountActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-primary fw-semibold mb-3">{employee.designation}</p>

            <Row className="g-2">
              {[
                { label: "Employee ID",   value: employee.empId },
                { label: "Department",    value: employee.department },
                { label: "Email Address", value: employee.email },
                { label: "Phone Number",  value: employee.phone },
                { label: "Joining Date",  value: formatDate(employee.joiningDate) },
                { label: "Report To",     value: employee.reportTo },
              ].map((item) => (
                <Col sm={6} md={4} key={item.label}>
                  <div style={infoBox}>
                    <span style={infoLabel}>{item.label}</span>
                    <span style={infoValue}>{item.value}</span>
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Card>

      {!isAccountActive ? (
        <Card className="p-5 text-center border-0 shadow-sm rounded-4">
          <div style={{ fontSize: '60px' }}>🚫</div>
          <h4 className="text-danger fw-bold mt-3">Account Inactive</h4>
          <p className="text-muted">
            Your account is currently inactive. Please contact HR for assistance.
          </p>
        </Card>
      ) : (
        <Row className="g-3 mb-4">
          {quickActions.map((action, index) => {
            const thisStatus = cardStatus[action.id];
            const isCardActive = thisStatus === "Active";

            return (
              <Col xs={12} key={action.id}>
                {!isCardActive ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: '#f8fafc',
                      border: '1px dashed #e2e8f0',
                      borderRadius: '12px',
                      padding: '10px 16px',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                      🔴 {action.title} — Hidden
                    </span>
                    <select
                      value={thisStatus}
                      onChange={(e) => handleCardStatusChange(action.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: '#fee2e2',
                        color: '#991b1b',
                        outline: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                      }}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                ) : (
                  <Card
                    className="p-3 shadow-sm border-0 rounded-4 position-relative overflow-hidden"
                    style={{
                      background: action.gradient,
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: '16px',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {/* Number Badge */}
                    <div style={{
                      minWidth: '42px', height: '42px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '18px', fontWeight: 'bold',
                      color: action.numColor || '#fff',
                      border: '2px solid rgba(255,255,255,0.4)',
                      flexShrink: 0,
                    }}>
                      {index + 1}
                    </div>

                    {/* Avatar */}
                    <img
                      src={action.avatar}
                      alt={action.title}
                      width="52" height="52"
                      className="rounded-circle border border-2 border-white shadow-sm"
                      style={{ objectFit: 'cover', flexShrink: 0 }}
                    />

                    {/* Text */}
                    <div className="flex-grow-1">
                      <h5 className={`fw-bold mb-1 ${action.textColor}`}>{action.title}</h5>
                      <p className={`small mb-0 ${action.descColor}`}>{action.desc}</p>
                    </div>

                    {/* Action Button */}
                    {action.isLink ? (
                      <Link
                        to={action.linkTo}
                        className="btn btn-light fw-bold rounded-pill px-4 py-2 shadow-sm"
                        style={{ whiteSpace: 'nowrap', color: '#11998e', flexShrink: 0 }}
                      >
                        <i className={`bi ${action.btnIcon} me-2`}></i>{action.btnText}
                      </Link>
                    ) : (
                      <Button
                        variant={action.btnVariant}
                        className="fw-bold rounded-pill px-4 py-2 shadow-sm"
                        style={{ whiteSpace: 'nowrap', flexShrink: 0, ...(action.btnStyle || {}) }}
                        onClick={action.onClick}
                      >
                        <i className={`bi ${action.btnIcon} me-2`}></i>{action.btnText}
                      </Button>
                    )}

                    {/* Dropdown */}
                    <select
                      value={thisStatus}
                      onChange={(e) => handleCardStatusChange(action.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        flexShrink: 0,
                        padding: '6px 12px',
                        borderRadius: '20px',
                        border: 'none',
                        fontWeight: '600',
                        fontSize: '12px',
                        cursor: 'pointer',
                        background: '#d1fae5',
                        color: '#065f46',
                        outline: 'none',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                      }}
                    >
                      <option value="Active"> Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </Card>
                )}
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

const infoBox = {
  background: "#f8fafc", borderRadius: "10px", padding: "10px 14px",
  border: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "3px",
};
const infoLabel = {
  fontSize: "11px", fontWeight: "600", textTransform: "uppercase",
  letterSpacing: "0.05em", color: "#94a3b8",
};
const infoValue = {
  fontSize: "14px", fontWeight: "500", color: "#1e293b",
};

export default EmployeeDashboard;