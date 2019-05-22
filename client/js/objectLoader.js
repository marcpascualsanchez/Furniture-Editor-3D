var OBJECT_LOADER = {
  init: function(variables) {
    this.settings = {
      objectLoader: null
    };

    this.variables = {
      create: true,
      objectPath: variables.objectPath,
      texturePath: variables.texturePath,
      manager: null,
      currentObject: null
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();

  },

  get: function() {
    return this.settings.objectLoader;
  },

  set: function() {
    this.setManager();
    //this.loadModel("model-pot");
  },

  getManager: function() {
    return this.variables.manager;
  },

  setManager: function (){
      var manager = new THREE.LoadingManager();
  
      manager.onStart = () => {
        document
          .getElementById("loading-overlay")
          .classList.remove("loading-overlay-hidden");
        document.getElementById("app").classList.remove("show-app");
      };
  
      manager.onLoad = function() {
        document
          .getElementById("loading-overlay")
          .classList.add("loading-overlay-hidden");
        document.getElementById("app").classList.add("show-app");
        APP.onResize();
        //UI.recolocateUI();
      };
  
      this.variables.manager = manager;
  },

  loadModel: (type) => {
    let objectPath = OBJECT_LOADER.variables.objectPath;
    let texturePath = OBJECT_LOADER.variables.texturePath;
    var mtlLoader = new THREE.MTLLoader();
    let redimensionType;

    if(type == "model-tv"){
      redimensionType = OBJECT_LOADER.redimensionObject.tv;
    }else if(type == "model-pot"){
      redimensionType = OBJECT_LOADER.redimensionObject.pot;
    }else if(type == "model-plant"){
      redimensionType = OBJECT_LOADER.redimensionObject.plant;
    }

    mtlLoader.load(texturePath, function(materials) {
      materials.preload();

      var loader = new THREE.OBJLoader(OBJECT_LOADER.getManager());
      loader.setMaterials(materials);
      // load a resource
      loader.load(
        // resource URL
        objectPath,
        // called when resource is loaded
        redimensionType
      );
    });
  },

  redimensionObject:{
    tv: function(object) {
      var dimensionsBox;

      object.scale.set(0.085, 0.085, 0.085);
      dimensionsBox = new THREE.Box3().setFromObject(object);
      object.geometrySize = dimensionsBox.getSize(); // Returns Vector3

      //rotamos y escalamos el modelo para adaptarlo al tamano en escala de la escena
      object.name = "loadedObject_tv";
      object.rotation.x = -Math.PI / 2;
      object.position.y =
        APP.settings.floor.position.y + APP.settings.mueble.totalHeight;
      object.position.z =
        APP.settings.mueble.position.z -
        APP.settings.mueble.topDepth / 2 +
        object.geometrySize.y / 2; //deberia ser geometrySize.z pero el modelo esta interpretado como si el eje Y fuese el Z
      object.position.x = APP.settings.mueble.position.x;
      APP.settings.scene.add(object);
      this.currentObject = object;
    },
    pot: function(object) {
      var dimensionsBox;

      object.scale.set(0.01, 0.01, 0.01);
      dimensionsBox = new THREE.Box3().setFromObject(object);
      object.geometrySize = dimensionsBox.getSize(); // Returns Vector3

      //rotamos y escalamos el modelo para adaptarlo al tamano en escala de la escena
      object.name = "loadedObject_pot";
      object.position.y =
        APP.settings.floor.position.y + APP.settings.mueble.totalHeight;
      object.position.z =
        APP.settings.mueble.position.z -
        APP.settings.mueble.topDepth / 2 +
        object.geometrySize.z / 2; //deberia ser geometrySize.z pero el modelo esta interpretado como si el eje Y fuese el Z
      object.position.x = APP.settings.mueble.position.x;
      APP.settings.scene.add(object);
      this.currentObject = object;
    },
    plant: function(object) {
      var dimensionsBox;

      object.scale.set(0.01, 0.01, 0.01);
      dimensionsBox = new THREE.Box3().setFromObject(object);
      object.geometrySize = dimensionsBox.getSize(); // Returns Vector3

      //rotamos y escalamos el modelo para adaptarlo al tamano en escala de la escena
      object.name = "loadedObject_plant";
      object.position.y =
        APP.settings.floor.position.y + APP.settings.mueble.totalHeight;
      object.position.z =
        APP.settings.mueble.position.z -
        APP.settings.mueble.topDepth / 2 +
        object.geometrySize.z / 2; //deberia ser geometrySize.z pero el modelo esta interpretado como si el eje Y fuese el Z
      object.position.x = APP.settings.mueble.position.x;
      APP.settings.scene.add(object);
      this.currentObject = object;
    }
  },

  hideModel: (model) => {
    model.visible = false;
  },
  
  showModel: (model) => {
    model.visible = true;
  }
};