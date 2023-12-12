/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// deleteEmployee.js
// Adapted from OSU CS340 ECapus NodeJS Starter App
function deleteEmployee(employeeID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: employeeID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/deleteEmployeeAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Remove the employee row from the table
            deleteRow(employeeID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

// Adapted from OSU CS340 ECapus NodeJS Starter App
function deleteRow(employeeID){
    let table = document.getElementById("employeesTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through each row
       if (table.rows[i].getAttribute("data-value") == employeeID) {
            table.deleteRow(i);
            break;
       }
    }
}