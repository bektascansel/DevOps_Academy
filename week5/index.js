const express = require('express');
const redis = require('redis');
const mysql = require("mysql2");

const connection=mysql.createPool({
    connectionLimit:100,
    host:"lab-test.chkyok24wwfk.eu-west-1.rds.amazonaws.com",
    user:"admin",
    password:"4ulWuOBWDfTfAgPp4QHl",
    database:"blog"
});



const app = express();
const redisClient = redis.createClient({
    host: "localhost",
    port: 6379
});


redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();





app.get('/blogs/:id', async (req, res) => {
    try {

        const id = req.params.id;
        const redisKey = `blog:id:${id}`;

        const blogData = await redisClient.get(redisKey);

        if (blogData) {
            console.log("Data from Redis");
            const blog = JSON.parse(blogData);
            return res.status(200).json({
                message: "Blog Successfully Found",
                blog: blog
            });
        } else {
            console.log("Data from Database");
            connection.query(
                "SELECT * FROM blogs WHERE id=?",
                [id],
                async (err, results, fields) => {
                    if (err) {
                        console.error("Database query error: ", err);
                        return res.status(500).send("Database's Error" + err.stack);
                    }

                    if (results.length === 0) {
                        return res.status(404).json({
                            message: 'Blog Not Found',
                        });
                    }

                    const blog = results[0];
                    const foundedBlog = {
                        title: blog.blog_title,
                        content: blog.blog_content,
                    };

                   
                    redisClient.set(redisKey,  JSON.stringify(foundedBlog), (err, reply) => {
                        if (err) {
                            console.error("Redis error:", err);
                        } else {
                            console.log("Saved redis");
                        }
                    });

                    return res.status(200).json({
                        message: "Blog Successfully Found",
                        blog: foundedBlog
                    });
                }
            );
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Server error");
    }
});




app.listen(5000, () =>{
    console.log('listening on port 5000');
});