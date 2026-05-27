import React, { useState, useEffect } from "react";
import {
  Button,
  Container,
  Spinner,
  Form,
  InputGroup,
  Badge,
  Row,
  Col,
  Modal,
  Table,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5007/api";

const EMPTY_FORM = {
  employee_code: "",
  name: "",
  dept: "",
  designation: "",
  email: "",
  job_role: "employee",
  status: "Active",
  current_salary: "",
  reporting_manager: "",
  joining_date: "",
  phone_no: "",
  password: "User@123",
  kpi: "",
};

const InfoRow = ({ label, value }) => (
  <div className="d-flex justify-content-between border-bottom mb-1 pb-1">
    <small className="text-muted fw-bold text-nowrap me-2">{label}:</small>
    <small className="text-end text-break">{value || "—"}</small>
  </div>
);

/* ── Salary Modal ── */
const SalaryStructureModal = ({ show, onHide, employeeCode, employeeName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (show && employeeCode) {
      setLoading(true);
      setError(null);
      setData(null);
      fetch(`http://localhost:5007/api/salary/${employeeCode}`)
        .then((r) => r.json())
        .then((res) => {
          if (res.success) setData(res.salary);
          else setError(res.error || "Data not found");
          setLoading(false);
        })
        .catch((e) => {
          setError(e.message);
          setLoading(false);
        });
    }
  }, [show, employeeCode]);

  const fmt = (v) =>
    "₹" +
    parseFloat(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 });
  const month = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header
        closeButton
        style={{
          background: "linear-gradient(135deg,#1e3c72,#2a5298)",
          color: "white",
        }}
      >
        <Modal.Title className="fs-5">
          💰 Salary Structure
          <div
            style={{ fontSize: "0.75rem", fontWeight: "normal", opacity: 0.85 }}
          >
            {employeeName} — {month}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-2 p-md-4">
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="text-muted mt-2">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-danger">❌ {error}</div>
        ) : !data ? null : (
          <>
            <h6 className="fw-bold text-success mb-2 small">📋 1. Earnings</h6>
            <div className="table-responsive">
              <Table bordered hover size="sm" className="mb-3 small">
                <thead className="table-success">
                  <tr>
                    <th>Component</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic Salary</td>
                    <td className="text-end">{fmt(data.earnings.basic)}</td>
                  </tr>
                  <tr>
                    <td>HRA</td>
                    <td className="text-end">{fmt(data.earnings.hra)}</td>
                  </tr>
                  <tr>
                    <td>Conveyance</td>
                    <td className="text-end">
                      {fmt(data.earnings.conveyance)}
                    </td>
                  </tr>
                  <tr>
                    <td>Medical</td>
                    <td className="text-end">{fmt(data.earnings.medical)}</td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td>
                    <td className="text-end">
                      {fmt(data.earnings.special_allowance)}
                    </td>
                  </tr>
                  <tr className="table-success fw-bold">
                    <td>Gross Salary</td>
                    <td className="text-end text-success">
                      {fmt(data.gross_salary)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <h6 className="fw-bold text-danger mb-2 small">📋 2. Deductions</h6>
            <div className="table-responsive">
              <Table bordered hover size="sm" className="mb-3 small">
                <thead className="table-danger">
                  <tr>
                    <th>Deduction</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PF (12%)</td>
                    <td className="text-end">{fmt(data.deductions.pf)}</td>
                  </tr>
                  <tr>
                    <td>ESI</td>
                    <td className="text-end">{fmt(data.deductions.esi)}</td>
                  </tr>
                  <tr>
                    <td>Tax (PT/TDS)</td>
                    <td className="text-end">
                      {fmt(data.deductions.pt + data.deductions.tds)}
                    </td>
                  </tr>
                  <tr className="table-danger fw-bold">
                    <td>Total Deductions</td>
                    <td className="text-end text-danger">
                      {fmt(data.total_deductions)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            <div className="bg-primary text-white p-3 rounded d-flex justify-content-between align-items-center">
              <span className="fw-bold">Net Take Home:</span>
              <span className="fs-4 fw-bold">{fmt(data.net_salary)}</span>
            </div>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

/* ══════════════════════════════════════════
   KPI PICKER
   - Primary: numbered rows 1,2,3,4,5 — HR types manually
   - Secondary: numbered rows 1,2,3 — HR types manually
   - No preset categories
══════════════════════════════════════════ */

const MAX_PRIMARY = 5;
const MAX_SECONDARY = 3;

// Parse kpi string → { primary: string[], secondary: string[] }
const parseKpi = (kpiStr) => {
  if (!kpiStr) return { primary: [], secondary: [] };
  try {
    const arr = JSON.parse(kpiStr);
    if (Array.isArray(arr)) {
      return {
        primary: arr.filter((i) => i.type === "primary").map((i) => i.text),
        secondary: arr.filter((i) => i.type === "secondary").map((i) => i.text),
      };
    }
  } catch {}
  // legacy plain string
  const items = kpiStr
    .split(/[,\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
  return { primary: items, secondary: [] };
};

// Serialize back to JSON string
const serializeKpi = (primary, secondary) => {
  const arr = [
    ...primary.map((text) => ({ text, type: "primary" })),
    ...secondary.map((text) => ({ text, type: "secondary" })),
  ];
  return JSON.stringify(arr);
};

const KpiPicker = ({ kpi, onChange, canEdit }) => {
  const parsed = parseKpi(kpi);

  // Local state: arrays of strings for each numbered slot
  const [primaryRows, setPrimaryRows] = useState(() => {
    const rows = [...parsed.primary];
    while (rows.length < MAX_PRIMARY) rows.push("");
    return rows;
  });
  const [secondaryRows, setSecondaryRows] = useState(() => {
    const rows = [...parsed.secondary];
    while (rows.length < MAX_SECONDARY) rows.push("");
    return rows;
  });

  // Sync up whenever parent kpi changes (e.g. openEdit)
  useEffect(() => {
    const p = parseKpi(kpi);
    const pr = [...p.primary];
    while (pr.length < MAX_PRIMARY) pr.push("");
    const sr = [...p.secondary];
    while (sr.length < MAX_SECONDARY) sr.push("");
    setPrimaryRows(pr);
    setSecondaryRows(sr);
  }, [kpi]);

  const updatePrimary = (idx, val) => {
    const next = [...primaryRows];
    next[idx] = val;
    setPrimaryRows(next);
    onChange(serializeKpi(next.filter(Boolean), secondaryRows.filter(Boolean)));
  };

  const updateSecondary = (idx, val) => {
    const next = [...secondaryRows];
    next[idx] = val;
    setSecondaryRows(next);
    onChange(serializeKpi(primaryRows.filter(Boolean), next.filter(Boolean)));
  };

  return (
    <div className="kpi-picker-wrapper p-3 rounded-3">
      <Form.Label className="small fw-bold d-flex align-items-center gap-2 mb-3">
        <span>🎯</span>
        <span className="text-primary">KPI / Job Role Responsibilities</span>
      </Form.Label>

      <Row className="g-3">
        {/* ── PRIMARY BOX ── */}
        <Col xs={12} md={7}>
          <div className="kpi-box kpi-primary-box p-3 rounded-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="kpi-box-badge primary-badge">PRIMARY</span>
              <small className="text-muted" style={{ fontSize: "11px" }}>
                Core responsibilities
              </small>
            </div>

            {primaryRows.map((val, idx) => (
              <div key={idx} className="kpi-numbered-row mb-2">
                <span className="kpi-num primary-num">{idx + 1}</span>
                <Form.Control
                  size="sm"
                  placeholder={`Primary KPI ${idx + 1}...`}
                  value={val}
                  onChange={(e) => updatePrimary(idx, e.target.value)}
                  disabled={!canEdit}
                  className="kpi-input"
                />
                {canEdit && val && (
                  <span
                    className="kpi-clear-btn"
                    onClick={() => updatePrimary(idx, "")}
                  >
                    ✕
                  </span>
                )}
              </div>
            ))}
          </div>
        </Col>

        {/* ── SECONDARY BOX ── */}
        <Col xs={12} md={5}>
          <div className="kpi-box kpi-secondary-box p-3 rounded-3">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="kpi-box-badge secondary-badge">SECONDARY</span>
              <small className="text-muted" style={{ fontSize: "11px" }}>
                Supporting tasks
              </small>
            </div>

            {secondaryRows.map((val, idx) => (
              <div key={idx} className="kpi-numbered-row mb-2">
                <span className="kpi-num secondary-num">{idx + 1}</span>
                <Form.Control
                  size="sm"
                  placeholder={`Secondary KPI ${idx + 1}...`}
                  value={val}
                  onChange={(e) => updateSecondary(idx, e.target.value)}
                  disabled={!canEdit}
                  className="kpi-input"
                />
                {canEdit && val && (
                  <span
                    className="kpi-clear-btn"
                    onClick={() => updateSecondary(idx, "")}
                  >
                    ✕
                  </span>
                )}
              </div>
            ))}
          </div>
        </Col>
      </Row>

      {/* Preview pills */}
      {(primaryRows.some(Boolean) || secondaryRows.some(Boolean)) && (
        <div
          className="mt-3 p-2 rounded-2"
          style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}
        >
          <small className="text-muted fw-bold">
            Preview — Primary: {primaryRows.filter(Boolean).length}{" "}
            &nbsp;|&nbsp; Secondary: {secondaryRows.filter(Boolean).length}
          </small>
          <div className="d-flex flex-wrap gap-1 mt-1">
            {primaryRows.filter(Boolean).map((item, idx) => (
              <span
                key={`p-${idx}`}
                className="kpi-preview-pill kpi-preview-primary"
              >
                <span className="kpi-preview-num">{idx + 1}</span> {item}
              </span>
            ))}
            {secondaryRows.filter(Boolean).map((item, idx) => (
              <span
                key={`s-${idx}`}
                className="kpi-preview-pill kpi-preview-secondary"
              >
                <span className="kpi-preview-num">{idx + 1}</span> {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
const ManageEmployees = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [empForm, setEmpForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [salaryModal, setSalaryModal] = useState({
    show: false,
    code: "",
    name: "",
  });
  const [role, setRole] = useState(localStorage.getItem("role") || "admin");

  const isAdmin = role === "admin";
  const isHR = role === "hrmanager";
  const isManager = role === "manager";
  const isEmployee = role === "employee";
  const canEditKpi = isAdmin || isHR;

  useEffect(() => {
    if (isEmployee) navigate("/dashboard");
    else fetchEmployees();
  }, [role]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/employees`, { headers: { role } });
      const data = await res.json();
      if (data.success) setEmployees(Array.isArray(data.data) ? data.data : []);
      else alert("Error fetching employees");
    } catch (e) {
      alert("Error: " + e.message);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmpForm((prev) => ({ ...prev, [name]: value }));
  };

  const openAdd = () => {
    if (isManager || isEmployee) return alert("❌ Not allowed!");
    setEditMode(false);
    setEmpForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (emp) => {
    if (isManager || isEmployee) return alert("❌ Not allowed!");
    setEditMode(true);
    setEmpForm({
      ...emp,
      joining_date: emp.joining_date ? emp.joining_date.split("T")[0] : "",
      password: "User@123",
      kpi: emp.kpi || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (isManager || isEmployee) return alert("❌ Not allowed!");
    const {
      employee_code,
      name,
      dept,
      designation,
      email,
      current_salary,
      joining_date,
      reporting_manager,
      phone_no,
    } = empForm;
    if (
      !employee_code ||
      !name ||
      !dept ||
      !designation ||
      !email ||
      !current_salary ||
      !joining_date ||
      !reporting_manager ||
      !phone_no
    )
      return alert("❌ Fill all fields!");
    setSaving(true);
    try {
      const url = editMode ? `${API}/employees/update` : `${API}/employees/add`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", role },
        body: JSON.stringify(empForm),
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Saved!");
        fetchEmployees();
        setShowModal(false);
      } else alert("❌ " + data.error);
    } catch (e) {
      alert("❌ " + e.message);
    }
    setSaving(false);
  };

  const handleDelete = async (emp) => {
    if (!isAdmin) return alert("❌ Only Admin can delete!");
    if (!window.confirm("Delete employee?")) return;
    try {
      const res = await fetch(`${API}/employees/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json", role },
        body: JSON.stringify({ employee_code: emp.employee_code }),
      });
      const data = await res.json();
      if (data.success) fetchEmployees();
      else alert(data.error);
    } catch (e) {
      alert(e.message);
    }
  };

  const filtered = employees.filter(
    (emp) =>
      emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Container className="mt-3 mt-md-4">
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={6} className="mb-2 mb-md-0">
          <h2 className="fs-3 fw-bold mb-1">👥 Employee Management</h2>
          <Badge bg="dark">Role: {role}</Badge>
        </Col>
        <Col
          xs={12}
          md={6}
          className="text-md-end d-flex gap-2 justify-content-md-end"
        >
          <Form.Select
            size="sm"
            value={role}
            onChange={(e) => {
              localStorage.setItem("role", e.target.value);
              setRole(e.target.value);
            }}
            style={{ width: 140 }}
          >
            <option value="admin">Admin</option>
            <option value="hrmanager">HR Manager</option>
            <option value="manager">Reporting Manager</option>
          </Form.Select>
          {(isAdmin || isHR) && (
            <Button size="sm" onClick={openAdd}>
              + Add
            </Button>
          )}
        </Col>
      </Row>

      <InputGroup className="mb-4 shadow-sm">
        <InputGroup.Text>🔍</InputGroup.Text>
        <Form.Control
          placeholder="Search by name or ID..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-muted">No employees found.</p>
      ) : (
        filtered.map((emp, i) => {
          const { primary, secondary } = parseKpi(emp.kpi);
          return (
            <div
              key={i}
              className="p-3 mb-3 border rounded shadow-sm bg-white card-custom"
            >
              <div className="d-flex flex-wrap align-items-center mb-2">
                <h5 className="mb-0 me-2 fs-6 fw-bold">{emp.name}</h5>
                <div className="d-flex flex-wrap gap-1 mt-1 mt-sm-0">
                  <Badge bg="info" style={{ fontSize: "10px" }}>
                    {emp.job_role}
                  </Badge>
                  <Badge
                    bg={emp.status === "Active" ? "success" : "secondary"}
                    style={{ fontSize: "10px" }}
                  >
                    {emp.status}
                  </Badge>
                </div>
              </div>

              <div className="mb-2">
                <Badge
                  bg="warning"
                  text="dark"
                  className="p-2 w-100 w-sm-auto text-start"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setSalaryModal({
                      show: true,
                      code: emp.employee_code,
                      name: emp.name,
                    })
                  }
                >
                  💰 ₹
                  {parseFloat(emp.current_salary || 0).toLocaleString("en-IN")}
                  <small className="opacity-75 ms-1">(View Structure)</small>
                </Badge>
              </div>

              <Row className="g-2">
                <Col xs={12} sm={6}>
                  <InfoRow label="ID" value={emp.employee_code} />
                  <InfoRow label="Dept" value={emp.dept} />
                  <InfoRow label="Email" value={emp.email} />
                </Col>
                <Col xs={12} sm={6}>
                  <InfoRow label="Role" value={emp.designation} />
                  <InfoRow label="Phone" value={emp.phone_no} />
                  <InfoRow label="Manager" value={emp.reporting_manager} />
                </Col>
              </Row>

              {/* KPI on card */}
              {/* KPI on card */}
              {(primary.length > 0 || secondary.length > 0) && (
                <div className="mt-2 p-2 rounded-3 kpi-card-section">
                  <small
                    className="fw-bold d-block mb-1"
                    style={{ color: "#0d6efd" }}
                  >
                    🎯 Job Role / Responsibilities
                  </small>

                  {/* Primary Pills */}
                  {primary.length > 0 && (
                    <div className="mb-1">
                      <small
                        className="text-muted fw-bold me-1"
                        style={{ fontSize: "10px" }}
                      >
                        PRIMARY:
                      </small>
                      <div className="d-inline-flex flex-wrap gap-1">
                        {primary.map((item, idx) => (
                          <span
                            key={`p-${idx}`}
                            className="kpi-display-pill kpi-display-primary"
                          >
                            <span className="kpi-pill-num">{idx + 1}</span>{" "}
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Secondary Pills */}
                  {secondary.length > 0 && (
                    <div>
                      <small
                        className="text-muted fw-bold me-1"
                        style={{ fontSize: "10px" }}
                      >
                        SECONDARY:
                      </small>
                      <div className="d-inline-flex flex-wrap gap-1">
                        {secondary.map((item, idx) => (
                          <span
                            key={`s-${idx}`}
                            className="kpi-display-pill kpi-display-secondary"
                          >
                            <span className="kpi-pill-num">{idx + 1}</span>{" "}
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-3 d-flex gap-2">
                {(isAdmin || isHR) && (
                  <Button
                    size="sm"
                    variant="outline-primary"
                    className="flex-grow-1"
                    onClick={() => openEdit(emp)}
                  >
                    Edit
                  </Button>
                )}
                {isAdmin && (
                  <Button
                    size="sm"
                    variant="outline-danger"
                    className="flex-grow-1"
                    onClick={() => handleDelete(emp)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          );
        })
      )}

      {/* ══ ADD / EDIT MODAL ══ */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title className="fs-5">
            {editMode ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">Emp ID</Form.Label>
              <Form.Control
                size="sm"
                name="employee_code"
                value={empForm.employee_code}
                onChange={handleChange}
                disabled={editMode}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">Name</Form.Label>
              <Form.Control
                size="sm"
                name="name"
                value={empForm.name}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">Email</Form.Label>
              <Form.Control
                size="sm"
                name="email"
                value={empForm.email}
                onChange={handleChange}
              />
            </Col>
            <Col xs={6} md={4}>
              <Form.Label className="small fw-bold">Status</Form.Label>
              <Form.Select
                size="sm"
                name="status"
                value={empForm.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Col>
            <Col xs={6} md={4}>
              <Form.Label className="small fw-bold text-primary">
                System Role
              </Form.Label>
              <Form.Select
                size="sm"
                name="job_role"
                value={empForm.job_role}
                onChange={handleChange}
              >
                <option value="employee">Employee</option>
                <option value="manager">Reporting Manager</option>
                <option value="hrmanager">HR Manager</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Col>
            <Col xs={6} md={4}>
              <Form.Label className="small fw-bold">Dept</Form.Label>
              <Form.Control
                size="sm"
                name="dept"
                value={empForm.dept}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">Designation</Form.Label>
              <Form.Control
                size="sm"
                name="designation"
                value={empForm.designation}
                onChange={handleChange}
              />
            </Col>
            <Col xs={6} md={4}>
              <Form.Label className="small fw-bold">Salary</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                name="current_salary"
                value={empForm.current_salary}
                onChange={handleChange}
              />
            </Col>
            <Col xs={6} md={4}>
              <Form.Label className="small fw-bold">Joining Date</Form.Label>
              <Form.Control
                size="sm"
                type="date"
                name="joining_date"
                value={empForm.joining_date}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">
                Reporting Manager
              </Form.Label>
              <Form.Control
                size="sm"
                name="reporting_manager"
                value={empForm.reporting_manager}
                onChange={handleChange}
              />
            </Col>
            <Col xs={12} md={4}>
              <Form.Label className="small fw-bold">Phone</Form.Label>
              <Form.Control
                size="sm"
                name="phone_no"
                value={empForm.phone_no}
                onChange={handleChange}
              />
            </Col>

            <Col xs={12}>
              <KpiPicker
                kpi={empForm.kpi}
                onChange={(val) =>
                  setEmpForm((prev) => ({ ...prev, kpi: val }))
                }
                canEdit={canEditKpi}
              />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="p-2">
          <Button
            variant="link"
            className="text-muted"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="success"
            size="sm"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : editMode ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>

      <SalaryStructureModal
        show={salaryModal.show}
        onHide={() => setSalaryModal({ show: false, code: "", name: "" })}
        employeeCode={salaryModal.code}
        employeeName={salaryModal.name}
      />

      <style>{`
        .container { max-width: 900px; }
        .card-custom { transition: all 0.2s; }
        .card-custom:hover { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important; }

        /* Card KPI */
        .kpi-card-section { background: #f0f4ff; border-left: 3px solid #0d6efd; }
        .kpi-display-pill {
          display: inline-flex; align-items: center; gap: 4px;
          border-radius: 20px; padding: 2px 10px;
          font-size: 11px; font-weight: 500; white-space: nowrap;
        }
        .kpi-display-primary  { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
        .kpi-display-secondary{ background: #f1f5f9; color: #475569;  border: 1px solid #cbd5e1; }
        .kpi-pill-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 16px; height: 16px; border-radius: 50%;
          font-size: 9px; font-weight: 700; flex-shrink: 0;
        }
        .kpi-display-primary  .kpi-pill-num { background: #1d4ed8; color: white; }
        .kpi-display-secondary .kpi-pill-num { background: #64748b; color: white; }

        /* Picker */
        .kpi-picker-wrapper { background: linear-gradient(135deg,#f0f4ff,#eaf0ff); border: 1px solid #c7d9ff; }
        .kpi-box { background: #fff; }
        .kpi-primary-box   { border: 1.5px solid #93c5fd; background: #f0f9ff !important; }
        .kpi-secondary-box { border: 1.5px solid #cbd5e1; background: #f8fafc !important; }
        .kpi-box-badge { font-size: 9px; font-weight: 700; letter-spacing: 0.5px; padding: 2px 8px; border-radius: 10px; }
        .primary-badge   { background: #1d4ed8; color: white; }
        .secondary-badge { background: #64748b; color: white; }

        /* Numbered input row */
        .kpi-numbered-row {
          display: flex; align-items: center; gap: 6px; position: relative;
        }
        .kpi-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 22px; height: 22px; border-radius: 50%;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
        }
        .primary-num   { background: #1d4ed8; color: white; }
        .secondary-num { background: #64748b; color: white; }
        .kpi-input { font-size: 12px !important; flex: 1; }
        .kpi-input:focus { box-shadow: none; border-color: #93c5fd; }
        .kpi-input:disabled { background: #f1f5f9; cursor: not-allowed; }
        .kpi-clear-btn {
          font-size: 11px; color: #9ca3af; cursor: pointer;
          flex-shrink: 0; padding: 0 2px; line-height: 1;
        }
        .kpi-clear-btn:hover { color: #ef4444; }

        /* Preview pills */
        .kpi-preview-pill {
          display: inline-flex; align-items: center; gap: 4px;
          border-radius: 20px; padding: 2px 10px;
          font-size: 11px; font-weight: 500;
        }
        .kpi-preview-primary  { background: #dbeafe; color: #1d4ed8; border: 1px solid #93c5fd; }
        .kpi-preview-secondary{ background: #f1f5f9; color: #475569;  border: 1px solid #cbd5e1; }
        .kpi-preview-num {
          display: inline-flex; align-items: center; justify-content: center;
          width: 15px; height: 15px; border-radius: 50%;
          font-size: 8px; font-weight: 700;
        }
        .kpi-preview-primary  .kpi-preview-num { background: #1d4ed8; color: white; }
        .kpi-preview-secondary .kpi-preview-num { background: #64748b; color: white; }

        @media (max-width: 576px) {
          h2 { font-size: 1.25rem !important; }
          .badge { font-size: 0.7rem; }
        }
      `}</style>
    </Container>
  );
};

export default ManageEmployees;
