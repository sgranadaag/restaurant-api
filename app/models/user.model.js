const mongoose = require("mongoose");
const { MenuItemSchema } = require("./menuItem.model");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const UserSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
      unique: true,
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
    menuItems: {
      type: [MenuItemSchema],
      default: [],
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(AutoIncrement, { id: "id_user_seq", inc_field: "id" });

module.exports = mongoose.model("user", UserSchema);
