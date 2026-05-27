import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card, Table } from "react-bootstrap";

// Designation → Department Head mapping
const DESIGNATION_HEAD_MAP = {
  "Software Engineer":  "Rajesh Kumar (VP Engineering)",
  "HR Manager":         "Priya Sharma (HR Director)",
  "Sales Executive":    "Amit Bose (Sales Director)",
  "Accountant":         "Sunita Rao (CFO)",
  "Team Lead":          "Vikram Singh (Director of Operations)",
  "Project Manager":    "Deepa Nair (COO)",
  "Recruitment HR":     "Priya Sharma (HR Director)",
};

const DEPT_HEAD_LIST = [
  "Rajesh Kumar (VP Engineering)",
  "Priya Sharma (HR Director)",
  "Amit Bose (Sales Director)",
  "Sunita Rao (CFO)",
  "Vikram Singh (Director of Operations)",
  "Deepa Nair (COO)",
];

const DEFAULT_SHORTLIST = [
  { headName: "", shortlisted: false, remarks: "", departmentRequired: "Yes" },
];

const DEFAULT_INTERVIEW_ROUNDS = [
  { round: "Round 1", dateOfInterview: "", timeOfJoining: "", interviewerRemarks: "", departmentRemarks: "", required: "Yes", status: "Pending" },
  { round: "Round 2", dateOfInterview: "", timeOfJoining: "", interviewerRemarks: "", departmentRemarks: "", required: "No",  status: "Pending" },
  { round: "Round 3", dateOfInterview: "", timeOfJoining: "", interviewerRemarks: "", departmentRemarks: "", required: "No",  status: "Pending" },
];

