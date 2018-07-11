"use strict";

const URL = require('url');
const HTTP = require('http');
const PORT = 3000;

let todos = [];
let todosCounter = 0;

function handleGetRequest(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Request-Method', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.end(JSON.stringify(todos));
}

function handlePostRequest(request, response) {
    let body = '';
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function (data) {
        let parsedTodo = JSON.parse(body);
        let newTodo = createTodo(parsedTodo);
        todos.push(newTodo);
        console.log(todos);
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Method', '*');
        response.setHeader('Access-Control-Allow-Methods', '*');
        response.setHeader('Access-Control-Allow-Headers', '*');
        response.end(body);

    });
}

function handleDeleteRequest(request, response) {
    let body = '';
    request.on('data', function (data) {
        body += data;
    });

    request.on('end', function (data) {
        console.log('body', body);
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Method', '*');
        response.setHeader('Access-Control-Allow-Methods', '*');
        response.setHeader('Access-Control-Allow-Headers', '*');
        response.end(body);

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