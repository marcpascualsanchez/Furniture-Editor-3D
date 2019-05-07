var FLOOR = {
  init: function(variables) {
    this.settings = {
      floor: null,
      floor_shadow: null
    };

    this.variables = {
      create: true,
      width: 20,
      height: 20,
      position_y: -0.5,
      widthSegments: 1,
      heightSegments: 1,
      color: 0xffffff,
      wireframe: false,
      receiveShadow: true,
      opacityShadow: 0.2
    };

    $.extend(this.variables, variables);

    if (this.variables.create) this.set();
  },

  set: function() {
    this.settings.floor = new THREE.Mesh(
      new THREE.PlaneGeometry(
        this.variables.width,
        this.variables.height,
        this.variables.widthSegments,
        this.variables.heightSegments
      ),
      new THREE.MeshBasicMaterial({
        color: this.variables.color
      })
    );

    this.settings.floor.rotation.x -= Math.PI / 2;
    this.settings.floor.position.y = this.variables.position_y;
    this.settings.floor.position.z = this.variables.height / 2;

    //SHADOW
    if (this.variables.receiveShadow) {
      var planeMaterial = new THREE.ShadowMaterial();
      planeMaterial.opacity = this.variables.opacityShadow;

      this.settings.floor_shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(
          this.variables.width,
          this.variables.height,
          this.variables.widthSegments,
          this.variables.heightSegments
        ),
        planeMaterial
      );
      this.settings.floor_shadow.rotation.x -= Math.PI / 2;
      this.settings.floor_shadow.position.y = this.variables.position_y;
      this.settings.floor_shadow.position.z = this.variables.height / 2;
      this.settings.floor_shadow.receiveShadow = true;
    }
  },

  get: function() {
    return this.settings.floor;
  },

  get_shadow: function() {
    return this.settings.floor_shadow;
  }
};
