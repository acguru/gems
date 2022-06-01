const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
require("dotenv").config();

/**
 * @route POST /login
 * @desc Login user
 * @param {String} req.body.username - User's username
 * @param {String} req.body.password - User's password
 * @returns {Object} user - User's data
 * @returns {String} token - User's token
 * @returns {String} error - Error message
 * @returns {Number} status - Status code
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByCredentials(username, password);
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.send({ status: 0 } + "error: " + e);
  }
});

/**
 * @route POST /createuser
 * @desc Create a new user
 * @param {String} req.body.username - User's username
 * @param {String} req.body.password - User's password
 * @param {String} req.body.SECRET_KEY - Only website owner can create new users
 * @returns {Boolean} isOk - True if user was created
 * @returns {String} message - Error message if user was not created
 */
router.post("/createuser", async (req, res) => {
  if (!req.body.SECRET_KEY || req.body.SECRET_KEY !== process.env.SECRET_KEY) {
    return res.status(200).send({ isOk: false, message: "Unauthorized - Wrong Secret Key" });
  }
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  if (user) {
    await user.save();
    res.status(200).send({ isOk: true });
  } else {
    res.status(400).send({ isOk: false, message: "Failed to create new account." });
  }
});

module.exports = router;