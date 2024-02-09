const express = require("express");

const router = express.Router();
const userAuthentication = require("../middleware/auth");

const userController = require("../controllers/userController");
const expenseController =require('../controllers/expenseController');

router.post("/signup", userController.addUser);

router.get("/login", userController.getLoginPage);

router.post("/login", userController.loginUser);

router.get('/download',userAuthentication.authenticate,expenseController.downloadExpense)

module.exports = router;
