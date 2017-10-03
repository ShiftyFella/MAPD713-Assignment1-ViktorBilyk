//intial params
var SERVER_NAME = 'Product Engine BackEnd';
var PORT = 3000;
var HOST = '127.0.0.1';
var getRequestCounter = 0;
var postRequestCounter = 0;

//required dependencies
var restify = require('restify');
var productsInMemDB = require('save')('products');

//creating server
server = restify.createServer({ name: SERVER_NAME});

//starting server at desired Host:Port
server.listen(PORT, HOST, function () {
    console.log("Server %s started listening at %s", server.name, server.url);
    console.log("Avaliable endpoints:");
    console.log("%s/sendGet  --- Shows all products", server.url);
    console.log("%s/sendPost --- Add products in format {id,product: name,price: price}", server.url);
    console.log("%s/sendDelete --- Deletes all products", server.url);
});

//ability to use POST and mapping request parametrs
server.use(restify.fullResponse());
server.use(restify.bodyParser());

//GET endpoint that displays All information
server.get('/sendGet', function (req, res, next) {
    getRequestCounter++;
    console.log("---> sendGet: request received");
    productsInMemDB.find({}, function (error, products) {
        console.log("---< sendGet: sending response");
        res.send(products);
    });
    console.log("Processed Request Counters ---> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
});