var WALL = {
  init: function(variables) {
    this.settings = {
      wall: null,
      wall_shadow: null
    };

    this.variables = {
      create: true,
      width: 20,
      height: 40,
      widthSegments: 1,
      position_y: -0.5,
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
    this.settings.wall = new THREE.Mesh(
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

    this.settings.wall.rotation.z -= Math.PI / 2;
    this.settings.wall.position.y =
      this.variables.width / 2 + this.variables.position_y;

    //SHADOW
    if (this.variables.receiveShadow) {
      var planeMaterial = new THREE.ShadowMaterial();
      planeMaterial.opacity = this.variables.opacityShadow;

      this.settings.wall_shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(
          this.variables.width,
          this.variables.height,
          this.variables.widthSegments,
          this.variables.heightSegments
        ),
        planeMaterial
      );
      this.settings.wall_shadow.rotation.z -= Math.PI / 2;
      this.settings.wall_shadow.position.y =
        this.variables.width / 2 + this.variables.position_y;
      this.settings.wall_shadow.receiveShadow = true;
    }
  },

  get: function() {
    return this.settings.wall;
  },

  get_shadow: function() {
    return this.settings.wall_shadow;
  }
};
