/* 
    Citation for the following file:
    Date: 11/30/2023
    Adapted from OSU CS340 ECampus NodeJs Starter App
    This file is adapted from the provided sample code, following the instructions
     to fit our own project
    Source URL: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/
*/

// Get the objects we need to modify
let updatePenguinForm = document.getElementById('updatePenguin');

// Modify the objects we need
// Adapted from OSU CS340 ECapus NodeJS Starter App
updatePenguinForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputID = document.getElementById("selectPenguinID");
    let inputName = document.getElementById("updateName");
    let inputdateOfBirth = document.getElementById("updatedateOfBirth");
    let inputSex = document.getElementById("updateSex");
    let inputSpecies = document.getElementById("updateSpecies");
    let inputHabitat = document.getElementById("updateHabitatID");
    //let inputHabitat = document.getElementById("input-habitat-update");

    // Get the values from the form fields
    let penguinID = inputID.value;
    let nameValue = inputName.value;
    let dateOfBirthValue = inputdateOfBirth.value;
    let sexValue = inputSex.value;
    let speciesValue = inputSpecies.value;
    let habitatValue = inputHabitat.value;
    
    // Put our data we want to send in a javascript object
    let data = {
        id: penguinID,
        name: nameValue,
        dateOfBirth: dateOfBirthValue,
        sex: sexValue,
        species: speciesValue,
        habitatID: habitatValue,
    }
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updatePenguinAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Update the data in the table
            updatePenguinRow(penguinID, nameValue, dateOfBirthValue, sexValue, speciesValue, habitatValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

// Adapted from OSU CS340 ECapus NodeJS Starter App
function updatePenguinRow(penguinID, nameValue, dateOfBirthValue, sexValue, speciesValue, habitatValue){

    let table = document.getElementById("penguinsTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == penguinID) {

            // Get the location of the row where we found the matching penguin ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            let sex = sexValue;
            if (sex == null)
            {sex = 'NULL'}
            else if (sex == 'male')
            {sex = 0}
            else if (sex == 'female')
            {sex = 1}
    

            // Get td of name value
            let td1 = updateRowIndex.getElementsByTagName("td")[1];
            let td2 = updateRowIndex.getElementsByTagName("td")[2];
            let td3 = updateRowIndex.getElementsByTagName("td")[3];
            let td4 = updateRowIndex.getElementsByTagName("td")[4];
            let td5 = updateRowIndex.getElementsByTagName("td")[5];

            // Reassign homeworld to our value we updated to
            td1.innerHTML = nameValue;
            td2.innerHTML = dateOfBirthValue;
            td3.innerHTML = sex;
            td4.innerHTML = speciesValue;
            td5.innerHTML = habitatValue
       }
    }
}