//intial params
var SERVER_NAME = 'Product Engine BackEnd';
var PORT = 3000;
var HOST = '127.0.0.1';
var getRequestCounter = 0;
var postRequestCounter = 0;

//required dependencies
var restify = require('restify');
var productsInMemDB = require('save')('products');