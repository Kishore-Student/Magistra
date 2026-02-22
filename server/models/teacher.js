import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    classAssigned: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["Teacher", "Administrator"],
        required: true
    }
}, { timestamps: true });

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;