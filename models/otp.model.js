const mongoose = require("mongoose");
const otpSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date
  },
  valueOtp: {
    type: String,
    required: true
  },
  type: {
    type: String
  },
  expiry: {
    type: String
  }
});
module.exports = mongoose.model("otp", otpSchema);