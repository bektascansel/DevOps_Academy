const express=require("express");
const mysql=require("mysql2");
const app=express();


const dbConnection=mysql.createPool({

    connectionLimit:10,
    host:"mysql-service",
    user:"root",
    password:"password",
    database:"BookDB",

});


dbConnection.getConnection((err,connection)=>{

if(err){
    console.log("Error connection to database");
}else{
    console.log("Connected to database");
}

});




app.get('/books/getAll', (req, res) => {
    dbConnection.query(
        "SELECT * FROM BookStore",
        (err, results) => {
            if (err) {
                console.error('Database query error:', err.stack);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Books Not Exist',
                });
            }

            const books = results.map(book => ({
                bookName: book.bookName,
                authorName: book.authorName,
                pageCount: book.pageCount,
                bookType: book.bookType,
            }));

            return res.status(200).json({
                message: "Books Successfully Listed",
                books: books
            });
        }
    );
});


app.listen(3030, () => {
    console.log("Server is running on port 3030");
});



