const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const MenuItemSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
    },
    price: {
      type: Number,
      min: 10,
    },
  },
  {
    timestamps: true,
  }
);
const MenuItem = mongoose.model("menu_item", MenuItemSchema);
MenuItemSchema.plugin(AutoIncrement, { id: "id_item_seq", inc_field: "id" });
module.exports = { MenuItemSchema, MenuItem };
