const mongoose = require("mongoose");

const connectWithDB = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(console.log(`DATABASE CONNECTED`))
    .catch((error) => {
      console.log(`DATABASE CONNECTION ERROR`);
      console.log(error);
    });
};

module.exports = connectWithDB;
