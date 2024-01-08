const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  memberShipCode: String,
  generalInfo: {
    name: { type: String, required: true },
    phoneNumber: { type: String },
    location: { type: String },
    email: { type: String },
    country: { type: String },
    address: { type: String },
    city: { type: String },
    postalCode: { type: String },
    currency: { type: String },
    websiteUrl: { type: String },
  },
  uploadLogo: { type: String }, // Assuming you want to store the logo as a Buffer
  workingHours: [
    {
      day: { type: String, required: true },
      isOpen: { type: Boolean, required: true },
      openTime: { type: String },
      closeTime: { type: String },
    },
  ],
  availableDoctors: [
    {
      type: String
    }
  ],

  // list of strings
  availablePatients: [{ type: String }],
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
