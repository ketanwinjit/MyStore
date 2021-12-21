const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

/**
 * ! REGULAR MIDDLEWARE
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Data comes in body

/**
 * ! COOKIE AND FILEUPLOAD MIDDLEWARE
 */
app.use(cookieParser()); // Handle data in cookie
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
); // Handle Images and Files
app.set("view engine", "ejs");
/**
 * ! MORGAN MIDDLEWARE
 */

app.use(morgan("tiny"));
/**
 *! ROUTER IMPORTS
 */

const home = require("./routes/home");
const user = require("./routes/user");

/**
 *! ROUTER MIDDLEWARES
 */

app.use("/api/v1", home);
app.use("/api/v1", user);

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.post("/api/v1/signup", (req, res) => {
  res.send(req.body);
});

module.exports = app;
