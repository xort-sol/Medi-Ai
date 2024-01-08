const mongoose = require("mongoose");

const ambulanceSchema = new mongoose.Schema({
  memberShipNo: String,
  registrationNumber: { type: String, required: true, unique: true },
  status: {
    type: String,
    enum: ["Available", "Busy", "Out of Service"],
    default: "Available",
  },
});

const Ambulance = mongoose.model("Ambulance", ambulanceSchema);

module.exports = Ambulance;
