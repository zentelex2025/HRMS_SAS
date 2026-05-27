import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Spinner,
} from "react-bootstrap";

const AdminDashboard = () => {
  const [employeeData, setEmployeeData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5007/api/employees")
      .then((res) => {
        if (!res.ok) throw new Error("Server error");
        return res.json();
      })
      .then((response) => {
        const dbData = Array.isArray(response) ? response : response.data || [];

        if (dbData && dbData.length > 0) {
          setDbConnected(true);

          const formattedDbData = dbData.map((emp) => ({
            id: emp.id,
            empId: emp.employee_id || emp.employee_code || "—",
            empCode: emp.employee_code || "—",

            // ✅ first_name + last_name জোড়া লাগানো
            name:
              `${emp.first_name || ""} ${emp.last_name || ""}`.trim() || "—",

            // ✅ JOIN থেকে department নাম আসবে
            department:
              emp.department_name || `Dept-${emp.department_id}` || "—",

            designation: emp.designation || "—",
            email: emp.email || "—",
            salary: emp.salary || "—",
            phone: emp.phone_no || "—",
            jobRole: emp.job_role || "—",

            // ✅ performance decimal আসবে
            performance:
              emp.performance !== null &&
              emp.performance !== undefined &&
              emp.performance !== ""
                ? parseFloat(emp.performance)
                : "—",

            status: emp.status || "Active",
          }));

          setEmployeeData(formattedDbData);
        } else {
          setEmployeeData([]);
          setDbConnected(false);
        }
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("⚠️ Backend connection failed:", err);
        setDbConnected(false);
        setIsLoading(false);
      });
  }, []);

  const totalEmployees = employeeData.length;
  const activeCount = employeeData.filter((e) => e.status === "Active").length;
  const leaveCount = employeeData.filter((e) => e.status === "On Leave").length;

  const perfList = employeeData
    .filter((e) => e.performance !== "—" && !isNaN(e.performance))
    .map((e) => parseFloat(e.performance));
  const avgPerformance =
    perfList.length > 0
      ? (perfList.reduce((a, b) => a + b, 0) / perfList.length).toFixed(1)
      : "—";

  const getStatusColor = (status) => {
    if (status === "Active") return "success";
    if (status === "Inactive") return "danger";
    if (status === "On Leave") return "warning";
    return "secondary";
  };

  const renderRating = (performance) => {
    if (performance === "—" || performance === null || isNaN(performance)) {
      return <span className="text-muted">—</span>;
    }
    return (
      <>
        <span className="fw-bold me-1">{performance}</span>
        <span className="text-warning">★</span>
      </>
    );
  };

  const stats = [
    {
      label: "Total Staff",
      subText: "Active records",
      value: totalEmployees,
      color: "#0d6efd",
      icon: "👥",
    },
    {
      label: "Active",
      subText: "Currently Working",
      value: activeCount,
      color: "#198754",
      icon: "🕒",
    },
    {
      label: "Avg Rating",
      subText: "Out of 5.0",
      value: avgPerformance === "—" ? "—" : `${avgPerformance}/5`,
      color: "#6f42c1",
      icon: "📈",
    },
    {
      label: "On Leave",
      subText: "Pending Leaves",
      value: leaveCount,
      color: "#ffc107",
      icon: "📅",
    },
  ];

  const modules = [
    { name: "Employee", icon: "👥" },
    { name: "Attendance", icon: "🕒" },
    { name: "Leaves", icon: "📅" },
    { name: "Payroll", icon: "💰" },
    { name: "Performance", icon: "📈" },
    { name: "Reports", icon: "📊" },
  ];

  return (
    <Container
      fluid
      className="px-3 px-md-4 py-4"
      style={{ backgroundColor: "#f4f7fe", minHeight: "100vh" }}
    >
      {/* HEADER */}
      <div className="mb-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
        <div>
          <h2 className="fw-bold text-dark mb-1">HRMS Command Center</h2>
          <p className="text-muted mb-0">
            {totalEmployees} Active Employee Profiles
          </p>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge
            bg="white"
            text="dark"
            className="border shadow-sm px-3 py-2 rounded-pill"
          >
            Today: {new Date().toLocaleDateString("en-GB")}
          </Badge>
          {isLoading && (
            <Spinner animation="border" size="sm" variant="primary" />
          )}
        </div>
      </div>

      {/* STATS */}
      <Row className="g-3 mb-5">
        {stats.map((stat, i) => (
          <Col xs={12} sm={6} lg={3} key={i}>
            <Card
              className="border-0 shadow-sm h-100 py-2"
              style={{
                borderLeft: `5px solid ${stat.color}`,
                borderRadius: "12px",
              }}
            >
              <Card.Body className="d-flex align-items-center">
                <div className="me-3 fs-3">{stat.icon}</div>
                <div>
                  <div className="fw-bold text-dark small">{stat.label}</div>
                  <div className="text-muted small mb-1">{stat.subText}</div>
                  <h3 className="fw-bold mb-0" style={{ color: stat.color }}>
                    {stat.value}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* MODULES */}
      <h5 className="fw-bold mb-3">Quick Modules</h5>
      <Row className="g-2 g-md-3 mb-5">
        {modules.map((m, i) => (
          <Col lg={2} md={3} sm={4} xs={6} key={i}>
            <Card className="text-center border-0 shadow-sm h-100 py-3 module-card">
              <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                {m.icon}
              </div>
              <span className="fw-bold small text-dark">{m.name}</span>
            </Card>
          </Col>
        ))}
      </Row>

      {/* TABLE */}
      <Card
        className="border-0 shadow-sm overflow-hidden"
        style={{ borderRadius: "15px" }}
      >
        <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">Employee Directory</h5>
          <Badge bg={dbConnected ? "success" : "secondary"}>
            {dbConnected ? "🟢 MySQL Live" : "⚪ Offline"}
          </Badge>
        </Card.Header>

        {isLoading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Fetching records from database...</p>
          </div>
        ) : employeeData.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <p className="fs-5">😔 No employee data found.</p>
            <p className="small">
              Please connect your database or add new employees.
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light text-muted small text-uppercase">
                <tr>
                  <th className="ps-4">#</th>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody style={{ whiteSpace: "nowrap" }}>
                {employeeData.map((emp, index) => (
                  <tr key={emp.id}>
                    <td className="ps-4 text-muted fw-bold">{index + 1}</td>
                    <td className="fw-bold text-primary">{emp.empId}</td>
                    <td className="fw-bold text-dark">{emp.name}</td>
                    <td className="text-muted">{emp.designation}</td>
                    <td>
                      <Badge
                        bg="light"
                        text="dark"
                        className="border fw-normal"
                      >
                        {emp.department}
                      </Badge>
                    </td>
                    <td className="text-muted small">{emp.email}</td>
                    <td className="text-muted small">{emp.phone}</td>
                    <td>
                      <Badge
                        bg={getStatusColor(emp.status)}
                        className="px-3 py-2 fw-normal"
                      >
                        {emp.status}
                      </Badge>
                    </td>
                    <td>{renderRating(emp.performance)}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-light border fw-bold text-muted">
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card>

      <style>{`
        .module-card { cursor: pointer; transition: 0.3s; border-radius: 12px; }
        .module-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; border: 1px solid #0d6efd !important; }
        .table tbody tr:hover { background-color: #f8faff !important; }
        .table-responsive::-webkit-scrollbar { height: 6px; }
        .table-responsive::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 10px; }
      `}</style>
    </Container>
  );
};

export default AdminDashboard;
