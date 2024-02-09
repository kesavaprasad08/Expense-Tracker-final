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
    const check = await User.findAll({
      attributes: ["Name", "Email", "Password"],
      where: {
        Email: email,
      },
    });
    if (check.length === 0) {
      bcrypt.hash(password, 10, async (err, hash) => {
        await User.create({
          Name: name,
          Email: email,
          Password: hash,
          isPremiumMember: false,
          totalExpenses:0,
        });
        res.status(200).json({ message: "User Added" });
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

    const check = await User.findAll({
      attributes: ["id", "Name", "Email", "Password"],
      where: {
        Email: email,
      },
    });

    if (check.length !== 0) {
      bcrypt.compare(password, check[0].dataValues.Password, (err, result) => {
        if (!result) {
          res.status(500).json({ message: "User not authorized" });
        }
        if (result) {
          res
            .status(200)
            .json({
              message: "user found",
              token: generateAccessToken(
                check[0].dataValues.id,
                check[0].dataValues.Name
              ),
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
