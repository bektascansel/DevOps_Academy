const mysql = require("mysql2");

const connection=mysql.createPool({
    connectionLimit:100,
    host:"localHost",
    user:"root",
    password:"canCan.4141",
    database:"example_app"
});



module.exports=connection;