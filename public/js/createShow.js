/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Grab data from createShowForm
let createShowForm = document.getElementById('createShowForm');
createShowForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputShowName = document.getElementById("createShowName");
    let inputDate = document.getElementById("createdate");
    let inputStartTime = document.getElementById("createstartTime");
    let inputEndTime = document.getElementById("createendTime");
    let inputTicketPrice = document.getElementById("createticketPrice");
    let inputHabitatID = document.getElementById("createhabitatID");

    // Handle the checkboxes slightly differently
    let inputPenguinID = document.querySelectorAll("input[name=createPenguinID]:checked");
    let inputEmployeeID = document.querySelectorAll("input[name=createEmployeeID]:checked");

    // Get the values from the form fields
    let showNameValue = inputShowName.value;
    let dateValue = inputDate.value;
    let startTimeValue = inputStartTime.value;
    let endTimeValue = inputEndTime.value;
    let ticketPriceValue = inputTicketPrice.value;
    let habitatIDValue = inputHabitatID.value;

    // Handle the checkboxes slightly differently
    let penguinIDs = Array.from(inputPenguinID).map(input => input.value);
    let employeeIDs = Array.from(inputEmployeeID).map(input => input.value);

    // Put our data we want to send in a javascript object
    let data = {
        showName: showNameValue,
        date: dateValue,
        startTime: startTimeValue,
        endTime: endTimeValue,
        ticketPrice: ticketPriceValue,
        habitatID: habitatIDValue,
        penguinID: penguinIDs,
        employeeID: employeeIDs
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/createShowAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //check xhttp.reponse first
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            showNameValue = '';
            dateValue = '';
            startTimeValue = '';
            endTimeValue = '';
            ticketPriceValue = '';
            habitatIDValue = '';
            penguinIDValue = '';
            employeeIDValue = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


// Adds the new row client side, so a refresh isn't needed
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("showsTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 10 cells
    let row = document.createElement("TR");

    let showIDCell = document.createElement("TD");
    let showNameCell = document.createElement("TD");
    let dateCell = document.createElement("TD");
    let startTimeCell = document.createElement("TD");
    let endTimeCell = document.createElement("TD");
    let ticketPriceCell = document.createElement("TD");
    let habitatIDCell = document.createElement("TD");
    let penguinIDCell = document.createElement("TD");
    let employeeIDCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    // Change date to a more readable format
    dateValue = new Date(newRow.date);
    dateValue = dateValue.toLocaleDateString();

    // Fill the cells with correct data
    showIDCell.innerText = newRow.showID;
    showNameCell.innerText = newRow.showName;
    dateCell.innerText = dateValue;
    startTimeCell.innerText = newRow.startTime;
    endTimeCell.innerText = newRow.endTime;
    ticketPriceCell.innerText = newRow.ticketPrice;
    habitatIDCell.innerText = newRow.habitatID;
    penguinIDCell.innerText = newRow.penguinNames;
    employeeIDCell.innerText = newRow.employeeNames;

    // Create the delete button
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deleteShow(newRow.showID);
    };

    // Add the cells to the row 
    row.appendChild(showIDCell);
    row.appendChild(showNameCell);
    row.appendChild(dateCell);
    row.appendChild(startTimeCell);
    row.appendChild(endTimeCell);
    row.appendChild(ticketPriceCell);
    row.appendChild(habitatIDCell);
    row.appendChild(employeeIDCell);
    row.appendChild(penguinIDCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.showID);
    
    // Add the row to the table
    currentTable.appendChild(row);
    let selectMenu = document.getElementById("selectShowID");
    let optionA = document.createElement("option");
    optionA.text = newRow.showID;
    optionA.value = newRow.showID;
    selectMenu.add(optionA);
}
