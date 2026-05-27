// controllers/assessmentController.js
// Controller — receives req, calls Model, sends res

const path       = require("path");
const fs         = require("fs");
const Assessment = require("../Models/Assessment");
const { formatRow, flattenGrades } = require("../helpers/formatters");
const { UPLOADS_DIR }              = require("../middlewares/upload9");

const assessmentController = {

  // GET /api/assessments
  async getAll(req, res) {
    try {
      const rows = await Assessment.findAll();
      res.json(rows.map(formatRow));
    } catch (err) {
      console.error("getAll error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/assessments/:id
  async getOne(req, res) {
    try {
      const row = await Assessment.findById(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(formatRow(row));
    } catch (err) {
      console.error("getOne error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/assessments
  async create(req, res) {
    try {
      const b    = req.body;
      const flat = flattenGrades(b.roundGrades || [], b.roundComments || []);
      const insertId = await Assessment.create({ ...b, ...flat });
      res.json({ id: insertId, success: true });
    } catch (err) {
      console.error("create error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // POST /api/upload-offer-letter
  async uploadOfferLetter(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });

      res.json({
        success:      true,
        filePath:     req.file.filename,
        originalName: req.file.originalname,
        size:         req.file.size,
      });
    } catch (err) {
      console.error("uploadOfferLetter error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // PATCH /api/assessments/:id/offer-letter
  async updateOfferLetter(req, res) {
    try {
      if (!req.file)
        return res.status(400).json({ error: "No file uploaded" });

      // Delete old file if exists
      const oldPath = await Assessment.getOfferLetterPath(req.params.id);
      if (oldPath) {
        const fullPath = path.join(UPLOADS_DIR, oldPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      await Assessment.updateOfferLetter(req.params.id, req.file.filename);
      res.json({ success: true, filePath: req.file.filename });
    } catch (err) {
      console.error("updateOfferLetter error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // PATCH /api/assessments/:id/verdict
  async updateVerdict(req, res) {
    try {
      const { verdict } = req.body;
      if (!verdict)
        return res.status(400).json({ error: "verdict is required" });

      await Assessment.updateVerdict(req.params.id, verdict);
      res.json({ success: true, verdict });
    } catch (err) {
      console.error("updateVerdict error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // DELETE /api/assessments/:id
  async remove(req, res) {
    try {
      // Delete offer letter file first
      const oldPath = await Assessment.getOfferLetterPath(req.params.id);
      if (oldPath) {
        const fullPath = path.join(UPLOADS_DIR, oldPath);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      }

      await Assessment.delete(req.params.id);
      res.json({ success: true });
    } catch (err) {
      console.error("remove error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/assessments/:id/hr-view
  async hrView(req, res) {
    try {
      const row = await Assessment.findHRView(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err) {
      console.error("hrView error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/assessments/:id/hod-view
  async hodView(req, res) {
    try {
      const row = await Assessment.findHODView(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err) {
      console.error("hodView error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },

  // GET /api/stats
  async stats(req, res) {
    try {
      const data = await Assessment.getStats();
      res.json(data);
    } catch (err) {
      console.error("stats error:", err.message);
      res.status(500).json({ error: err.message });
    }
  },
};

module.exports = assessmentController;