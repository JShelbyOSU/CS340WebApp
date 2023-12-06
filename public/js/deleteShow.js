/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/


// Handles deletion of a show
function deleteShow(showID) {

    // Put our data we want to send in a javascript object
    let data = {
        id: showID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/deleteShowAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Delete the row from the table
            deleteRow(showID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}


function deleteRow(showID){

    // Get a reference to the table
    let table = document.getElementById("showsTable");

    // Iterate through the table until the correct row is found
    for (let i = 0, row; row = table.rows[i]; i++) {

       let row = table.rows[i];
       if (row.getAttribute("data-value") == showID) {

            table.deleteRow(i);
            break;

       }
    }
}
