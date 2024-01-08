const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  memberShipCode: String,
  personalDetails: {
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    gender: String,
    country: String,
    address: String,
    bloodType: String,
    city: String,
    postalCode: String,
    passportNumber: String,
    height: String,
    weight: String,
  },
  travelDetails: {
    travelReason: String,
    dateOfTravel: Date,
    travelLocation: String,
  },
  medicalHistory: {
    medicalCondition: String,
    sicknessHistory: [String],
    surgicalHistory: String,
    allergy: String,
    medication: String,
    medicationTypes: [String],
    customInputMedications: [String],
  },
  vaccineHistory: {
    hasReceivedCovidVaccine: String,
    dosesReceived: String,
    timeSinceLastVaccination: String,
    immunizationHistory: [
      {
        vaccines: String,
        dateOfVaccine: Date,
      },
    ],
  },
  emergencyContacts: [
    {
      nameOfEmergencyContact: String,
      phoneNumber: String,
      relationship: String,
      email: String,
      mediaId: String,
    },
  ],
  lifestyleFactors: {
    smokingHabits: String,
    alcoholConsumptions: String,
    physicalActivityLevel: String,
    preferences: String,
  },
  BrifNotes:String,
  // uploadDocuments: [String], // Assuming document paths or URLs are stored as strings
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
