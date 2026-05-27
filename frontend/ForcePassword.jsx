import React, { useState } from "react";
import { Container, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ForceChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // LocalStorage theke logged-in user info nichhi
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match!");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }

    try {
      const res = await fetch(`http://localhost:5002/api/employees/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employee_id: user?.employee_id,
          password: newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Password updated successfully! Please login again with your new password.");
        localStorage.clear(); // Session clear kore login-e pathachhi
        navigate("/Login");
      } else {
        setError(data.message || "Failed to update password.");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Card style={{ width: "400px" }} className="p-4 shadow border-danger">
        <Card.Body>
          <h4 className="text-center text-danger mb-3">Security Update</h4>
          <p className="text-center text-muted small">
            You are logging in for the first time or your password was reset. Please set a new password.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            <Button variant="danger" type="submit" className="w-100">
              Update & Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ForceChangePassword;