const express = require("express");

const authController = require("../controllers/authentication");

const { body } = require("express-validator");

const router = express.Router();

const User = require('../models/user')

router.post("/login", authController.login);

router.post(
  "/signup",
  [
    body("email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exists!");
          }
        });
      })
      .normalizeEmail(),
     body("password").notEmpty()
  ],
  authController.signup
);

module.exports = router;
