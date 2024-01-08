const express = require("express");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const router = express.Router();
const Patient = require("../models/Patient"); // Adjust the path as needed


router.post("/", async (req, res) => {
  // register patient
  try {
    console.log(req.body);
    const patient = await Patient.create(req.body);
    console.log("patient registered");
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific patient by ID
router.get("/getPatient/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ memberShipNo: req.params.id });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a patient by ID
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a patient by ID
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
