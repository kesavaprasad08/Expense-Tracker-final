const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema =new Schema({
  name:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  isPremiumMember:{
    type:Boolean,
    required:true
  },
  totalExpenses:{
    type:Number,
    required:true
  }

})

module.exports= mongoose.model('User',userSchema);



// const { Sequelize } = require("sequelize");

// const sequelize = require("../util/database");

// const User = sequelize.define("User", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   Name: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   Email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   Password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   isPremiumMember: {
//     type: Sequelize.BOOLEAN,
//     allowNull: false,
//   },
//   totalExpenses:{
//     type:Sequelize.INTEGER,
//     allowNull:false,
//   }
// });

// module.exports = User;
