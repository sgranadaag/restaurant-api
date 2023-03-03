const { isEmpty, uniqBy } = require("lodash");
const { MenuItem } = require("../models/menuItem.model");
const Restaurant = require("../models/restaurant.model");
const User = require("../models/user.model");
const { getToken } = require("../utils/getToken.util");
const { jwt } = require("./user.controller");

exports.getRestaurants = async (req, res) => {
  const restaurants = await Restaurant.find();
  if (isEmpty(restaurants))
    return res.status(400).send({ error: "No restaurants added yet" });
  return res.status(200).send(restaurants);
};

exports.getSingleRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await Restaurant.findOne({ id: restaurantId });
    return res.status(200).send(restaurant);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

exports.getMenuItems = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { menuItems } = await Restaurant.findOne({ id: restaurantId });
    return res.status(200).send(menuItems);
  } catch (error) {
    return res.status(400).send({ error });
  }
};

exports.getItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    console.log(itemId);
    const item = await MenuItem.findOne({ id: itemId });
    if (item) return res.status(200).send(item);

    return res.status(400).send({ message: "The item id not exist" });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

exports.migration = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    let items = [];
    restaurants.forEach(
      (restaurant) => (items = [...items, ...restaurant.menuItems])
    );

    console.log(items);

    const allItems = await MenuItem.insertMany(items);
    return res.status(200).send(allItems);
  } catch (error) {
    return res.status(400).send(error);
  }
};

exports.addMenuItem = async (req, res) => {
  const { itemId } = req.body;
  if (!itemId) return res.status(400).send({ error: "ItemId cant be empty" });
  const token = getToken(req, res);
  if (!token) return res.status(400).send({ error: "Token cant be empty" });
  const { userId } = jwt.decode(token);
  const user = await User.findOne({ id: userId });
  if (!user) return res.status(400).send({ error: "The user not exist" });
  const item = await MenuItem.findOne({ id: itemId });
  if (!item) return res.status(400).send({ error: "The item not exist" });
  user.menuItems = uniqBy([...user.menuItems, item], "id");
  try {
    await User.updateOne({ id: user.id }, user);
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

exports.deleteMenuITem = async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!itemId) return res.status(400).send({ error: "ItemId cant be empty" });
    const token = getToken(req, res);
    if (!token) return res.status(400).send({ error: "Token cant be empty" });
    const { userId } = jwt.decode(token);
    const user = await User.findOne({ id: userId });
    if (!user) return res.status(400).send({ error: "The user not exist" });
    const item = user.menuItems.find((item) => item.id == itemId);

    if (!item)
      return res.status(400).send({ error: "The item has not added yet" });

    user.menuItems = user.menuItems.filter((item) => item.id != itemId);
    console.log(JSON.stringify(user));
    await User.updateOne({ id: user.id }, user);
    return res.status(200).send({ user });
  } catch (error) {
    return res.status(400).send({ error });
  }
};

exports.getTotalPrice = async (req, res) => {
  try {
    const token = getToken(req, res);
    if (!token) return res.status(400).send({ error: "Token cant be empty" });
    const { userId } = jwt.decode(token);
    const { menuItems } = await User.findOne({ id: userId });
    if (isEmpty(menuItems))
      return res
        .status(200)
        .send({ message: "The user haven't items added yet" });

    const totalPrice = menuItems.reduce((sum, item) => sum + item.price, 0);
    return res.status(200).send({ totalPrice });
  } catch (error) {
    return res.status(400).send({ error });
  }
};
exports.payMenuItems = async (req, res) => {
  try {
    const { cash } = req.body;
    const token = getToken(req, res);
    if (!token) return res.status(400).send({ error: "Token cant be empty" });
    const { userId } = jwt.decode(token);
    const user = await User.findOne({ id: userId });
    if (isEmpty(user.menuItems))
      return res
        .status(200)
        .send({ message: "The user haven't items added yet" });

    const totalPrice = user.menuItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

    if (totalPrice > cash)
      return res.status(400).send({ error: "Insufficient funds" });
    const restCash = cash - totalPrice;
    user.menuItems = [];
    await User.updateOne({ id: user.id }, user);
    return res.status(200).send({ restCash });
  } catch (error) {
    return res.status(400).send({ error });
  }
};
