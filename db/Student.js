const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
  id: String,
  name: String,
  batch: String,
  course: String,
},{ collection: 'students' });
module.exports = mongoose.model('students', studentSchema);

