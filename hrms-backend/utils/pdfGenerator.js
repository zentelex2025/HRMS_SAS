// utils/pdfGenerator.js
const PDFDocument = require("pdfkit");

function generateAssessmentPDF(assessments, res) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=assessments.pdf");
  doc.pipe(res);

  // Title
  doc.fontSize(20).font("Helvetica-Bold")
    .text("Interview Assessment Report", { align: "center" });
  doc.fontSize(10).font("Helvetica").fillColor("#555555")
    .text(`Generated: ${new Date().toLocaleString()}`, { align: "center" });
  doc.moveDown(1.5);

  if (!assessments || assessments.length === 0) {
    doc.fontSize(12).fillColor("red").text("No assessment data found.");
    doc.end();
    return;
  }

  assessments.forEach((item, index) => {
    if (doc.y > 700) doc.addPage();

    // ✅ Blue background bar — full width, text inside
    const barY = doc.y;
    const barHeight = 24;
    const pageWidth = doc.page.width; // A4 = 595.28
    const margin = 30;

    // Blue rectangle — full width
    doc
      .rect(margin, barY, pageWidth - margin * 2, barHeight)
      .fill("#1a73e8");

    // White text inside the blue bar
    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("white")
      .text(
        `${index + 1}. ${item.candidate_name || item.name || "N/A"}`,
        margin + 10,        // left padding inside bar
        barY + 5,           // vertical center inside bar
        { width: pageWidth - margin * 2 - 20 }
      );

    // Move down after the bar
    doc.moveDown(0.8);

    // ✅ Fields
    const fields = [
      ["Applied For",      item.applied_role     || item.appliedRole],
      ["Job Role",         item.job_role          || item.jobRole],
      ["Qualification",    item.qualification],
      ["Interview Date",   (item.interview_date || item.iDate)
                             ? new Date(item.interview_date || item.iDate).toDateString()
                             : null],
      ["Interview Time",   item.interview_time    || item.iTime],
      ["HR Interviewer",   item.hr_name           || item.hrName],
      ["HR Designation",   item.hr_designation    || item.hrDesignation],
      ["HOD Name",         item.hod_name          || item.hodName],
      ["HOD Designation",  item.hod_designation   || item.hodDesignation],
      ["HOD Department",   item.hod_department    || item.hodDepartment],
      ["Expected Salary",  item.expected_salary   || item.expectedSalary],
      ["Final Salary",     item.final_salary      || item.finalSalary],
      ["Overall Grade",    item.overall_grade     || item.overallGrade],
      ["Verdict / Status", item.verdict],
      ["HR Comments",      item.hr_comments       || item.hrComments],
    ];

    fields.forEach(([label, value]) => {
      const display = value != null && value !== "" ? String(value) : "—";
      doc.fontSize(10)
        .font("Helvetica-Bold").fillColor("#333333")
        .text(`${label}: `, 40, doc.y, { continued: true })
        .font("Helvetica").fillColor("#555555")
        .text(display);
    });

    // Divider
    doc.moveDown(0.8);
    doc.moveTo(margin, doc.y).lineTo(pageWidth - margin, doc.y).strokeColor("#cccccc").stroke();
    doc.moveDown(1);
  });

  doc.fontSize(9).fillColor("#aaaaaa").text("— End of Report —", { align: "center" });
  doc.end();
}

module.exports = { generateAssessmentPDF };