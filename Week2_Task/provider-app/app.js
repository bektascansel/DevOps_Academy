const express=require("express");
const bodyParser=require('body-parser');
const amqp=require("amqplib");

const port=3000;
const app=express();

app.use(bodyParser.json());



app.post('/books/add',(req,res)=>{

    const{bookName,authorName,pageCount,bookType}=req.body;

    const addedBook={
        bookName:bookName,
        authorName:authorName,
        pageCount:pageCount,
        bookType:bookType,
    }

    const addedBookJSON = JSON.stringify(addedBook);

    sendRabbitMq(addedBookJSON)

    return res.status(200).json({
       
        message: "Book Successfully Added",
        book:addedBook 

    });
});


async function sendRabbitMq(message){

    try{
    
        const connection = await amqp.connect('amqp://172.18.0.7');
        const channel= await connection.createChannel();
        await channel.assertQueue("BooksQuery",{ durable: false })
        channel.sendToQueue("BooksQuery", Buffer.from(message));

        } catch (error) {

            console.error("Hata:", error);
           
        }
}


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  