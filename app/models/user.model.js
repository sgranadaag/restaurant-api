const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
      unique: true
    },
    user: {
      type: String,
      index: true,
      unique: true,
      required: true,
      trim: true,
      minlength: 4,
    },
    password: {
      type: String,
      min: 256,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(AutoIncrement, { inc_field: "id" });

module.exports = mongoose.model("user", UserSchema);
