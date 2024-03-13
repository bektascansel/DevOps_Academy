
const express = require("express");
const dbConnection = require("./Helper/postgre");
const port=3030;
const app = express();


dbConnection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected');
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

            if (results.rows.length === 0) {
                return res.status(404).json({
                    message: 'Books Not Exist',
                });
            }

            const books = results.rows.map(book => ({
                id:book.id,
                bookName: book.bookname,
                authorName: book.authorname,
                pageCount: book.pagecount,
                bookType: book.booktype,
            }));

            return res.status(200).json({
                message: "Books Successfully Listed",
                books: books
            });
        }
    );
});



app.get('/books/:id', (req, res) => {
    const bookId = req.params.id; 

    dbConnection.query(
        "SELECT * FROM BookStore WHERE id = $1",
        [bookId],
        (err, results) => {
            if (err) {
                console.error('Database query error:', err.stack);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.rows.length === 0) {
                return res.status(404).json({
                    message: 'Book Not Found',
                });
            }

            const book = results.rows[0]; 

           
            const getBook = {
                id:book.id,
                bookName: book.bookname,
                authorName: book.authorname,
                pageCount: book.pagecount,
                bookType: book.booktype,
            };

            return res.status(200).json({
                message: "Book Successfully Found",
                book: getBook
            });
        }
    );
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });