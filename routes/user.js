
const express = require("express");

const router = express.Router();

const { signup, login, editUser, getUserDetailByFilter, getUserDetailByUserId } = require("../controller/User.controller");
const auth = require("../middleware/auth");

router.post("/signup", signup);

router.post("/login", login);

router.put("/edit", auth, editUser);

router.get("/bulk", auth, getUserDetailByFilter);

router.get("/:userId", auth, getUserDetailByUserId);

module.exports = router;
