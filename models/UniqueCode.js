const mongoose = require("mongoose");

const UniqueId = new mongoose.Schema({
    UniqueId: Number
});
const UID = mongoose.model("UID", UniqueId);

module.exports = UID;
