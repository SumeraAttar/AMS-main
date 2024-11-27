const mongoose = require("mongoose");

// Define the schema for the students collection
const studentSchema = new mongoose.Schema({
  id: { type: String, required: true },  // Ensure id is required
  name: { type: String, required: true }, // Ensure name is required
  batch: { type: String, required: true }, // Ensure batch is required
  course: { type: String, required: true }, // New field for course
}, { collection: 'students' });

// Export the model
module.exports = mongoose.model('students', studentSchema);
