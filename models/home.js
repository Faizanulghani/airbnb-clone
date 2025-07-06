let mongoose = require("mongoose");
// const favourite = require("./favourite");

let homeSchema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: String, required: true },
  location: { type: String, required: true },
  rating: { type: String, required: true },
  photo: { type: String, required: true },
  rules: { type: String, required: true },
  description: String,
});

module.exports = mongoose.model("Home", homeSchema);
