const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema =new Schema({
  paymentId:{
    type:String,
  },
  orderId:{
    type:String,
    required:true
  },
  status:{
    type:String,
    required:true
  },
})

module.exports= mongoose.model('Order',orderSchema);




// const { Sequelize } = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define("Order", {
//   id: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//     primaryKey: true,
//     autoIncrement: true,
//   },
//   paymentId: Sequelize.STRING,

//   orderId: Sequelize.STRING,

//   status: Sequelize.STRING,
// });

// module.exports = Order;
