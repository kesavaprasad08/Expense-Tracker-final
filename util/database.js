const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(process.env.DB_NAME,process.env.DB_USER_NAME,process.env.DB_USER_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host:process.env.DB_HOST,
});

module.exports = sequelize;
