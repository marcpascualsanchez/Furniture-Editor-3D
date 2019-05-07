var CONTROLS = {
  init: function(variables) {
    this.settings = {
      controls: null,
      camera: null,
      renderer: null
    };

    this.variables = {
      create: true,
      limits: false,
      maxDistance: 10,
      minDistance: 3,
      minPolarAngle: 0xffffff,
      maxPolarAngle: 0x555555,
      minAzimuthAngle: -1.25,
      maxAzimuthAngle: 1.25,
      rotateSpeed: 2,
      enableZoom: false
    };

    $.extend(this.variables, variables);

    if (this.variables.create) this.set();
  },

  set: function(camera, renderer) {
    if (this.variables.create && camera != null && renderer != null) {
      this.settings.camera = camera;
      this.settings.renderer = renderer;

      this.settings.controls = new THREE.OrbitControls(
        this.settings.camera,
        this.settings.renderer.domElement
      );

      if (this.variables.limits) {
        this.settings.controls.maxDistance = this.variables.maxDistance;
        this.settings.controls.minDistance = this.variables.minDistance;

        this.settings.controls.minPolarAngle = this.variables.minPolarAngle;
        this.settings.controls.maxPolarAngle = this.variables.maxPolarAngle;

        this.settings.controls.minAzimuthAngle = this.variables.minAzimuthAngle;
        this.settings.controls.maxAzimuthAngle = this.variables.maxAzimuthAngle;
      }

      this.settings.controls.rotateSpeed = this.variables.rotateSpeed;
      this.settings.controls.enableZoom = this.variables.enableZoom;
      this.settings.controls.update();
    }
  },

  get: function() {
    return this.settings.controls;
  }
};
