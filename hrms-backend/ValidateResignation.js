const validateResignation = (req, res, next) => {
  const { name, designation, department, joiningDate, lastDate, reason } = req.body;
  if (!name || !designation || !department || !joiningDate || !lastDate || !reason) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  next(); // if block এর বাইরে আনা হয়েছে
};

module.exports = { validateResignation }; // if block এর বাইরে আনা হয়েছে