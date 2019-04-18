var MOUSE = {
  init: function(variables) {
    this.settings = {
      mouse: null
    };

    this.variables = {
      create: true,
      mouse: {
        x: 0,
        y: 0
      },
      mouseClient: {
        x: 0,
        y: 0
      },
      INTERSECTED: variables.INTERSECTED,
      camera: variables.camera
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.mouse;
  },

  set: function() {
    this.settings.mouse = this.variables;
  },

  updateMouse() {
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    mouse.x = this.variables.mouse.x;
    mouse.y = this.variables.mouse.y;
    /*var pointerContext = APP.settings.scene.getObjectByName("silouette group")
    .children;*/
    var pointer = APP.settings.scene.getObjectByName("silouettes group")
      .children;

    if (this.variables.INTERSECTED != null) {
      APP.auxs.intersected_old_uuid = this.variables.INTERSECTED.uuid;
    } else {
      APP.auxs.intersected_old_uuid = null;
    }

    raycaster.setFromCamera(mouse, this.variables.camera);

    raycaster.far = 30.0;
    raycaster.near = 0.0;

    var intersects = raycaster.intersectObjects(pointer);

    if (intersects.length > 0) {
      if (this.variables.INTERSECTED != intersects[0].object) {
        this.variables.INTERSECTED = intersects[0].object;
        this.relateSilouetteWithDoor(this.variables.INTERSECTED);
      }
    } else {
      if (this.variables.INTERSECTED) {
        this.variables.INTERSECTED = null;
        this.relateSilouetteWithDoor(this.variables.INTERSECTED);
      }
    }
  },
  /*
    Developed and produced by Marc Pascual
    Ordered by Sergi Jarque and Bill Ben, from edatasoft.com
  */
  relateSilouetteWithDoor(silouetteObject) {
    //relacionamos el volumen de todo el cajon con la puerta segun indices de arrays
    var doorObjectIndex = 0;

    if (this.variables.INTERSECTED != null) {
      doorObjectIndex = silouetteObject.parent.children.findIndex(
        x => x.uuid == silouetteObject.uuid
      );

      APP.auxs.intersected_actual_index = doorObjectIndex;
    } else {
      APP.auxs.intersected_actual_index = null;
    }
  }
};
