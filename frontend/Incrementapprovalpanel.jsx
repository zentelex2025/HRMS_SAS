import React, { useState, useEffect } from "react";
import {
  Container, Table, Button, Badge, Spinner, Row, Col, Card
} from "react-bootstrap";

const API = "http://localhost:5002/api";

// ─── Increment Approval Panel (Admin / HR Manager only) ───────────────────────
// এই page এ Manager দের পাঠানো increment request গুলো approve/reject করা যাবে।
// Approve হলে automatically employee এর salary update হবে এবং history save হবে।

const IncrementApprovalPanel = () => {
  const [requests, setRequests]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [processing, setProcessing] = useState(null); // currently processing id

  const approvedBy = localStorage.getItem("name") || "Admin";
  const currentRole = localStorage.getItem("role") || "admin";
  const isAdmin = currentRole === "admin";
  const isHR    = currentRole === "hrmanager";

  useEffect(() => {
    if (isAdmin || isHR) fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/increment/requests/pending`);
      const data = await res.json();
      if (data.success) setRequests(data.requests || []);
      else console.error(data.error);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAction = async (id, status) => {
    const label = status === 'Approved' ? 'Approve' : 'Reject';
if (!window.confirm(`Do you want to ${label} this increment request?`)) return;

    setProcessing(id);
    try {
      const res = await fetch(`${API}/increment/request/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, approved_by: approvedBy })
      });
      const data = await res.json();
      if (data.success) {
        if (status === 'Approved') {
          alert(`✅ Increment Approved!\nNew Salary: ₹${parseFloat(data.new_salary).toLocaleString('en-IN')}`);
        } else {
          alert("❌ Increment Rejected.");
        }
        fetchRequests(); // refresh list
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (e) {
      alert("❌ " + e.message);
    } finally {
      setProcessing(null);
    }
  };

  // Summary stats
  const totalPending     = requests.length;
  const totalNewSalary   = requests.reduce((sum, r) => sum + parseFloat(r.new_salary || 0), 0);
  const totalCurrentSal  = requests.reduce((sum, r) => sum + parseFloat(r.old_salary || 0), 0);
  const totalIncrement   = totalNewSalary - totalCurrentSal;

  // Access check — hooks এর পরে করতে হবে (Rules of Hooks)
  if (!isAdmin && !isHR) {
    return (
      <Container className="mt-5 text-center">
        <div className="p-5 border rounded bg-light">
          <div style={{ fontSize: 48 }}>🔒</div>
          <h5 className="mt-3 text-danger">Access Denied</h5>
<p className="text-muted">
  Only Admin and HR Manager can access this page.
</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="mt-4 mb-5">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">📈 Increment Approval Panel</h4>
       <p className="text-muted mb-0" style={{ fontSize: 13 }}>
  Approve or reject increment requests sent by managers.
  Once approved, the salary will be updated automatically.
</p>
        </div>
        <Button variant="outline-secondary" size="sm" onClick={fetchRequests} disabled={loading}>
          🔄 Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      {totalPending > 0 && (
        <Row className="g-3 mb-4">
          <Col md={4}>
            <Card className="border-0 bg-light text-center py-2">
              <Card.Body>
                <div className="text-muted" style={{ fontSize: 12 }}>Pending Requests</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{totalPending}</div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 bg-light text-center py-2">
              <Card.Body>
                <div className="text-muted" style={{ fontSize: 12 }}>Total Increment Amount</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#16a34a' }}>
                  +₹{totalIncrement.toLocaleString('en-IN')}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 bg-light text-center py-2">
              <Card.Body>
                <div className="text-muted" style={{ fontSize: 12 }}>Total New Salary (if all approved)</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#1e40af' }}>
                  ₹{totalNewSalary.toLocaleString('en-IN')}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-5 border rounded bg-light">
          <div style={{ fontSize: 48 }}>✅</div>
          <h5 className="mt-3 text-success">All Clear!</h5>
<p className="text-muted">
  No pending increment requests found.
</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table bordered hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Employee</th>
                <th>Department</th>
                <th>Current Salary</th>
                <th>Increment</th>
                <th>New Salary</th>
                <th>Remarks</th>
                <th>Requested By</th>
                <th>Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r, idx) => {
                const diff = parseFloat(r.new_salary) - parseFloat(r.old_salary);
                const isProcessing = processing === r.id;
                return (
                  <tr key={r.id}>
                    <td><small className="text-muted">{idx + 1}</small></td>
                    <td>
                      <div className="fw-bold">{r.name}</div>
                      <small className="text-muted">{r.employee_code}</small>
                    </td>
                    <td>
                      <small>{r.dept || "—"}</small>
                      {r.designation && <><br /><small className="text-muted">{r.designation}</small></>}
                    </td>
                    <td>
                      <span style={{ fontWeight: 500 }}>
                        ₹{parseFloat(r.old_salary).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <Badge bg="warning" text="dark" style={{ fontSize: 13 }}>
                        {r.increment_type === 'percent'
                          ? `${parseFloat(r.increment_value)}%`
                          : `₹${parseFloat(r.increment_value).toLocaleString('en-IN')}`
                        }
                      </Badge>
                      <br />
                      <small className="text-success">+₹{diff.toLocaleString('en-IN')}</small>
                    </td>
                    <td>
                      <span className="fw-bold text-success" style={{ fontSize: 15 }}>
                        ₹{parseFloat(r.new_salary).toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">{r.remarks || "—"}</small>
                    </td>
                    <td>
                      <small>{r.requested_by}</small>
                    </td>
                    <td>
                      <small className="text-muted">
                        {new Date(r.created_at).toLocaleDateString('en-IN', {
                          day: '2-digit', month: 'short', year: 'numeric'
                        })}
                      </small>
                    </td>
                    <td>
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          size="sm"
                          variant="success"
                          onClick={() => handleAction(r.id, 'Approved')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Spinner size="sm" /> : "✅ Approve"}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleAction(r.id, 'Rejected')}
                          disabled={isProcessing}
                        >
                          {isProcessing ? <Spinner size="sm" /> : "❌ Reject"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </Container>
  );
};

export default IncrementApprovalPanel;