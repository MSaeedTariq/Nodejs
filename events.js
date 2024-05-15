const eventEmiter = require('events');
const http = require('http');

// class Sales extends eventEmiter{
//     constructor(){
//         super();
//     }
// }

// const saleEmiter = new Sales();

// saleEmiter.on('newSale' , ()=>{
//     console.log("New Sale Occured");
// });

// saleEmiter.on('newSale' , (items)=>{
//     console.log(`New sale of ${items} items occured`);
// });

// saleEmiter.emit('newSale' , 9);




// Server Events //

const server  = http.createServer();

server.on('request' , (request, response)=>{
    console.log("Request Received");
    response.end('Request Received');
});

server.listen(8000 , '127.0.0.1' , ()=>{
    console.log("Server Listening On Port 8000");
});
