var UI = {
  init: function(variables) {
    this.settings = {
      UI: null
    };

    this.variables = {
      create: true
    };
    $.extend(this.variables, variables);
  },

  moveUISettings(positionX, positionY, elementId) {
    var windowSettings = document.getElementById(elementId);
    var windowPosition = {
      left: parseInt(windowSettings.style.left),
      top: parseInt(windowSettings.style.top)
    };

    var windowNextPosition = {
      left: positionX + Math.round($("#" + elementId).width() / 2),
      top: positionY - Math.round($("#" + elementId).height() / 2)
    };

    var windowMovement = ANIMATION.createUIAnimation(
      windowPosition,
      windowNextPosition,
      windowSettings.style
    );
    windowMovement.start();
  },

  get2dPosition(objectName, index) {
    var object = APP.settings.scene.getObjectByName(objectName).children[index];
    var vector = new THREE.Vector3();

    var widthHalf = 0.5 * APP.settings.renderer.context.canvas.width;
    var heightHalf = 0.5 * APP.settings.renderer.context.canvas.height;

    var widthMargin = APP.auxs.appDomSettings.left;
    var heightMargin = APP.auxs.appDomSettings.top;

    object.updateMatrixWorld();
    vector.setFromMatrixPosition(object.matrixWorld);
    vector.project(APP.settings.camera);

    vector.x = vector.x * widthHalf + widthHalf + widthMargin;

    vector.y = -(vector.y * heightHalf) + heightHalf + heightMargin;

    return {
      x: vector.x,
      y: vector.y
    };
  },

  setUiParameters() {
    var realHeight = Math.round(
      APP.settings.mueble.totalHeight * 100
    ).toString();
    var realWidth = Math.round(APP.settings.mueble.totalWidth * 100).toString();

    this.changeParameter("current-height", realHeight + "cm");
    this.changeParameter("current-width", realWidth + "cm");
  },

  changeParameter(elementId, newValue) {
    var selectedElement = document.getElementById(elementId);

    selectedElement.innerHTML = newValue;
  },

  recolocateUI() {
    var UIPosition = {};

    UIPosition = this.get2dPosition(
      "silouettes group",
      APP.settings.mueble.numColumns - 1
    );

    this.moveUISettings(UIPosition.x, UIPosition.y, "settings");
  }
};

/*jQuery pertinent a la UI*/
$(document).on("change", '[name="height"]', function(e) {
  //indicar la altura en cm en el DOM
  UI.setUiParameters();
});

$(document).on("change", '[name="row-heights"]', function(e) {
  //indicar la altura en cm en el DOM
  UI.setUiParameters();
});

$(document).on("change", '[name="width"]', function(e) {
  //indicar anchura en cm en el DOM
  UI.setUiParameters();
});

$(document).on("change", '[name="col-width"]', function(e) {
  //indicar anchura en cm en el DOM
  var divWidthValue = document.getElementById("current-col-width");
  divWidthValue.innerHTML = this.value + "cm";
  UI.setUiParameters(); //refresca el valor total del mueble que se ve afectado
});

$(document).on("change", '[name="depth"]', function(e) {
  var newSelected = $(this).attr("id");
  var labelNewSelected = $("#label-" + newSelected);
  $("#furniture-depths label").removeClass("main-custom-button-checked");
  labelNewSelected.addClass("main-custom-button-checked");
});

$(".fa-info").hover(function(e) {
  var newSelected = $(this).attr("id");
  var messageId = "message-" + newSelected;
  var messageNewSelected = $("#" + messageId);
  var classString = document.getElementById(messageId).className;
  //posicionar
  var newPositionLeft =
    document.getElementById(messageId).parentElement.offsetWidth +
    document.getElementById(messageId).offsetWidth;
  messageNewSelected.css("left", newPositionLeft + "px");

  //poner en visible | invisible
  if (classString.includes("message-visible")) {
    messageNewSelected.removeClass("message-visible");
  } else {
    messageNewSelected.addClass("message-visible");
  }
});
