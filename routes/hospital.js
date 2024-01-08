const express = require("express");
const router = express.Router();
const Hospital = require("../models/Hospital");
const User = require("../models/User");
const Patient = require("../models/Patient");

// Add a new hospital
router.post("/", async (req, res) => {
  try {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.status(201).json({ message: "Hospital added successfully", hospital });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Update hospital info
router.put("/update/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Hospital updated successfully", hospital });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete a hospital
router.delete("/delete/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    res.json({ message: "Hospital deleted successfully", hospital });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get all hospitals as JSON object
router.get("/all", async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res.json(hospitals);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get a specific hospital by membership number
router.get("/by-membership/:membershipNo", async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      memberShipNo: req.params.membershipNo,
    });
    if (!hospital) {
      return res.status(404).json({ message: "Hospital not found" });
    }
    res.json(hospital);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.post("/addPatient/:memberShipCode", async (req, res) => {
  try {
    const { memberShipCode} = req.params;
    const hospitalMemberShipNo = req.body.memberShipCode;

    console.log(`adding ${hospitalMemberShipNo}`);
     console.log(`adding patient ${memberShipCode}`);


    // Check if the patient exists in the User model
    const patient = await Patient.findOne({ memberShipCode });

    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // If the patient is found, update the Hospital model

    const hospital = await Hospital.findOne({
      memberShipCode:hospitalMemberShipNo,
    });

    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }

    // Check if the patient is already in the availablePatients array
    if (hospital.availablePatients.includes(patient.memberShipCode)) {
      return res.status(400).json({ error: "Patient already added" });
    }

    // Add the patient to the availablePatients array
    hospital.availablePatients.push(patient.memberShipCode);
    await hospital.save();

    res.json({ message: "Patient added successfully", hospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



module.exports = router;
