
const { Pool } = require("pg");
require("dotenv").config(); 

const pool = new Pool({
  user: process.env.PG_USER || "postgres",
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DATABASE || "ubicacion_aulas",
  password: process.env.PG_PASSWORD || "tu_password",
  port: process.env.PG_PORT || 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
