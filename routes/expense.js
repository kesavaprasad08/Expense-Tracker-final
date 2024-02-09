const express = require("express");

const router = express.Router();

const expenseController = require("../controllers/expenseController");
const userAuthentication = require("../middleware/auth");

router.get("/", expenseController.getExpensePage);

router.post(
  "/add-expense",
  userAuthentication.authenticate,
  expenseController.addExpense
);

router.get(
  "/get-expense/",
  userAuthentication.authenticate,
  expenseController.getExpensesForPagination
);

router.delete(
  "/delete-expense/:id",
  userAuthentication.authenticate,
  expenseController.deleteExpense
);

module.exports = router;
