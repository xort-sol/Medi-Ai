const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  memberShipCode: { type: Number},
  userType: {
    type: String,
    enum: ["ambulance", "doctor", "hospital", "patient"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
