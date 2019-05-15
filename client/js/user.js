var USER = {
    init: () =>{
        //let saveLoadBtn = document.querySelector("");
    },
    session: {
        created: null,
        email: null
    },
    checkLogin: (code) =>{
        if(code === 200){
            this.enableSaveAndLoad();
        }else{
            this.sendLoginError();
        }
    },
    enableSaveAndLoad: () =>{
        document.querySelector("#login").setAttribute("style", "display: none;");
        document.querySelector("#saveAndLoad").setAttribute("style", "display: block;");
    },
    sendLoginError: () =>{
        document.querySelector(".password").setAttribute("class", "error");
    },
    showUserUI: () =>{
        document.querySelector(".password").removeAttribute("hidden");
    },
    hideUserUI: () =>{
        document.querySelector(".password").setAttribute("hidden", "");
    }
}