var ANIMATION = {
  init: function(variables) {
    this.settings = {
      animation: null
    };

    this.variables = {
      create: true,
      object: variables.object,
      rotation: variables.rotation,
      duration: variables.duration,
      position: variables.position
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.animation;
  },

  set: function() {
    this.settings.animation = this.createAllAnimations(
      this.variables.object,
      this.variables.rotation,
      this.variables.position,
      this.variables.duration
    );
  },

  createAllAnimations(entireCloset, rotation, position, duration) {
    TWEEN.removeAll();
    var allAnimations = [];
    for (let i = 0; i < entireCloset.length - 2; i++) {
      //-2 por las patas y siluetas
      if (entireCloset[i].coverType === "Doors") {
        allAnimations[i] = this.createDoorsAnimation(
          entireCloset[i].children[2].children[0],
          rotation,
          duration
        );
        allAnimations[i].coverType = entireCloset[i].coverType;
      } else if (entireCloset[i].coverType === "DoubleDoors") {
        allAnimations[i] = this.createDoubleDoorsAnimation(
          entireCloset[i].children[2],
          rotation,
          duration
        );
        allAnimations[i].coverType = entireCloset[i].coverType;
      } else if (entireCloset[i].coverType === "Drawers") {
        allAnimations[i] = this.createDrawersAnimation(
          entireCloset[i].children[2],
          position,
          duration
        );
        allAnimations[i].coverType = entireCloset[i].coverType;
      } else {
        allAnimations[i] = null;
      }
    }

    return allAnimations;
  },

  createDoorsAnimation(object, rotation, duration) {
    var doorsAnimationRotation = [];
    var doorsAnimationRotationOpen = [];
    var doorsAnimationRotationClose = [];

    //abrir
    doorsAnimationRotationOpen = new TWEEN.Tween(object.rotation)
      .to(
        {
          x: rotation.x,
          y: rotation.y,
          z: rotation.z
        },
        duration
        //Math.random() * (duration - duration / 3) + duration / 3
      )
      .easing(TWEEN.Easing.Exponential.Out);

    //cerrar
    doorsAnimationRotationClose = new TWEEN.Tween(object.rotation)
      .to(
        {
          x: rotation.x,
          y: 0,
          z: rotation.z
        },
        duration
        //Math.random() * (duration - duration / 3) + duration / 3
      )
      .easing(TWEEN.Easing.Exponential.Out);

    doorsAnimationRotation[0] = doorsAnimationRotationOpen;
    doorsAnimationRotation[1] = doorsAnimationRotationClose;

    return doorsAnimationRotation;
  },

  createDoubleDoorsAnimation(object, rotation, duration) {
    var objectDoubleDoorRight = [];
    var objectDoubleDoorLeft = [];

    objectDoubleDoorLeft = object.children[1];
    objectDoubleDoorRight = object.children[0];

    var animationsDoubleDoorRight = this.createDoorsAnimation(
      objectDoubleDoorRight,
      rotation,
      duration
    );

    var animationsDoubleDoorLeft = this.createDoorsAnimation(
      objectDoubleDoorLeft,
      { x: rotation.x, y: rotation.y * -1, z: rotation.z },
      duration
    );
    return [animationsDoubleDoorRight, animationsDoubleDoorLeft];
  },

  createDrawersAnimation(object, position, duration) {
    var drawersAnimationPosition = [];
    var drawersAnimationPositionOpen = [];
    var drawersAnimationPositionClose = [];

    //abrir
    drawersAnimationPositionOpen = new TWEEN.Tween(object.position)
      .to(
        {
          x: position.x + object.position.x,
          y: position.y + object.position.y,
          z: position.z + object.position.z
        },
        duration
        //Math.random() * (duration - duration / 3) + duration / 3
      )
      .easing(TWEEN.Easing.Exponential.Out);

    //cerrar
    drawersAnimationPositionClose = new TWEEN.Tween(object.position)
      .to(
        {
          x: object.position.x,
          y: object.position.y,
          z: object.position.z
        },
        duration
        //Math.random() * (duration + duration / 3) + (duration + duration / 3)
      )
      .easing(TWEEN.Easing.Exponential.Out);

    drawersAnimationPosition[0] = drawersAnimationPositionOpen;
    drawersAnimationPosition[1] = drawersAnimationPositionClose;

    return drawersAnimationPosition;
  },

  moveDoor(indexDoor, abrir) {
    if (this.settings.animation[indexDoor] != null) {
      if (this.settings.animation[indexDoor].coverType != "DoubleDoors") {
        //movimientos en general
        if (abrir) {
          this.settings.animation[indexDoor][0].stop(); //parar un tween no iniciado no da error
          this.settings.animation[indexDoor][1].stop(); //asi nos aseguramos evitar bugs
          this.settings.animation[indexDoor][0].start();
        } else {
          this.settings.animation[indexDoor][0].stop();
          this.settings.animation[indexDoor][1].stop();
          this.settings.animation[indexDoor][1].start();
        }
      } else {
        //movimientos de doble puerta
        this.moveDoubleDoors(indexDoor, abrir);
      }
    }
  },

  moveDoubleDoors(indexDoor, abrir) {
    if (abrir) {
      this.settings.animation[indexDoor][0][0].start(); //puerta 0 derecha
      this.settings.animation[indexDoor][1][0].start(); //puerta 1 izquierda
    } else {
      this.settings.animation[indexDoor][0][0].stop();
      this.settings.animation[indexDoor][0][1].start();
      this.settings.animation[indexDoor][1][0].stop();
      this.settings.animation[indexDoor][1][1].start();
    }
  },

  createUIAnimation(objectCurrentPosition, objectNextPosition, objectTarget) {
    var UIMovementAnimation = new TWEEN.Tween(objectCurrentPosition)
      .to(
        {
          left: objectNextPosition.left,
          top: objectNextPosition.top
        },
        500
      )
      .easing(TWEEN.Easing.Exponential.Out)
      .onUpdate(() => {
        objectTarget.left = objectCurrentPosition.left + "px";
        objectTarget.top = objectCurrentPosition.top + "px";
      });

    return UIMovementAnimation;
  },

  animate() {
    requestAnimationFrame(ANIMATION.animate);

    TWEEN.update();

    //stats.update();

    APP.render();
  }
};
