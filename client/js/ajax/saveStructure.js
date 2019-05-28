document.addEventListener("DOMContentLoaded", ()=>{
    var saveButton = document.querySelector("#save-button");
    var xhttp = new XMLHttpRequest();
    var structure;
    
    var manageStructure = () => {
        structure = MUEBLE.getFullStructureJSON();
        structure.designer = USER.getEmail();
        structure.date = USER.getCurrentDate();
        structure.slotId = USER.getSlotId();
        
        xhttp.onreadystatechange = function(data) {
            if ( (this.readyState == 4 && this.status == 200)) {
                console.log("AJAX OK: " + this.responseText);
            }
        };
        xhttp.open("POST", "saveStructure", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(structure));
    }
    saveButton.addEventListener("click", manageStructure);
});