const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const UID = require("../models/UniqueCode");
const User = require("../models/User");

router.post("/initializeId", async (req, res) => {
  try {
    // Check if there is already a document in the UID collection
    const existingUID = await UID.findOne();

    if (existingUID) {
      // If there is an existing document, return a message indicating that it's already initialized
      return res.json({ msg: "UniqueId is already initialized." });
    }

    // If no document exists, initialize it to 1000
    const initialUniqueId = 1000;
    const newUID = new UID({ UniqueId: initialUniqueId });
    await newUID.save();

    res.json({ msg: "UniqueId initialized to 1000." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/register", async (req, res) => {
  const { email, password, phoneNumber, userType } = req.body;
  console.log(req.body);

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
    const newUniqueId = currentUniqueId + 1;

    newUniqueIdString  = newUniqueId.toString();

    // Update the unique code model
    await UID.updateOne({}, { $set: { UniqueId: newUniqueId } });

    // Create a new user with the incremented unique code
    const user = new User({
      email,
      password,
      userType,
      memberShipCode: newUniqueIdString,
    });

    // Save the user
    await user.save();

    // Create a JWT token
    const payload = {
      user: {
        id: user.id,
        role: user.userType,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          id: user.id,
          userType: user.userType,
          memberShipCode: user.memberShipCode,
        });
      }
    );
  } catch (err) {
    console.error(err); // Log detailed error information
    res.status(500).json({ error: err.message });
  }
});


router.post("/login", async (req, res) => {
  const token = req.header("Authorization");
  if (token) {
    return res.status(401).json({ msg: "Already Logged In" });
  }
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    if (user.blocked) {
      return res.status(400).json({ msg: "Account Blocked" });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        userType: user.userType,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 3600 },
      (err, token) => {
        if (err) throw err;
        res.json({ token, id: user.id,memberShipCode:user.memberShipCode.toString(), role: user.userType });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// router.get("/profile", auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

// router.put("/profile", auth, async (req, res) => {
//   const { username, email } = req.body;

//   try {
//     let user = await User.findById(req.user.id);

//     user.username = username || user.username;
//     user.email = email || user.email;

//     await user.save();

//     res.json("Updated User");
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send("Server Error");
//   }
// });

module.exports = router;
