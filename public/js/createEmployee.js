/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Get the objects we need to modify
let addEmployeeForm = document.getElementById('createEmployeeForm');

// Modify the objects we need
// Adapted from OSU CS340 ECapus NodeJS Starter App
addEmployeeForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputFirstName = document.getElementById("createFirstName");
    let inputLastName = document.getElementById("createLastName");
    let inputPosition = document.getElementById("createPosition");
    let inputHireDate = document.getElementById("createHireDate");
    let inputSalary = document.getElementById("createSalary");
    let inputHabitatID = document.getElementById("createHabitatID");

    // Get the values from the form fields
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let positionValue = inputPosition.value;
    let hireDateValue = inputHireDate.value;
    let salaryValue = inputSalary.value;
    let habitatIDValue = inputHabitatID.value;

    // Put our data we want to send in a javascript object
    let data = {
        firstName: firstNameValue,
        lastName: lastNameValue,
        position: positionValue,
        hireDate: hireDateValue,
        salary: salaryValue,
        habitatID: habitatIDValue
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/createEmployeeAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToEmployeeTable(xhttp.response);

            // Clear the input fields for another transaction
            inputFirstName.value = '';
            inputLastName.value = '';
            inputPosition.value = '';
            inputHireDate.value = '';
            inputSalary.value = '';
            inputHabitatID.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from Employees
// Adapted from OSU CS340 ECapus NodeJS Starter App
addRowToEmployeeTable = (data) => {

    let currentTable = document.getElementById("employeesTable");

    let newRowIndex = currentTable.rows.length;

    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let firstNameCell = document.createElement("TD");
    let lastNameCell = document.createElement("TD");
    let positionCell = document.createElement("TD");
    let hireDateCell = document.createElement("TD");
    let salaryCell = document.createElement("TD");
    let habitatIDCell = document.createElement("TD");
    let deleteCell = document.createElement("button");

    hireDate = new Date(newRow.hireDate);
    hireDate = hireDate.toLocaleDateString();

    // Fill the cells with correct data
    idCell.innerText = newRow.employeeID;
    firstNameCell.innerText = newRow.firstName;
    lastNameCell.innerText = newRow.lastName;
    positionCell.innerText = newRow.position;
    hireDateCell.innerText = hireDate;
    salaryCell.innerText = newRow.salary;
    habitatIDCell.innerText = newRow.habitatID;

    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteEmployee(newRow.employeeID);
    };

    // Add the cells to the row
    row.appendChild(idCell);
    row.appendChild(firstNameCell);
    row.appendChild(lastNameCell);
    row.appendChild(positionCell);
    row.appendChild(hireDateCell);
    row.appendChild(salaryCell);
    row.appendChild(habitatIDCell);
    row.appendChild(deleteCell);

    row.setAttribute('data-value', newRow.employeeID);

    // Add the row to the table
    currentTable.appendChild(row);
}