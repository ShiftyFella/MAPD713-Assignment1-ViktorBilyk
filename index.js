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

//POST endpoint that adds to memory database received product
server.post('/sendPost', function (req, res, next) {

    postRequestCounter++;
    console.log("---> sendPost: request received");

    //if one or more parametrs are not supplied show error
    if (req.params.product === undefined ) {
        console.log("--< sendPost: Error - No Product Name");
        console.log("Processed Request Counters ---> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
        return next(new restify.InvalidArgumentError('Product name must be entered'));
    }

    if (req.params.price === undefined) {
        console.log("--< sendPost: Error - No Product Price");
        console.log("Processed Request Counters ---> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
        return next(new restify.InvalidArgumentError('Product price should be supplied'));
    }

    //creating product object
    var newProduct = {
        product: req.params.product,
        price: req.params.price
    };

    //saving product in memory, if error, display error, otherwise send product info in body response
    productsInMemDB.create(newProduct, function (error, product) {
        if (error) {
            console.log("---< sendPost: Error creating a product");
            console.log("Processed Request Counters ---> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
            return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
        }
        else {
            res.send(201,product);
            console.log("---< sendPost: sending product response");
        }
    });
    console.log("Processed Request Counters ---> GET: %s | POST: %s", getRequestCounter, postRequestCounter);
});

//DELETE endpoint that deletes ALL products from memory storage
server.del('/sendDelete', function (req, res, next) {
    console.log("--> sendDelete: request received");
    //find all products if error, display it, otherwise send OK response after deletion
    productsInMemDB.deleteMany({}, function (error, products) {
        if (error) {
            console.log("--< sendDelete: Error deleting products");
            return next(new restify.InvalidArgumentError(JSON.stringify(error.errors)));
        }
        else {
            res.send(200);
            console.log("--< sendDelete: All products deleted");
        }
    });
});

//JS Sequence Diagrams

//GET Method: filename: get-diagram.svg
//User->Web API: HTTP Request
//Note right of User: GET:\n /sendGet
//Web API->Data: find products
//Data-->Web API: Return products
//Web API-->User: HTTP Response
//Note right of User: {product:"name",price:"price",id:"id"}

