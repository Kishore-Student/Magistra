import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        default: 0
    }
});

const Student = mongoose.model("Student", studentSchema);
export default Student;