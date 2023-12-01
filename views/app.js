/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// App.js

/*
    SETUP
*/
var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 2955;                 // Set a port number at the top so it's easy to change in the future

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
        let query1 = "SELECT Shows.showID, Shows.showName, Shows.date, Shows.startTime, Shows.endTime, \
                            Shows.ticketPrice, Shows.habitatID, Penguins.name, Employees.lastName \
                        FROM Shows \
                        JOIN Penguins_Shows ON Shows.showID = Penguins_Shows.showID \
                        JOIN Penguins ON Penguins_Shows.penguinID = Penguins.penguinID \
                        JOIN Employees_Shows ON Shows.showID = Employees_Shows.showID \
                        JOIN Employees ON Employees_Shows.employeeID = Employees.employeeID;"

        let query2 = "SELECT * FROM Habitats;";

        let query3 = "SELECT * FROM Penguins;";

        let query4 = "SELECT * FROM Employees;";

        db.pool.query(query1, function(error, rows, fields){

            let shows = rows;

            if (error) {
                console.error("Error executing query:", error);
                return res.status(500).send('Internal Server Error');
            }

            rows.forEach(row => {
                row.date = row.date.toLocaleDateString();
            });

            db.pool.query(query2, (error, rows, fields) => {
            
                let habitats = rows;

                db.pool.query(query3, (error, rows, fields) => {
            
                    let penguins = rows;
                    
                    db.pool.query(query4, (error, rows, fields) => {
            
                        let employees = rows;

                        res.render('shows', {data: shows, habitats: habitats, penguins: penguins, employees: employees});

                    })

                })
                
            })

        })
    });

