// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
PORT        = 8312;                 // Set a port number at the top so it's easy to change in the future

/* 
    HANDLEBARS
*/

const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/

app.get('/', function(req, res)
    {
        res.render('index');                    // Note the call to render() and not send(). Using render() ensures the templating engine
    });                                         // will process this file, before sending the finished HTML to the client.

app.get('/shows', function(req, res)
    {
        res.render('shows');
    });

app.get('/penguins', function(req, res)
    {
        let query1 = "SELECT * FROM Penguins;"

        db.pool.query(query1, function(error, rows, fields){

            rows.forEach(row => {
                row.dateOfBirth = row.dateOfBirth.toLocaleDateString();
            });

            res.render('penguins', {data: rows});

        })
        
    });

app.get('/employees', function(req, res)
    {
        res.render('employees');
    });

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

/*
    DATABASE
*/

var db = require('./database/db-connector')
