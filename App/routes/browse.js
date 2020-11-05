var express = require("express");
var router = express.Router();
const sql_query = require("../sql");

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get("/", function (req, res, next) {
  pool.query(sql_query.query.browse, [], (err, data) => {
    res.render("browse", { avails: data.rows });
  });
});

router.get("/:id", function (req, res, next) {
  console.log(req.params.id);
  pool.query(sql_query.query.get_browsed_caretaker, [req.params.id], (err, data) => {
    console.log(data);
    res.render("browsed_caretaker", {
      username: data.rows[0].username,
      address: data.rows[0].address,
      first_name: data.rows[0].first_name,
      last_name: data.rows[0].last_name
     })
  });
});

module.exports = router;