app.post('/createShowAjax', function(req, res) {
    let data = req.body;

    let query1 = `INSERT INTO Shows (showName, date, startTime, endTime, ticketPrice, habitatID) 
                    VALUES ('${data.showName}', '${data.date}', '${data.startTime}', '${data.endTime}', '${data.ticketPrice}', '${data.habitatID}');`;

    db.pool.query(query1, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            let query2 = `INSERT INTO Employees_Shows (employeeID, showID) 
                            VALUES ('${data.employeeID}', 
                                    (SELECT showID FROM Shows WHERE showName = '${data.showName}'));`;

            db.pool.query(query2, function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    let query3 = `INSERT INTO Penguins_Shows (penguinID, showID) 
                                    VALUES ('${data.penguinID}', 
                                            (SELECT showID FROM Shows WHERE showName = '${data.showName}'));`;

                    db.pool.query(query3, function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            let query4 = `SELECT * FROM Shows`;

                            db.pool.query(query4, function(error, rows, fields) {
                                if (error) {
                                    console.log(error);
                                    res.sendStatus(400);
                                } else {
                                    res.send(rows);
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.delete('/deleteShowAjax/', function(req,res,next){
    let data = req.body;
    let showID = parseInt(data.id);
    let deletePenguinsShows = `DELETE FROM Penguins_Shows WHERE showID = ?`;
    let deleteEmployeesShows = `DELETE FROM Employees_Shows WHERE showID = ?`
    let deleteShows= `DELETE FROM Shows WHERE showID = ?`;
  
  
        // Run the 1st query
        db.pool.query(deletePenguinsShows, [showID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            // Run the second query
            db.pool.query(deleteEmployeesShows, [showID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    db.pool.query(deleteShows, [showID], function(error, rows, fields) {

                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {
                            res.sendStatus(204);
                        }
                    })
                }
            })
        }
  })});

app.put('/updateShowAjax', function(req,res,next){
let data = req.body;

let showID = parseInt(data.showID);
let showName = data.showName;
let date = data.date;
let startTime = data.startTime;
let endTime = data.endTime;
let ticketPrice = parseInt(data.ticketPrice);
let habitatID = parseInt(data.habitatID);
let penguinID = parseInt(data.penguinID);
let employeeID = parseInt(data.employeeID);

let queryUpdateShow = `UPDATE Shows SET
    showName = ?,
    date = ?,
    startTime = ?,
    endTime = ?,
    ticketPrice = ?,
    habitatID = ?
    WHERE Shows.showID = ?`;

let selectShow = `SELECT * FROM Shows WHERE showID = ?`

        // Run the 1st query
        db.pool.query(queryUpdateShow, [showName, date, startTime, endTime, ticketPrice, habitatID, showID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            // If there was no error, we run our second query and return that data so we can use it to update the people's
            // table on the front-end
            else
            {
                // Run the second query
                db.pool.query(selectShow, [showID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.send(rows);
                    }
                })
            }
})});

app.get('/penguins', function(req, res)
    {
        let query1 = "SELECT * FROM Penguins;"

        let query2 = "SELECT * FROM Habitats;";

        db.pool.query(query1, function(error, rows, fields){

            let penguins = rows;

            rows.forEach(row => {
                row.dateOfBirth = row.dateOfBirth.toLocaleDateString();
            });

            db.pool.query(query2, (error, rows, fields) => {
            
                let habitats = rows;
                return res.render('penguins', {data: penguins, habitats: habitats});
            })

        })
        
        
    });

    app.post('/createPenguinAjax', function(req, res) 
    {
        // Capture the incoming data and parse it back to a JS object
        let data = req.body;
    
        let sex = data.sex;
        if (sex == null)
        {sex = 'NULL'}
        else if (sex == 'male')
        {sex = 0}
        else if (sex == 'female')
        {sex = 1}

    
        let habitatID = parseInt(data.habitatID);
        if (isNaN(habitatID))
        {
            habitatID = 'NULL'
        }

        let dateOfBirth = data.dateOfBirth;
        dateOfBirth = new Date(dateOfBirth);
        dateOfBirth = dateOfBirth.toISOString().slice(0, 10);
        
        // Create the query and run it on the database
        query1 = `INSERT INTO Penguins (name, dateOfBirth, sex, species, habitatID) VALUES ('${data.name}', '${dateOfBirth}', ${sex}, '${data.species}', ${habitatID})`;
        db.pool.query(query1, function(error, rows, fields){
    
            if (error) {
                console.log(error)
                res.sendStatus(400);
            }
            else
            {
                // If there was no error, perform a SELECT * on Penguins
                query2 = `SELECT * FROM Penguins;`;
                db.pool.query(query2, function(error, rows, fields){
    
                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    }
                    else
                    {
                        res.send(rows);
                    }
                })
            }
        })
    });

    app.delete('/deletePenguinAjax/', function(req,res,next){
        let data = req.body;
        let penguinID = parseInt(data.id);
        let deleteShowsPenguin = `DELETE FROM Penguins_Shows WHERE penguinID = ?`;
        let deletePenguin= `DELETE FROM Penguins WHERE penguinID = ?`;
      
      
            // Run the 1st query
            db.pool.query(deleteShowsPenguin, [penguinID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deletePenguin, [penguinID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
      })});

      app.put('/updatePenguinAjax', function(req,res,next){
        let data = req.body;
      
        let penguinID = parseInt(data.id);
        let name = data.name;
        let dateOfBirth = data.dateOfBirth;
        let sex = data.sex;
        let species = data.species;
        let habitatID = parseInt(data.habitatID);
      
        if (sex == null)
        {sex = 'NULL'}
        else if (sex == 'male')
        {sex = 0}
        else if (sex == 'female')
        {sex = 1}

        dateOfBirth = new Date(dateOfBirth);
        dateOfBirth = dateOfBirth.toISOString().slice(0, 10);

        let queryUpdatePenguin = `UPDATE Penguins 
                          SET name = ?, 
                              dateOfBirth = ?, 
                              sex = ?, 
                              species = ?, 
                              habitatID = ? 
                          WHERE Penguins.penguinID = ?`;

        let selectPenguin = `SELECT * FROM Penguins WHERE penguinID = ?`
      
              // Run the 1st query
              db.pool.query(queryUpdatePenguin, [name, dateOfBirth, sex, species, habitatID, penguinID], function(error, rows, fields){
                  if (error) {
      
                  // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                  console.log(error);
                  res.sendStatus(400);
                  }
                  else
                  {
                      // Run the second query
                      db.pool.query(selectPenguin, [penguinID], function(error, rows, fields) {
      
                          if (error) {
                              console.log(error);
                              res.sendStatus(400);
                          } else {
                              res.send(rows);
                          }
                      })
                  }
      })});

app.get('/employees', function(req, res)
{
    let query1 = "SELECT * FROM Employees;"

    let query2 = "SELECT * FROM Habitats;";

    db.pool.query(query1, function(error, rows, fields){

        let employees = rows;

        rows.forEach(row => {
            row.hireDate = row.hireDate.toLocaleDateString();
        });

        db.pool.query(query2, (error, rows, fields) => {
        
            let habitats = rows;
            return res.render('employees', {data: employees, habitats: habitats});
        })

    })
});

app.post('/createEmployeeAjax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    let habitatID = parseInt(data.habitatID);
    if (isNaN(habitatID))
    {
        habitatID = 'NULL'
    }

    let hireDate = data.hireDate;
    hireDate = new Date(hireDate);
    hireDate = hireDate.toISOString().slice(0, 10);

    query1 = `INSERT INTO Employees (firstName, lastName, position, hireDate, salary, habitatID) VALUES (?, ?, ?, ?, ?, ?);`;

    db.pool.query(query1, [data.firstName, data.lastName, data.position, hireDate, data.salary, habitatID], function(error, rows, fields){
        // Your error handling and follow-up code here

        if (error) {
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT * on Penguins
            query2 = `SELECT * FROM Employees;`;
            db.pool.query(query2, function(error, rows, fields){

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                }
                else
                {
                    res.send(rows);
                }
            })
        }
    })
});

app.put('/updateEmployeeAjax', function(req,res,next){
    let data = req.body;

    let employeeID = parseInt(data.id);
    let firstName = data.firstName;
    let lastName = data.lastName;
    let hireDate = data.hireDate;
    let salary = parseFloat(data.salary);
    let position = data.position;
    let habitatID = parseInt(data.habitatID);

    hireDate = new Date(hireDate);
    hireDate = hireDate.toISOString().slice(0, 10);

    let queryUpdateEmployee = `UPDATE Employees 
                                SET firstName = ?,
                                lastName = ?,
                                position = ?,
                                hireDate = ?,
                                salary = ?,
                                habitatID = ?
                                WHERE Employees.employeeID = ?`;

    let selectEmployee = `SELECT * FROM Employees WHERE employeeID = ?`
    
    db.pool.query(queryUpdateEmployee, [firstName, lastName, position, hireDate, salary, habitatID, employeeID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else
        {
            db.pool.query(selectEmployee, [data.id], function(error, rows, fields) {
    
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }
            })
        }
    });
});

app.delete('/deleteEmployeeAjax/', function(req,res,next){
    let data = req.body;
    let employeeID = parseInt(data.id);
    let deleteEmployee = `DELETE FROM Employees WHERE employeeID = ?`;
    let deleteShowsEmployee = `DELETE FROM Employees_Shows WHERE employeeID = ?`;

    db.pool.query(deleteShowsEmployee, [employeeID], function(error, rows, fields){
        if (error) {

        // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
        console.log(error);
        res.sendStatus(400);
        }

        else
        {
            db.pool.query(deleteEmployee, [employeeID], function(error, rows, fields) {

                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.sendStatus(204);
                }
            })
        }
})});

/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

/*
    DATABASE
*/

var db = require('./database/db-connector');const { devNull } = require('os');

