const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

const User = require("../models/user");

exports.addUser = (req, res, next) => {
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
  const role = req.body.role;
  const admin_id = req.admin_id; 
  

  if (role == "admin") {
    return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const newUser = new User({
        email,
        password: hashedPw,
        role,
        admin_id,
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
      console.log(err);
    });
};

exports.getUsers = (req, res, next) => {
  const adminId = req.admin_id; 
  
  const limit = parseInt(req.query.limit) || 5;
  const offset = parseInt(req.query.offset) || 0;
  const role = req.query.role;

  const filters = {
    admin_id: adminId,
  };

  if (role) {
    if (role != "editor" && role != "viewer") {
      return res.status(400).json({ status: 400, data: null, message: "Bad request", error: null });
    }
    filters.role = role;
  }

  User.find(filters)
    .limit(limit)
    .skip(offset)
    .then((users) => {
      const formattedUser = users.map((user)=>({
        user_id: user._id,
        email: user.email,
        role: user.role,
        cretedAt: user.createdAt
      }))
      return res.status(200).json({ status: 200, data: formattedUser, message: "Users retrieved successfully.", error: null });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteUser = (req, res, next) => {
  const adminId = req.admin_id; 
  
  const userId = req.params.user_id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ status: 404, data: null, message: "User not found.", error: null });
      }
      if (adminId !== user.admin_id.toString()) {
        return res.status(403).json({ status: 403, data: null, message: "Forbidden Access /Operation not allowed.", error: null });
      } else {
        User.findByIdAndDelete(userId)
          .then((result) => {
            return res.status(200).json({ status: 200, data: null, message: "User deleted successfully.", error: null });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updatePassword = (req, res, next) => {
  const userId = req.user_id; 
  
  const oldPassword = req.body.old_password;
  const newPassword = req.body.new_password;


  User.findById(userId).then((user) => {
    if (!user) {
      return res.status(404).json({});
    }
    
    bcrypt
    .compare(oldPassword, user.password)
    .then((doMatch) => {
      if (doMatch) {
        bcrypt
        .hash(newPassword, 12)
        .then((hashedPw) => {
          user.password = hashedPw;
          user
          .save()
          .then((result) => {
                  return res.status(204).json({});
                })
                .catch((err) => {
                  console.log(err);
                });
              })
              .catch((err) => {
                console.log(err);
              });
            } else {
          return res.status(403).json({});
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