const Recruitment = () => {

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    departmentHead: "",
    jobRole: "",
    department: "",
    employmentType: "Full-time",
    dateOfHiring: "",
    status: "Open",
    experience: "",
    minQualification: "",
    preferredQualification: "",
    additionalSkills: "",
    budget: "",
    basicSalary: "",
    hraType: "percent",
    hraValue: "50",
    conveyance: "",
    medical: "",
    special: "",
    esiApplicable: false,
    pt: "200",
    tds: "",
    otherDed: "",
  });

  const [cvFile, setCvFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [shortlistRows, setShortlistRows] = useState(DEFAULT_SHORTLIST);
  const [interviewRounds, setInterviewRounds] = useState(DEFAULT_INTERVIEW_ROUNDS);
  const [list, setList] = useState([]);
  const [showList, setShowList] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Handlers ──────────────────────────────────────────────
  const handleChange = (e) => {
    const val = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (e.target.name === "designation") {
      const autoHead = DESIGNATION_HEAD_MAP[e.target.value] || "";
      setFormData((prev) => ({ ...prev, designation: e.target.value, departmentHead: autoHead }));
      if (e.target.value !== "Recruitment HR") { setCvFile(null); setCvPreview(null); }
    } else {
      setFormData({ ...formData, [e.target.name]: val });
    }
  };

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) { alert("Only PDF or Word (.doc/.docx) files allowed."); e.target.value = ""; return; }
    if (file.size > 5 * 1024 * 1024) { alert("File size cannot exceed 5MB."); e.target.value = ""; return; }
    setCvFile(file);
    if (file.type === "application/pdf") { setCvPreview(URL.createObjectURL(file)); } else { setCvPreview(null); }
  };

  const handleShortlistChange = (idx, field, value) =>
    setShortlistRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  const addShortlistRow = () =>
    setShortlistRows((prev) => [...prev, { headName: "", shortlisted: false, remarks: "", departmentRequired: "Yes" }]);
  const removeShortlistRow = (idx) =>
    setShortlistRows((prev) => prev.filter((_, i) => i !== idx));

  const handleInterviewChange = (idx, field, value) =>
    setInterviewRounds((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));

  // ── Salary calculations ────────────────────────────────────
  const budgetAmt = parseFloat(formData.budget) || 0;
  const basic     = parseFloat(formData.basicSalary) || 0;
  const hraAmt    = formData.hraType === "percent"
                      ? (basic * (parseFloat(formData.hraValue) || 0)) / 100
                      : parseFloat(formData.hraValue) || 0;
  const convAmt   = parseFloat(formData.conveyance) || 0;
  const medAmt    = parseFloat(formData.medical)    || 0;
  const specAmt   = parseFloat(formData.special)    || 0;
  const grossSalary     = basic + hraAmt + convAmt + medAmt + specAmt;
  const pf              = basic * 0.12;
  const esi             = formData.esiApplicable ? grossSalary * 0.0075 : 0;
  const ptAmt           = parseFloat(formData.pt)       || 0;
  const tdsAmt          = parseFloat(formData.tds)      || 0;
  const otherDedAmt     = parseFloat(formData.otherDed) || 0;
  const totalDeductions = pf + esi + ptAmt + tdsAmt + otherDedAmt;
  const netSalary       = grossSalary - totalDeductions;
  const fmt = (n) => "₹ " + Math.round(n).toLocaleString("en-IN");

  const resetForm = () => {
    setFormData({
      employeeId: "", employeeName: "", designation: "", departmentHead: "",
      jobRole: "", department: "", employmentType: "Full-time", dateOfHiring: "",
      status: "Open", experience: "", minQualification: "", preferredQualification: "",
      additionalSkills: "", budget: "", basicSalary: "", hraType: "percent", hraValue: "50",
      conveyance: "", medical: "", special: "", esiApplicable: false, pt: "200", tds: "", otherDed: "",
    });
    setCvFile(null); setCvPreview(null);
    setShortlistRows(DEFAULT_SHORTLIST);
    setInterviewRounds(DEFAULT_INTERVIEW_ROUNDS);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.basicSalary || parseFloat(formData.basicSalary) <= 0) { alert("Basic Salary is required!"); return; }
    if (formData.designation === "Recruitment HR" && !cvFile) { alert("CV upload is mandatory for Recruitment HR!"); return; }
    const payload = { ...formData, grossSalary, totalDeductions, netSalary, pf: Math.round(pf), esi: Math.round(esi), shortlistRows, interviewRounds };
    try {
      let body; let headers = {};
      if (cvFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => fd.append(k, typeof v === "object" ? JSON.stringify(v) : v));
        fd.append("cv", cvFile);
        body = fd;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(payload);
      }
      const response = await fetch("http://localhost:5013/api/recruitment/add", { method: "POST", headers, body });
      const result = await response.json();
      if (response.ok) {
        alert(`Saved Successfully!\nID: ${result.id}\nEmployee: ${formData.employeeName} (${formData.employeeId})\nNet Salary: ₹${Math.round(netSalary).toLocaleString("en-IN")}` + (cvFile ? `\nCV: ${cvFile.name} uploaded` : ""));
        resetForm();
      } else { alert("Error: " + result.message); }
    } catch (error) { console.error("Error:", error); alert("Server not responding. Please check if node server.js is running."); }
  };

  const loadList = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5013/api/recruitment/list");
      const data = await res.json();
      setList(data); setShowList(true);
    } catch { alert("Unable to load list."); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Delete record ID ${id}?`)) return;
    await fetch(`http://localhost:5013/api/recruitment/delete/${id}`, { method: "DELETE" });
    loadList();
  };

  const secTitle = {
    fontSize: "11px", fontWeight: "600", letterSpacing: "0.06em",
    textTransform: "uppercase", color: "#6c757d", marginBottom: "14px",
  };

  const isRecruitmentHR = formData.designation === "Recruitment HR";

  const statusColor = (s) =>
    s === "Selected"  ? "bg-success" :
    s === "Rejected"  ? "bg-danger"  :
    s === "On Hold"   ? "bg-warning text-dark" :
    s === "Scheduled" ? "bg-primary" :
    s === "No Show"   ? "bg-dark"    : "bg-secondary";

  const roundAccent = ["#0d6efd", "#6610f2", "#fd7e14"];
  const roundBg     = ["#f0f6ff", "#f5f0ff", "#fff8f0"];
  const roundIcon   = ["🔵", "🟣", "🟠"];

  return (
    <div className="bg-light min-vh-100 py-4">
      <Container>

        {/* Header */}
        <div className="mb-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold mb-0">Recruitment Service</h3>
            <p className="text-muted mb-0">New hiring process — fill in all required details</p>
          </div>
          <div className="d-flex gap-2">
            {showList && <Button variant="outline-primary" onClick={() => setShowList(false)}>📝 Back to Form</Button>}
            <Button variant={showList ? "secondary" : "success"} onClick={() => showList ? setShowList(false) : loadList()}>
              {showList ? "✖ Close List" : "📋 View All Records"}
            </Button>
          </div>
        </div>

        {/* ── Records List ── */}
        {showList ? (
          <Card className="border-0 shadow-sm" style={{ borderRadius: "15px" }}>
            <Card.Body className="p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">All Recruitment Records</h5>
                <Button size="sm" variant="outline-primary" onClick={loadList}>🔄 Refresh</Button>
              </div>
              {loading ? (
                <p className="text-center text-muted py-4">Loading...</p>
              ) : list.length === 0 ? (
                <p className="text-center text-muted py-4">No records found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered table-hover align-middle">
                    <thead className="table-dark text-center">
                      <tr>
                        <th>ID</th><th>Emp ID</th><th>Employee Name</th><th>Designation</th>
                        <th>Dept. Head</th><th>Job Role</th><th>Department</th><th>Type</th>
                        <th>Date</th><th>Status</th><th>Experience</th><th>Budget</th>
                        <th>Gross</th><th>Deductions</th><th>Net Salary</th><th>CV</th><th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map(r => (
                        <tr key={r.id}>
                          <td className="text-center fw-bold">#{r.id}</td>
                          <td className="text-center"><span className="badge bg-dark">{r.employee_id || r.employeeId || "-"}</span></td>
                          <td className="fw-bold">{r.employee_name || r.employeeName || "-"}</td>
                          <td>{r.designation}</td>
                          <td>{r.departmentHead || r.department_head || "-"}</td>
                          <td>{r.jobRole}</td>
                          <td>{r.department}</td>
                          <td><span className="badge bg-secondary">{r.employmentType}</span></td>
                          <td>{r.dateOfHiring ? r.dateOfHiring.slice(0, 10) : "-"}</td>
                          <td><span className={`badge ${r.status === "Open" ? "bg-success" : r.status === "Closed" ? "bg-danger" : "bg-warning text-dark"}`}>{r.status}</span></td>
                          <td>{r.experience}</td>
                          <td className="text-end fw-bold">₹{Number(r.budget || 0).toLocaleString("en-IN")}</td>
                          <td className="text-end fw-bold text-success">₹{Number(r.grossSalary || 0).toLocaleString("en-IN")}</td>
                          <td className="text-end text-danger">₹{Number(r.totalDeductions || 0).toLocaleString("en-IN")}</td>
                          <td className="text-end fw-bold text-primary">₹{Number(r.netSalary || 0).toLocaleString("en-IN")}</td>
                          <td className="text-center">{r.cvFileName ? <span className="badge bg-success">📎 {r.cvFileName}</span> : <span className="text-muted">—</span>}</td>
                          <td className="text-center"><Button size="sm" variant="outline-danger" onClick={() => handleDelete(r.id)}>🗑️ Delete</Button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>

        ) : (
          <Form onSubmit={handleSubmit}>

            {/* ── Employee Information ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Employee Information</p>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Employee ID <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="employeeId" placeholder="e.g. EMP-110"
                        value={formData.employeeId} onChange={handleChange} required />
                      <Form.Text className="text-muted">Unique ID for this employee (e.g. EMP-001, HR-042)</Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Employee Name <span className="text-danger">*</span></Form.Label>
                      <Form.Control type="text" name="employeeName" placeholder="e.g. Rahul Sharma"
                        value={formData.employeeName} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ── Job Information ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Job Information</p>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Designation</Form.Label>
                      <Form.Select name="designation" value={formData.designation} onChange={handleChange} required>
                        <option value="">Select designation</option>
                        <option>Software Engineer</option>
                        <option>HR Manager</option>
                        <option>Recruitment HR</option>
                        <option>Sales Executive</option>
                        <option>Accountant</option>
                        <option>Team Lead</option>
                        <option>Project Manager</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Department Head
                        {formData.designation && formData.departmentHead && (
                          <span className="ms-2 badge bg-success" style={{ fontSize: "10px" }}>✓ Auto-filled</span>
                        )}
                      </Form.Label>
                      <Form.Control type="text" name="departmentHead" value={formData.departmentHead} onChange={handleChange}
                        placeholder={formData.designation ? "Auto-filled from designation" : "Select designation first"}
                        style={formData.departmentHead ? { background: "#f0faf0", borderColor: "#28a745", fontWeight: "600", color: "#155724" } : {}} />
                      {formData.designation && formData.departmentHead && (
                        <Form.Text className="text-success">🏢 Department Head auto-selected based on Designation</Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Job Role / Title</Form.Label>
                      <Form.Control type="text" name="jobRole" placeholder="e.g. Backend Developer"
                        value={formData.jobRole} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Department</Form.Label>
                      <Form.Select name="department" value={formData.department} onChange={handleChange} required>
                        <option value="">Select department</option>
                        <option>Engineering</option>
                        <option>Human Resources</option>
                        <option>Finance</option>
                        <option>Sales</option>
                        <option>Operations</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Employment Type</Form.Label>
                      <Form.Select name="employmentType" value={formData.employmentType} onChange={handleChange}>
                        <option>Full-time</option><option>Part-time</option>
                        <option>Contract</option><option>Internship</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Date of Hiring</Form.Label>
                      <Form.Control type="date" name="dateOfHiring" value={formData.dateOfHiring} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Job Status</Form.Label>
                      <Form.Select name="status" value={formData.status} onChange={handleChange}>
                        <option>Open</option><option>On hold</option><option>Closed</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                {/* CV Upload — only for Recruitment HR */}
                {isRecruitmentHR && (
                  <div className="mt-4 p-4 rounded-3"
                    style={{ background: "linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)", border: "2px dashed #ffc107" }}>
                    <div className="d-flex align-items-center mb-3">
                      <span style={{ fontSize: "24px", marginRight: "10px" }}>📎</span>
                      <div>
                        <div className="fw-bold" style={{ color: "#856404", fontSize: "14px" }}>
                          CV / Resume Upload <span className="text-danger">*</span>
                        </div>
                        <small style={{ color: "#856404" }}>Uploading a CV is mandatory for the Recruitment HR designation.</small>
                      </div>
                    </div>
                    <Form.Control type="file" accept=".pdf,.doc,.docx" onChange={handleCvUpload} style={{ cursor: "pointer" }} />
                    <Form.Text className="text-muted">Accepted formats: PDF, DOC, DOCX &nbsp;|&nbsp; Max size: 5MB</Form.Text>
                    {cvFile && (
                      <div className="mt-3 p-3 rounded-3 d-flex justify-content-between align-items-center"
                        style={{ background: "#d4edda", border: "1px solid #c3e6cb" }}>
                        <div>
                          <div className="fw-bold text-success">✅ {cvFile.name}</div>
                          <small className="text-muted">
                            Size: {(cvFile.size / 1024).toFixed(1)} KB &nbsp;|&nbsp;
                            Type: {cvFile.type.includes("pdf") ? "PDF" : "Word Document"}
                          </small>
                        </div>
                        <Button size="sm" variant="outline-danger" onClick={() => { setCvFile(null); setCvPreview(null); }}>🗑️ Remove</Button>
                      </div>
                    )}
                    {cvPreview && (
                      <div className="mt-3">
                        <small className="text-muted fw-bold d-block mb-2">📄 PDF Preview:</small>
                        <iframe src={cvPreview} title="CV Preview" width="100%" height="300px"
                          style={{ borderRadius: "8px", border: "1px solid #dee2e6" }} />
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* ══════════════════════════════════════════════════
                CV SHORTLIST — Department Head Review
            ══════════════════════════════════════════════════ */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <p style={{ ...secTitle, marginBottom: "2px" }}>📋 CV Shortlist — Department Head Review</p>
                    <small className="text-muted">Record which department heads have reviewed and shortlisted this candidate's CV</small>
                  </div>
                  <Button size="sm" variant="outline-primary" onClick={addShortlistRow}>+ Add Row</Button>
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered align-middle mb-0" style={{ fontSize: "13px" }}>
                    <thead style={{ background: "#f1f3f5" }}>
                      <tr>
                        <th style={{ minWidth: "210px" }}>Department Head Name</th>
                        <th className="text-center" style={{ minWidth: "120px" }}>CV Shortlisted?</th>
                        <th style={{ minWidth: "230px" }}>Remarks</th>
                        <th className="text-center" style={{ minWidth: "130px" }}>Dept. Required</th>
                        <th className="text-center" style={{ minWidth: "70px" }}>Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortlistRows.map((row, idx) => (
                        <tr key={idx} style={{ background: row.shortlisted ? "#f0fff4" : "#fff" }}>
                          <td>
                            <Form.Select value={row.headName}
                              onChange={(e) => handleShortlistChange(idx, "headName", e.target.value)}
                              style={{ fontSize: "13px" }}>
                              <option value="">— Select Head —</option>
                              {DEPT_HEAD_LIST.map((h) => <option key={h}>{h}</option>)}
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            <div className="d-flex flex-column align-items-center gap-1">
                              <Form.Check
                                type="checkbox"
                                id={`sl-${idx}`}
                                checked={row.shortlisted}
                                onChange={(e) => handleShortlistChange(idx, "shortlisted", e.target.checked)}
                              />
                              <span className={`badge ${row.shortlisted ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "10px" }}>
                                {row.shortlisted ? "✔ Shortlisted" : "✘ Not Yet"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <Form.Control size="sm" type="text" placeholder="Enter remarks..."
                              value={row.remarks}
                              onChange={(e) => handleShortlistChange(idx, "remarks", e.target.value)} />
                          </td>
                          <td className="text-center">
                            <Form.Select size="sm" value={row.departmentRequired}
                              onChange={(e) => handleShortlistChange(idx, "departmentRequired", e.target.value)}
                              style={{ width: "90px", margin: "auto", fontSize: "12px",
                                       color: row.departmentRequired === "Yes" ? "#155724" : "#721c24",
                                       background: row.departmentRequired === "Yes" ? "#d4edda" : "#f8d7da" }}>
                              <option>Yes</option>
                              <option>No</option>
                            </Form.Select>
                          </td>
                          <td className="text-center">
                            {shortlistRows.length > 1 && (
                              <Button size="sm" variant="outline-danger" onClick={() => removeShortlistRow(idx)}>✕</Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Shortlist summary */}
                <div className="mt-3 d-flex gap-3">
                  <div className="px-3 py-2 rounded-2 text-center" style={{ background: "#d4edda", minWidth: "110px" }}>
                    <div className="fw-bold text-success fs-5">{shortlistRows.filter(r => r.shortlisted).length}</div>
                    <small className="text-muted">Shortlisted</small>
                  </div>
                  <div className="px-3 py-2 rounded-2 text-center" style={{ background: "#f8d7da", minWidth: "110px" }}>
                    <div className="fw-bold text-danger fs-5">{shortlistRows.filter(r => !r.shortlisted).length}</div>
                    <small className="text-muted">Pending Review</small>
                  </div>
                  <div className="px-3 py-2 rounded-2 text-center" style={{ background: "#cce5ff", minWidth: "110px" }}>
                    <div className="fw-bold text-primary fs-5">{shortlistRows.filter(r => r.departmentRequired === "Yes").length}</div>
                    <small className="text-muted">Dept. Required</small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* ══════════════════════════════════════════════════
                INTERVIEW PROCESS — Round 1 / 2 / 3
            ══════════════════════════════════════════════════ */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>🎯 Interview Process — Rounds 1 / 2 / 3</p>

                {interviewRounds.map((round, idx) => (
                  <div key={idx} className="mb-4 p-4 rounded-3"
                    style={{ border: `2px solid ${roundAccent[idx]}`, background: roundBg[idx] }}>

                    {/* Round Header */}
                    <div className="d-flex align-items-center justify-content-between mb-3 pb-2"
                      style={{ borderBottom: `1px solid ${roundAccent[idx]}33` }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: "18px" }}>{roundIcon[idx]}</span>
                        <span className="fw-bold" style={{ color: roundAccent[idx], fontSize: "14px" }}>
                          {round.round}
                        </span>
                        <span className={`badge ms-1 ${statusColor(round.status)}`} style={{ fontSize: "11px" }}>
                          {round.status}
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted fw-bold">Required for this position:</small>
                        <Form.Select size="sm" value={round.required}
                          onChange={(e) => handleInterviewChange(idx, "required", e.target.value)}
                          style={{
                            width: "85px", fontSize: "12px", fontWeight: "700",
                            color: round.required === "Yes" ? "#155724" : "#721c24",
                            background: round.required === "Yes" ? "#d4edda" : "#f8d7da",
                            border: "none",
                          }}>
                          <option>Yes</option>
                          <option>No</option>
                        </Form.Select>
                      </div>
                    </div>

                    <Row className="g-3">
                      {/* Date of Interview */}
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            📅 Date of Interview
                          </Form.Label>
                          <Form.Control type="date" size="sm"
                            value={round.dateOfInterview}
                            onChange={(e) => handleInterviewChange(idx, "dateOfInterview", e.target.value)} />
                        </Form.Group>
                      </Col>

                      {/* Time of Joining */}
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            🕐 Time of Joining
                          </Form.Label>
                          <Form.Control type="time" size="sm"
                            value={round.timeOfJoining}
                            onChange={(e) => handleInterviewChange(idx, "timeOfJoining", e.target.value)} />
                        </Form.Group>
                      </Col>

                      {/* Status */}
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            📊 Status
                          </Form.Label>
                          <Form.Select size="sm" value={round.status}
                            onChange={(e) => handleInterviewChange(idx, "status", e.target.value)}>
                            <option>Pending</option>
                            <option>Scheduled</option>
                            <option>Selected</option>
                            <option>Rejected</option>
                            <option>On Hold</option>
                            <option>No Show</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>

                      {/* Dept. Required badge */}
                      <Col md={3}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            ✅ Department Required
                          </Form.Label>
                          <div className="pt-1">
                            <span className={`badge px-3 py-2 ${round.required === "Yes" ? "bg-success" : "bg-secondary"}`}
                              style={{ fontSize: "13px" }}>
                              {round.required === "Yes" ? "✔ Yes — Required" : "✘ No — Optional"}
                            </span>
                          </div>
                        </Form.Group>
                      </Col>

                      {/* Interviewer Remarks */}
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            🗒️ Interviewer Remarks
                          </Form.Label>
                          <Form.Control as="textarea" rows={2} size="sm"
                            placeholder="Interviewer's comments on the candidate..."
                            value={round.interviewerRemarks}
                            onChange={(e) => handleInterviewChange(idx, "interviewerRemarks", e.target.value)} />
                        </Form.Group>
                      </Col>

                      {/* Department Remarks */}
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label style={{ fontSize: "12px", fontWeight: "600", color: "#495057" }}>
                            🏢 Department Remarks
                          </Form.Label>
                          <Form.Control as="textarea" rows={2} size="sm"
                            placeholder="Department head's feedback on the candidate..."
                            value={round.departmentRemarks}
                            onChange={(e) => handleInterviewChange(idx, "departmentRemarks", e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                ))}

                {/* Interview Summary Bar */}
                <div className="p-3 rounded-3" style={{ background: "#f8f9fa", border: "1px solid #dee2e6" }}>
                  <small className="fw-bold text-muted d-block mb-2" style={{ fontSize: "11px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    Interview Round Summary
                  </small>
                  <div className="d-flex gap-3 flex-wrap">
                    {interviewRounds.map((r, i) => (
                      <div key={i} className="text-center px-3 py-2 rounded-2"
                        style={{ background: "#fff", border: `1.5px solid ${roundAccent[i]}33`, minWidth: "140px" }}>
                        <div style={{ fontSize: "12px", color: roundAccent[i], fontWeight: "700" }}>
                          {roundIcon[i]} {r.round}
                        </div>
                        <span className={`badge mt-1 ${statusColor(r.status)}`} style={{ fontSize: "10px" }}>
                          {r.status}
                        </span>
                        <div className="mt-1" style={{ fontSize: "10px" }}>
                          <span className={`badge ${r.required === "Yes" ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "9px" }}>
                            Required: {r.required}
                          </span>
                        </div>
                        {r.dateOfInterview && (
                          <div style={{ fontSize: "10px", color: "#888", marginTop: "3px" }}>
                            📅 {r.dateOfInterview}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* ── Experience & Qualification ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Experience &amp; Qualification</p>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Required Experience</Form.Label>
                      <Form.Select name="experience" value={formData.experience} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option>Fresher (0 yr)</option><option>1–2 years</option>
                        <option>3–5 years</option><option>5–8 years</option><option>8+ years</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Minimum Qualification</Form.Label>
                      <Form.Select name="minQualification" value={formData.minQualification} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option>SSC / Equivalent</option><option>HSC / Equivalent</option>
                        <option>Diploma</option><option>Bachelor's degree</option>
                        <option>Master's degree</option><option>PhD</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Preferred Qualification</Form.Label>
                      <Form.Select name="preferredQualification" value={formData.preferredQualification} onChange={handleChange}>
                        <option value="">Select</option>
                        <option>B.Sc in CS / IT</option><option>BBA / MBA</option>
                        <option>B.Com / M.Com</option><option>B.Eng / M.Eng</option>
                        <option>Any discipline</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Additional Skills / Notes</Form.Label>
                      <Form.Control as="textarea" rows={3} name="additionalSkills"
                        placeholder="e.g. React, Node.js, communication skills..."
                        value={formData.additionalSkills} onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ── Budget ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Budget</p>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Budget (₹)</Form.Label>
                      <Form.Control type="number" name="budget" value={formData.budget}
                        onChange={handleChange} placeholder="e.g. 50000" min="0" />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="d-flex align-items-center">
                    {budgetAmt > 0 && (
                      <div className="p-3 rounded-3 w-100 text-center" style={{ background: "#eaf3de" }}>
                        <small className="text-muted d-block mb-1">Allocated Budget</small>
                        <div className="fw-bold fs-5" style={{ color: "#27500A" }}>{fmt(budgetAmt)}</div>
                      </div>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* ── Earnings ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Salary Structure — Earnings</p>
                <Table responsive className="align-middle">
                  <thead className="table-light">
                    <tr><th>Component</th><th>Type</th><th className="text-end">Amount (₹)</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Basic Salary <span className="text-danger">*</span></td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="basicSalary" value={formData.basicSalary}
                          onChange={handleChange} placeholder="0" min="1" required
                          style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr>
                      <td>HRA (House Rent Allowance)</td>
                      <td>
                        <Form.Select name="hraType" value={formData.hraType} onChange={handleChange}
                          style={{ width: "140px", fontSize: "13px" }}>
                          <option value="percent">% of basic</option>
                          <option value="fixed">Fixed</option>
                        </Form.Select>
                      </td>
                      <td className="text-end">
                        <div className="d-flex justify-content-end align-items-center gap-2">
                          <Form.Control type="number" name="hraValue" value={formData.hraValue}
                            onChange={handleChange} placeholder="0" min="0" style={{ width: "100px", textAlign: "right" }} />
                          {formData.hraType === "percent" && <small className="text-muted text-nowrap">= {fmt(hraAmt)}</small>}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>Conveyance Allowance</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="conveyance" value={formData.conveyance}
                          onChange={handleChange} placeholder="0" min="0"
                          style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr>
                      <td>Medical Allowance</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="medical" value={formData.medical}
                          onChange={handleChange} placeholder="0" min="0"
                          style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr>
                      <td>Special Allowance</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="special" value={formData.special}
                          onChange={handleChange} placeholder="0" min="0"
                          style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr className="table-success">
                      <td colSpan={2} className="fw-bold">Gross Salary</td>
                      <td className="text-end fw-bold text-success fs-6">{fmt(grossSalary)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* ── Deductions ── */}
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: "15px" }}>
              <Card.Body className="p-4">
                <p style={secTitle}>Salary Structure — Deductions</p>
                <Table responsive className="align-middle">
                  <thead className="table-light">
                    <tr><th>Component</th><th>Rate / Type</th><th className="text-end">Amount (₹)</th></tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Provident Fund (PF)</td>
                      <td><span className="badge bg-info text-dark">12% of basic</span><small className="text-muted ms-2">auto</small></td>
                      <td className="text-end fw-bold text-danger">{fmt(pf)}</td>
                    </tr>
                    <tr>
                      <td>
                        ESI
                        <Form.Check type="switch" id="esiSwitch" name="esiApplicable"
                          checked={formData.esiApplicable} onChange={handleChange}
                          label="Applicable" className="d-inline-flex ms-3 align-items-center" style={{ fontSize: "12px" }} />
                      </td>
                      <td><span className="badge bg-secondary">{formData.esiApplicable ? "0.75% of gross" : "Not applicable"}</span></td>
                      <td className="text-end fw-bold text-danger">{fmt(esi)}</td>
                    </tr>
                    <tr>
                      <td>Professional Tax (PT)</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="pt" value={formData.pt} onChange={handleChange}
                          placeholder="0" min="0" style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr>
                      <td>TDS (Income Tax)</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="tds" value={formData.tds} onChange={handleChange}
                          placeholder="0" min="0" style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr>
                      <td>Other Deductions</td>
                      <td><span className="badge bg-secondary">Fixed</span></td>
                      <td className="text-end">
                        <Form.Control type="number" name="otherDed" value={formData.otherDed} onChange={handleChange}
                          placeholder="0" min="0" style={{ width: "140px", marginLeft: "auto", textAlign: "right" }} />
                      </td>
                    </tr>
                    <tr className="table-danger">
                      <td colSpan={2} className="fw-bold">Total Deductions</td>
                      <td className="text-end fw-bold text-danger fs-6">{fmt(totalDeductions)}</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>

            {/* ── Summary ── */}
            <Row className="g-3 mb-4">
              <Col md={4}>
                <div className="text-center p-3 rounded-3" style={{ background: "#eaf3de" }}>
                  <small className="text-muted d-block mb-1">Gross Salary</small>
                  <div className="fw-bold fs-5" style={{ color: "#27500A" }}>{fmt(grossSalary)}</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 rounded-3" style={{ background: "#fcebeb" }}>
                  <small className="text-muted d-block mb-1">Total Deductions</small>
                  <div className="fw-bold fs-5" style={{ color: "#791F1F" }}>{fmt(totalDeductions)}</div>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center p-3 rounded-3" style={{ background: "#e6f1fb" }}>
                  <small className="text-muted d-block mb-1">Net Salary (Take Home)</small>
                  <div className="fw-bold fs-5" style={{ color: "#0C447C" }}>{fmt(netSalary)}</div>
                </div>
              </Col>
            </Row>

            {/* Net Banner */}
            <div className="p-4 mb-4 d-flex justify-content-between align-items-center rounded-3"
              style={{ background: "#e6f1fb", border: "1px solid #85b7eb" }}>
              <div>
                <div className="fw-bold" style={{ color: "#0C447C", fontSize: "15px" }}>
                  Net Salary = Gross − Total Deductions
                </div>
                <small style={{ color: "#185FA5" }}>
                  PF = 12% of Basic &nbsp;|&nbsp; ESI = 0.75% of Gross (if applicable)
                </small>
              </div>
              <div className="fw-bold" style={{ color: "#0C447C", fontSize: "28px" }}>{fmt(netSalary)}</div>
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3 mb-5">
              <Button type="submit" variant="primary" size="lg" className="px-5 fw-bold shadow-sm">
                💾 Save &amp; Submit
              </Button>
              <Button type="button" variant="outline-secondary" size="lg" className="px-4 fw-bold" onClick={resetForm}>
                🔄 Reset
              </Button>
            </div>

          </Form>
        )}
      </Container>
    </div>
  );
};

export default Recruitment;