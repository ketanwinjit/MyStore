const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // Default Node package

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    maxlength: [40, "Name should be under 40 characters"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    validate: [validator.isEmail, "Please enter email in correct format"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: [6, "Password should be atleast 6 character"],
    select: false, // When we bring user the password field is not get displayed
  },
  role: {
    type: String,
    default: "user",
  },
  photo: {
    id: {
      type: String,
    },
    secure_url: {
      type: String,
    },
  },
  forgetPasswordToken: String,
  forgetPasswordExpiry: Date,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

/**
 * ! PASSWORD ENCRYPTION BEFORE SAVE USER - ( IF IT'S CHANGE THEN ONLY )
 * ! userSchema.pre -> THIS ARE HOOKS
 */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * ! PASSWORD VALIDATE WITH USER ENTERED PASSWORD AND DB PASSWORD
 */

userSchema.methods.isValidatedPassword = async function (userEnteredPassword) {
  return await bcrypt.compare(userEnteredPassword, this.password);
};

/**
 * ! METHOD TO CREATE AND RETURN JWT TOKEN
 * @returns jwt token
 */

userSchema.methods.generateToken = async function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

userSchema.methods.getForgetPasswordToken = async function () {
  // Generate long random string
  const forgetToken = crypto.randomBytes(20).toString("hex");

  // Getting hash -> Make sure while comparing first you convert into hash and then compare
  this.forgetPasswordToken = crypto
    .createHash("sha256")
    .update(forgetToken)
    .digest("hex");

  // Time of token
  this.forgetPasswordExpiry = Date.now() + 20 * 60 * 1000; // 20 minutes

  return forgetToken;
};

module.exports = mongoose.model("User", userSchema);
