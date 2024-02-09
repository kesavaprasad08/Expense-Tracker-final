const express = require("express");
const router = express.Router();

const userAuthentication = require("../middleware/auth");

const purchaseController = require("../controllers/purchaseController");

router.get(
  "/premiumMembership",
  userAuthentication.authenticate,
  purchaseController.purchasePremium
);

router.post(
  "/updateTransactionStatus",
  userAuthentication.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
