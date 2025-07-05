let mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: String,
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  userType: {
    type: String,
    enum: ["guest", "host"],
    default: "guest",
  },
  favourites:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Home'
  }]
});

module.exports = mongoose.model("user", userSchema);
