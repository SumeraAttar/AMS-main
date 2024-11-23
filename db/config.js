const mongoose = require("mongoose");
mongoose.connect(
  "mongodb+srv://Sumera:12345@cluster0.viuy4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    serverSelectionTimeoutMS: 50000, // 30 seconds
    socketTimeoutMS: 45000, // 45 seconds
  }
);
