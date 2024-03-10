"use strict";

const express = require("express");
const bodyParser = require('body-parser');

const dbConnection = require("./Helper/postgre");
const app = express();


dbConnection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected');
    }
});

app.use(bodyParser.json());


app.post('/students/add', (req, res) => {
    const { name, midterm_grade, final_grade } = req.body;

    const pgCommand = `INSERT INTO students (name, midterm_grade, final_grade) VALUES ($1, $2, $3)`;
    dbConnection.query(pgCommand, [name, midterm_grade, final_grade], (err, result) => {
        if (err) {
            console.error('Database query error:', err.stack);
            res.status(500).send("Database's Error" + err.stack);
        } else {
            const addedStudent = {
                name: name,
                midterm_grade: midterm_grade,
                final_grade: final_grade,
            };

            res.status(200).json({
                message: "Student Successfully Added",
                student: addedStudent
            });
        }
    });
});


app.get('/students/getById/:id', (req, res) => {
    dbConnection.query(
        "SELECT * FROM students WHERE id=$1",
        [req.params.id],
        (err, results) => {
            if (err) {
                console.error('Database query error:', err.stack);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.rows.length === 0) {
                return res.status(404).json({
                    message: 'Student Not Found',
                });
            }

            const student = results.rows[0];
            const foundedStudent = {
                name: student.name,
                midterm_grade: student.midterm_grade,
                final_grade: student.final_grade,
                average: (student.final_grade + student.midterm_grade) / 2
            };

            return res.status(200).json({
                message: "Student Successfully Found",
                student: foundedStudent
            });
        }
    );
});


app.get('/students/getAll', (req, res) => {
    dbConnection.query(
        "SELECT * FROM students",
        (err, results) => {
            if (err) {
                console.error('Database query error:', err.stack);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.rows.length === 0) {
                return res.status(404).json({
                    message: 'Students Not Exist',
                });
            }

            const students = results.rows.map(student => ({
                name: student.name,
                midterm_grade: student.midterm_grade,
                final_grade: student.final_grade,
                average: (student.final_grade + student.midterm_grade) / 2
            }));

            return res.status(200).json({
                message: "Students Successfully Listed",
                students: students
            });
        }
    );
});



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

