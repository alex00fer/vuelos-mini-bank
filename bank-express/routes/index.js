var express = require("express");
var router = express.Router();
const db = require("../db/config");

/* GET home page. */
router.get("/", function (req, res, next) {
  db.query("SELECT number FROM cards", (error, result) => {
    if (error) throw error;

    res.send(result);
  });
});

module.exports = router;
