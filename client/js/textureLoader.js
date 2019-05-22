var TEXTURE_LOADER = {
  init: function(variables) {
    this.settings = {
      textureLoader: null
    };

    this.variables = {
      create: true,
      texture_path: variables.texturePath,
      manager: null
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.textureLoader;
  },

  set: function() {
    this.setManager();
    this.settings.textureLoader = this.createLoader(this.variables.texturePath);
  },

  createLoader(texturePath) {
    var texture = {
      map: new THREE.TextureLoader(this.variables.manager).load(texturePath)
    };

    return texture;
  },

  setManager: function (){
    var manager = new THREE.LoadingManager();

    manager.onStart = () => {};

    manager.onLoad = function() {
      document
        .getElementById("loading-overlay")
        .classList.add("loading-overlay-hidden");
      document.getElementById("app").classList.add("show-app");
      APP.onResize();
    };

    this.variables.manager = manager;
  }
};
