const router = require("express").Router();
const passwordController = require("../controllers/passwordController");

router.get("/", passwordController.getForgotPasswordPage);
router.post("/forgot-password", passwordController.forgotPassword);
router.get("/reset-password/:id", passwordController.resetPassword);
router.post("/update-password/:id", passwordController.updatePassword);

module.exports = router;
