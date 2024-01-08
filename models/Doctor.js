const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  memberShipCode: String,
  connectedHospitalId: String,
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  qualification: { type: String, required: true },
  license: { type: String, required: true },
  phoneNumber: { type: String },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
