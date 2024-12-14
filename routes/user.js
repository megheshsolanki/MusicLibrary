const express = require("express");

const userController = require("../controllers/user");

const { body } = require("express-validator");

const router = express.Router();

const User = require("../models/user");

router.get('/users',userController.getUsers);

router.post(
  "/users/add-user",
  [
    body("email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exists.");
          }
        });
      }).notEmpty().withMessage("Email is missing")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is missing"),
    body("role").notEmpty().withMessage("Role is missing"),
  ],
  userController.addUser
);

router.delete('/users/:user_id',userController.deleteUser);

router.put('/users/update-password', userController.updatePassword);

module.exports = router;
