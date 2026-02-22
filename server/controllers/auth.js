import bcrypt from "bcryptjs";
import generateToken from "../config/token.js";
import Teacher from "../models/teacher.js";

// REGISTER
export const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, classAssigned, role } = req.body;

    if (!name || !email || !password || !classAssigned || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      classAssigned,
      role
    });

    await newTeacher.save();

    const token = generateToken(newTeacher._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax"
      })
      .status(201)
      .json({
        message: "Registered successfully",
        teacher: {
          id: newTeacher._id,
          name: newTeacher.name,
          role: newTeacher.role
        }
      });
  } catch (error) {
    console.log("Error registering teacher", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Normalize email
    const teacher = await Teacher.findOne({ email: email.toLowerCase() });
    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = generateToken(teacher._id);

    // Set cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production"
      })
      .status(200)
      .json({
        message: "Login successful",
        teacher: {
          id: teacher._id,
          name: teacher.name,
          role: teacher.role
        }
      });

  } catch (error) {
    console.log("Error logging in teacher", error);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
export const logOutTeacher = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};