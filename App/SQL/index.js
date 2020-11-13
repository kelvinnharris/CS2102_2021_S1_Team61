const sql = {};

sql.query = {
  // register
  add_user:
    "INSERT INTO users (username, password, first_name, last_name) VALUES ($1,$2,$3,$4)",
  add_petowner: "INSERT INTO petowners (username) VALUES ($1)",
  add_caretaker: "INSERT INTO caretakers (username) VALUES ($1)",
  add_admin: "INSERT INTO admin (username) VALUES ($1)",
  // login
  get_user: "SELECT * FROM users WHERE username=$1",

  // pets
  get_pets: "SELECT * FROM pets WHERE username=$1",
  add_pet:
    "INSERT INTO pets (username, name, animal_type, special_requirement) VALUES ($1,$2,$3,$4)",

  // petowners
  get_petowner: "SELECT * FROM petowners WHERE username=$1",

  // caretakers
  get_caretaker: "SELECT * FROM caretakers WHERE username=$1",
  get_browsed_caretaker: "SELECT * FROM caretakers NATURAL JOIN users WHERE username=$1",

  browse: "SELECT * FROM (SELECT t.username, min(t.avail_date) as s_date, max(t.avail_date) as e_date FROM (SELECT b.avail_date, b.username, b.avail_date + (interval '1 day' * -row_number() over (PARTITION BY b.username ORDER BY b.avail_date)) as i FROM (SELECT * FROM availability NATURAL JOIN caretakers) b) t GROUP BY t.username, i ORDER BY t.username, s_date) av NATURAL JOIN users",
  
  // insert pet
  insert_pet: "INSERT INTO pets VALUES ($1, $2, $3, $4)",

  // admin
  get_admin: "SELECT * FROM admin WHERE username=$1",

  // bids
  add_bid_date:
    "INSERT INTO bid_dates (s_date, e_date) VALUES ($1,$2) ON CONFLICT DO NOTHING",
  add_bid:
    "INSERT INTO bids (pouname, ctuname, name, s_date, e_date, price) VALUES ($1,$2,$3,$4,$5,$6)",
  get_bid:
    "SELECT * FROM bids NATURAL JOIN pets NATURAL JOIN petowners NATURAL JOIN users WHERE ctuname=$1",

  // admin queries
  get_num_of_pets_within_month:
    "SELECT COUNT(DISTINCT name) FROM bids WHERE is_win = TRUE AND (s_date >= '2021-05-01' AND s_date <= '2021-05-31') OR (e_date >= '2021-05-01' AND e_date <= '2021-05-31');",
};

module.exports = sql;
