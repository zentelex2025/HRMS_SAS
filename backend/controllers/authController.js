import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, role, employeeId } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role,
      employeeId,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body; // ⬅ get role sent from frontend

    // 1️⃣ Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // 2️⃣ Validate password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid password" });

    // 3️⃣ Compare role
    if (role !== user.role) {
      return res.status(400).json({
        message: `Role mismatch! You are registered as '${user.role}'.`,
      });
    }

    // 4️⃣ Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      userId: user._id,
      employeeId: user.employeeId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

