/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Get the objects we need to modify
let updateShowForm = document.getElementById('updateShow');
updateShowForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputShowID = document.getElementById("selectShowID");
    let inputShowName = document.getElementById("updateShowName");
    let inputDate = document.getElementById("updateDate");
    let inputStartTime = document.getElementById("updateStartTime");
    let inputEndTime = document.getElementById("updateEndTime");
    let inputTicketPrice = document.getElementById("updateTicketPrice");
    let inputHabitatID = document.getElementById("updateHabitatID");

    // Handle the checkboxes slightly differently
    let inputPenguinID = document.querySelectorAll("input[name=updatePenguinID]:checked");
    let inputEmployeeID = document.querySelectorAll("input[name=updateEmployeeID]:checked");

    // Get the values from the form fields
    let showIDValue = inputShowID.value;
    let showNameValue = inputShowName.value;
    let dateValue = inputDate.value;
    let startTimeValue = inputStartTime.value;
    let endTimeValue = inputEndTime.value;
    let ticketPriceValue = inputTicketPrice.value;
    let habitatIDValue = inputHabitatID.value;
    let penguinIDs = Array.from(inputPenguinID).map(input => input.value);
    let employeeIDs = Array.from(inputEmployeeID).map(input => input.value);

    // Put our data we want to send in a javascript object
    let data = {
        showID: showIDValue,
        showName: showNameValue,
        date: dateValue,
        startTime: startTimeValue,
        endTime: endTimeValue,
        ticketPrice: ticketPriceValue,
        habitatID: habitatIDValue,
        penguinID: penguinIDs,
        employeeID: employeeIDs,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateShowAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data){

    // Create a reference to a table
    let table = document.getElementById("showsTable");

    // Parse through the JSON data
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    for (let i = 0, row; row = table.rows[i]; i++) {
       // Iterate through rows until the correct row is found
       if (table.rows[i].getAttribute("data-value") == newRow.showID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get all tds
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            let td6 = updateRowIndex.getElementsByTagName("td")[6];
            let td7 = updateRowIndex.getElementsByTagName("td")[7];
            let td8 = updateRowIndex.getElementsByTagName("td")[8];

            // Make date more readable
            dateValue = new Date(newRow.date);
            dateValue = dateValue.toLocaleDateString();

            // Set data to new data client side
            td1.innerHTML = newRow.showName;
            td2.innerHTML = dateValue;
            td3.innerHTML = newRow.startTime;
            td4.innerHTMl = newRow.endTime;
            td5.innerHTML = newRow.ticketPrice;
            td6.innerHTML = newRow.habitatID;
            td7.innerHTML = newRow.employeeNames;
            td8.innerHTML = newRow.penguinNames;
       }
    }
}
