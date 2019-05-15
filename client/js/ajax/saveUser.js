document.addEventListener("DOMContentLoaded", ()=>{
    var saveButton = document.querySelector("#login-button");
    var xhttp = new XMLHttpRequest();
    var user;
    
    var comprovar = () => {
        user = USER.getJSON();
        
        xhttp.onreadystatechange = function(data) {
            if ( (this.readyState == 4 && this.status == 200)) {
                console.log("AJAX OK: " + this.responseText);
            }
            USER.checkLogin(this.status);
        };
        xhttp.open("POST", "saveUser", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(structure));        
    }
    saveButton.addEventListener("click", comprovar);
});