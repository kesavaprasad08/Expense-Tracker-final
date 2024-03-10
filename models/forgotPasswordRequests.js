const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const forgotPasswordRequestsSchema =new Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    required:true
  },
  isActive:{
    type:Boolean,
    required:true
  },
  secret:{
    type:String,
    required:true
  }
});

module.exports= mongoose.model('ForgotPasswordRequests',forgotPasswordRequestsSchema);





// const { Sequelize } = require("sequelize");

// const sequelize = require("../util/database");

// const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
//     id: {
//       type: Sequelize.UUID,
//       defaultValue:Sequelize.UUIDV4,
//       allowNull: false,
//       primaryKey: true,
//     },
//     userId:{
//       type:Sequelize.INTEGER,
//     },
//     isActive:{
//       type:Sequelize.BOOLEAN,
//     }

// });

// module.exports=ForgotPasswordRequests;


