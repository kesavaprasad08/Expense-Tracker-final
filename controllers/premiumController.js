const Expense = require("../models/expense")
const User = require("../models/user")
const sequelize = require("../util/database")

exports.showLeaderBoard = async(req,res,next)=>{
    try{
        const expenseList =await User.find();
        res.status(200).json({expenseList});
    }
    catch(err){
        console.log("leaderBoard error", err);
    res.status(500).json({ success: false, message: err.message });
    }
}