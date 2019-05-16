var USER = {
    init: () =>{
        let userButton = document.querySelector("#session-button");
        let userCloseButton = document.querySelector("#session-close-button");
        let userExitButton = document.querySelector("#session-exit-button");
        
        userButton.addEventListener("click", USER.showUserUI);
        userCloseButton.addEventListener("click", USER.hideUserUI);
        userExitButton.addEventListener("click", USER.logout);
    },
    variables: {
        created: null,
        email: null,
        password: null,
        listMax: 5,
        list: null
    },
    getEmail: () =>{
        return USER.variables.email;
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
        document.querySelector("#login-button").value = "Guardar";
    },
    sendLoginError: () =>{
        document.querySelector(".password").classList.add("error");
    },
    showUserUI: () =>{
        document.querySelector(".dark-cover").setAttribute("style", "display: block;");
    },
    hideUserUI: () =>{
        if(event.target.id == "session-close-button"){
            document.querySelector(".dark-cover").setAttribute("style", "display: none;");
        }
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
    },
    loadModelList: (structures) => {
        let listElement = document.querySelector(".model-list");
        let i = 0;
        USER.cleanHTMLList();
        USER.variables.list = structures;

        while( i < USER.variables.listMax && i < structures.length ){
            listElement.appendChild(USER.createListElement(i, structures[i]));
            i++;
        }
    },
    cleanHTMLList: () => {
        let listElement = document.querySelector(".model-list");

        while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild);
        }
    },
    createListElement: (id, structure) => {
        var newModel = document.createElement("LI");
        let checkBox = document.createElement("INPUT");
        let description = document.createElement("SPAN");
        let color = document.createElement("DIV");
        
        newModel.setAttribute("class", "model-list-element");
        checkBox.setAttribute("value", id);
        checkBox.setAttribute("type", "checkbox");
        checkBox.setAttribute("class", "load-model-checkbox");
        description.textContent = id+1 + ", " + structure.width + "cm x " + structure.height + "cm, " + structure.date;
        color.setAttribute("class", "list-color");
        color.setAttribute("style", "background-color: #" + parseInt(structure.color).toString(16) + ";");

        newModel.appendChild(checkBox);
        newModel.appendChild(description);
        newModel.appendChild(color);

        return newModel;
    },
    logout: () =>{
        USER.setEmail(null);
        document.querySelector("#login").setAttribute("style", "display: block;");
        document.querySelector("#saveAndLoad").setAttribute("style", "display: none;");
        document.querySelector("#login-button").value = "Login";
    },
    setEmail: (email) => {
        USER.variables.email = email;
    },
    getList: () => {
        return USER.variables.list;
    }
}