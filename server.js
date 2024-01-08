const express = require("express");
const mongoose = require("mongoose");
const nodemon = require("nodemon");

const adminRoute = require("./routes/admin");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/userProfile");
const userProfile = require("./routes/userProfile");
const patientProile = require("./routes/patient");
const hospitalRoute = require("./routes/hospital");
const doctorRoute = require("./routes/doctor");

const cors = require("cors");
require("dotenv").config();

const app = express();

mongoose.connect(`mongodb://localhost:27017/MediAi`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("DB Connection Successfull");
});

app.use(express.json());

app.use(cors());

app.use("/", authRoute);
app.use("/", userProfile);
app.use("/admin", adminRoute);
app.use("/profile", profileRoute);
app.use("/patient", patientProile);
app.use("/hospital", hospitalRoute);
app.use("/doctor",doctorRoute);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(process.env.PORT, () =>
  console.log(`App listening on port ${process.env.PORT}!`)
);
