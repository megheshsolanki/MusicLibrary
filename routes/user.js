const express = require("express");
const { body } = require("express-validator");
const User = require("../models/user");
const userController = require("../controllers/user");
const isAuthenticated = require("../middlewares/isAuthenticated");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, userController.getUsers);

router.post(
  "/users/add-user",
  isAuthenticated,
  isAdmin,
  [
    body("email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-mail already exists.");
          }
        });
      })
      .notEmpty()
      .withMessage("Email is missing")
      .normalizeEmail(),
    body("password").notEmpty().withMessage("Password is missing"),
    body("role").notEmpty().withMessage("Role is missing"),
  ],
  userController.addUser
);

router.delete("/users/:user_id", isAuthenticated, isAdmin, userController.deleteUser);

router.put("/users/update-password", isAuthenticated, userController.updatePassword);

module.exports = router;
