var USER = {
    init: () =>{
        let userButton = document.querySelector("#session-button");
        let userCloseButton = document.querySelector("#session-close-button");
        
        userButton.addEventListener("click", USER.showUserUI);
        userCloseButton.addEventListener("click", USER.hideUserUI);
    },
    variables: {
        created: null,
        email: null,
        password: null
    },
    checkLogin: (code) =>{
        if(code === 200){
            USER.enableSaveAndLoad();
        }else{
            USER.sendLoginError();
        }
    },
    enableSaveAndLoad: () =>{
        document.querySelector("#login").setAttribute("style", "display: none;");
        document.querySelector("#saveAndLoad").setAttribute("style", "display: block;");
    },
    sendLoginError: () =>{
        document.querySelector(".password").classList.add("error");
    },
    showUserUI: () =>{
        document.querySelector(".dark-cover").setAttribute("style", "display: block;");
    },
    hideUserUI: () =>{
        document.querySelector(".dark-cover").setAttribute("style", "display: none;");
    },
    getJSON: () => {
        USER.getFormData();

        let result = {
            email: USER.variables.email,
            password: USER.variables.password,
        }

        return result;
    },
    getFormData: () => {
        USER.variables.created = true;
        USER.variables.email = document.querySelector(".email-field").value;
        USER.variables.password = document.querySelector(".password-field").value;
    }
}

//activar
    //class="dark-cover"
    //id="login"