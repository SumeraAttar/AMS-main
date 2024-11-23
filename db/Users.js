const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
    role:String,
    course: String,
    id: { type: String, default: "" },
    batch: { type: String, default: "" },
    dob: { type: String, default: "" }
});
module.exports = mongoose.model("users", userSchema);
