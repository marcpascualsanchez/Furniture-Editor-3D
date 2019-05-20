"use strict";
/*START VARIABLES GLOBALES DEV */
const manager = new THREE.LoadingManager();
manager.onStart = () => {};

manager.onLoad = function() {
  document
    .getElementById("loading-overlay")
    .classList.add("loading-overlay-hidden");
  document.getElementById("app").classList.add("show-app");
  APP.onResize();
};
//initial structure organization of the closet
var inpStructureOrganization =  
  [  
     ["None","Drawers" ,"None","Drawers","None","Drawers","None","Drawers","None","Drawers","None"],
     ["None","Drawers" ,"None","Drawers","None","Drawers","None","Drawers","None","Drawers","None"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["None","Drawers" ,"None","Drawers","None","Drawers","None","Drawers","None","Drawers","None"],
     ["None","Door","None","Doors","None","Doors","None","Doors","None","Doors","None"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["None","Drawers" ,"None","Drawers","None","Drawers","None","Drawers","None","Drawers","None"],
     ["None","Door","None","Doors","None","Doors","None","Doors","None","Doors","None"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["None","Drawers" ,"None","Drawers","None","Drawers","None","Drawers","None","Drawers","None"],
     ["None","Door","None","Doors","None","Doors","None","Doors","None","Doors","None"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"],
     ["Doors","None","Doors","None","Doors","None","Doors","None","Doors","None","Doors"]
  ];
//final closet structure organization
var rowHeights = [0.26, 0.19, 0.38];
var colWidths = [0.28, 0.28, 0.42, 0.42];
var rowDepths = [0.48, 0.4, 0.32];
//JSON con estructura + rowHeights & colWidths
const limitations = {
  minDoorHeight: 0.26,
  maxDrawerPositionHeight: 1.6,
  legsHeight: 0.01,
  rowHeightsLimits: [0.19, 0.26, 0.38],
  rowDepthsLimits: [0.32, 0.4, 0.48],
  thick: 0.018
};
/*END GLOBALES DEV */

var APP = {
  init: function() {
    var self = this;

    // Variables Globales
    this.settings = {
      container: document.getElementById("app"),
      renderer: null,
      scene: null,
      camera: null,
      grid: null,
      controls: null,
      floor: null,
      floor_shadow: null,
      wall: null,
      wall_shadow: null,
      mueble: null,
      mueble_old: null,
      lights_shadow: null,
      lights_left: null,
      lights_right: null,
      lights_back: null,
      animation: [],
      mouse: null,
      clock: new THREE.Clock(),
      textureLoader: null,
      objectLoader: null
    };

    this.auxs = {
      intersected_old_uuid: null, //uuid del anterior objeto intersectado por raycaster
      intersected_actual_index: null, //objeto intersectado por raycaster en el momento
      intersected_last_index: null,
      current_index_selected: null,
      appDomSettings: null, //objeto con medidas y posicion del elemento canvas/webGL en el DOM
      doorClipAction: null, //array de clipAction de todas las puertas
      doorMixer: null, //array de mixer de todas las puertas
      doorStopAction: false, //bool para parar una sola vez despues de desapuntar mueble
      oldDoorIndex: null, //indice de la ultima division por la que ha pasado el mouse
      currentClosetDepth: null, //profundidad del mueble actual
      switchShowUI: false, //auxiliar para mostrar o esconder la UI
      insideUI: false, //auxiliar para saber si el mouse esta dentro de la UI
      clickedIndex: null, //
      allClickedIndex: [],
      hidePresettings: false,
      allRowColSwitch: false,
      firstClickedIndex: null,
      isMouseUp: false
    };

    // Construir el entorno
    this.Environment(function() {
      // Crear el mueble
      self.createMueble();
    });

    //Evento resize
    $(window).on("resize", function() {
      self.onResize();
    });
  },
  // Funcion para crear la Escena
  createScene() {
    this.settings.scene = SCENE.get();
  },
  // Funcion para crear la Camera
  createCamera() {
    this.settings.camera = CAMERA.get();
    if (this.settings.scene != null && this.settings.camera != null) {
      this.settings.scene.add(this.settings.camera);
    }
  },
  // Funcion para crear la luz
  createLights() {
    // Luz con sombra
    this.settings.lights_shadow = LIGHTS.get("shadow");
    if (this.settings.scene != null && this.settings.lights_shadow != null)
      this.settings.scene.add(this.settings.lights_shadow);

    // Luz izquierda
    this.settings.lights_left = LIGHTS.get("left");
    if (this.settings.scene != null && this.settings.lights_left != null)
      this.settings.scene.add(this.settings.lights_left);

    // Luz derecha
    this.settings.lights_right = LIGHTS.get("right");
    if (this.settings.scene != null && this.settings.lights_right != null)
      this.settings.scene.add(this.settings.lights_right);

    // Luz trasera
    this.settings.lights_back = LIGHTS.get("back");
    if (this.settings.scene != null && this.settings.lights_back != null)
      this.settings.scene.add(this.settings.lights_back);
  },
  // Funcion para crear la Cuadrícula
  createGrid() {
    this.settings.grid = GRID.get();
    if (this.settings.scene != null && this.settings.grid != null)
      this.settings.scene.add(this.settings.grid);
  },
  // Funcion para crear el Renderer
  createRenderer() {
    var self = this;
    this.settings.renderer = RENDERER.get();
    if (this.settings.scene != null && this.settings.renderer != null)
      this.settings.container.appendChild(this.settings.renderer.domElement);
  },
  // Funcion para crear los Controles
  createControls() {
    var self = this;
    self.settings.controls = CONTROLS.set(
      self.settings.camera,
      self.settings.renderer
    );
    self.settings.controls = CONTROLS.get();
    if (self.settings.controls != null) {
      self.settings.controls.addEventListener("change", function() {
        self.settings.camera.lookAt(
          self.settings.mueble.position.x,
          0.2,
          self.settings.mueble.position.z
        );
        self.settings.camera.updateProjectionMatrix();
        self.render();
      });
    }
  },
  // Funcion para crear el suelo
  createFloor() {
    this.settings.floor = FLOOR.get();
    if (this.settings.scene != null && this.settings.floor != null)
      this.settings.scene.add(this.settings.floor);

    this.settings.floor_shadow = FLOOR.get_shadow();
    if (this.settings.scene != null && this.settings.floor_shadow != null)
      this.settings.scene.add(this.settings.floor_shadow);
  },
  changeColorFloor(color) {
    this.settings.floor.material.color.set(color);
    this.render();
  },
  // Funcion para crear la pared
  createWall() {
    this.settings.wall = WALL.get();
    if (this.settings.scene != null && this.settings.wall != null)
      this.settings.scene.add(this.settings.wall);

    this.settings.wall_shadow = WALL.get_shadow();
    if (this.settings.scene != null && this.settings.wall_shadow != null)
      this.settings.scene.add(this.settings.wall_shadow);
  },
  changeColorWall(color) {
    this.settings.wall.material.color.set(color);
    this.render();
  },
  // Funcion para crear el mueble
  createMueble() {
    this.settings.mueble = MUEBLE.get();
    if (this.settings.scene != null && this.settings.mueble != null)
      this.settings.scene.add(this.settings.mueble);
  },
  createAnimation() {
    this.settings.animation = ANIMATION.get();
  },
  createTextureLoader() {
    this.settings.textureLoader = TEXTURE_LOADER.get();
  },
  createObjectLoader() {
    this.settings.objectLoader = OBJECT_LOADER.get();
  },
  render() {
    this.settings.renderer.clear();
    this.settings.renderer.render(this.settings.scene, this.settings.camera);
    //stats.update();
  },
  // Funcion para redimensionar la scena
  onResize() {
    var canvasWidth = document.getElementById("app").offsetWidth;
    var canvasHeight = (9 / 16) * canvasWidth;
    this.settings.renderer.setSize(canvasWidth, canvasHeight);
    this.settings.camera.aspect = canvasWidth / canvasHeight;
    this.settings.camera.updateProjectionMatrix();
    this.appDomSettings();
    this.render();
  },

  appDomSettings() {
    var appDiv = document.getElementById("app");
    var appDomSettings = appDiv.getBoundingClientRect();
    this.auxs.appDomSettings = appDomSettings;
  },

  // Funcion para crear el entorno
  Environment(callBack) {
    var self = this;
    self.createScene(); // Crear la Escena
    self.createLights(); // Crear las Luces
    self.createGrid(); // Crear la Cuadrícula
    self.createRenderer(); // Crear el Renderer
    self.createCamera(); // Crear la Cámara
    self.createControls(); // Crear los Controles
    self.createFloor(); // Crear el suelo
    self.createWall(); // Crear la pared
    self.createTextureLoader();
    self.createObjectLoader();

    callBack(); // Añadiremos el mueble
  }
};

/*///////////////////////////////////////////////////////
            CONFIGURACIÓN DE LA APLICACIÓN
///////////////////////////////////////////////////////*/
$(function() {
  var canvasWidth = document.getElementById("app").offsetWidth;
  var canvasHeight = document.getElementById("app").offsetHeight;

  var colores = {
    color_floor: "#f0f0f1",
    color_wall: "#e1e1e1"
  };

  // Inicializar la Escena
  SCENE.init({
    create: true, // Crear la escena
    background: 0xf0f0f0, // Color del fondo de la escena
    fog: true, // Activar Niebla
    fog_color: 0xf0f0f0, // Color de la niebla
    fog_near: 5, // Distancia mínima niebla
    fog_far: 10 // Distancia máxima niebla
  });
  //Inicializar las texturas
  TEXTURE_LOADER.init({
    create: true,
    texturePath: "textures/borderTexture.jpg"
  });
  //Inicializar objeto a partir de modelo
  OBJECT_LOADER.init({
    create: true,
    texturePath: "models/OBJ/Samsung LED TV.mtl",
    objectPath: "models/OBJ/Samsung LED TV.obj"
  });
  // Inicializar el mueble
  MUEBLE.init({
    create: true, // Crear el mueble
    width: 1.4, // Anchura del mueble introducida por cliente (cm)
    height: 0.78, // Altura del mueble introducida por cliente (cm)
    depth: 0.32, // Profundidad del mueble (cm)
    thick: 0.018, //grosor de las laminas que forman el mueble (cm)
    marginWall: 0.05, //margen entre mueble y pared (M)
    color: 0x231919, //0xeceef4, //blanco plantilla
    objectTexture: TEXTURE_LOADER.get(),
    structureOrganization: validateStructure(
      inpStructureOrganization,
      rowHeights
    ),
    rowHeights: rowHeights,
    colWidths: colWidths,
    rowDepths: rowDepths,
    legsLength: 0.01,
    minRowHeight: 0.19,
    maxRowHeight: 0.38,
    minColWidth: 0.28,
    maxColWidth: 0.52
  });
  UI.init({
    create: true
  });
  // Inicializar la Cámara
  CAMERA.init({
    create: true, // Crear la camera
    fov: 22, // Campo de visión
    aspect:
      document.getElementById("app").offsetWidth /
      document.getElementById("app").offsetHeight, // Relación de aspecto
    near: 1, // Aproximación del plano
    far: 1000, // Plano lejano
    position_x: [-2, 0, 2], // Posicion Camera X
    position_y: 0, // Posicion Camera Y
    position_z: 2 // Posicion Camera Z
  });
  // Inicializar las Luces
  LIGHTS.init({
    create: true, // Crear la luz
    light_color: 0xffffff, // Color de la luz
    light_intensity: 1.15, // Intensidad de la luz
    light_x: 5, // Posicion X
    light_y: 13, // Posicion Y
    light_z: 13 // Posicion Z
  });

  // Inicializar el Grid
  GRID.init({
    create: false, // Crear el GridHelper (Cuadrícula de Ayuda)
    size: 20, // Tamaño de la cuadrícula
    divisions: 20, // Divisiones de la cuadrícula
    colorCenterLine: 0xdc3545, // Color de las lineas centrales de la cuadrícula
    colorGrid: 0x555555 // Color de las lineas de la cuadricula
  });

  // Inicializar el suelo
  FLOOR.init({
    create: true, // Crear el suelo
    width: 40, // Anchura del suelo (Centimetros)
    height: 20, // Altura del suelo (Centimetros)
    position_y: -0.5,
    widthSegments: 0.1, // Anchura del segmento
    heightSegments: 0.1, // Altura del segmento
    color: colores.color_floor, // Color del suelo
    receiveShadow: true // Recibir sombras
  });

  // Inicializar la pared
  WALL.init({
    create: true, // Crear la pared
    width: 20, // Anchura de la pared
    height: 40, // Altura de la pared
    position_y: -0.5,
    widthSegments: 0.1, // Anchura del segmento de la pared
    heightSegments: 0.1, // Altura del segmento de la pared
    color: colores.color_wall, // Color de la pared
    receiveShadow: true // Recibir sombras
  });

  // Inicializar el Renderer
  RENDERER.init({
    isWebGl: true, // Crear el Renderer (true => WebGl) || (false => Canvas)
    shadow: true, // Habilitar las sombras
    antialias: true, // Alisar los contornos de los objetos (Consume Recursos)
    precision: "highp", // Precisión de la sobra ("highp", "mediump", "lowp")
    powerPreference: "high-performance" // Potencia segun configuration de la GPU ("default", "high-performance", "low-power")
  });

  // Inicializar los Controles
  CONTROLS.init({
    create: true, // Crear el controlador de posición
    limits: true, // Crear los límites
    maxDistance: 100, // Distancia Máxima (Máx Zoom) Respecto Z
    minDistance: 0, // Distancia Mínima (Min Zoom) Respecto Z
    minPolarAngle: 0.8, // Angulo Mínimo Respecto X
    maxPolarAngle: 1.45, // Angulo Máximo Respecto X
    minAzimuthAngle: -1.25, // Angulo Mínimo Respecto Y
    maxAzimuthAngle: 1.25, // Angulo Máximo Respecto Y
    rotateSpeed: 0.25, // Velocidad de rotación
    enableZoom: false
  });

  // Inicializar la APP
  APP.init();
  ANIMATION.animate();
  APP.appDomSettings();
  APP.onResize();
  UI.setUiParameters(); //inicializar los parametros de la UI del mueble

  /*
  //eje que nos ayuda en el desarrollo para las dimensiones 3d
  var axesHelper = new THREE.AxesHelper();
  APP.settings.scene.add(axesHelper);
*/

  // Inicializar el receptor de mouse dentro de la escena
  MOUSE.init({
    create: true,
    mouse: {
      x: 0,
      y: 0
    },
    mouseClient: {
      x: 0,
      y: 0
    },
    INTERSECTED: null,
    camera: APP.settings.camera
  });
  
  //Inicializar eventos del UI de login y guardar
  USER.init();

  function animationInit() {
    // Inicializar la animacion
    ANIMATION.init({
      create: true, // Crear animation
      object: APP.settings.mueble.children,
      rotation: { x: 0, y: 1, z: 0 },
      position: { x: 0, y: 0, z: MUEBLE.get_old().depth * 0.75 }, //cajon abre menos del depth
      duration: 2000
    });
  }
  animationInit();

  UI.recolocateUI();
  moveToFooter("presettings");
  function moveToFooter(elementId) {
    var element = document.getElementById(elementId);
    var newPositionX = -Math.round($("#" + elementId).width() / 2); //offsetWidth no funciona bien
    var newPositionY = -Math.round($("#" + elementId).height() / 2);

    newPositionX += Math.round($("#app").width() / 2);
    newPositionY += Math.round($("#app").height());

    element.style.left = newPositionX + "px";
    element.style.top = newPositionY + "px";
  }

  hideDOMElement(false, "presettings", 300);
  //primera recolocación de camara y UI
  CAMERA.recolocate(1);

  // Load Params default
  $('input[name="wall"]').val(colores.color_wall);
  $('input[name="floor"]').val(colores.color_floor);

  // Eventos
  $(document).on("change", '[name="wall"]', function(e) {
    colores.color_wall = this.value;
    APP.changeColorWall(this.value);
  });

  $(document).on("change", '[name="floor"]', function(e) {
    colores.color_floor = this.value;
    APP.changeColorFloor(this.value);
  });

  $("#furniture-colors input").on("change", function() {
    var newSelected = $(this).attr("id");
    var circleNewSelected = $("#circle-" + newSelected);
    $("#furniture-colors label").removeClass("color-circle-checked");
    circleNewSelected.addClass("color-circle-checked");
  });

  $("#furniture-colors input").on("change", function() {
    //cambiar el color del mueble
    var newColor = Number(this.value.replace("#", "0x")); //cambiar el prefijo del color
    var mueble_old = MUEBLE.get_old();
    MUEBLE.init({
      //iniciamos con los parametros de antes de cambiar nada
      create: true,
      width: mueble_old.width, //anadimos solo el parametro nuevo que da el cliente
      height: mueble_old.height,
      depth: mueble_old.depth,
      thick: mueble_old.thick,
      marginWall: mueble_old.marginWall,
      shelf: mueble_old.shelf,
      color: newColor,
      objectTexture: TEXTURE_LOADER.get(),
      structureOrganization: validateStructure(
        mueble_old.structureOrganization,
        mueble_old.rowHeights
      ),
      rowHeights: mueble_old.rowHeights,
      colWidths: mueble_old.colWidths,
      rowDepths: mueble_old.rowDepths,
      legsLength: mueble_old.legsLength,
      minRowHeight: mueble_old.minRowHeight,
      maxRowHeight: mueble_old.maxRowHeight,
      minColWidth: mueble_old.minColWidth,
      maxColWidth: mueble_old.maxColWidth
    });

    remakeCloset(false);
  });

  $("#row-heights input").on("change", function() {
    //cambiar la altura de las filas
    var newRowHeights = rowHeights;
    var allClickedIndex = APP.auxs.allClickedIndex;
    for (var i = 0; i < allClickedIndex.length; i++) {
      newRowHeights[allClickedIndex[i][0]] = parseFloat(this.value);
    }
    var mueble_old = MUEBLE.get_old();
    MUEBLE.init({
      //iniciamos con los parametros de antes de cambiar nada
      create: true,
      width: mueble_old.width,
      height: mueble_old.height,
      depth: mueble_old.depth,
      thick: mueble_old.thick,
      marginWall: mueble_old.marginWall,
      shelf: mueble_old.shelf,
      color: mueble_old.color,
      objectTexture: TEXTURE_LOADER.get(),
      structureOrganization: validateStructure(
        mueble_old.structureOrganization,
        mueble_old.rowHeights
      ),
      rowHeights: newRowHeights, //anadimos solo el parametro nuevo que da el cliente
      colWidths: mueble_old.colWidths,
      legsLength: mueble_old.legsLength,
      rowDepths: mueble_old.rowDepths,
      minRowHeight: mueble_old.minRowHeight,
      maxRowHeight: mueble_old.maxRowHeight,
      minColWidth: mueble_old.minColWidth,
      maxColWidth: mueble_old.maxColWidth
    });

    remakeCloset(false);
  });

  $("#row-depths input").on("change", function() {
    //cambiar la altura de las filas
    var newRowDepths = rowDepths;
    var allClickedIndex = APP.auxs.allClickedIndex;
    for (var i = 0; i < allClickedIndex.length; i++) {
      newRowDepths[allClickedIndex[i][0]] = parseFloat(this.value);
    }
    console.log(newRowDepths);
    var mueble_old = MUEBLE.get_old();
    MUEBLE.init({
      //iniciamos con los parametros de antes de cambiar nada
      create: true,
      width: mueble_old.width,
      height: mueble_old.height,
      depth: mueble_old.depth,
      thick: mueble_old.thick,
      marginWall: mueble_old.marginWall,
      shelf: mueble_old.shelf,
      color: mueble_old.color,
      objectTexture: TEXTURE_LOADER.get(),
      structureOrganization: validateStructure(
        mueble_old.structureOrganization,
        mueble_old.rowHeights
      ),
      rowHeights: mueble_old.rowHeights, //anadimos solo el parametro nuevo que da el cliente
      colWidths: mueble_old.colWidths,
      legsLength: mueble_old.legsLength,
      rowDepths: newRowDepths,
      minRowHeight: mueble_old.minRowHeight,
      maxRowHeight: mueble_old.maxRowHeight,
      minColWidth: mueble_old.minColWidth,
      maxColWidth: mueble_old.maxColWidth
    });

    remakeCloset(false);
  });

  $("#furniture-width").on("change", function(e) {
    //generar mueble segun anchura
    if (!APP.auxs.isMouseUp) {
      var new_width = this.value / 100;
      var mueble_old = MUEBLE.get_old();
      var range_width = mueble_old.width;

      while (
        range_width / mueble_old.maxColWidth <
        new_width / mueble_old.maxColWidth
      ) {
        MUEBLE.init({
          //iniciamos con los parametros de antes de cambiar nada
          create: true,
          width: range_width, //anadimos solo el parametro nuevo que da el cliente
          height: mueble_old.height,
          depth: mueble_old.depth,
          thick: mueble_old.thick,
          marginWall: mueble_old.marginWall,
          shelf: mueble_old.shelf,
          color: mueble_old.color,
          objectTexture: TEXTURE_LOADER.get(),
          structureOrganization: validateStructure(
            mueble_old.structureOrganization,
            mueble_old.rowHeights
          ),
          rowHeights: mueble_old.rowHeights,
          colWidths: mueble_old.colWidths,
          rowDepths: mueble_old.rowDepths,
          legsLength: mueble_old.legsLength,
          minRowHeight: mueble_old.minRowHeight,
          maxRowHeight: mueble_old.maxRowHeight,
          minColWidth: mueble_old.minColWidth,
          maxColWidth: mueble_old.maxColWidth
        });
        remakeCloset(false);

        range_width += mueble_old.maxColWidth;
      }

      MUEBLE.init({
        //iniciamos con los parametros de antes de cambiar nada
        create: true,
        width: new_width, //anadimos solo el parametro nuevo que da el cliente
        height: mueble_old.height,
        depth: mueble_old.depth,
        thick: mueble_old.thick,
        marginWall: mueble_old.marginWall,
        shelf: mueble_old.shelf,
        color: mueble_old.color,
        objectTexture: TEXTURE_LOADER.get(),
        structureOrganization: validateStructure(
          mueble_old.structureOrganization,
          mueble_old.rowHeights
        ),
        rowHeights: mueble_old.rowHeights,
        colWidths: mueble_old.colWidths,
        rowDepths: mueble_old.rowDepths,
        legsLength: mueble_old.legsLength,
        minRowHeight: mueble_old.minRowHeight,
        maxRowHeight: mueble_old.maxRowHeight,
        minColWidth: mueble_old.minColWidth,
        maxColWidth: mueble_old.maxColWidth
      });
      remakeCloset(false);
      range_width += 0.2;
    }
  });

  $(document).on("change", '[name="width"]', function(e) {
    UI.recolocateUI();
    hideSettings();
  });

  $(document).on("change", '[name="height"]', function(e) {
    //cambiar altura del mueble
    if (!APP.auxs.isMouseUp) {
      var new_height = this.value / 100;
      var mueble_old = MUEBLE.get_old();

      var range_height = mueble_old.height;

      while (
        range_height / mueble_old.maxRowHeight <
        new_height / mueble_old.maxRowHeight
      ) {
        MUEBLE.init({
          create: true,
          width: mueble_old.width,
          height: range_height,
          depth: mueble_old.depth,
          thick: mueble_old.thick,
          marginWall: mueble_old.marginWall,
          shelf: mueble_old.shelf,
          color: mueble_old.color,
          objectTexture: TEXTURE_LOADER.get(),
          structureOrganization: validateStructure(
            mueble_old.structureOrganization,
            mueble_old.rowHeights
          ),
          rowHeights: mueble_old.rowHeights,
          colWidths: mueble_old.colWidths,
          rowDepths: mueble_old.rowDepths,
          legsLength: mueble_old.legsLength,
          minRowHeight: mueble_old.minRowHeight,
          maxRowHeight: mueble_old.maxRowHeight,
          minColWidth: mueble_old.minColWidth,
          maxColWidth: mueble_old.maxColWidth
        });
        remakeCloset(false);
        range_height += mueble_old.maxRowHeight;
      }

      MUEBLE.init({
        create: true,
        width: mueble_old.width,
        height: new_height,
        depth: mueble_old.depth,
        thick: mueble_old.thick,
        marginWall: mueble_old.marginWall,
        shelf: mueble_old.shelf,
        color: mueble_old.color,
        objectTexture: TEXTURE_LOADER.get(),
        structureOrganization: validateStructure(
          mueble_old.structureOrganization,
          mueble_old.rowHeights
        ),
        rowHeights: mueble_old.rowHeights,
        colWidths: mueble_old.colWidths,
        rowDepths: mueble_old.rowDepths,
        legsLength: mueble_old.legsLength,
        minRowHeight: mueble_old.minRowHeight,
        maxRowHeight: mueble_old.maxRowHeight,
        minColWidth: mueble_old.minColWidth,
        maxColWidth: mueble_old.maxColWidth
      });
      remakeCloset(false);
    }
  });

  $("#col-width").on("change", function(e) {
    //cambiar anchura de columnas
    //evitar que al levantar el mouse haga la accion repetida

    if (!APP.auxs.isMouseUp) {
      var newWidth = this.value / 100;
      var newColWidths = colWidths;
      var allClickedIndex = APP.auxs.allClickedIndex;

      for (var i = 0; i < allClickedIndex.length; i++) {
        newColWidths[allClickedIndex[i][1]] = parseFloat(newWidth);
      }
      var mueble_old = MUEBLE.get_old();

      MUEBLE.init({
        //iniciamos con los parametros de antes de cambiar nada
        create: true,
        width: mueble_old.width,
        height: mueble_old.height,
        depth: mueble_old.depth,
        thick: mueble_old.thick,
        marginWall: mueble_old.marginWall,
        shelf: mueble_old.shelf,
        color: mueble_old.color,
        objectTexture: TEXTURE_LOADER.get(),
        structureOrganization: validateStructure(
          mueble_old.structureOrganization,
          mueble_old.rowHeights
        ),
        rowHeights: mueble_old.rowHeights, //anadimos solo el parametro nuevo que da el cliente
        colWidths: newColWidths,
        rowDepths: mueble_old.rowDepths,
        legsLength: mueble_old.legsLength,
        minRowHeight: mueble_old.minRowHeight,
        maxRowHeight: mueble_old.maxRowHeight,
        minColWidth: mueble_old.minColWidth,
        maxColWidth: mueble_old.maxColWidth
      });

      remakeCloset(false);
    }
  });

  $(document).on("change", '[name="height"]', function(e) {
    //recolocar camara al cambiar la altura
    CAMERA.recolocate(500);
    UI.recolocateUI();
    hideSettings();
  });

  $(document).on("change", '[name="depth"]', function(e) {
    //cambiar profundidad del mueble
    var new_depth = this.value / 100;
    var mueble_old = MUEBLE.get_old();
    MUEBLE.init({
      create: true,
      width: mueble_old.width,
      height: mueble_old.height,
      depth: new_depth,
      thick: mueble_old.thick,
      marginWall: mueble_old.marginWall,
      shelf: mueble_old.shelf,
      color: mueble_old.color,
      objectTexture: TEXTURE_LOADER.get(),
      structureOrganization: validateStructure(
        mueble_old.structureOrganization,
        mueble_old.rowHeights
      ),
      rowHeights: mueble_old.rowHeights,
      colWidths: mueble_old.colWidths,
      rowDepths: mueble_old.rowDepths,
      legsLength: mueble_old.legsLength,
      minRowHeight: mueble_old.minRowHeight,
      maxRowHeight: mueble_old.maxRowHeight,
      minColWidth: mueble_old.minColWidth,
      maxColWidth: mueble_old.maxColWidth
    });
    remakeCloset(false);
  });

  $(document).on("mouseout", '[name="depth"]', function(e) {
    UI.recolocateUI();
  });

  $(document).on("click", '[name="all"]', function(e) {
    //seleccionar todo, para dev
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;
    for (var i = 0; i < allSilouettes.length; i++) {
      highLightSilouette(allSilouettes[i], true, true);
      highLightSilouette(allSilouettes[i], false, false);
    }
  });

  $("#app").on("click", function(e) {
    if (APP.auxs.allClickedIndex.length > 0) {
      preventClientMistake(0.01, 0.018, true);
    }
  });

  $(document).on("click", '[name="allRow"]', function(e) {
    //seleccionar toda la fila
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;
    var clickedSilouetteIndex;
    var allClicked = APP.auxs.allClickedIndex;
    var clickedSilouette;
    var firstClickedIndex;

    if (allClicked.length < 2 || APP.auxs.allRowColSwitch) {
      firstClickedIndex = APP.auxs.firstClickedIndex.slice();
      if (APP.auxs.allRowColSwitch) {
        APP.auxs.allClickedIndex = [];

        for (var i = 0; i < allSilouettes.length; i++) {
          setClickedSilouette(false, 0.3, allSilouettes[i], true); //resetea clicks antes de select
          allSilouettes[i].material.visible = false;
          ANIMATION.moveDoor(i, false);
        }
      }

      for (var i = 0; i < APP.settings.mueble.numColumns; i++) {
        if (firstClickedIndex[1] != i || APP.auxs.allRowColSwitch) {
          clickedSilouetteIndex = fromClosetIndexToIndex([
            firstClickedIndex[0],
            i
          ]);
          clickedSilouette = APP.settings.scene.getObjectByName(
            "silouettes group"
          ).children[clickedSilouetteIndex];
          highLightSilouette(clickedSilouette, true, true);
          ANIMATION.moveDoor(clickedSilouetteIndex, true);
        }
      }

      setCurrentCheckedButtons();
      APP.auxs.allRowColSwitch = true;
      APP.auxs.firstClickedIndex = firstClickedIndex;
    }
  });

  $(document).on("click", '[name="allCol"]', function(e) {
    //seleccionar toda la columna
    var clickedSilouetteIndex;
    var allClicked = APP.auxs.allClickedIndex;
    var clickedSilouette;
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;
    var firstClickedIndex;

    if (allClicked.length < 2 || APP.auxs.allRowColSwitch) {
      firstClickedIndex = APP.auxs.firstClickedIndex.slice();
      if (APP.auxs.allRowColSwitch) {
        APP.auxs.allClickedIndex = [];

        for (var i = 0; i < allSilouettes.length; i++) {
          setClickedSilouette(false, 0.3, allSilouettes[i], true); //resetea clicks antes de select
          allSilouettes[i].material.visible = false;
          ANIMATION.moveDoor(i, false);
        }
      }

      for (var i = 0; i < APP.settings.mueble.numRows; i++) {
        if (firstClickedIndex[0] != i || APP.auxs.allRowColSwitch) {
          clickedSilouetteIndex = fromClosetIndexToIndex([
            i,
            firstClickedIndex[1]
          ]);
          clickedSilouette = APP.settings.scene.getObjectByName(
            "silouettes group"
          ).children[clickedSilouetteIndex];
          highLightSilouette(clickedSilouette, true, true);
          ANIMATION.moveDoor(clickedSilouetteIndex, true);
        }
      }
      setCurrentCheckedButtons();

      APP.auxs.allRowColSwitch = true;
      APP.auxs.firstClickedIndex = firstClickedIndex;
    }
  });

  $(document).on("click", '[name="coverType"]', function(e) {
    //cambiar a cajon || puerta || nada
    var newCoverType = document.getElementById(this.getAttribute("for")).value; //value del radio al que hace referencia la label seleccionada
    var mueble_old = MUEBLE.get_old();
    var currentSilouette;
    var allClicked = APP.auxs.allClickedIndex;
    var currentIndex;
    if (allClicked.length > 0) {
      for (var i = 0; i < allClicked.length; i++) {
        currentIndex = fromClosetIndexToIndex(allClicked[i]);
        currentSilouette = APP.settings.scene.getObjectByName(
          "silouettes group"
        ).children[currentIndex]; //objeto silueta
        mueble_old.structureOrganization[currentSilouette.closetIndex[0]][
          currentSilouette.closetIndex[1]
        ] = newCoverType; //igualamos con la posicion en el mueble del objeto silueta
      }

      MUEBLE.init({
        create: true,
        width: mueble_old.width,
        height: mueble_old.height,
        depth: mueble_old.depth,
        thick: mueble_old.thick,
        marginWall: mueble_old.marginWall,
        shelf: mueble_old.shelf,
        color: mueble_old.color,
        objectTexture: TEXTURE_LOADER.get(),
        structureOrganization: validateStructure(
          mueble_old.structureOrganization,
          mueble_old.rowHeights
        ),
        rowHeights: mueble_old.rowHeights,
        colWidths: mueble_old.colWidths,
        rowDepths: mueble_old.rowDepths,
        legsLength: mueble_old.legsLength,
        minRowHeight: mueble_old.minRowHeight,
        maxRowHeight: mueble_old.maxRowHeight,
        minColWidth: mueble_old.minColWidth,
        maxColWidth: mueble_old.maxColWidth
      });
      remakeCloset(false);
    }
  });

  $(document).on("click", '#load-button', function(e) {
    //load modelo guardado
    var newModel;
    var mueble_old = MUEBLE.get_old();
    var structures = USER.getList();

    for (let i = 0; i < structures.length; i++) {
      if(structures[i].slotId == USER.getSlotId()){
        newModel = structures[i];
      }
    }
    if(newModel != undefined && newModel != null){
      MUEBLE.init({
        create: true,
        width: newModel.width,
        height: newModel.height,
        depth: mueble_old.depth,
        thick: mueble_old.thick,
        marginWall: mueble_old.marginWall,
        shelf: mueble_old.shelf,
        color: parseInt(newModel.color),
        objectTexture: TEXTURE_LOADER.get(),
        structureOrganization: newModel.coverTypes,
        rowHeights: newModel.rowHeights,
        colWidths: newModel.colWidths,
        rowDepths: newModel.rowDepths,
        legsLength: mueble_old.legsLength,
        minRowHeight: mueble_old.minRowHeight,
        maxRowHeight: mueble_old.maxRowHeight,
        minColWidth: mueble_old.minColWidth,
        maxColWidth: mueble_old.maxColWidth
      });
      remakeCloset(true);
    }
  });

  $("#settings").mouseover(function(e) {
    APP.auxs.insideUI = true;
  });

  $("#settings").mouseleave(function(e) {
    APP.auxs.insideUI = false;
  });

  function hideSettings() {
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;

    hideDOMElement(true, "settings", 1000);
    hideDOMElement(false, "presettings", 1000);

    APP.auxs.hidePresettings = false;

    for (var i = 0; i < allSilouettes.length; i++) {
      setClickedSilouette(false, 0.3, allSilouettes[i], true); //resetea clicks antes de select
      allSilouettes[i].material.visible = false;
      ANIMATION.moveDoor(i, false);
    }

    APP.auxs.allRowColSwitch = false;
  }

  $(document).on("click", '[name="hideSettings"]', function(e) {
    hideSettings();
  });

  $(document).on("mousedown", '[id="app"]', function(e) {
    var currentIndex = APP.auxs.intersected_actual_index;
    var targetSilouette = APP.settings.scene.getObjectByName("silouettes group")
      .children;

    if (currentIndex != null) {
      APP.auxs.clickedIndex = APP.auxs.intersected_actual_index;
      highLightSilouette(targetSilouette[currentIndex], true, true);
      setConcreteDimensions();
      setCurrentCheckedButtons();
    }
  });

  $("body").on("mouseup", function() {
    CAMERA.recolocate(800);
    APP.auxs.isMouseUp = true;
  });

  $("body").on("mousedown", function() {
    APP.auxs.isMouseUp = false;
  });

  $("#app").on("mouseup", function() {
    showOrHideSettings();
  });

  $(window).on("resize", function() {
    moveToFooter("presettings");
    UI.recolocateUI();
  });

  function showOrHideSettings() {
    var clickLength = APP.auxs.allClickedIndex.length;
    var currentHide = APP.auxs.hidePresettings;
    var hide = clickLength > 0 ? true : false;

    if (hide != currentHide) {
      hideDOMElement(hide, "presettings", 300);
      hideDOMElement(!hide, "settings", 300);
    }

    APP.auxs.hidePresettings = hide;
  }

  function hideDOMElement(hide, elementId, duration) {
    var element = $("#" + elementId);

    if (hide) {
      element.fadeOut(duration);
    } else {
      element.fadeIn(duration);
    }
  }

  function checkValidHover(intersected, oldIntersected) {
    //definimos si se debe empezar o parar una animacion
    var checked = null;

    if (intersected != null) {
      if (intersected.uuid != oldIntersected) {
        //al cambiar de puerta con el mouse
        checked = true;
        APP.auxs.doorStopAction = true;
      } //cuando el mouse sigue en la misma puerta que antes no hacemos nada
    } else if (intersected == null && APP.auxs.doorStopAction) {
      //la primera vez que el mouse no apunta al mueble
      checked = false;
      APP.auxs.doorStopAction = false;
    }

    return checked;
  }

  function animateOrDeanimate() {
    //parar y empezar animaciones
    var doAnimate = checkValidHover(
      MOUSE.variables.INTERSECTED,
      APP.auxs.intersected_old_uuid
    );
    var currentPosition = 0;
    var currentIndex = APP.auxs.intersected_actual_index;
    var oldDoorIndex = APP.auxs.oldDoorIndex;
    var targetSilouette = APP.settings.scene.getObjectByName("silouettes group")
      .children;

    if (doAnimate != null) {
      if (
        doAnimate &&
        oldDoorIndex != undefined &&
        oldDoorIndex != currentIndex
      ) {
        //cerrar al abrir otra puerta dentro del mueble
        if (!targetSilouette[APP.auxs.oldDoorIndex].clicked) {
          ANIMATION.moveDoor(APP.auxs.oldDoorIndex, false);
          highLightSilouette(
            targetSilouette[APP.auxs.oldDoorIndex],
            false,
            false
          );
        }
      }
      if (doAnimate) {
        //abrir una puerta
        if (!targetSilouette[currentIndex].clicked) {
          ANIMATION.moveDoor(currentIndex, true);
          highLightSilouette(targetSilouette[currentIndex], true, false);
        }

        //mostrar y mover la ventana de settings al cursor
        if (!APP.auxs.insideUI) {
          currentPosition = UI.get2dPosition("silouettes group", currentIndex);
          UI.moveUISettings(
            UI.get2dPosition(
              "silouettes group",
              APP.settings.mueble.numColumns - 1
            ),
            currentPosition.y,
            "settings"
          );
        }
        APP.auxs.intersected_last_index = currentIndex;
      } else {
        if (oldDoorIndex != null) {
          if (!targetSilouette[APP.auxs.oldDoorIndex].clicked) {
            //esconder ventana
            //cerrar una puerta al salir del mueble
            ANIMATION.moveDoor(APP.auxs.oldDoorIndex, false);
            highLightSilouette(
              targetSilouette[APP.auxs.oldDoorIndex],
              false,
              false
            );
          }
        }
      }
      APP.auxs.oldDoorIndex = currentIndex;
    }
  }

  function highLightSilouette(intersected, visible, clicked) {
    if (intersected.clicked != undefined && !intersected.clicked) {
      //si la silueta no esta seleccionada
      intersected.material.visible = visible;
    }

    if (clicked) {
      if (!intersected.clicked) {
        setClickedSilouette(true, 0.6, intersected, false);
      } else {
        setClickedSilouette(false, 0.3, intersected, true); //volvemos a poner la opacidad del hover
        //quitar division clickeada
      }
    }
  }

  function setClickedSilouette(clickStatus, opacity, intersected, borrar) {
    var allClicked = APP.auxs.allClickedIndex;
    var indexToDelete;

    intersected.clicked = clickStatus;
    intersected.material.opacity = opacity;

    if (borrar) {
      indexToDelete = allClicked.indexOf(intersected.closetIndex);
      if (indexToDelete != -1) {
        allClicked.splice(indexToDelete, 1); //borrar division
      }
    } else {
      allClicked.push(intersected.closetIndex); //anadir division
    }

    //indicar el indice de la silueta mas antigua que se ha clickeado
    if (allClicked.length > 0) {
      APP.auxs.firstClickedIndex = allClicked[0];
    } else {
      APP.auxs.firstClickedIndex = null;
    }
  }

  function onDocumentMouseMove(event) {
    //recogemos medidas del DOM para calibrar correctamente el raycaster con el raton
    var canvasLeftWidth = APP.settings.renderer.domElement.offsetLeft;
    var canvasLeftMargin = APP.auxs.appDomSettings.left;
    var canvasTotalWidth = APP.settings.renderer.domElement.clientWidth;

    var canvasTopHeight = APP.settings.renderer.domElement.offsetTop;
    var canvasTopMargin = APP.auxs.appDomSettings.top;
    var canvasTotalHeight = APP.settings.renderer.domElement.clientHeight;

    //Solo recogemos las coordenadas del mouse dentro del div con id='app'
    MOUSE.variables.mouse.x =
      ((event.clientX - canvasLeftWidth - canvasLeftMargin) /
        canvasTotalWidth) *
        2 -
      1;

    MOUSE.variables.mouse.y =
      -(
        (event.clientY - canvasTopHeight - canvasTopMargin) /
        canvasTotalHeight
      ) *
        2 +
      1;

    //cojemos las coordenadas de todo el doc
    MOUSE.variables.mouseClient.x = event.clientX;
    MOUSE.variables.mouseClient.y = event.clientY;

    if (!APP.auxs.insideUI) {
      MOUSE.updateMouse();
    }

    //console.log("X: " + event.clientX + ", Y: " + event.clientY);

    animateOrDeanimate();
  }

  function validateStructure(inpStructureOrganization, currentRowHeights) {
    //cambia la estructura dada para evitar muebles inestables || prohibidos
    var minDoorHeight = limitations.minDoorHeight;
    var maxDrawerPositionHeight = limitations.maxDrawerPositionHeight;
    var legsHeight = limitations.legsHeight;
    var thick = limitations.thick;

    var resultStructureOrganization = JSON.parse(
      JSON.stringify(inpStructureOrganization)
    ); //creamos uno nuevo en vez de referenciar al original
    var currentHeight = legsHeight + thick;

    for (var i = 0; i < currentRowHeights.length; i++) {
      currentHeight += currentRowHeights[i] + thick;
      //controlamos la altura total en cada piso que validamos
      for (var e = 0; e < resultStructureOrganization[0].length; e++) {
        if (
          currentRowHeights[i] < minDoorHeight &&
          (resultStructureOrganization[i][e] === "Doors" ||
            resultStructureOrganization[i][e] === "DoubleDoors")
        ) {
          //puertas de menos de 26cm de altura a None
          resultStructureOrganization[i][e] = "None";
        }

        if (
          currentHeight > maxDrawerPositionHeight &&
          resultStructureOrganization[i][e] === "Drawers"
        ) {
          //cajones a mas de 160cm de altura
          resultStructureOrganization[i][e] = "None";
        }
      }
    }
    return resultStructureOrganization;
  }

  function preventClientMistake(legsHeight, thick, columnsAndRows) {
    //prohibe al cliente crear divisiones no permitidas u otras opciones
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;
    var allClickedIndex = APP.auxs.allClickedIndex;
    var allClicked = [];
    var mistakeCode = "";
    var currentLimit;
    var i = 0;

    cleanClassFromElement("", "custom-button-disabled");

    while (i < allClickedIndex.length && mistakeCode == "") {
      allClicked[i] = fromClosetIndexToIndex(allClickedIndex[i]);
      if (allSilouettes[allClicked[i]].height < 0.26) {
        //errorMessage = "No es posible crear una puerta de menos de 0.26cm de alto.";
        mistakeCode = "rowHeight";
        document
          .getElementById("division-coverDoors")
          .classList.add("custom-button-disabled");
      }
      if (
        calculateHeightUntilRow(allClickedIndex[i][0], legsHeight, thick) > 1.6
      ) {
        //errorMessage = "No es posible crear un cajón a más de 160cm de altura.";
        mistakeCode = "coverType";
        document
          .getElementById("division-coverDrawers")
          .classList.add("custom-button-disabled");
      }
      i++;
    }
    //deshabilitar el cambio de dimensiones de la ultima fila/columna
    if (allClickedIndex.length === 1) {
      if (allClickedIndex[0][0] == APP.settings.mueble.numRows - 1) {
        for (var i = 0; i < limitations.rowHeightsLimits.length; i++) {
          currentLimit = (limitations.rowHeightsLimits[i] * 100).toString();
          document
            .getElementById("row-height" + currentLimit)
            .classList.add("custom-button-disabled");
        }
      }
      if (allClickedIndex[0][1] == APP.settings.mueble.numColumns - 1) {
        document
          .getElementById("col-width")
          .classList.add("custom-button-disabled");
      }
    }
    //deshabilitar la seleccion de toda la columna y fila
    if (allClickedIndex.length > 1 && columnsAndRows) {
      document
        .getElementById("selection-allRow")
        .classList.add("custom-button-disabled");
      document
        .getElementById("selection-allCol")
        .classList.add("custom-button-disabled");
    } else {
      document
        .getElementById("selection-allRow")
        .classList.remove("custom-button-disabled");
      document
        .getElementById("selection-allCol")
        .classList.remove("custom-button-disabled");
    }
  }

  function calculateHeightUntilRow(maxRow, legsHeight, thick) {
    var currentHeight = legsHeight + thick;
    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children;

    for (var i = 0; i < maxRow + 1; i++) {
      currentHeight += allSilouettes[i].height + thick;
    }

    return currentHeight;
  }

  function fromClosetIndexToIndex(closetIndex) {
    var index =
      closetIndex[0] * APP.settings.mueble.numColumns + closetIndex[1];

    return index;
  }

  function remakeCloset(resetClicked) {
    //si se quiere deseleccionar todo, pasar param true
    var allClickedClosetIndex = APP.auxs.allClickedIndex.slice();
    var allClickedIndex = [];
    if (APP.auxs.firstClickedIndex != null) {
      var firstClickedIndex = APP.auxs.firstClickedIndex.slice();
    }

    //rehacer todo el mueble
    APP.settings.scene.remove(APP.settings.mueble);
    APP.createMueble();

    var allSilouettes = APP.settings.scene.getObjectByName("silouettes group")
      .children; //importante coger la referencia despues de rehacer el mueble

    //rehace todas las animaciones
    animationInit();
    APP.createAnimation();

    //reseteamos todo lo seleccionado
    APP.auxs.allClickedIndex = [];

    if (!resetClicked) {
      for (var i = 0; i < allClickedClosetIndex.length; i++) {
        allClickedIndex[i] = fromClosetIndexToIndex(allClickedClosetIndex[i]);
        highLightSilouette(allSilouettes[allClickedIndex[i]], true, true);
        ANIMATION.moveDoor(allClickedIndex[i], true);
      }
    }

    if (firstClickedIndex != null) {
      APP.auxs.firstClickedIndex = firstClickedIndex;
    }
    showOrHideSettings();
    setCurrentCheckedButtons();
    preventClientMistake(0.01, 0.018, false);
    recolocateLoadedObject();
  }

  function recolocateLoadedObject() {
    var loadedObject;

    if (APP.settings.scene.getObjectByName("loadedObject") != undefined) {
      loadedObject = APP.settings.scene.getObjectByName("loadedObject");

      loadedObject.position.y =
        APP.settings.floor.position.y + APP.settings.mueble.totalHeight;
      loadedObject.position.x = APP.settings.mueble.position.x;
      loadedObject.position.z =
        APP.settings.mueble.position.z -
        APP.settings.mueble.topDepth / 2 +
        loadedObject.geometrySize.y / 2; //deberia ser geometrySize.z pero el modelo esta interpretado como si el eje Y fuese el Z
    }
  }

  function setConcreteDimensions() {
    //enviar las dimensiones adecuadas a la UI segun la division seleccionada
    var rangeWidthValue;
    var widthElement;
    var currentDivisionWidth;
    if (APP.auxs.allClickedIndex.length > 0) {
      widthElement = document.getElementById("current-col-width");
      rangeWidthValue = document.getElementById("col-width");
      currentDivisionWidth = parseInt(
        colWidths[APP.auxs.allClickedIndex[0][1]] * 100
      );

      widthElement.innerHTML = currentDivisionWidth + "cm";

      rangeWidthValue.value = currentDivisionWidth;
    }
  }

  function setCurrentCheckedButtons() {
    //poner en checked los botones adecuados a la UI segun la division seleccionada
    var newSelectedLabel;
    var newSelectedRadio;
    var id;
    var difference = false;
    var lastOptions = [null, null];
    var i = 0;
    var limitedParameters = ["height", "depth"];

    cleanClassFromElement("custom-check-button", "custom-button-checked"); //quitar checked de todos antes de nada

    while (!difference && i < APP.auxs.allClickedIndex.length) {
      //alturas de filas y profundidades
      for (let e = 0; e < limitedParameters.length; e++) {
        id = parseInt(rowHeights[APP.auxs.allClickedIndex[i][0]] * 100);
        newSelectedLabel = document.getElementById(
          "row-" + limitedParameters[e] + id
        );
        newSelectedRadio = document.getElementById(limitedParameters[e] + id);
        newSelectedLabel.classList.add("custom-button-checked");
        newSelectedRadio.checked = true;
        if (lastOptions[1] != null && id != lastOptions[1]) {
          difference = true;
          cleanClassFromElement("custom-check-button", "custom-button-checked");
        }
      }
      lastOptions[1] = id;

      //cobertura de la division
      id = APP.settings.scene.getObjectByName("silouettes group").children[
        fromClosetIndexToIndex(APP.auxs.allClickedIndex[i])
      ].coverType; //propiedad coverType de object silueta igual a la parte final del id
      newSelectedLabel = document.getElementById("division-cover" + id);
      newSelectedRadio = document.getElementById("cover" + id);
      newSelectedLabel.classList.add("custom-button-checked");
      newSelectedRadio.checked = true;
      if (lastOptions[0] != null && id != lastOptions[0]) {
        difference = true;
        cleanClassFromElement("custom-check-button", "custom-button-checked"); //si hay diferencias, no se pone nada
      }
      lastOptions[0] = id;

      i++;
    }
  }

  function cleanClassFromElement(elementName, className) {
    //quita la clase pasada de todos los elem con el nombre pasado
    var selectedTags = document.getElementsByName(elementName);
    for (var i = 0; i < selectedTags.length; i++) {
      selectedTags[i].checked = false;
    }
    $("label").removeClass(className);
    $("input").removeClass(className);
  }

  document.addEventListener("mousemove", onDocumentMouseMove, false);

  $("input[type=range]").on("input", function() {
    $(this).trigger("change"); //cada cambio en input range actualiza los eventos de inputs de jquery
  });

  $("#save-button").on("click", function() {
    //createJSON()
    //sendJSON()
    //downloadJSON()
  });
});
