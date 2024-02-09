const router = require("express").Router();
const userAuthentication = require("../middleware/auth");
const premiumController = require("../controllers/premiumController");

router.get(
  "/leaderBoard",
  userAuthentication.authenticate,
  premiumController.showLeaderBoard
);

module.exports = router;
