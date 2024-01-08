const express = require("express");
const router = express.Router();
const Ambulance = require("../models/ambulanceModel");

// Add a new ambulance
router.post("/", async (req, res) => {
  try {
    const ambulance = new Ambulance(req.body);
    await ambulance.save();
    res
      .status(201)
      .json({ message: "Ambulance added successfully", ambulance });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update ambulance status
router.put("/:registrationNumber", async (req, res) => {
  try {
    const { registrationNumber } = req.params;
    const { status } = req.body;

    const updatedAmbulance = await Ambulance.findOneAndUpdate(
      { registrationNumber },
      { status },
      { new: true }
    );

    if (!updatedAmbulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    res.json({
      message: "Ambulance status updated",
      ambulance: updatedAmbulance,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete an ambulance
router.delete("/:registrationNumber", async (req, res) => {
  try {
    const { registrationNumber } = req.params;

    const deletedAmbulance = await Ambulance.findOneAndRemove({
      registrationNumber,
    });

    if (!deletedAmbulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    res.json({ message: "Ambulance deleted", ambulance: deletedAmbulance });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get all ambulances
router.get("/", async (req, res) => {
  try {
    const ambulances = await Ambulance.find();
    res.json(ambulances);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get a specific ambulance by membership number
router.get("/:memberShipNo", async (req, res) => {
  try {
    const { memberShipNo } = req.params;
    const ambulance = await Ambulance.findOne({ memberShipNo });

    if (!ambulance) {
      return res.status(404).json({ message: "Ambulance not found" });
    }

    res.json(ambulance);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
