const express = require("express");
require("./db/config");
const User = require("./db/Users");
const Attendance = require("./db/Attendence");
const Student = require("./db/Student");
const Batch = require("./db/Batch");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // For loading environment variables
const nodemailer = require("nodemailer");

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "ams.radiantitservice@gmail.com",
    pass: "yvse mypp aosd fgql",
  },
});

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// signup.....................................

// app.post("/signup", async (req, resp) => {
//   try {
//     let user = new User(req.body);
//     let result = await user.save();
//     result = result.toObject();
//     delete result.password;

//     // Prepare the email options
//     const mailOptions = {
//       from: "ams.radiantitservice@gmail.com",
//       to: user.email,
//       subject: "Your Attendance Portal Login Details",
//       text: `Hello ${user.name},\n\nWelcome to the Student Attendance Portal. Below are your login credentials:\n\nEmail: ${user.email}\nPassword: ${req.body.password}\nBatch: ${req.body.batch}\nStudent ID: ${req.body.id}\n\nIt's crucial to keep this information confidential. Do not share your credentials with anyone. They are for your personal use only.\n\nIf you have any questions or concerns, please don't hesitate to reach out.\n\nBest regards,\nAdmin Department,\nRADIANT IT SERVICES PVT. LTD.`,
//     };

//     // Send the email
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error);
//       } else {
//         console.log("Email sent:", info.response);
//       }
//     });

//     // Send the response to the client
//     resp.status(201).send(result);
//   } catch (error) {
//     console.error("Error during signup:", error);
//     resp.status(500).send({ status: "error", message: error.message });
//   }
// });

