const { Error } = require("sequelize");
const Order = require("../models/order");
const Razorpay = require("razorpay");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id, isPremiumMember) => {
  return jwt.sign(
    { userId: id, isPremiumMember: isPremiumMember },
    process.env.SECRET_KEY
  );
};

exports.purchasePremium = (req, res, next) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_sECRET,
    });

    const amount = 2000;

    razorpay.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        console.log(err);
        throw new Error(JSON.stringify(err));
      }
      Order.create({ orderId: order.id, status: "PENDING" })
        .then(() => {
          return res.status(200).json({ order, key_id: razorpay.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log("Error in purchase premium", err);
    res.status(401).json({ message: "Something went wrong", error: err });
  }
};

exports.updateTransactionStatus = async (req, res, next) => {
  const { payment_id, order_id } = req.body;
  try {
    const order = await Order.findOne({ where: { orderId: order_id } });
    if (!payment_id) {
      order.update({ status: "FAILED" }).then(() => {
        return res
          .status(203)
          .json({ success: true, message: "Transaction failed" });
      });
    } else {
      const promise1 = await order.update({
        paymentId: payment_id,
        status: "SUCCESSFUL",
      });
      const user = await User.findByPk(req.user.id);
      user.isPremiumMember = true;
      const userUpdate = await user.save();
      Promise.all([promise1, userUpdate])
        .then(() => {
          return res.status(202).json({
            success: true,
            message: "Transaction SuccessFul",
            token: generateAccessToken(req.user.id, true),
          });
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something wentwrong while Updating the Transaction",
      error: error.err,
    });
  }
};
