"use strict";

const URL = require('url');
const HTTP = require('http');
const PORT = 3000;

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'todos';
let db;

let todos = [];
let todosCounter = 0;

// Use connect method to connect to the server
function mongo() {
    MongoClient.connect(url, function (err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        db = client.db(dbName);

    });
}

mongo();

// INSERT todo
const insertDocuments = function (db, todo, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Insert some documents
    collection.insert(todo, function (err, result) {
        callback(result);
    });
}

// FIND todos
const findDocuments = function (db, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log("Found the following records");
        console.log(docs)
        callback(docs);
    });
}

// UPDATE todo
const updateDocument = function (db, todo, callback) {
    // Get the documents collection
    const collection = db.collection('todos');
    // Update document where a is 2, set b equal to 1
    collection.updateOne(todo, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Updated the document with the field a equal to 2");
        callback(result);
    });
}

// DELETE todo
const removeDocument = function (db, todo, callback) {
    // Get the documents collection
    const collection = db.collection('documents');
    // Delete document where a is 3
    collection.deleteOne(todo, function (err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Removed the document with the field a equal to 3");
        callback(result);
    });
}

function handleGetRequest(request, response) {
    findDocuments(db, function (todos) {
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Method', '*');
        response.setHeader('Access-Control-Allow-Methods', '*');
        response.setHeader('Access-Control-Allow-Headers', '*');
        response.end(JSON.stringify(todos));
    });

}

function handlePostRequest(request, response) {
    let body = '';
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function (data) {
        let parsedTodo = JSON.parse(body);
        let newTodo = createTodo(parsedTodo);
        insertDocuments(db, newTodo, function () {
            console.log(todos);
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Request-Method', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            response.setHeader('Access-Control-Allow-Headers', '*');
            response.end(body);
        });


    });
}

function handleDeleteRequest(request, response) {
    let body = '';
    request.on('data', function (data) {
        body += data;
    });
    removeDocument(db, todo, function () {
        request.on('end', function (data) {
            console.log('body', body);
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Request-Method', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            response.setHeader('Access-Control-Allow-Headers', '*');
            response.end(body);

        });
    });

}

function createTodo(todo) {

    let newTodo = { id: todosCounter++, body: todo.body };

    return newTodo
}

const SERVER = HTTP.createServer(function (request, response) {
    switch (request.method) {
        case 'GET':
            handleGetRequest(request, response);
            break;

        case 'POST':
            handlePostRequest(request, response);
            break;

        case 'PUT':
            handleDeleteRequest(request, response);
            break;

        default:
            response.setHeader('Access-Control-Allow-Origin', '*');
            response.setHeader('Access-Control-Request-Method', '*');
            response.setHeader('Access-Control-Allow-Methods', '*');
            response.setHeader('Access-Control-Allow-Headers', '*');
            response.end('ERROR you fool');
            break;
    }

});

SERVER.listen(PORT);