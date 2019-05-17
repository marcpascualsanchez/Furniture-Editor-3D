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
        USER.resetErrors();
        if(code === 200){
            USER.enableSaveAndLoad();
        }else if(code === 400){
            USER.sendEmailError();
        }else if(code === 401){
            USER.sendPasswordError();
        }
    },
    enableSaveAndLoad: () =>{
        document.querySelector("#login").setAttribute("style", "display: none;");
        document.querySelector("#saveAndLoad").setAttribute("style", "display: block;");
        document.querySelector("#session-button").text = "Guardar";
    },
    sendPasswordError: () =>{
        document.querySelector(".pass-error").classList.add("fas", "fa-ban");
    },
    sendEmailError: () =>{
        document.querySelector(".email-error").classList.add("fas", "fa-ban");
    },
    resetErrors: () =>{
        document.querySelector(".pass-error").classList.remove("fas", "fa-ban");
        document.querySelector(".email-error").classList.remove("fas", "fa-ban");
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
        let emptySlot;
        //let sortedStructures = USER.sortStructuresBySlotId(structures);
        USER.cleanHTMLList();
        USER.variables.list = structures;

        for (let i = 0; i < USER.variables.listMax; i++) {
            emptySlot = true;

            for (let j = 0; j < structures.length; j++) {
                if(structures[j].slotId == i){
                    listElement.appendChild(USER.createListElement(structures[j]));
                    emptySlot = false;
                }
            }

            if(emptySlot){
                listElement.appendChild(USER.createEmptyElement(i));
            }
        }
    },
    cleanHTMLList: () => {
        let listElement = document.querySelector(".model-list");

        while (listElement.firstChild) {
            listElement.removeChild(listElement.firstChild);
        }
    },
    createListElement: (structure) => {
        var newModel = document.createElement("LI");
        let checkBox = document.createElement("INPUT");
        let description = document.createElement("DIV");
        let dimensions = document.createElement("SPAN");
        let date = document.createElement("SPAN");
        let colorContainer = document.createElement("DIV");
        let color = document.createElement("DIV");
        let hourIcon = document.createElement("I");

        newModel.setAttribute("class", "model-list-element");
        checkBox.setAttribute("value", structure.slotId);
        checkBox.setAttribute("type", "radio");
        checkBox.setAttribute("name", "model-radio");
        checkBox.setAttribute("class", "load-model-checkbox");
        checkBox.setAttribute("class", "load-model-checkbox col-1");
        hourIcon.setAttribute("class", "far fa-clock");
        description.setAttribute("class", "col-9");
        dimensions.textContent = structure.width + "cm x " + structure.height + "cm";
        date.textContent = structure.date;
        colorContainer.setAttribute("class", "col-2 color-circle-container");
        color.setAttribute("class", "color-circle");
        color.setAttribute("style", "background-color: #" + parseInt(structure.color).toString(16) + ";");

        description.appendChild(dimensions);
        description.appendChild(hourIcon);
        description.appendChild(date);
        colorContainer.appendChild(color);
        newModel.appendChild(checkBox);
        newModel.appendChild(description);
        newModel.appendChild(colorContainer);

        return newModel;
    },
    createEmptyElement: (id) => {
        var newModel = document.createElement("LI");
        let checkBox = document.createElement("INPUT");
        let description = document.createElement("SPAN");
        
        newModel.setAttribute("class", "model-list-element");
        checkBox.setAttribute("value", id);
        checkBox.setAttribute("type", "radio");
        checkBox.setAttribute("name", "model-radio");
        checkBox.setAttribute("class", "load-model-checkbox col-1");
        description.setAttribute("class", "no-data col-11 text-left")
        description.textContent = "Sin datos guardados";

        newModel.appendChild(checkBox);
        newModel.appendChild(description);

        return newModel;
    },
    logout: () =>{
        USER.setEmail(null);
        document.querySelector("#login").setAttribute("style", "display: block;");
        document.querySelector("#saveAndLoad").setAttribute("style", "display: none;");
        document.querySelector("#session-button").text = "Login";
    },
    setEmail: (email) => {
        USER.variables.email = email;
    },
    getList: () => {
        return USER.variables.list;
    },
    getSlotId: () => {
        var id;
        var checkBoxArray = document.querySelectorAll(".load-model-checkbox");

        for(var i = 0; i < checkBoxArray.length; i++){
            if(checkBoxArray[i].checked) id = checkBoxArray[i].value;
        }

        return id;
    },
    sortStructuresBySlotId: (structures) => {
        return structures.sort( USER.compareTo );
    },
    compareTo: (a, b) => {
            let result = 0;

            if ( a.slotId < b.slotId ){
              result = -1;
            }
            if ( a.slotId > b.slotId ){
              result = 1;
            }

            return result;
    },
    getCurrentDate: () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var hh = String(today.getHours()).padStart(2, '0');
        var mi = String(today.getMinutes()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January = 0
        var yyyy = today.getFullYear();
    
        today = hh + ":" + mi + "<i class='far fa-clock'> " + dd + '/' + mm + '/' + yyyy;

        return today;
    }
}