const mysql = require("mysql2");

const connection=mysql.createPool({
    connectionLimit:100,
    host:"localHost",
    user:"root",
    password:"can",
    database:"example_app"
});



module.exports=connection;