const { Sequelize } = require("sequelize");

const sequelize = require("../util/database");

const ForgotPasswordRequests = sequelize.define("ForgotPasswordRequests", {
    id: {
      type: Sequelize.UUID,
      defaultValue:Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userId:{
      type:Sequelize.INTEGER,
    },
    isActive:{
      type:Sequelize.BOOLEAN,
    }

});

module.exports=ForgotPasswordRequests;


