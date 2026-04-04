const express  = require("express");
const mongoose = require("mongoose");
const cons = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect("mongodb:??127.0.0.1:2701/distraction_blocker")
.then(()=> console.log("MONGO DB CONNECTED"));
app.use("/tasks", require("./routes/taskRoutes"));

app.listen(5000,()=> console.log("Server running on port 5000"));
