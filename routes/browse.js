var express = require("express");
var router = express.Router();
const sql_query = require("../sql");

const { Pool } = require("pg");
const { middleware } = require("../auth");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get("/", middleware(), function (req, res, mnext) {
  const username = req.session.passport.user;

  var pets = [];
  pool.query(sql_query.query.get_pets, [username], (err, data) => {
    pets = data.rows;
  });

  console.log(username);
  console.log(pets);
  
  pool.query(sql_query.query.browse, [], (err, data) => {
    //console.log(data.rows);
    var username = req.session.passport.user;
    console.log(username);
    res.render("browse", { avails: data.rows, username: username, pets: pets });
  });
});

router.get("/:id", function (req, res, next) {
  console.log(req.params.id);
  pool.query(sql_query.query.get_browsed_caretaker, [req.params.id], (err, data) => {
    //console.log(data);
    res.render("browsed_caretaker", {
      username: data.rows[0].username,
      address: data.rows[0].address,
      first_name: data.rows[0].first_name,
      last_name: data.rows[0].last_name
     })
  });
});

module.exports = router;
