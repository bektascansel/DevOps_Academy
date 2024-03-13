const amqp = require("amqplib");
const dbConnection = require("./Helper/postgre");


dbConnection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
    } else {
        console.log('Database connected');
    }
});

consumeRabbitMq()

async function consumeRabbitMq() {

    try {

        const connection = await amqp.connect('amqp://172.18.0.7');
        const channel = await connection.createChannel();
        await channel.assertQueue("BooksQuery", { durable: false });

        console.log("Waiting for messages in the queue...");

        channel.consume("BooksQuery", function (message) {

            if (message !== null) {

                try {
                    const parsedMessage = JSON.parse(message.content.toString()); 
                    const { bookName, authorName, pageCount, bookType } = parsedMessage;

                    const addedBook = {
                        name: bookName,
                        authorName: authorName,
                        pageCount: pageCount,
                        bookType: bookType,
                    };

                    const pgCommand = `INSERT INTO BookStore (bookName, authorName, pageCount, bookType) VALUES ($1, $2, $3, $4)`;
                    dbConnection.query(pgCommand, [bookName, authorName, pageCount, bookType], (err, result) => {
                        if (err) {
                            console.error('Database query error:', err.stack);
                            
                        }
                    });

                    channel.ack(message);

                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            }
        });
    } catch (error) {
        console.error("Error:", error);
    }
}


 
   











    
