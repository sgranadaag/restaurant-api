const { authMiddleware } = require("../middleware/auth.middleware");
const { badRequestMiddleware } = require("../middleware/badRequest.middleware");

module.exports = (app) => {
  const restaurant = require("../controllers/restaurant.controller");
  app.get("/api/restaurants", [authMiddleware], restaurant.getRestaurants);
  app.get("/api/migration", restaurant.migration);
  app.get(
    "/api/restaurants/:restaurantId",
    [authMiddleware],
    restaurant.getSingleRestaurant
  );

  app.get("/api/menu_items/item/:itemId", [authMiddleware], restaurant.getItem);
  app.post(
    "/api/item",
    [authMiddleware, badRequestMiddleware],
    restaurant.addMenuItem
  );
  app.delete("/api/item/:itemId", [authMiddleware], restaurant.deleteMenuITem);
  app.get("/api/menu_items/price", [authMiddleware], restaurant.getTotalPrice);
  app.post(
    "/api/menu_items/pay",
    [badRequestMiddleware, authMiddleware],
    restaurant.payMenuItems
  );
  app.get(
    "/api/menu_items/:restaurantId",
    [authMiddleware],
    restaurant.getMenuItems
  );
};
