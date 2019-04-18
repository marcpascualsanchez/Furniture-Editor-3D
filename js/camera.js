var CAMERA = {
  init: function(variables) {
    this.settings = {
      camera: null
    };

    this.variables = {
      create: true,
      fov: 22,
      aspect:
        document.getElementById("app").offsetWidth /
        document.getElementById("app").offsetHeight,
      near: 1,
      far: 1000,
      position_x: [-2, 0, 2],
      position_y: 0,
      position_z: 2
    };

    $.extend(this.variables, variables);

    if (this.variables.create) this.set();
  },

  set: function() {
    this.settings.camera = new THREE.PerspectiveCamera(
      this.variables.fov,
      this.variables.aspect,
      this.variables.near,
      this.variables.far
    );

    this.settings.camera.position.set(
      this.variables.position_x[1],
      this.variables.position_y,
      this.variables.position_z
    );
  },

  get: function() {
    return this.settings.camera;
  },

  recolocate(duration) {
    var actualPositionX = APP.settings.camera.position.x;
    var originalPositionX = this.decideNewPositionX(actualPositionX, [
      -(APP.settings.mueble.totalWidth + 2),
      0,
      APP.settings.mueble.totalWidth + 2
    ]);
    var originalPositionY = this.variables.position_y;
    var originalPositionZ = this.variables.position_z;
    var widthFactorZ; //minimo de 2
    APP.settings.mueble.totalWidth > 1
      ? (widthFactorZ = APP.settings.mueble.totalWidth / 2)
      : (widthFactorZ = 1);
    var heightFactorY; //minimo de 0.8
    APP.settings.mueble.totalHeight > 0.8
      ? (heightFactorY = APP.settings.mueble.totalHeight)
      : (heightFactorY = 0.8);
    var cameraMovement1 = new TWEEN.Tween(APP.settings.camera.position)
      .to(
        {
          x: originalPositionX,
          y: originalPositionY + APP.settings.mueble.totalHeight / 1.5,
          z: originalPositionZ + (widthFactorZ + heightFactorY * 2.5)
        },
        duration
      )
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(function(e) {
        APP.settings.camera.lookAt(
          APP.settings.mueble.position.x,
          0.2,
          APP.settings.mueble.position.z
        );
        APP.settings.scene.fog.near = APP.settings.mueble.position.z + 8;
        APP.settings.scene.fog.far = APP.settings.mueble.position.z + 20;
        APP.settings.camera.updateProjectionMatrix();
      });

    cameraMovement1.start();
  },

  decideNewPositionX(position, possiblePositions) {
    var result = possiblePositions[0];

    for (var i = 0; i < possiblePositions.length; i++) {
      if (position >= possiblePositions[i]) {
        result = possiblePositions[i];
      }
    }

    return result;
  }
};
