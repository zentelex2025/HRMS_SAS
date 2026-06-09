import React from "react";
import "./heroFirst.scss";
import heroImage from "../../../shared/assets/images/heroFirst.png";

const HeroFirst = () => {
  return (
    <section className="hero-page-1">
      <div className="container hero-content">
        <div className="hero-left">
          <h1>HRMS Management System</h1>

          <p>
            Streamline employee management, leave tracking, payroll, and
            attendance with an all-in-one HRMS platform.
          </p>

          <div className="hero-buttons">
            <button className="btn-primary">Get Started</button>

            <button className="btn-secondary">Register Now</button>
          </div>
        </div>

        <div className="hero-right">
          <img src={heroImage} alt="HRMS Team" />
        </div>
      </div>
    </section>
  );
};

export default HeroFirst;
