require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

// Database configuration
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
const { authMiddleware } = require("./app/middleware/auth.middleware.js");
mongoose.Promise = global.Promise;

mongoose.set("strictQuery", false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes

require("./app/routes/auth.routes")(app);
require("./app/routes/restaurant.routes")(app);

// listen server port
var port = process.env.PORT || 3000;

mongoose
  .connect(dbConfig.url, dbConfig.options)
  .then(() => {
    console.log("Connect to database: success!");
  })
  .catch((err) => {
    console.log("Connect to database: failure!: " + err);
    process.exit();
  });

app.listen(port, () => {
  console.log("Server is listening on port " + port);
});