const { Sequelize } = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("User", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  Name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  Password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  isPremiumMember: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  totalExpenses:{
    type:Sequelize.INTEGER,
    allowNull:false,
  }
});

module.exports = User;
