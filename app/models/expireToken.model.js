const mongoose = require("mongoose");

const ExpireTokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      index: true,
      unique: true,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("expire_token", ExpireTokenSchema);
