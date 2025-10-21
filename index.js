const express = require('express'); //import express module
let mysql = require('mysql2'); //import mysql module
const app = express(); //create an express application
const port = 3000; //set the port number
app.use(express.json()); //middleware to parse JSON request body
app.use(express.urlencoded({ extended: true })); //middleware to parse URL-encoded request body

app.get('/', (req, res) => { //define a route for the root URL
  res.send('Hello World!'); //send a response
});

app.listen(port, () => { //start the server
  console.log(`Server is running on port ${port}`); //log a message to the console
});

const db = mysql.createConnection({ //create a connection to the database
  host: 'localhost', //database host
  user: 'root', //database user
  password: '', //database password
  database: 'biodata', //database name
  port: 3306 //database port
});