var RENDERER = {
  init: function(variables) {
    this.settings = {
      renderer: null
    };

    this.variables = {
      isWebGl: true,
      shadow: true,
      antialias: true,
      precision: "mediump",
      powerPreference: "low-power"
    };

    $.extend(this.variables, variables);

    this.set();
  },

  set: function() {
    this.settings.renderer = this.variables.isWebGl
      ? new THREE.WebGLRenderer({
          antialias: this.variables.antialias,
          precision: this.variables.precision,
          powerPreference: this.variables.powerPreference
        })
      : new THREE.CanvasRenderer();

    this.settings.renderer.setPixelRatio(window.devicePixelRatio);
    this.settings.renderer.setSize(
      document.getElementById("app").offsetWidth,
      document.getElementById("app").offsetHeight
    );
    //this.settings.renderer.setSize(window.innerWidth, window.innerHeight);

    // Habilitar las sombras
    if (this.variables.shadow) {
      this.settings.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.settings.renderer.shadowMap.enabled = true;
    }
  },

  get: function() {
    return this.settings.renderer;
  }
};
