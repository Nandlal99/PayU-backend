
const express = require("express");
const auth = require("../middleware/auth");
const { getBalance, transferBalance } = require("../controller/account.controller");

const router = express.Router();

router.get("/balance", auth, getBalance);
router.post("/transfer", auth, transferBalance);

module.exports = router;