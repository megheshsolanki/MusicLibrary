const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ status: 401, data: null, message: "Unauthorized Access.", error: null });
  }
  const token = authHeader.split(" ")[1];

  let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    return res.status(401).json({ status: 401, data: null, message: "Unauthorized Access. from token", error: null });
  }
  req.user_id = decodedToken.user_id;
  req.role = decodedToken.user_role;
  if (decodedToken.user_role === "admin") {
    req.admin_id = decodedToken.user_id;
    next();
  } else {
    User.findById(decodedToken.user_id)
      .then((user) => {
        req.admin_id = user.admin_id.toString();
        next();
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
