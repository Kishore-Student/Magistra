import bcrypt from "bcryptjs";
import generateToken from "../config/token";
import Teacher from "../models/teacher";

// Register a new teacher
export const registerTeacher = async (req, res) => {
    const { name, email, password, class: teacherClass, role } = req.body;
    try {
        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return res.status(400).json({ message: "Teacher already exists" });
        }
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new teacher
        const newTeacher = new Teacher({    
            name,
            email,
            password: hashedPassword,
            class: teacherClass,
            role
        });
        await newTeacher.save();
        // Generate token        const token = await generateToken(newTeacher._id);
        res.status(201).json({ token });
    } catch (error) {
        console.log("Error registering teacher", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Login a teacher
export const loginTeacher = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Find teacher by email
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Compare password        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        // Generate token
        const token = await generateToken(teacher._id);
        res.status(200).json({ token });
    } catch (error) {
        console.log("Error logging in teacher", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const logOutTeacher = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error logging out teacher", error);
        res.status(500).json({ message: "Server error" });
    }
};