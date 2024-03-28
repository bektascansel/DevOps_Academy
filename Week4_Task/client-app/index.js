const amqp=require("amqplib");
const mysql=require("mysql2");


const dbConnection=mysql.createPool({

    connectionLimit:10,
    host:"mysql-service",
    user:"root",
    password:"password",
    database:"BookDB",

});


dbConnection.getConnection((err,connection)=>{
    if(err){
        console.log("Error connnection to database");
    }else{
        console.log("Connected to database");
    }

});

consumeRabbitMq();

async function consumeRabbitMq(){

    try{
        const rabbitmqConnection=await amqp.connect('amqp://rabbitmq-service:5672');
        const channel = await rabbitmqConnection.createChannel();
        await channel.assertQueue("bookQuery",{durable: false});

        console.log("Waiting for messages in the queue...");

        channel.consume("bookQuery",function(message){

            if(message !== null){

                try{

                    const parsedMessage = JSON.parse(message.content.toString());
                    const { bookName, authorName, pageCount, bookType } = parsedMessage;

           

                    const mysqlCommand = "INSERT INTO BookStore (bookName, authorName, pageCount, bookType) VALUES (?, ?, ?, ?)";
                    dbConnection.query(mysqlCommand, [bookName, authorName, pageCount, bookType], (err, result) => {
                        if (err) {
                            console.error('Database query error:', err.stack);
                           
                        }
                    });
                    
                    channel.ack(message);

                }catch(error){
                    console.error('Error parsing message:', error);
                }
            }
        });
    }catch(error){
        console.error('Error:', error);
    }

}

