"use strict";

const express=require("express");
const bodyParser = require('body-parser');

const dbConnection = require("./Helper/mysql");
const connection = require("./Helper/mysql");

const app=express();


dbConnection.getConnection((err,connection)=>{

        if(err){
            console.log("Database connection error: ",err);
        }else{
            console.log("DataBase connected");
        }

});


app.use(bodyParser.json());




app.post('/students/add', (req, res)=>{

    const{name,midterm_grade,final_grade}=req.body;


    const mysqlCommand=`INSERT INTO students (name, midterm_grade, final_grade) VALUES (?, ?, ?)`;
    dbConnection.query(mysqlCommand,[name,midterm_grade,final_grade],(err,result)=>{
            if(err){
                console.log("Database query error: ", err);
                res.status(500).send("Database's Error"+err.stack);
            } else {

                const addedStudent={
                    name:name,
                    midterm_grade:midterm_grade,
                    final_grade:final_grade,
                };


                
                res.status(200).json({
                    message:"Student  Succesfully Added",
                    student:addedStudent
                });
              
            }   
    });
});









app.get('/students/getById/:id', (req, res) => {
    dbConnection.query(
        "SELECT * FROM students WHERE id=?",
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                console.log("Database query error: ", err);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Student Not Found',
                });
            }

            const student = results[0]
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
        "SELECT * FROM students ",
        [req.params.id],
        (err, results, fields) => {
            if (err) {
                console.log("Database query error: ", err);
                return res.status(500).send("Database's Error" + err.stack);
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: 'Students Not Exist',
                });
            }

            const students = [];

            results.forEach(studentData => {
                const student = studentData;
                const foundedStudent = {
                    name: student.name,
                    midterm_grade: student.midterm_grade,
                    final_grade: student.final_grade,
                    average: (student.final_grade + student.midterm_grade) / 2
                };
                students.push(foundedStudent);
            });

            return res.status(200).json({
                message: "Students Successfully Listed",
                student: students
            });
        }
    );
});




app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });



