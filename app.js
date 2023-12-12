// App.js

/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

/*
    SETUP - Adapted from OSU CS340 ECapus NodeJS Starter App
*/
var express = require('express');
var app     = express();
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 2955;

/* 
    HANDLEBARS - Adapted from OSU CS340 ECapus NodeJS Starter App
*/

const { engine } = require('express-handlebars');
const exphbs = require('express-handlebars');
app.engine('.hbs', engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

/*
    ROUTES - Adapted from OSU CS340 ECapus NodeJS Starter App
*/

// Rendering index requires no js, just the .hbs files
app.get('/', function(req, res)
    {
        res.render('index');
    });

// Get shows, including READ on database
app.get('/shows', function(req, res)
    {
        // This query grabs necessary information from Shows, Employees and Penguins using the
        // Employees_Shows and Penguins_Shows intersection tables. GROUP_CONCAT is used to grab
        // all names, in a many:many relationship.
        let query1 = "SELECT \
        Shows.showID, \
        Shows.showName, \
        Shows.date, \
        Shows.startTime, \
        Shows.endTime, \
        Shows.ticketPrice, \
        Shows.habitatID, \
        GROUP_CONCAT(DISTINCT Employees.lastName SEPARATOR ', ') AS employeeNames, \
        GROUP_CONCAT(DISTINCT Penguins.name SEPARATOR ', ') AS penguinNames \
        FROM Shows \
        JOIN Employees_Shows ON Shows.showID = Employees_Shows.showID \
        JOIN Employees ON Employees_Shows.employeeID = Employees.employeeID \
        JOIN Penguins_Shows ON Shows.showID = Penguins_Shows.showID \
        JOIN Penguins ON Penguins_Shows.penguinID = Penguins.penguinID \
        GROUP BY Shows.showID;"

        // Simple SELECT for Habitatis
        let query2 = "SELECT * FROM Habitats;";

        // Simple SELECT for Penguins
        let query3 = "SELECT * FROM Penguins;";

        // Simple SELECT for Employees
        let query4 = "SELECT * FROM Employees;";

        db.pool.query(query1, function(error, rows, fields){

            let shows = rows;

            if (error) {
                console.error("Error executing query:", error);
                return res.status(500).send('Internal Server Error');
            }

            // Convert the date to a more readable format
            rows.forEach(row => {
                row.date = row.date.toLocaleDateString();
            });

            // Run the rest of the queries and pass information
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

// Handles creation of new Shows
app.post('/createShowAjax', function(req, res) {
    let data = req.body;

    // Query to add data into Shows
    let query1 = `INSERT INTO Shows (showName, date, startTime, endTime, ticketPrice, habitatID) 
                    VALUES (?, ?, ?, ?, ?, ?);`;

    db.pool.query(query1, [data.showName, data.date, data.startTime, data.endTime, data.ticketPrice, data.habitatID], function(error, result) {
        if (error) {

            console.log(error);
            res.sendStatus(400);

        } else {

            // Save showID for later use
            let showID = result.insertId;

            // Convert the checklist of employees to usable pairs in sql
            let employeesShowsValues = data.employeeID.map(employeeID => [employeeID, showID]);

            // Insert into Employees_Shows intersection table for each checked employee
            let query2 = `INSERT INTO Employees_Shows (employeeID, showID) 
                            VALUES ?`;

            db.pool.query(query2, [employeesShowsValues], function(error, rows, fields) {
                if (error) {

                    console.log(error);
                    res.sendStatus(400);

                } else {

                    // Convert the checklist of penguins to usable pairs in sql
                    let penguinsShowsValues = data.penguinID.map(penguinID => [penguinID, showID]);

                    // Insert into Penguins_Shows intersection table for each checked Penguin
                    let query3 = `INSERT INTO Penguins_Shows (penguinID, showID) 
                                    VALUES ?`;

                    db.pool.query(query3, [penguinsShowsValues], function(error, rows, fields) {
                        if (error) {
                            console.log(error);
                            res.sendStatus(400);
                        } else {

                            // Query to properly reload the table without refreshing
                            let query4 = "SELECT \
                            Shows.showID, \
                            Shows.showName, \
                            Shows.date, \
                            Shows.startTime, \
                            Shows.endTime, \
                            Shows.ticketPrice, \
                            Shows.habitatID, \
                            GROUP_CONCAT(DISTINCT Employees.lastName SEPARATOR ', ') AS employeeNames, \
                            GROUP_CONCAT(DISTINCT Penguins.name SEPARATOR ', ') AS penguinNames \
                            FROM Shows \
                            JOIN Employees_Shows ON Shows.showID = Employees_Shows.showID \
                            JOIN Employees ON Employees_Shows.employeeID = Employees.employeeID \
                            JOIN Penguins_Shows ON Shows.showID = Penguins_Shows.showID \
                            JOIN Penguins ON Penguins_Shows.penguinID = Penguins.penguinID \
                            GROUP BY Shows.showID;";

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

// Handles deleting a show
app.delete('/deleteShowAjax/', function(req,res,next){
    let data = req.body;
    let showID = parseInt(data.id);

    // Define the three queries to delete from Shows and both intersection tables
    let deletePenguinsShows = `DELETE FROM Penguins_Shows WHERE showID = ?`;
    let deleteEmployeesShows = `DELETE FROM Employees_Shows WHERE showID = ?`;
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

            // The rest of this section is fairly simple, just run all delete queries with showID
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


// Handles updating a show
app.put('/updateShowAjax', function(req,res,next){
    let data = req.body;

    // Defines all data into seperate variables for ease of use
    let showID = parseInt(data.showID);
    let showName = data.showName;
    let date = data.date;
    let startTime = data.startTime;
    let endTime = data.endTime;
    let ticketPrice = parseInt(data.ticketPrice);
    let habitatID = parseInt(data.habitatID);

    // Defines queries to clear intersection tables, then re-add to them later
    let deletePenguinsShows = `DELETE FROM Penguins_Shows WHERE showID = ?`;
    let deleteEmployeesShows = `DELETE FROM Employees_Shows WHERE showID = ?`;

    // Defines the main update query to the show
    let queryUpdateShow = `UPDATE Shows SET
        showName = ?,
        date = ?,
        startTime = ?,
        endTime = ?,
        ticketPrice = ?,
        habitatID = ?
        WHERE Shows.showID = ?`;

        // The rest of this section follows a very similar structure to the create section
        // except it runs the two DELETE queries, and runs an UPDATE instead of CREATE for shows
        db.pool.query(queryUpdateShow, [showName, date, startTime, endTime, ticketPrice, habitatID, showID], function(error, rows, fields){
            if (error) {

            console.log(error);
            res.sendStatus(400);
            }

            else
            {
        let employeesShowsValues = data.employeeID.map(employeeID => [employeeID, showID]);
            
            db.pool.query(deletePenguinsShows, [showID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {

            db.pool.query(deleteEmployeesShows, [showID], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {

            let query2 = `INSERT INTO Employees_Shows (employeeID, showID) 
                            VALUES ?`;

            db.pool.query(query2, [employeesShowsValues], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    let penguinsShowsValues = data.penguinID.map(penguinID => [penguinID, showID]);

                    let query3 = `INSERT INTO Penguins_Shows (penguinID, showID) 
                                    VALUES ?`;

                    db.pool.query(query3, [penguinsShowsValues], function(error, rows, fields) {
                        if (error) {

                            console.log(error);
                            res.sendStatus(400);

                        } else {

                            // Send back proper information to update without refreshing
                            let query4 = "SELECT \
                            Shows.showID, \
                            Shows.showName, \
                            Shows.date, \
                            Shows.startTime, \
                            Shows.endTime, \
                            Shows.ticketPrice, \
                            Shows.habitatID, \
                            GROUP_CONCAT(DISTINCT Employees.lastName SEPARATOR ', ') AS employeeNames, \
                            GROUP_CONCAT(DISTINCT Penguins.name SEPARATOR ', ') AS penguinNames \
                            FROM Shows \
                            JOIN Employees_Shows ON Shows.showID = Employees_Shows.showID \
                            JOIN Employees ON Employees_Shows.employeeID = Employees.employeeID \
                            JOIN Penguins_Shows ON Shows.showID = Penguins_Shows.showID \
                            JOIN Penguins ON Penguins_Shows.penguinID = Penguins.penguinID \
                            GROUP BY Shows.showID;";

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
            }})}
        })}}
    )}})
});

// Handles "get" for penguins, including Read
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

// Handles Penguin creation from the Penguins page
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


// Handles the deletion of Penguins from the Penguins page
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

// Handles updating Penguin from the Penguins page
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

// Handles "get" for the Employees page
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

// Handles creation of new Employees
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
        // Error handling
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

// Handles Update on Employees
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

// Handles Delete for Employee
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
    LISTENER - Adapted from OSU CS340 ECapus NodeJS Starter App
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});

/*
    DATABASE - Adapted from OSU CS340 ECapus NodeJS Starter App
*/

var db = require('./database/db-connector');const { devNull } = require('os');
