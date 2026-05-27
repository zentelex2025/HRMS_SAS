import React, { useState } from "react";
import { Form, Button, Card, Container, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

/**
 * @param {Function} onLogin - প্যারেন্ট থেকে আসা ফাংশন যা লগইন লজিক হ্যান্ডেল করবে
 * @param {Boolean} loading - লগইন প্রসেস চলাকালীন বাটনের স্টেট কন্ট্রোল করবে
 */
const Login = ({ onLogin, loading }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "employee", // default role
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // ফর্ম ডেটা প্যারেন্ট ফাংশনে পাঠিয়ে দিচ্ছে
    onLogin(formData);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <Card className="shadow-lg border-0" style={{ width: "400px", padding: "30px", borderRadius: "15px" }}>
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">Welcome Back</h3>
          <p className="text-muted small">Please enter your details to login</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="name@company.com"
              onChange={handleChange}
              value={formData.email}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="••••••••"
              onChange={handleChange}
              value={formData.password}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold">Login As</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </Form.Select>
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mt-4 py-2 fw-bold" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </Form>

        <div className="text-center mt-4">
          <span className="text-muted">Don't have an account? </span>
          <Link to="/register" className="text-decoration-none fw-bold">
            Register
          </Link>
        </div>
      </Card>
    </Container>
  );
};

export default Login;