/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Get the objects we need to modify
let addPenguinForm = document.getElementById('createPenguinForm');

// Modify the objects we need
addPenguinForm.addEventListener("submit", function (e) {
    
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputName = document.getElementById("createName");
    let inputdateOfBirth = document.getElementById("createdateOfBirth");
    let inputSex = document.getElementById("createSex");
    let inputSpecies = document.getElementById("createSpecies");
    let inputHabitat = document.getElementById("createHabitatID");

    // Get the values from the form fields
    let nameValue = inputName.value;
    let dateOfBirthValue = inputdateOfBirth.value;
    let sexValue = inputSex.value;
    let speciesValue = inputSpecies.value;
    let habitatValue = inputHabitat.value;

    // Put our data we want to send in a javascript object
    let data = {
        name: nameValue,
        dateOfBirth: dateOfBirthValue,
        sex: sexValue,
        species:speciesValue,
        habitatID:habitatValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/createPenguinAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            addRowToTable(xhttp.response);

            // Clear the input fields for another transaction
            inputName.value = '';
            inputdateOfBirth.value = '';
            inputSex.value = '';
            inputSpecies.value = '';
            inputHabitat.value = '';
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Creates a single row from an Object representing a single record from penguins
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("penguinsTable");

    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;

    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]

    // Create a row and 8 cells
    let row = document.createElement("TR");
    let idCell = document.createElement("TD");
    let nameCell = document.createElement("TD");
    let dateOfBirthCell = document.createElement("TD");
    let sexCell = document.createElement("TD");
    let speciesCell = document.createElement("TD");
    let habitatCell = document.createElement("TD");
    let deleteCell = document.createElement("TD");

    dateOfBirth = new Date(newRow.dateOfBirth);
    dateOfBirth = dateOfBirth.toLocaleDateString();

    // Fill the cells with correct data
    idCell.innerText = newRow.penguinID;
    nameCell.innerText = newRow.name;
    dateOfBirthCell.innerText = dateOfBirth;
    sexCell.innerText = newRow.sex;
    speciesCell.innerText = newRow.species;
    habitatCell.innerText = newRow.habitatID;
    
    deleteCell = document.createElement("button");
    deleteCell.innerHTML = "Delete";
    deleteCell.onclick = function(){
        deletePenguin(newRow.penguinID);
    };

    // Add the cells to the row 
    row.appendChild(idCell);
    row.appendChild(nameCell);
    row.appendChild(dateOfBirthCell);
    row.appendChild(sexCell);
    row.appendChild(speciesCell);
    row.appendChild(habitatCell);
    row.appendChild(deleteCell);

    // Add a row attribute so the deleteRow function can find a newly added row
    row.setAttribute('data-value', newRow.penguinID);

    // Add the row to the table
    currentTable.appendChild(row);

    let selectMenu = document.getElementById("selectPenguinID");
    let optionA = document.createElement("option");
    optionA.text = newRow.penguinID;
    optionA.value = newRow.penguinID;
    selectMenu.add(optionA);
}
