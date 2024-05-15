const { log } = require('console');
const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate.js');
// Blocking Or Sync Mehtod //

// const text = fs.readFileSync('./txt/input.txt' , 'utf-8');
// console.log(text);
// const write = `This is what we know about the avacados: ${text}.\n Created On: ${Date.now()}`;
// fs.writeFileSync('./txt/input.txt' , write);
// console.log("FIle Written");


// Non-Blocking Or ASync Mehtod //

// fs.readFile('./txt/start.txt' , 'utf-8' , (err , data)=>{
//     fs.readFile(`./txt/${data}.txt` , 'utf-8' , (err , data2)=>{
//         console.log(data2);
//         fs.readFile(`./txt/append.txt` , 'utf-8' , (err , data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt', `${data2}.\n${data3}` , 'utf-8'  ,  (err)=>{
//                 console.log("File Is Written! ");
//             });
//         });
//     });
// });
// console.log("Reading File!");

const homePage = fs.readFileSync('./templates/overview.html' , 'utf-8');
const cardPage = fs.readFileSync('./templates/card.html' , 'utf-8');
const productPage = fs.readFileSync('./templates/product.html' , 'utf-8');

const fileData = fs.readFileSync('./dev-data/data.json' , 'utf-8');
const dataObject = JSON.parse(fileData);

const slugs = dataObject.map(data => slugify(data.productName , {lower: true}));

// Node Js Server
const server = http.createServer((request , response)=>{
    const {query , pathname} = url.parse(request.url , true);
    if(pathname === '/' || pathname === 'home'){
        response.writeHead('200' , {
            'Content-type' : 'text/html'
        });
        const pageRender = dataObject.map(element => replaceTemplate(cardPage , element)).join('');
        const cardRender = homePage.replace('{product_card}' , pageRender);
        response.end(cardRender);
    }else if(pathname === '/product'){
        response.writeHead('200' , {
            'Content-type' : 'text/html'
        });
        const productData = dataObject[query.id];
        const productOutputPage = replaceTemplate(productPage , productData);
        response.end(productOutputPage);
    }else if(pathname === '/api'){
        response.writeHead(200 , {
            'Content-type' : 'application/json'
        });
        response.end(fileData);
    }
    else{
        response.writeHead('404' , {
            'Content-type' : 'text/html'
        });
        response.end("<h1>404! Page Not Found</h1>");
    }
    
});

server.listen(8000 , '127.0.0.1' , ()=>{
console.log("Server is running on port 8000");
});