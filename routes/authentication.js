const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");

const authController = require("../controllers/authentication");

const router = express.Router();

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
      .notEmpty()
      .withMessage("Email is missing")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is missing"),
  ],
  authController.signup
);

module.exports = router;
