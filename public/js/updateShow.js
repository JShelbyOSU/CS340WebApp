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

// Modify the objects we need
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
    let inputPenguinID = document.getElementById("updatePenguinID");
    let inputEmployeeID = document.getElementById("updateEmployeeID");

    // Get the values from the form fields
    let showIDValue = inputShowID.value;
    let showNameValue = inputShowName.value;
    let dateValue = inputDate.value;
    let startTimeValue = inputStartTime.value;
    let endTimeValue = inputEndTime.value;
    let ticketPriceValue = inputTicketPrice.value;
    let habitatIDValue = inputHabitatID.value;
    let penguinIDValue = inputPenguinID.value;
    let employeeIDValue = inputEmployeeID.value;
    
    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld

    /* if (isNaN(homeworldValue)) 
    {
        return;
    } */


    // Put our data we want to send in a javascript object
    let data = {
        showID: showIDValue,
        showName: showNameValue,
        date: dateValue,
        startTime: startTimeValue,
        endTime: endTimeValue,
        ticketPrice: ticketPriceValue,
        habitatID: habitatIDValue,
        penguinID: penguinIDValue,
        employeeID: employeeIDValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updateShowAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            //updateRow(xhttp.response, fullNameValue);
            updateRow(showIDValue, showNameValue, dateValue, startTimeValue,
                endTimeValue, ticketPriceValue, habitatIDValue, penguinIDValue,
                employeeIDValue)

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(showIDValue, showNameValue, dateValue, startTimeValue,
    endTimeValue, ticketPriceValue, habitatIDValue, penguinIDValue,
    employeeIDValue){

    //let parsedData = JSON.parse(data);
    
    let table = document.getElementById("showsTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == showIDValue) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            let td5 = updateRowIndex.getElementsByTagName("td")[5];
            let td6 = updateRowIndex.getElementsByTagName("td")[6];
            let td7 = updateRowIndex.getElementsByTagName("td")[7];
            let td8 = updateRowIndex.getElementsByTagName("td")[8];

            // Reassign homeworld to our value we updated to
            td1.innerHTML = showNameValue;
            td2.innerHTML = dateValue;
            td3.innerHTML = startTimeValue;
            td4.innerHTMl = endTimeValue;
            td5.innerHTML = ticketPriceValue;
            td6.innerHTML = habitatIDValue;
            td7.innerHTML = penguinIDValue;
            td8.innerHTML = employeeIDValue;
       }
    }
}
