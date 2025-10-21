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

db.connect((err) => { //connect to the database
  if (err) { //if there is an error
    console.error('Error connecting to MySQL: ', + err.stack); //log the error message
    return;
  }
    console.log('Connected to the database.'); //log a success message
});

app.get('/api/mahasiswa', (req, res) => { //define a route to get all mahasiswa
    db.query('SELECT * FROM mahasiswa', (err, results) => { //query the database
        if (err) { //if there is an error
            console.error('Error fetching data: ', + err.stack); //log the error message
            res.status(500).send('Error fetching data'); //send an error response
            return;
        }
        res.json(results); //send the results as a JSON response
    });
});

app.post('/api/mahasiswa', (req, res) => { //define a route to add a new mahasiswa
    const { nama, nim, kelas, prodi } = req.body; //get the data from the request body

    if (!nama || !nim || !kelas || !prodi) { //validate the input data
        return res.status(400).send('All fields are required'); //send a bad request response
    }

    db.query( //insert the new mahasiswa into the database
        'INSERT INTO mahasiswa (nama, nim, kelas, prodi) VALUES (?, ?, ?, ?)', //SQL query with placeholders
        [nama, nim, kelas, prodi], //data to be inserted
        (err, result) => { //callback function
            if (err) { //if there is an error
                console.error(err); //log the error message
                return res.status(500).json('Error adding mahasiswa'); //send an error response
            }
            res.status(201).json({ message: 'Mahasiswa added successfully', id: result.insertId }); //send a success response
        }  
    );
});

app.put('/api/mahasiswa/:id', (req, res) => { //define a route to update a mahasiswa
    const userId = req.params.id; //get the id from the request parameters
    const { nama, nim, kelas, prodi } = req.body; //get the data from the request body
    db.query( //update the mahasiswa in the database
        'UPDATE mahasiswa SET nama = ?, nim = ?, kelas = ?, prodi = ? WHERE id = ?', //SQL query with placeholders
        [nama, nim, kelas, prodi, userId], //data to be updated
        (err, result) => { //callback function
            if (err) { //if there is an error
                console.error(err); //log the error message
                return res.status(500).json('Error updating mahasiswa'); //send an error response
            }
            res.json({ message: 'Mahasiswa updated successfully' }); //send a success response
        }
    );
});

app.delete('/api/mahasiswa/:id', (req, res) => { //define a route to delete a mahasiswa
    const userId = req.params.id; //get the id from the request parameters
    db.query( //delete the mahasiswa from the database
        'DELETE FROM mahasiswa WHERE id = ?', [userId], //SQL query with placeholder
        (err, result) => { //callback function
            if (err) { //if there is an error
                console.error(err); //log the error message
                return res.status(500).json('Error deleting mahasiswa'); //send an error response
            }
            res.json({ message: 'Mahasiswa deleted successfully' }); //send a success response
        }
    );
});