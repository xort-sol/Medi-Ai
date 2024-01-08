const express = require("express");
const router = express.Router();
const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Hospital = require("../models/Hospital");
const UID = require("../models/UniqueCode");
const jwt = require("jsonwebtoken");
router.post("/add/:hospitalId", async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, phoneNumber, userType } =
      req.body.doctorInfoForSubmission;
    console.log("email" + email);

    // Declare newUniqueId outside the try block
    let newUniqueId = "";

    try {
      // Check if email already exists
      let existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ msg: "Email is already in use" });
      }
      // Fetch current unique code
      const currentUniqueIdDoc = await UID.findOne();

      const currentUniqueId = currentUniqueIdDoc.UniqueId;

      // Increment unique code
      newUniqueId = currentUniqueId + 1;

      // Update the unique code model
      await UID.updateOne({}, { $set: { UniqueId: newUniqueId } });

      // Create a new user with the incremented unique code
      const user = new User({
        email,
        password,
        userType,
        memberShipCode: newUniqueId,
      });
      
      console.log("middle");

      // Save the user
      await user.save();
    } catch (err) {
      console.error(err); // Log detailed error information
      res.status(500).json({ error: err.message });
    }

    const hospitalId = req.params.hospitalId; // Access the hospitalId property

    console.log("new unique id" + newUniqueId); // Corrected the spelling
    const doctorData = {
      memberShipCode: newUniqueId,
      connectedHospitalId: hospitalId.toString(),
      name: req.body.doctorInfoForSubmission.fullName,
      specialization: req.body.doctorInfoForSubmission.specialization,
      qualification: req.body.doctorInfoForSubmission.qualifications,
      license: req.body.doctorInfoForSubmission.license,
      phoneNumber: req.body.doctorInfoForSubmission.phoneNumber,
    };

    const doctor = new Doctor(doctorData);
    await doctor.save();

    const hospital = await Hospital.findOne({
      memberShipCode: hospitalId.toString(),
    });

    // Add the patient to the availablePatients array
    hospital.availableDoctors.push(newUniqueId.toString()); // Push as a string
    await hospital.save();

    res.status(201).json({ message: "Doctor added successfully", doctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update doctor info
router.put("/update/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete a doctor
router.delete("/delete/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    res.json({ message: "Doctor deleted successfully", doctor });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get all doctors associated with a hospital
router.get("/all/:hospitalId", async (req, res) => {
  try {
    const doctors = await Doctor.find({
      connectedHospitalId: req.params.hospitalId,
    });
    res.json(doctors);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
// Get a specific doctor by ID
router.get("/get/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    res.json(doctor);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
