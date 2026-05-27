const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Transporter (secure config)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Check connection
transporter.verify((err, success) => {
  if (err) {
    console.log("❌ Mail Error:", err.message);
  } else {
    console.log("✅ Email server ready");
  }
});

// ✅ Send HR Email
const sendHrEmail = async ({
  hrEmail,
  hrName,
  department,
  recruitmentId,
  designations = [],
  dateOfHiring,
  jobRole
}) => {
  try {

    const desigList = designations.map(d =>
      `<li><strong>${d.title}</strong> — Min. Qual: ${d.minQual || 'N/A'} | Salary: ₹${Number(d.salary || 0).toLocaleString('en-IN')}/mo</li>`
    ).join('');

    const mailOptions = {
      from: `"Recruitment System" <${process.env.EMAIL_USER}>`,
      to: hrEmail,
      subject: `🎯 HR Access Granted — Recruitment #${recruitmentId}`,
      html: `
        <div style="font-family:Arial; padding:20px">
          <h2>🎯 HR Access Granted</h2>
          <p>Dear <b>${hrName}</b>,</p>
          <p>You have been assigned to recruitment process.</p>

          <p><b>Department:</b> ${department}</p>
          <p><b>Job Role:</b> ${jobRole}</p>
          <p><b>Date of Hiring:</b> ${dateOfHiring}</p>

          ${desigList ? `<ul>${desigList}</ul>` : ''}

          <br/>
          <a href="http://localhost:3000">Open Dashboard</a>

          <p style="margin-top:20px; font-size:12px; color:gray">
            Auto generated email
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email Sent:", info.response);

    return { success: true };

  } catch (err) {
    console.error("❌ Send Mail Error:", err.message);
    return { success: false, message: err.message };
  }
};

module.exports = sendHrEmail;