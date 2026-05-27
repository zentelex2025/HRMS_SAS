import React, { useState, useEffect, useRef } from "react";
import { Table, Card, Row, Col, Button, ListGroup, Badge, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MYSQL_GET_API = "http://localhost:5007/api/payroll/EMP-2024-0042";
const UPDATE_NAME_API = (empId) => `http://localhost:5007/api/payroll/update-name/${empId}`;

const PayrollManagement = ({ employeeId = "EMP-2024-0042" }) => {
  const [activeView, setActiveView] = useState("overview");
  const [employeeName, setEmployeeName] = useState("Loading...");
  const [nameStatus, setNameStatus] = useState(""); // "", "saving", "saved", "error"

  const [bankDetails, setBankDetails] = useState({ name: "", account: "" });
  const [pfNumber, setPfNumber] = useState("N/A");
  const [esiNumber, setEsiNumber] = useState("N/A");

  const [salaryStructure, setSalaryStructure] = useState({
    basic: 0,
    hra: 0,
    conveyance: 0,
    medical: 0,
    special: 0,
    pf: 0,
    esi: 0,
    pt: 0,
    tds: 0,
    others: 0
  });

  // Debounce timer ref
  const debounceRef = useRef(null);

  useEffect(() => {
    fetch(MYSQL_GET_API)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.salaryStructure) {
          const ds = data.salaryStructure;

          setEmployeeName(data.employeeName || "N/A");
          setBankDetails({
            name: ds.bank_name || "N/A",
            account: ds.account_no || "N/A"
          });
          setPfNumber(ds.pf_number || "N/A");
          setEsiNumber(ds.esi_number || "N/A");

          const basicVal = parseFloat(ds.basic_salary) || 0;
          const calculatedPF = Math.round(basicVal * 0.12);
          const calculatedESI = Math.round(basicVal * 0.0075);

          setSalaryStructure({
            basic: basicVal,
            hra: parseFloat(ds.hra) || 0,
            conveyance: parseFloat(ds.conveyance) || 0,
            medical: parseFloat(ds.medical) || 0,
            special: parseFloat(ds.special_allowance) || 0,
            pf: calculatedPF,
            esi: calculatedESI,
            pt: parseFloat(ds.pt_tax) || 0,
            tds: parseFloat(ds.tds) || 0,
            others: parseFloat(ds.other_deductions) || 0
          });
        }
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  // ✅ Name update with debounce (saves 800ms after user stops typing)
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setEmployeeName(newName);
    setNameStatus("saving");

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      if (!newName.trim()) {
        setNameStatus("error");
        return;
      }
      try {
        const res = await fetch(UPDATE_NAME_API(employeeId), {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ employee_name: newName.trim() })
        });
        const data = await res.json();
        if (data.success) {
          setNameStatus("saved");
          setTimeout(() => setNameStatus(""), 2000);
        } else {
          setNameStatus("error");
        }
      } catch (err) {
        console.error("Name update error:", err);
        setNameStatus("error");
      }
    }, 800);
  };

  const grossSalary =
    salaryStructure.basic +
    salaryStructure.hra +
    salaryStructure.conveyance +
    salaryStructure.medical +
    salaryStructure.special;

  const totalDeductions =
    salaryStructure.pf +
    salaryStructure.esi +
    salaryStructure.pt +
    salaryStructure.tds +
    salaryStructure.others;

  const netSalary = grossSalary - totalDeductions;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(41, 128, 185);
    doc.text("ZENTELEX IT SOLUTIONS", 105, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Kolkata, West Bengal, India | Official Payroll Document", 105, 22, { align: "center" });
    doc.line(14, 25, 196, 25);

    autoTable(doc, {
      startY: 30,
      body: [
        ["Employee Name:", employeeName || "N/A", "Employee ID:", employeeId],
        ["PF Number:", pfNumber || "N/A", "ESI Number:", esiNumber || "N/A"],
        ["Designation:", "Full Stack Developer", "Month/Year:", "March 2026"],
        ["Bank Name:", bankDetails?.name || "N/A", "Account No:", bankDetails?.account || "N/A"]
      ],
      theme: "plain",
      styles: { fontSize: 10, cellPadding: 1 }
    });

    const earnings = [
      ["Earnings", "Amount"],
      ["Basic Salary", `INR ${salaryStructure.basic}`],
      ["HRA", `INR ${salaryStructure.hra}`],
      ["Conveyance Allowance", `INR ${salaryStructure.conveyance}`],
      ["Medical Allowance", `INR ${salaryStructure.medical}`],
      ["Special Allowance", `INR ${salaryStructure.special}`],
      [
        { content: "Gross Earnings", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: `INR ${grossSalary}`, styles: { fontStyle: "bold", fillColor: [245, 245, 245] } }
      ]
    ];

    const deductions = [
      ["Deductions", "Amount"],
      ["Provident Fund (PF)", `INR ${salaryStructure.pf}`],
      ["Employee State Insurance (ESI)", `INR ${salaryStructure.esi}`],
      ["Professional Tax (PT)", `INR ${salaryStructure.pt}`],
      ["TDS (Income Tax)", `INR ${salaryStructure.tds}`],
      ["Other Deductions", `INR ${salaryStructure.others}`],
      [
        { content: "Total Deductions", styles: { fontStyle: "bold", fillColor: [245, 245, 245] } },
        { content: `INR ${totalDeductions}`, styles: { fontStyle: "bold", fillColor: [245, 245, 245] } }
      ]
    ];

    autoTable(doc, {
      startY: 65,
      head: [earnings[0]],
      body: earnings.slice(1),
      theme: "grid",
      headStyles: { fillColor: [41, 128, 185] },
      margin: { right: 105 }
    });

    autoTable(doc, {
      startY: 65,
      head: [deductions[0]],
      body: deductions.slice(1),
      theme: "grid",
      headStyles: { fillColor: [192, 57, 43] },
      margin: { left: 105 }
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFillColor(41, 128, 185);
    doc.rect(14, finalY, 182, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text(
      `NET PAYABLE AMOUNT: INR ${netSalary.toLocaleString()}`,
      105,
      finalY + 8,
      { align: "center" }
    );
    doc.save(`Payslip_${employeeName.replace(/\s+/g, "_")}.pdf`);
  };

  // Status badge helper
  const renderNameStatus = () => {
    if (nameStatus === "saving") return <small className="text-muted ms-2">Saving...</small>;
    if (nameStatus === "saved") return <small className="text-success ms-2">✔ Saved</small>;
    if (nameStatus === "error") return <small className="text-danger ms-2">✘ Error</small>;
    return null;
  };

  return (
    <div className="container-fluid mt-3 mt-md-4 pb-5 px-2 px-md-3">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between mb-4 align-items-start align-items-md-center gap-2">
        <h5 className="fw-bold text-dark mb-0">HR Management System</h5>
        <Button size="sm" variant="success" onClick={() => alert("Finalized!")}>
          Finalize Salary
        </Button>
      </div>

      {/* Summary Cards */}
      <Row className="mb-3 g-2">
        <Col xs={12} md={4}>
          <Card className="p-2 p-md-3 shadow-sm border-0 text-center">
            <h6 className="small">Gross Salary</h6>
            <h5 className="text-primary">₹{grossSalary.toLocaleString()}</h5>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="p-2 p-md-3 shadow-sm border-0 text-center">
            <h6 className="small">Total Deductions</h6>
            <h5 className="text-danger">₹{totalDeductions.toLocaleString()}</h5>
          </Card>
        </Col>
        <Col xs={12} md={4}>
          <Card className="p-2 p-md-3 shadow-sm border-0 bg-dark text-white text-center">
            <h6 className="small">Net Payable</h6>
            <h5>₹{netSalary.toLocaleString()}</h5>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        {/* Sidebar */}
        <Col xs={12} md={3}>
          <Card className="p-3 shadow-sm border-0">
            <h6 className="fw-bold mb-3 border-bottom pb-2">Edit Details</h6>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold">
                Employee Name {renderNameStatus()}
              </Form.Label>
              <Form.Control
                size="sm"
                value={employeeName}
                onChange={handleNameChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold">Bank Name</Form.Label>
              <Form.Control size="sm" value={bankDetails?.name || ""} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold">PF Number</Form.Label>
              <Form.Control size="sm" value={pfNumber} readOnly />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-bold">ESI Number</Form.Label>
              <Form.Control size="sm" value={esiNumber} readOnly />
            </Form.Group>
          </Card>

          <ListGroup className="mt-3">
            <ListGroup.Item
              action
              active={activeView === "overview"}
              onClick={() => setActiveView("overview")}
            >
              Structure
            </ListGroup.Item>
            <ListGroup.Item
              action
              active={activeView === "payslips"}
              onClick={() => setActiveView("payslips")}
            >
              Payslip
            </ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Content */}
        <Col xs={12} md={9}>
          {activeView === "overview" ? (
            <Card className="p-3 p-md-4 shadow-sm border-0">
              <h6 className="mb-3 fw-bold">
                Salary Components <Badge bg="primary">{employeeName}</Badge>
              </h6>

              <Table responsive hover size="sm">
                <tbody>
                  <tr><td>Bank Name</td><td>{bankDetails?.name || "N/A"}</td></tr>
                  <tr><td>Account No</td><td>{bankDetails?.account || "N/A"}</td></tr>
                  <tr><td>PF Number</td><td>{pfNumber || "N/A"}</td></tr>
                  <tr><td>ESI Number</td><td>{esiNumber || "N/A"}</td></tr>
                  <tr><td>Basic Salary</td><td>₹{salaryStructure.basic}</td></tr>
                  <tr className="text-danger"><td>PF</td><td>- ₹{salaryStructure.pf}</td></tr>
                  <tr className="text-danger"><td>ESI</td><td>- ₹{salaryStructure.esi}</td></tr>
                </tbody>
              </Table>
            </Card>
          ) : (
            <div className="bg-white p-3 p-md-4 shadow-sm rounded">

              <Card className="mb-3 border-0 bg-light p-3">
                <Row>
                  <Col xs={12} md={6}>
                    <p><strong>Name:</strong> {employeeName}</p>
                    <p><strong>Bank:</strong> {bankDetails?.name || "N/A"}</p>
                    <p><strong>A/C No:</strong> {bankDetails?.account || "N/A"}</p>
                  </Col>
                  <Col xs={12} md={6} className="text-md-end">
                    <p><strong>PF No:</strong> {pfNumber || "N/A"}</p>
                    <p><strong>ESI No:</strong> {esiNumber || "N/A"}</p>
                  </Col>
                </Row>
              </Card>

              <Table bordered size="sm" responsive>
                <thead>
                  <tr>
                    <th>Earnings</th><th>Amount</th>
                    <th>Deductions</th><th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Basic</td><td>₹{salaryStructure.basic}</td>
                    <td>PF</td><td>₹{salaryStructure.pf}</td>
                  </tr>
                  <tr>
                    <td>HRA</td><td>₹{salaryStructure.hra}</td>
                    <td>ESI</td><td>₹{salaryStructure.esi}</td>
                  </tr>
                  <tr>
                    <td>Conveyance Allowance</td><td>₹{salaryStructure.conveyance}</td>
                    <td>PT</td><td>₹{salaryStructure.pt}</td>
                  </tr>
                  <tr>
                    <td>Medical Allowance</td><td>₹{salaryStructure.medical}</td>
                    <td>TDS</td><td>₹{salaryStructure.tds}</td>
                  </tr>
                  <tr>
                    <td>Special Allowance</td><td>₹{salaryStructure.special}</td>
                    <td>Others</td><td>₹{salaryStructure.others}</td>
                  </tr>
                  <tr className="fw-bold">
                    <td>Total Gross</td><td>₹{grossSalary}</td>
                    <td>Total Deduction</td><td>₹{totalDeductions}</td>
                  </tr>
                </tbody>
              </Table>

              <div className="alert alert-info text-center fw-bold">
                Net Salary: ₹{netSalary.toLocaleString()}
              </div>

              <Button size="sm" variant="primary" className="w-100" onClick={handleDownloadPDF}>
                Download PDF
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PayrollManagement;