const mongoose = require("mongoose");
const { MenuItemSchema } = require("./menuItem.model");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const RestaurantSchema = mongoose.Schema(
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
      minlength: 3,
    },
    menuItems: {
      type: [MenuItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

RestaurantSchema.plugin(AutoIncrement, {
  id: "id_restaurant_seq",
  inc_field: "id",
});

module.exports = mongoose.model("restaurant", RestaurantSchema);
