const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id, name) {
  return jwt.sign({ userId: id, name: name }, "abc");
}

exports.getLoginPage = async (req, res, next) => {
  try {
    res.sendFile("login.html", { root: "views" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.addUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const check = await User.find({
      email: email,
    });
    if (check.length === 0) {
      bcrypt.hash(password, 10, async (err, hash) => {
        const user = new User({
          name: name,
          email: email,
          password: hash,
          isPremiumMember: false,
          totalExpenses: 0,
        });
        await user.save();

        console.log(user);
        return res.status(200).json({ message: "User Added" });
      });
    } else {
      res.status(403).json({ message: "User Already Exist" });
    }
  } catch (e) {
    console.log(e);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const check = await User.find({
      email: email,
    });
    if (check.length !== 0) {
      bcrypt.compare(password, check[0].password, (err, result) => {
        if (!result) {
          res.status(500).json({ message: "User not authorized" });
        }
        if (result) {
          res.status(200).json({
            message: "user found",
            token: generateAccessToken(check[0]._id, check[0].name),
          });
        }
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.log(e);
  }
};
