/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Get the objects we need to modify
let updateEmployeeForm = document.getElementById('updateEmployeeForm');

// Modify the objects we need
updateEmployeeForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("selectEmployeeID");
    let inputFirstName = document.getElementById("updateFirstName");
    let inputLastName = document.getElementById("updateLastName");
    let inputPosition = document.getElementById("updatePosition");
    let inputHireDate = document.getElementById("updateHireDate");
    let inputSalary = document.getElementById("updateSalary");
    let inputHabitat = document.getElementById("updateHabitatID");
    
    // Get the values from the form fields
    let employeeID = inputID.value;
    let firstNameValue = inputFirstName.value;
    let lastNameValue = inputLastName.value;
    let positionValue = inputPosition.value;
    let hireDateValue = inputHireDate.value;
    let salaryValue = inputSalary.value;
    let habitatValue = inputHabitat.value;

    // Put our data we want to send in a javascript object
    let data = {
        id: employeeID,
        firstName: firstNameValue,
        lastName: lastNameValue,
        position: positionValue,
        hireDate: hireDateValue,
        salary: salaryValue,
        habitatID: habitatValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateEmployeeAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the data in the table
            updateEmployeeRow(employeeID, firstNameValue, lastNameValue, positionValue, hireDateValue, salaryValue, habitatValue);

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

function updateEmployeeRow(employeeID, firstNameValue, lastNameValue, positionValue, hireDateValue, salaryValue, habitatValue){

    let table = document.getElementById("employeesTable");

    for (let i = 0, row; row = table.rows[i]; i++) {

       if (table.rows[i].getAttribute("data-value") == employeeID) {

            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            let td6 = updateRowIndex.getElementsByTagName("td")[6];

            td1.innerHTML = firstNameValue;
            td2.innerHTML = lastNameValue;
            td3.innerHTML = positionValue;
            td4.innerHTML = hireDateValue;
            td5.innerHTML = salaryValue.toFixed(2);
            td6.innerHTML = habitatValue;
       }
    }
}