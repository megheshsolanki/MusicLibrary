const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signup = (req,res,next) =>{
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (errors.array()[0].msg == "E-mail already exists.") {
          return res.status(409).json({ status: 409, data: null, message: errors.array()[0].msg, error: null });
        } else {
          let reason = "";
          errors.array().map((e) => {
            reason += e.msg;
            reason += ", ";
          });
          return res.status(400).json({ status: 400, data: null, message: `Bad Request, Reason: ${reason} `, error: null });
        }
      }
    const email = req.body.email;
    const password = req.body.password;
    const role = "admin";
    return bcrypt
        .hash(password, 12)
        .then((hashedPw) => {
        const newUser = new User({
            email,
            password: hashedPw,
            role,
        });
        return newUser.save();
        })
        .then((result) => {
        res.status(201).json({
            status: 201,
            data: null,
            message: "User created successfully",
            error: null,
        });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ status: 404,data: null, message: "User not found.", error: null });
        }
        bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
            if (doMatch) {
            const token = jwt.sign({ user_id: user._id.toString(), user_role: user.role }, process.env.JWT_SECRET, { expiresIn: "7days" });
            return res.status(200).json({ status: 200,data: {token: token}, message: "Login successful.", error: null });
            } else {
             return res.status(400).json({ status: 400,data: null, message: "Bad request, Reason: Invalid credentials", error: null });
            }
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
        
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 400;
          err.message = "Bad request."
        }
        next(err);
      });
  };