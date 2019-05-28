document.addEventListener("DOMContentLoaded", ()=>{
    var forgotButton = document.querySelector("#forgot-button");
    var output = document.querySelector("#output-text");
    var xhttp = new XMLHttpRequest();
    var userEmail;
    
    var managePassword = () => {
        userEmail = {email: document.querySelector("#forgot-email").value};
        
        xhttp.onreadystatechange = function(data) {
            if ( this.readyState == 4 ) {
                output.textContent = this.responseText;
                if ( this.status == 200 ){
                    output.classList.remove("error-email");
                    output.classList.add("correct-email");
                }else{
                    output.classList.remove("correct-email");
                    output.classList.add("error-email");
                }
            }
        };
        xhttp.open("POST", "forgotPassword", true);
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify(userEmail));        
    }
    forgotButton.addEventListener("click", managePassword);
});