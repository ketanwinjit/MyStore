const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary");
const BigPromise = require("../middleware/bigPromise");
const CustomError = require("../utils/customError");
const User = require("../models/user");
const cookieToken = require("../utils/cookieToken");
const sendEmailToUser = require("../utils/emailHelper");
const crypto = require("crypto");

exports.signup = BigPromise(async (req, res, next) => {
  let imageUploadReuslt;
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new CustomError("Name, Email and Password are require", 400));
  }

  if (req.files) {
    let file = req.files.photo;
    imageUploadReuslt = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: imageUploadReuslt?.public_id,
      secure_url: imageUploadReuslt?.secure_url,
    },
  });
  cookieToken(user, res);
});

exports.login = BigPromise(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json("Email and Password both required");
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json("Email or Password does not matched or exists");
  }

  const isPasswordVerified = await user.isValidatedPassword(password);

  if (!isPasswordVerified) {
    return res.status(401).json("Email or Password does not matched or exists");
  }

  cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logout user",
  });
});

exports.forgetPassword = BigPromise(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const forgetToken = await user.getForgetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const myUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgetToken}`;

  const message = `Copy Paste this URL in the browser and hit enter \n \n ${myUrl}`;

  try {
    await sendEmailToUser({
      email: user.email,
      subject: "My Store - Password reset email",
      text: message,
    });
    res.status(200).json({
      success: true,
      message: "Please check email for password reset",
    });
  } catch (error) {
    user.forgetPasswordToken = undefined;
    user.forgetPasswordExpiry = undefined;
    await user.save({ validateBeforeSave: false });
    res.send(500).json({
      success: false,
      message: error,
    });
  }
});

exports.resetPassword = BigPromise(async (req, res) => {
  const token = req.params.token;

  const encryptToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryptToken,
    forgetPasswordExpiry: { $gt: Date.now() }, // Mongo property time greater then now
  });

  if (!user) {
    return res.send(400).json({
      success: false,
      message: "Token is invalid or expire",
    });
  }

  if (req.body.password !== req.body.conformPassword) {
    return res.send(400).json({
      success: false,
      message: "Password and conform password did not matched",
    });
  }

  user.password = req.body.password;
  user.forgetPasswordToken = undefined;
  user.forgetPasswordExpiry = undefined;

  await user.save();

  cookieToken(user, res);

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});
