document.addEventListener("DOMContentLoaded", ()=>{
    var loginButton = document.querySelector("#login-button");
    var saveButton = document.querySelector("#save-button");
    var xhttp = new XMLHttpRequest();
    var user;
    
    var comprovar = () => {
        user = USER.getJSON();
        
        xhttp.onreadystatechange = function(data) {
            if (this.readyState == 4) {
                //console.log("AJAX OK: " + this.responseText);
                USER.checkLogin(this.status);
                if(this.status === 200){
                    USER.loadModelList(JSON.parse(this.response));
                }
            }
        };
        xhttp.open("POST", "login", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(user));        
    }
    loginButton.addEventListener("click", comprovar);
    saveButton.addEventListener("click", comprovar);
});