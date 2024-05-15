const fs = require('fs');
const server = require('http').createServer();

server.on('request' , (request , response)=>{       
    //  Solution 1 : Default Method

    // fs.readFile('./txt/test.txt' , 'utf-8' , (error, data)=>{
    //     if(error) console.log(error);
    //     response.end(data);
    // });

    // Solution 2 : Using Stream (Back Pressure Issue (Response is not sending data at the same speed as it is being written by the stream))
    // const streamData = fs.createReadStream('./txt/test.txt');
    // streamData.on('data' , (data_chunk)=>{
    //     response.write(data_chunk);
    // });
    // streamData.on('end' , ()=>{
    //     response.end();
    // });
    // streamData.on('error' , (error)=>{
    //     response.statusCode = 500;
    //     response.end("File Not Found");
    // })


    // Solution 3
    const streamData = fs.createReadStream('./txt/test.txt');
    streamData.pipe(response);
    // From where Data Comes . pipe . To where Data is Written
});

server.listen(8000 , '127.0.0.1' , ()=>{
    console.log("Server Running On Port 8000");
});