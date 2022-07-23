const express = require("express");
const router = express.Router();

const user_handler = require("../router_handler/user");

// const expressJoi = require("");
// const { reg_login_schema } = require("../schema/user");

const bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
// app.use(jsonParser);

router.post("/reguser", jsonParser, user_handler.regUser);
router.post("/login", jsonParser, user_handler.login);

router.post("/logout", jsonParser, user_handler.logout);
// Log in and verify your password
router.post("/login1", jsonParser, user_handler.login1);
// Authentication token
router.post("/login2", jsonParser, user_handler.login2);
// Save the data
router.post("/login3", jsonParser, user_handler.login3);
// Read the data
router.post("/login4", jsonParser, user_handler.login4);
// Get all data
router.post("/login5", jsonParser, user_handler.login5);
router.post("/readwordlist", jsonParser, user_handler.readwordlist);

module.exports = router;
