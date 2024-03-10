const Expense = require("../models/expense");
const User = require("../models/user");
const sequelize = require("../util/database");
const AWS = require("aws-sdk");

exports.getExpensePage = async (req, res, next) => {
  try {
    res.sendFile("expense.html", { root: "views" });
  } catch (e) {
    res.status(500).json({ error: e });
  }
};

exports.addExpense = async (req, res, next) => {
  try {
    const expAmt = req.body.amount;
    const des = req.body.description;
    const cat = req.body.category;
    const expense = new Expense(
      {
        expenseAmount: expAmt,
        description: des,
        category: cat,
        userId: req.user._id,
      }
    );
    await expense.save();
    User.findById(req.user._id).then((user) => {
      user.totalExpenses = Number(user.totalExpenses) + Number(expAmt);
      user.save();
      return res.status(200).json({ message: "Expense Added" });
    });
  } catch (e) {
    console.log(e);
  }
};

exports.deleteExpense = async (req, res, next) => {
  try {
    const user = await User.find({ _id: req.user._id });
    const id = req.params.id;
    const deletedExpense = await Expense.findByIdAndDelete(id);
    req.user.totalExpenses =
      Number(user[0].totalExpenses) - Number(deletedExpense.expenseAmount);
    await req.user.save();
    res.status(200).json({ message: "deleted Successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

const uploadToS3 = async (data, fileName) => {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY_ = process.env.IAM_USER_KEY_;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY_,
    secretAccessKey: IAM_USER_SECRET,
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(s3response.Location);
      }
    });
  });
};

exports.downloadExpense = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user.isPremiumMember) {
      throw new Error("Not a Premium User");
    } else {
      const expenses = await Expense.find({userId: userId });
      const stringifiedExpenses = JSON.stringify(expenses);
      const fileName = `Expenses${userId}/${new Date()}.txt`;
      const fileURL = await uploadToS3(stringifiedExpenses, fileName);
      res.status(200).json({ fileURL });
    }
  } catch (err) {
    return res.status(500).json({ fileUrl: "", success: false, err: err });
  }
};
exports.getExpensesForPagination = async (req, res, next) => {
  try {
    const pageNo = parseInt(req.query.page);
    const limit = parseInt(req.query.limit) || 4;
    const offset = (pageNo - 1) * limit;
    const user = await User.findById(req.user._id);
    const totalExpenses = (await Expense.find({ userId: req.user.id })).length;
    const totalPages = Math.ceil(totalExpenses / limit);
    const expenses = await Expense.find({
      userId: req.user.id,
    });
    res.status(200).json({
      success: true,
      expenses,
      totalPages,
      isPremium: user.isPremiumMember,
    });
  } catch (err) {
    console.log("Error in getExpensesForPagination", err);
    res.status(500).json({ success: false, message: err });
  }
};
