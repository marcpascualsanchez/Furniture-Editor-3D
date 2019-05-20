var OBJECT_LOADER = {
  init: function(variables) {
    this.settings = {
      objectLoader: null
    };

    this.variables = {
      create: true,
      objectPath: variables.objectPath,
      texturePath: variables.texturePath
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.objectLoader;
  },

  set: function() {
    this.settings.objectLoader = this.createLoader(
      this.variables.objectPath,
      this.variables.texturePath
    );
  },

  createLoader(objectPath, texturePath) {
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(texturePath, function(materials) {
      materials.preload();

      var loader = new THREE.OBJLoader(manager);
      loader.setMaterials(materials);
      // load a resource
      loader.load(
        // resource URL
        objectPath,
        // called when resource is loaded
        function(object) {
          var dimensionsBox;

          object.scale.set(0.09, 0.09, 0.09);
          dimensionsBox = new THREE.Box3().setFromObject(object);
          object.geometrySize = dimensionsBox.getSize(); // Returns Vector3

          //rotamos y escalamos el modelo para adaptarlo al tamano en escala de la escena
          object.name = "loadedObject";
          object.rotation.x = -Math.PI / 2;
          object.position.y =
            APP.settings.floor.position.y + APP.settings.mueble.totalHeight;
          object.position.z =
            APP.settings.mueble.position.z -
            APP.settings.mueble.topDepth / 2 +
            object.geometrySize.y / 2; //deberia ser geometrySize.z pero el modelo esta interpretado como si el eje Y fuese el Z
          object.position.x = APP.settings.mueble.position.x;
          APP.settings.scene.add(object);
        }
      );
    });
  }
};