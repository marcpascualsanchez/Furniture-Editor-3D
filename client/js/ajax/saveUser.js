document.addEventListener("DOMContentLoaded", ()=>{
    var saveButton = document.querySelector("#login-button");
    var xhttp = new XMLHttpRequest();
    var user;
    
    var comprovar = () => {
        user = USER.getJSON();
        
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4) {
                //console.log("AJAX OK: " + this.responseText);
                USER.checkLogin(this.status);
                USER.loadModelList(JSON.parse(this.response));
            }
        };
        xhttp.open("POST", "login", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(user));        
    }
    saveButton.addEventListener("click", comprovar);
});