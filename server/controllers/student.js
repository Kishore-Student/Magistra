import Student from "../models/student.js";

export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    console.log("Error fetching students", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (error) {
    console.log("Error fetching student", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addStudent = async (req, res) => {
  const { name, marks, class: studentClass } = req.body;
  try {
    const newStudent = new Student({
      name,
      marks,
      class: studentClass,
    });
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.log("Error adding student", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateMarks = async (req, res) => {
  const { id } = req.params;
  const { marks } = req.body;
  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    student.marks = marks;
    await student.save();
    res.status(200).json(student);
  } catch (error) {
    console.log("Error updating marks", error);
    res.status(500).json({ message: "Server error" });
  }
};
