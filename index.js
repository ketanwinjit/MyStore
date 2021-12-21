require("dotenv").config();
const app = require("./app");
const connectWithDB = require("./config/db.config");
const cloudinary = require("cloudinary");

// DB CONNECTION
connectWithDB();

//CLOUDINARY
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server is listing on PORT ${process.env.PORT}`);
});
