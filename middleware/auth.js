const User = require("../models/user");
const jwt = require("jsonwebtoken");
module.exports = async function (req, res, next) {
  try {
    const token = req.headers["token"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.send("NO USER WAS FOUND");
    }
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." });
  }
};
