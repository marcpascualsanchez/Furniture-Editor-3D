var TEXTURE_LOADER = {
  init: function(variables) {
    this.settings = {
      textureLoader: null
    };

    this.variables = {
      create: true,
      texture_path: variables.texturePath
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.textureLoader;
  },

  set: function() {
    this.settings.textureLoader = this.createLoader(this.variables.texturePath);
  },

  createLoader(texturePath) {
    var texture = {
      map: new THREE.TextureLoader().load(texturePath)
    };

    return texture;
  }
};
