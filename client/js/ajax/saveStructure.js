document.addEventListener("DOMContentLoaded", ()=>{
    var saveButton = document.querySelector("#save-button");
    var xhttp = new XMLHttpRequest();
    var structure;
    
    var comprovar = () => {
        structure = MUEBLE.getFullStructureJSON();
        structure.designer = USER.getEmail();
        structure.date = getCurrentDate();
        
        xhttp.onreadystatechange = function(data) {
            if ( (this.readyState == 4 && this.status == 200)) {
                console.log("AJAX OK: " + this.responseText);
            }
        };
        xhttp.open("POST", "saveStructure", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(structure));
    }
    saveButton.addEventListener("click", comprovar);

    var getCurrentDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var hh = String(today.getHours());
        var mi = String(today.getMinutes());
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January = 0
        var yyyy = today.getFullYear();
    
        today = hh + ":" + mi + ", " + dd + '/' + mm + '/' + yyyy;
        return today;
    }
});