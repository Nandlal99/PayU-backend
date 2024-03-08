
const express = require("express");
const auth = require("../middleware/auth");
const { getBalance, transferBalance, getAllTransaction } = require("../controller/account.controller");

const router = express.Router();

router.get("/balance", auth, getBalance);
router.post("/transfer", auth, transferBalance);
router.get("/transactions", auth, getAllTransaction);

module.exports = router;