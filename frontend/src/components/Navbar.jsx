import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../images/Zentelex2.png";

const AppNavbar = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState(localStorage.getItem("role"));
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeId");

    setRole(null);
    setIsLoggedIn(false);

    navigate("/login");
  };

  useEffect(() => {
    const checkLogin = () => {
      setRole(localStorage.getItem("role"));
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    const interval = setInterval(checkLogin, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="py-2">
      <Container fluid className="px-19">
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <img
            src={logo}
            alt="Zentelex"
            style={{
              height: "95px",
              width: "auto",
              objectFit: "contain",
              transform: "none"
            }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar" />
        <Navbar.Collapse id="main-navbar">
          <Nav className="me-auto">
            {role === "employee" && (
              <>
                <Nav.Link as={Link} to="/attendance">
                  Attendance
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/dashboard">
                  Dashboard
                </Nav.Link>
              </>
            )}

            {role === "admin" && (
              <>
                {/* <Nav.Link as={Link} to="/employee-form">
                  Add Employee
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/admin/attendance">
                  Attendance
                </Nav.Link>
                <Nav.Link as={Link} to="/employee/Payroll">
                  Payroll
                </Nav.Link> */}
              </>
            )}
          </Nav>

          <Nav>
            {isLoggedIn ? (
              <Button variant="light" style={{ border: "none" }} onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button variant="light" style={{ border: "none" }} as={Link} to="/manage-employee">
                Login
              </Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar; 