// Signup Endpoint
app.post("/signup", async (req, resp) => {
  const { name, email, password, role, id, batch, dob } = req.body;

  try {
    // Check if user with the same email or ID already exists
    const existingUser = await User.findOne({ $or: [{ email }, { id }] });
    if (existingUser) {
      return resp.status(400).json({
        success: false,
        message: `User with email ${email} or ID ${id} already exists. Please use different credentials.`,
      });
    }

    // Create new user
    const user = new User({ name, email, password, role, id, batch, dob });
    let result = await user.save();
    result = result.toObject();
    delete result.password;

    // Prepare the email options
    const mailOptions = {
      from: "ams.radiantitservice@gmail.com",
      to: email,
      subject: "Your Attendance Portal Login Details",
      text: `Hello ${name},\n\nWelcome to the Student Attendance Portal. Below are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\nBatch: ${batch}\nStudent ID: ${id}\n\nIt's crucial to keep this information confidential. Do not share your credentials with anyone. They are for your personal use only.\n\nIf you have any questions or concerns, please don't hesitate to reach out.\n\nBest regards,\nAdmin Department,\nRADIANT IT SERVICES PVT. LTD.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).json({
          success: false,
          message: "User created but failed to send email.",
          error: error.message,
        });
      } else {
        console.log("Email sent:", info.response);
        return resp.status(201).json({
          success: true,
          message: "User registered successfully and email sent!",
          data: result,
        });
      }
    });
  } catch (error) {
    console.error("Error during signup:", error);
    return resp.status(500).json({
      success: false,
      message: "An error occurred during signup.",
      error: error.message,
    });
  }
});


// login........................................
app.post("/login", async (req, resp) => {
  console.log(req.body);
  if (req.body.email && req.body.password && req.body.role) {
    let user = await User.findOne(req.body).select("-password");
    resp.send(user);
  } else {
    resp.send({ result: "Invalid Credentials" });
  }
});

// users..........................................
app.get("/user", async (req, resp) => {
  let user = await User.find();
  resp.send(user);
});

app.get("/lms/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }); // Fetch user by email

    if (!user) {
      return res.status(404).send("User not found");
    }

    const userCourse = user.course; // Fetch the course from user profile
    let url;

    switch (userCourse) {
      case "Full Stack Java Development":
        url = "https://classroom.google.com/u/1/";
        break;
      case "Data Science":
        url = "https://classroom.google.com/u/1/h";
        break;
      case "Web Development":
      case "Power BI":
      case "Salesforce":
      case "Digital Marketing":
      case "UI/UX Design":
        url = "https://classroom.google.com";
        break;
      default:
        return res.status(400).send("Invalid course");
    }

    res.status(200).json({ url });
  } catch (error) {
    console.error("Error retrieving LMS URL:", error);
    res.status(500).send("Server error");
  }
});

// Profile endpoint to get user details by email
// Backend (Express example)
app.get("/api/profile/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});
// add student.................................
// app.post("/students", async (req, resp) => {
//   let student = new Student(req.body);
//   let result = await student.save();
//   resp.send(result);
// });
// Existing imports and configurations remain the same

// Add Student Endpoint
app.post("/students", async (req, resp) => {
  const { id, name, batch } = req.body;

  try {
    // Check if student with the same ID already exists
    const existingStudent = await Student.findOne({ id });
    if (existingStudent) {
      return resp.status(400).json({
        success: false,
        message: `Student with ID ${id} already exists. Please use a different ID.`,
      });
    }

    // Create new student
    const student = new Student({ id, name, batch });
    const result = await student.save();

    return resp.status(201).json({
      success: true,
      message: "Student added successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    return resp.status(500).json({
      success: false,
      message: "An error occurred while adding the student.",
      error: error.message,
    });
  }
});


// update student..................................................
app.get("/update-student/:id", async (req, resp) => {
  let result = await User.findOne({ id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No product found!" });
  }
});

app.put("/update-user-student/:id", async (req, resp) => {
  try {
    let result = await User.updateOne(
      { id: req.params.id },
      { $set: req.body }
    );

// Prepare the email options
    const mailOptions = {
      from: "ams.radiantitservice@gmail.com",
      to: req.body.email,
      subject: "Your Attendance Portal Login Details",
      text: `Hello ${req.body.name},\n\nWelcome to the Student Attendance Portal. Below are your login credentials:\n\nEmail: ${req.body.email}\nPassword: ${req.body.password}\nBatch: ${req.body.batch}\nStudent ID: ${req.body.id}\n\nIt's crucial to keep this information confidential. Do not share your credentials with anyone. They are for your personal use only.\n\nIf you have any questions or concerns, please don't hesitate to reach out.\n\nBest regards,\nAdmin Department,\nRADIANT IT SERVICES PVT. LTD.`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return resp.status(500).send({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        return resp.status(201).send(result);
      }
    });

  } catch (err) {
    console.error(err);
    resp.status(500).send({ error: "Failed to update user" });
  }
});

app.put("/update-student/:id",  async (req, resp) => {
  let result = await Student.updateOne(
    { id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

// delete student.................................
// delete student from student data
app.delete("/delete-student/:id", async (req, resp) => {
  let result = await Student.deleteOne({ id: req.params.id });
  resp.send(result);
});

// delete student from users data
app.delete("/delete-user/:id", async (req, resp) => {
  let result = await User.deleteOne({ id: req.params.id });
  resp.send(result);
});

// Add batch......................................
// post
app.post("/batch", async (req, resp) => {
  let batch = new Batch(req.body);
  let result = await batch.save();
  resp.send(result);
});

// get  
app.get("/batch", async (req, resp) => {
  let batch = await Batch.find();
  resp.send(batch);
});


// update batch..................................................
app.get("/update-batch/:id", async (req, resp) => {
  let result = await Batch.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result);
  } else {
    resp.send({ result: "No product found!" });
  }
});

app.put("/update-batch/:id",  async (req, resp) => {
  let result = await Batch.updateOne(
    { _id: req.params.id },
    { $set: req.body }
  );
  resp.send(result);
});

// mark attendence..............................
// Fetch students
app.get("/students", async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Fetch attendance
app.get("/attendance", async (req, res) => {
  try {
    const attendance = await Attendance.find();
    res.send(attendance);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update attendance
app.put("/attendance", async (req, res) => {
  const { date, batch, records } = req.body;

  try {
    let attendance = await Attendance.findOne({ date });
    if (!attendance) {
      attendance = new Attendance({
        date,
        batches: [{ batchName: batch, records }],
      });
    } else {
      const batchIndex = attendance.batches.findIndex(
        (b) => b.batchName === batch
      );
      if (batchIndex === -1) {
        attendance.batches.push({ batchName: batch, records });
      } else {
        const existingBatch = attendance.batches[batchIndex];
        existingBatch.records = [
          ...existingBatch.records,
          ...records.filter(
            (record) =>
              !existingBatch.records.some(
                (existingRecord) =>
                  existingRecord.studentId === record.studentId
              )
          ),
        ];
      }
    }

    await attendance.save();
    res.send({ message: "Attendance updated successfully!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Post attendance
app.post("/attendance", async (req, res) => {
  const { attendances } = req.body;

  try {
    for (const { date, batches } of attendances) {
      let attendance = await Attendance.findOne({ date });
      if (!attendance) {
        attendance = new Attendance({ date, batches });
      } else {
        for (const { batchName, records } of batches) {
          const batchIndex = attendance.batches.findIndex(
            (b) => b.batchName === batchName
          );
          if (batchIndex === -1) {
            attendance.batches.push({ batchName, records });
          } else {
            attendance.batches[batchIndex].records = [
              ...attendance.batches[batchIndex].records,
              ...records.filter(
                (record) =>
                  !attendance.batches[batchIndex].records.some(
                    (existingRecord) =>
                      existingRecord.studentId === record.studentId
                  )
              ),
            ];
          }
        }
      }
      await attendance.save();
    }
    res.send({ message: "Attendance inserted successfully!" });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// student attendance...................................
// Fetch a student by ID
app.get("/student-attend/:studentId", async (req, res) => {
  try {
    const student = await Student.findOne({ id: req.params.studentId });
    if (!student) {
      return res.status(404).send({ message: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// Fetch student attendance details by student ID and date
app.get("/stud-attendance/:studentId/:date", async (req, res) => {
  const { studentId, date } = req.params;

  try {
    const student = await Student.findOne({ id: studentId });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const attendance = await Attendance.findOne({ date });

    if (attendance) {
      const batchAttendance = attendance.batches.find(
        (batch) => batch.batchName === student.batch
      );

      if (batchAttendance) {
        const attendanceRecord = batchAttendance.records.find(
          (record) => record.studentId === studentId
        );

        if (attendanceRecord) {
          return res.json({
            ...student.toObject(),
            status: attendanceRecord.status,
          });
        }
      }
    }

    res.status(404).json({
      message:
        "No attendance record found for the given date and student batch.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// batch attendance.................................................
app.get("/attendance-summary/:month/:batch", async (req, res) => {
  const { month, batch } = req.params;

  try {
    const attendanceData = await Attendance.find().lean();
    const students = await Student.find({ batch }).lean();

    const monthAttendance = attendanceData
      .filter((attendance) => attendance.date.startsWith(month))
      .map(
        (attendance) =>
          attendance.batches.find((b) => b.batchName === batch)?.records || []
      )
      .flat();

    const attendanceWithDetails = students.map((student) => {
      const studentAttendance = monthAttendance.filter(
        (att) => att.studentId === student.id
      );
      const presentCount = studentAttendance.filter(
        (att) => att.status === "Present"
      ).length;
      const absentCount = studentAttendance.filter(
        (att) => att.status === "Absent"
      ).length;
      return {
        ...student,
        presentCount,
        absentCount,
      };
    });

    res.json(attendanceWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// student monthly report..............................................
// Fetch student by ID and validate batch
app.get("/student-report/:id/:batch", async (req, res) => {
  const { id, batch } = req.params;

  try {
    const student = await Student.findOne({ id: id });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (student.batch !== batch) {
      return res
        .status(400)
        .json({ message: "Student does not belong to the specified batch." });
    }

    res.json(student);
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Error fetching student data." });
  }
});

// Fetch attendance for a batch, student ID, and month
app.get("/attendance-report/:batch/:id/:month", async (req, res) => {
  const { batch, id, month } = req.params;

  try {
    const attendance = await Attendance.find();
    const filteredAttendance = [];
    let presentCount = 0;
    let absentCount = 0;

    attendance.forEach((record) => {
      if (record.date.startsWith(month) && record.batches) {
        const batchAttendance = record.batches.find(
          (b) => b.batchName === batch
        );
        if (batchAttendance) {
          const studentAttendance = batchAttendance.records.find(
            (att) => att.studentId === id
          );
          if (studentAttendance) {
            filteredAttendance.push({
              date: record.date,
              status: studentAttendance.status,
            });
            if (studentAttendance.status === "Present") presentCount++;
            if (studentAttendance.status === "Absent") absentCount++;
          }
        }
      }
    });

    res.json({
      attendanceData: filteredAttendance,
      totalAttendance: { present: presentCount, absent: absentCount },
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status  (500).json({ message: "Error fetching attendance data." });
  }
});

// app.get("/", (req, res)=>{
//   app.use(express.static(path.resolve(__dirname, "ams", "build")));
//   res.sendFile(path.resolve(__dirname, "ams", "build", "index.html"));
// });

app.use(express.static(path.resolve(__dirname, "ams", "build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "ams", "build", "index.html"));
});



const port = process.env.PORT || 5002;
app.listen(port, () => {
    console.log(Server running on port ${port});
});

