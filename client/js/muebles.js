var MUEBLE = {
  init: function(variables) {
    this.settings = {
      mueble: null
    };

    this.constants = {
    	maxWidthColumn: 0.9, //maxima distancia sense crear una nova columna
    	minWidthDoubleDoors: 0.45, //maxima distancia sense partir les portes en dos
    	prices: {
    		doorPrice: 45,
    		drawerPrice: 60,
    		columnPrice: 35
    	},
    	silouette:{
    		silouetteColor: 0x5f8da6,
    		silouetteOpacity: 0.3
    	},
    	drawer:{
    		marginDrawerBetween: 0.01,
    		marginDrawerHeight: 0.05
    	}
    }

    this.variables = {
      create: true,
      width: variables.width,
      height: variables.height,
      depth: variables.depth,
      thick: variables.thick,
      marginWall: variables.marginWall,
      color: variables.color,
      objectTexture: variables.objectTexture,
      structureOrganization: variables.structureOrganization,
      rowHeights: variables.rowHeights,
      colWidths: variables.colWidths,
      rowDepths: variables.rowDepths,
      legsLength: variables.legsLength,
      minRowHeight: variables.minRowHeight,
      maxRowHeight: variables.maxRowHeight,
      minColWidth: variables.minColWidth,
      maxColWidth: variables.maxColWidth
    };
    $.extend(this.variables, variables);

    if (variables.create) this.set();
  },

  get: function() {
    return this.settings.mueble;
  },

  get_old: function() {
    return this.settings.mueble_old;
  },

  set: function() {
    this.settings.mueble_old = this.variables;
    this.settings.mueble = this.createCloset(this.variables);
  },

  createCloset(variables) {
    var closet = new THREE.Group();
    closet.name = "initial closet group";
    var silouettes = new THREE.Group();
    silouettes.name = "silouettes group";
    var computedVariables = {
    	numberColumns: null,
    	numberRows: null,
    	totalWidth: null,
    	totalHeight: null,
    	totalPrice: null,
    	rowsPositionY: null,
    	colsPositionX: null,
    	baseDepth: null
    };
    
    computedVariables.numberColumns = this.calculateNumGridAxe(variables.width, variables.colWidths, "width");
    computedVariables.numberRows = this.calculateNumGridAxe(
      variables.height + variables.legsLength,
      variables.rowHeights,
      "height"
    );
    computedVariables.totalWidth = this.calculateLengthGridAxe(
      computedVariables.numberColumns,
      variables.colWidths,
      variables.thick
    );
    computedVariables.totalHeight = this.calculateLengthGridAxe(
      computedVariables.numberRows,
      variables.rowHeights,
      variables.thick
    );
    computedVariables.totalPrice = this.calculatePrice(
      variables.structureOrganization,
      computedVariables.numberColumns,
      computedVariables.numberRows
    );
    computedVariables.rowsPositionY = this.calculateCoordinates(variables.height, variables.rowHeights);
    computedVariables.colsPositionX = this.calculateCoordinates(variables.width, variables.colWidths);
    computedVariables.baseDepth = this.getHigherValue(variables.rowDepths);

    this.generateShelvesAndSilouettes(variables, computedVariables, closet, silouettes);
    closet.add(
      this.generateLegs(
        variables.height,
        variables.baseDepth,
        variables.thick,
        variables.legsLength,
        computedVariables.colsPositionX,
        computedVariables.numberColumns,
        variables.colWidths
      )
    );

    closet.position.y = (variables.height + variables.thick) / 2 + variables.legsLength - 0.5; //posicionamos el mueble sobre el suelo
    closet.position.z = (computedVariables.baseDepth + variables.thick) / 2 + variables.marginWall; //posicionamos el mueble delante de la pared

    //Info importante sobre el mueble
    closet.totalWidth = computedVariables.totalWidth; //xa saber ancho total
    closet.totalHeight = computedVariables.totalHeight + variables.legsLength; //xa saber altura total
    closet.baseDepth = computedVariables.baseDepth;
    closet.topDepth = variables.rowDepths[variables.rowDepths.length - 1];
    closet.numRows = computedVariables.numberRows;
    closet.numColumns = computedVariables.numberColumns;
    closet.totalPrice = computedVariables.totalPrice;

    return closet;
  },

  generateShelvesAndSilouettes(initialVariables, computedVariables, closet, silouettes){    
		var closetDivision = [];
    	var closetDivisionSilouette = [];

	    for (var z = 0; z < computedVariables.numberRows; z++) {
	      for (var i = 0; i < computedVariables.numberColumns; i++) {
	        //define si hace esquina la division actual
	        computedVariables.corner = this.defineCorner(i, computedVariables.numberColumns);
	        //crea division
	        closetDivision[i] = this.createClosetDivision(
	          initialVariables.colWidths[i],
	          initialVariables.rowHeights[z],
	          initialVariables.rowDepths[z],
	          initialVariables.thick,
	          initialVariables.marginWall,
	          initialVariables.color,
	          initialVariables.objectTexture,
	          initialVariables.structureOrganization[z][i].coverType,
	          initialVariables.rowHeights[z],
	          computedVariables.corner
	        );
	        //posiciona division relativa al mueble

	        closetDivision[i].position.x = computedVariables.colsPositionX[i];
	        closetDivision[i].position.y = computedVariables.rowsPositionY[z];
	        closetDivision[i].position.z = -computedVariables.baseDepth / 2 + initialVariables.rowDepths[z] / 2;
	        closet.add(closetDivision[i]);

	        //silouette division
	        closetDivisionSilouette[i] = this.createSilouetteCubes(
	          initialVariables.rowDepths[z],
	          initialVariables.thick,
	          initialVariables.colWidths[i],
	          initialVariables.rowHeights[z],
	          initialVariables.structureOrganization[z][i].coverType
	        );

	        closetDivisionSilouette[i].closetIndex.push(z, i);

	        closetDivisionSilouette[i].position.x = computedVariables.colsPositionX[i];
	        closetDivisionSilouette[i].position.y = computedVariables.rowsPositionY[z];
	        closetDivisionSilouette[i].position.z =
	          -computedVariables.baseDepth / 2 + initialVariables.rowDepths[z] / 2;
	        silouettes.add(closetDivisionSilouette[i]);
	      }
	    }
	    closet.add(silouettes);
  },

  defineCorner(i, numberColumns){
  	var corner = "None";

  	if (i == 0 && i == numberColumns - 1) {
          corner = "Both";
        } else if (i == 0) {
          corner = "Left";
        } else if (i == numberColumns - 1) {
          corner = "Right";
        } else {
          corner = "None";
        }

    return corner;
  },

  createClosetDivision( //genera una division del armario
    width, //anchura del mueble      - X
    height, //altura del mueble       - Y
    depth, //profundidad del mueble  - Z
    thick, //grosor de las piezas del mueble
    marginWall,
    closetColor,
    objectTexture,
    coverType,
    maxHeight,
    corner
  ) {
    var objectColor = { color: closetColor };
    var closetCustom = new THREE.Group(); //creamos GRUPOS como closet de OBJETOS
    closetCustom.name = "closetCustom " + coverType;
    closetCustom.corner = corner;
    
    var columnsPositionX = this.calculateColumns(width, this.constants.maxWidthColumn);
    var shelvesPositionY = this.calculateShelves(height, maxHeight);

    var shelvesSpecs = {
    	width: width,
    	height: height,
        depth: depth,
        thick: thick,
        color: objectColor,
        texture: objectTexture,
        position: {
        	x: columnsPositionX,
        	y: shelvesPositionY
        }
    };

    closetCustom.add(
      this.generateShelves(shelvesSpecs)
    ); //anadir cajones + suelo y techo incluido

    closetCustom.add(
      this.generateShelvesWall(shelvesSpecs)
    ); //anadir separadores + paredes laterales incluidas

    if (coverType === "Doors" && width >= this.constants.minWidthDoubleDoors) {
      coverType = "DoubleDoors";
    }

    if (coverType === "Doors") {
      closetCustom.add(
        this.positionateDoors(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          true
        )
      );
      closetCustom.add(
        this.positionateDoors(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          false
        )
      );
    } else if (coverType === "DoubleDoors") {
      closetCustom.add(
        this.positionateDoubleDoors(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          true
        )
      );
      closetCustom.add(
        this.positionateDoors(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          false
        )
      );
    } else if (coverType === "Drawers") {
      closetCustom.add(
        this.positionateDrawers(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY
        )
      );
      closetCustom.add(
        this.positionateDoors(
          depth,
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          false
        )
      );
    } else if (coverType === "None") {
      if (corner === "Both") {
        closetCustom.add(
          this.generateHalfBackWall(
            width,
            height,
            depth,
            thick,
            objectColor,
            objectTexture,
            "Right"
          )
        );
        closetCustom.add(
          this.generateHalfBackWall(
            width,
            height,
            depth,
            thick,
            objectColor,
            objectTexture,
            "Left"
          )
        );
      } else if (corner != "None") {
        closetCustom.add(
          this.generateHalfBackWall(
            width,
            height,
            depth,
            thick,
            objectColor,
            objectTexture,
            corner
          )
        );
      }
    }

    closetCustom.coverType = coverType;
    closetCustom.totalWidth = width; //xa saber ancho total
    closetCustom.totalHeight = height; //xa saber altura total

    return closetCustom;
  },

  generateHalfBackWall(
    width,
    height,
    depth,
    thick,
    objectColor,
    objectTexture,
    corner
  ) {
    var halfBackWall;
    var fixedWidth = 0.15;
    var leftOrRight = 0;
    if (corner == "Left") {
      leftOrRight = -1;
    } else if (corner == "Right") {
      leftOrRight = 1;
    }

    geometry = new THREE.BoxGeometry(fixedWidth, height - thick, thick);

    materialShelf = this.customMaterial(
      objectTexture,
      objectTexture,
      objectTexture,
      objectTexture,
      objectColor,
      objectColor
    ); //material y colores de estanterias

    halfBackWall = new THREE.Mesh(geometry, materialShelf);

    halfBackWall.position.x = (width / 2 - fixedWidth / 2) * leftOrRight;
    halfBackWall.position.z = -depth / 2;

    return halfBackWall;
  },

  generateShelves(specs) {
    var shelfWidth = specs.width + specs.thick;
    var shelves = [];
    var shelfGroup = new THREE.Group();
    shelfGroup.name = "horizontal shelf group";
    geometry = new THREE.BoxGeometry(shelfWidth, specs.thick, specs.depth + specs.thick / 2);

    materialShelf = this.customMaterial(
      specs.texture,
      specs.texture,
      specs.color,
      specs.color,
      specs.texture,
      specs.texture
    ); //material y colores de estanterias

    for (var e = 0; e < specs.position.y.length + 1; e++) {
      //le sumamos uno por el techo
      shelves[e] = new THREE.Mesh(geometry, materialShelf);
      shelves[e].name = "individual horizontal shelf " + e;
      shelves[e].castShadow = true;
      shelves[e].position.y = specs.position.y[e];
      shelfGroup.add(shelves[e]);
    }

    return shelfGroup;
  },

  generateShelvesWall(specs) {
    var shelfWalls = [];
    var shelfWallGroup = new THREE.Group();
    shelfWallGroup.name = "vertical shelf wall group";
    var shelfWallHeight = specs.height - specs.thick;
	    geometry = new THREE.BoxGeometry(specs.thick, shelfWallHeight, specs.depth);

    var materialShelfWall = this.customMaterial(
      specs.color,
      specs.color,
      specs.texture,
      specs.texture,
      specs.texture,
      specs.texture
    ); //material separadores de Cajones

    for (var i = 0; i < specs.position.x.length; i++) {
      for (var e = 0; e < specs.position.y.length - 1; e++) {
        shelfWalls[e] = new THREE.Mesh(geometry, materialShelfWall);
        shelfWalls[e].castShadow = true;
        shelfWalls[e].name = "individual vertical wall " + i + "_" + e;
        shelfWalls[e].position.x = specs.position.x[i];
        shelfWalls[e].position.y =
          specs.position.y[e] + (shelfWallHeight + specs.thick) / 2;
        shelfWallGroup.add(shelfWalls[e]);
      }
    }

    return shelfWallGroup;
  },

  calculateColumns(width, maxWidth) {
    var numColumns = parseInt(width / maxWidth);
    var columnsPositionX = [];

    for (var i = 0; i <= numColumns; i++) {
      columnsPositionX[i] = -width / 2 + i * (width / (numColumns + 1));
    }
    columnsPositionX[columnsPositionX.length] = width / 2; //pared derecha

    return columnsPositionX;
  },

  calculateNumGridAxe(dimension, arrayDimensions, dimensionType) {
    //calcula nums de columnas o filas, considerando si anadir o quitar
    var numTotal = 0;
    var currentDimension = 0; //altura o anchura real del mueble
    var maxDimension;
    var minDimension;
    var difference;
    var limits;

    if (dimensionType === "height") {
      maxDimension = this.variables.maxRowHeight;
      minDimension = this.variables.minRowHeight;
      limits = limitations.rowHeightsLimits;
    } else if (dimensionType === "width") {
      maxDimension = this.variables.maxColWidth;
      minDimension = this.variables.minColWidth;
      limits = []; //no hay limites intermedios
    }

    while (numTotal < arrayDimensions.length && currentDimension < dimension) {
      currentDimension += arrayDimensions[numTotal];
      numTotal++;
    }

    difference =
      Math.round(
        (arrayDimensions[arrayDimensions.length - 1] +
          dimension -
          currentDimension) *
          100
      ) / 100;

    if (currentDimension < dimension) {
      if (difference >= maxDimension) {
        //check si crear una columna/fila
        this.manageNewFinalRowOrColumn(
          arrayDimensions,
          minDimension,
          maxDimension,
          true
        );
      } else {
        //si sobrepasa el mueble ya disenado se ensancha la ultima columna/fila
        this.adjustFinalRowOrColumn(
          difference,
          arrayDimensions,
          maxDimension,
          minDimension,
          limits
        );
      }
    } else if (currentDimension > dimension) {
      if (arrayDimensions.length > numTotal) {
        //check si quitar una columna/fila
        this.manageNewFinalRowOrColumn(
          arrayDimensions,
          minDimension,
          maxDimension,
          false
        );
      } else {
        //si es menor al mueble ya disenado se reduce la ultima columna/fila
        this.adjustFinalRowOrColumn(
          difference,
          arrayDimensions,
          maxDimension,
          minDimension,
          limits
        );
      }
    }

    return numTotal;
  },

  manageNewFinalRowOrColumn(
    arrayDimensions,
    minDimension,
    maxDimension,
    create
  ) {
    //anade una ultima columna o fila con la minima altura/anchura
    if (create) {
      arrayDimensions[arrayDimensions.length - 1] = maxDimension; //aseguramos que la ultima esta al max
      arrayDimensions.push(minDimension);
      rowDepths.push(rowDepths[rowDepths.length - 1]);
    } else {
      arrayDimensions.pop();
      rowDepths.pop();
    }
  },

  adjustFinalRowOrColumn(
    difference,
    arrayDimensions,
    maxDimension,
    minDimension,
    limits
  ) {
    var i = 0;
    var limitedDifference = 0;

    if (limits.length > 0) {
      //si hay limites se aplican
      while (i < limits.length && limitedDifference === 0) {
        if (limits[i] >= difference) {
          limitedDifference = limits[i];
        }
        i++;
      }
      difference = limitedDifference;
    }

    if (difference <= maxDimension && difference >= minDimension) {
      if (difference >= minDimension) {
        arrayDimensions[arrayDimensions.length - 1] = difference;
      }
    }
  },

  calculateLengthGridAxe(numTotal, colDimensions, thick) {
    //calcula la longitud de cualquier eje
    var totalLength = thick; //la pared del principio

    for (let i = 0; i < numTotal; i++) {
      totalLength += colDimensions[i];
    }

    return totalLength;
  },

  calculatePrice(coverTypes, numColumns, numRows) {
    //calcular precio del mueble, provisional
    var finalPrice = 0;

    for (var i = 0; i < numRows; i++) {
      for (var e = 0; e < numColumns; e++) {
        finalPrice += this.constants.prices.columnPrice;
        if (coverTypes[i][e].coverType === "Doors") {
          finalPrice += this.constants.prices.doorPrice;
        } else if (coverTypes[i][e].coverType === "Drawers") {
          finalPrice += this.constants.prices.drawerPrice;
        }
      }
    }
    document.getElementById("final-price").innerHTML = finalPrice + "€";

    return finalPrice;
  },

  calculateShelves(height, maxHeight) {
    var numShelves = parseInt(height / maxHeight) - 1;
    var shelvesPositionY = [];
    for (var i = 0; i <= numShelves; i++) {
      shelvesPositionY[i] = -height / 2 + i * (height / (numShelves + 1));
    }

    shelvesPositionY[shelvesPositionY.length] = height / 2;
    return shelvesPositionY;
  },

  calculateCoordinates(height, rowHeights) {
    var maxHeightTotal = rowHeights.reduce((a, b) => a + b, 0); //sum de todo el array
    var numShelves = parseInt(height / maxHeightTotal);
    var previousHeight = 0;
    var rowsPositionY = [];

    for (var i = 0; i < rowHeights.length; i++) {
      rowsPositionY[i] = previousHeight + (-height + rowHeights[i]) / 2;
      previousHeight += rowHeights[i];
    }

    return rowsPositionY;
  },

  getHigherValue(array) {
    return Math.max.apply(Math, array);
  },

  generateLegs(
    height,
    depth,
    thick,
    legsLength,
    positionLegsX,
    numberLegs,
    colWidths
  ) {
    var legsGroup = new THREE.Group();
    legsGroup.name = "legs group";
    var legsColor = 0x1a0000;
    var legsRadium = 0.01;
    var legs = [];

    var legsGeometry = new THREE.CylinderGeometry(
      legsRadium,
      legsRadium,
      legsLength,
      16 //qtat de poliedres que formen la figura (millor sensacio desfera)
    );
    var legsMaterial = new THREE.MeshLambertMaterial({ color: legsColor });

    for (var e = -1; e < 2; e += 2) {
      //per fer davant i darrere
      for (var i = 0; i <= numberLegs; i++) {
        legs[i] = new THREE.Mesh(legsGeometry, legsMaterial);
        legs[i].castShadow = true;
        legs[i].name = "individual leg " + i + "_" + e;
        if (i === 0) {
          legs[i].position.x = positionLegsX[i] - colWidths[i] / 2;
        } else {
          legs[i].position.x = positionLegsX[i - 1] + colWidths[i - 1] / 2;
        }
        legs[i].position.z = (e * (depth - thick / 2)) / 2;
        legs[i].position.y = -(height / 2) - thick;
        legsGroup.add(legs[i]);
      }
    }

    return legsGroup;
  },

  positionateDoors(
    depth,
    thick,
    objectColor,
    objectTexture,
    columnsPositionX,
    shelvesPositionY,
    forAnimation
  ) {
    var doorWidth = columnsPositionX[1] - columnsPositionX[0] - thick;
    var doorHeight = shelvesPositionY[1] - shelvesPositionY[0] - thick / 2;
    var doors = [];
    var doorsGroup = new THREE.Group();
    if (forAnimation) {
      doorsGroup.name = "front door group";
    } else {
      doorsGroup.name = "back door group";
    }
    var geometry = new THREE.BoxGeometry(doorWidth, doorHeight, thick);

    for (var i = 0; i < shelvesPositionY.length - 1; i++) {
      for (var e = 1; e < columnsPositionX.length; e++) {
        doors[e] = this.generateDoors(
          thick,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          geometry,
          forAnimation,
          false
        );
        doors[e].position.x = columnsPositionX[e];
        doors[e].position.z = depth / 2;
        if (!forAnimation) {
          doors[e].position.z = -depth / 2;
        }
        doors[e].position.y = shelvesPositionY[i] + doorHeight / 2;
        doorsGroup.add(doors[e]);
      }
    }

    return doorsGroup;
  },
  /*
    Developed and produced by Marc Pascual
    Ordered by Sergi Jarque and Bill Ben, from edatasoft.com
  */
  generateDoors(
    thick,
    objectColor,
    objectTexture,
    columnsPositionX,
    shelvesPositionY,
    geometry,
    forAnimation,
    doubleDoor
  ) {
    var doorReal = [];
    var doorMirror = [];
    if (!doubleDoor) {
      var doorWidth = columnsPositionX[1] - columnsPositionX[0];
    } else {
      var doorWidth = (columnsPositionX[1] - columnsPositionX[0]) / 2;
    }
    var doorsIndividuals = [];
    doorsIndividuals = new THREE.Group();
    doorsIndividuals.name = "door individual";

    var materialDoor = this.customMaterial(
      objectTexture,
      objectTexture,
      objectTexture,
      objectTexture,
      objectColor,
      objectColor
    ); //material puertas

    doorReal = new THREE.Mesh(geometry, materialDoor);
    doorReal.name = "door real";
    doorReal.castShadow = true;

    if (forAnimation) {
      doorReal.position.x = -doorWidth / 2;
      doorMirror = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0.5,
          visible: false
        })
      );
      doorMirror.position.x = doorWidth / 2;
      doorMirror.name = "door mirror";
      doorsIndividuals.add(doorReal);
      doorsIndividuals.add(doorMirror);
    } else {
      doorReal.position.x = -doorWidth / 2;
      doorsIndividuals.add(doorReal);
    }

    return doorsIndividuals;
  },

  positionateDrawers(
    depth,
    thick,
    objectColor,
    objectTexture,
    columnsPositionX,
    shelvesPositionY
  ) {
    var drawerWidth = columnsPositionX[1] - columnsPositionX[0] - thick;
    var drawerHeight = shelvesPositionY[1] - shelvesPositionY[0] - thick;
    var drawers = [];
    var drawersGroup = new THREE.Group();
    drawersGroup.name = "drawers group";

    for (var i = 0; i < shelvesPositionY.length - 1; i++) {
      for (var e = 1; e < columnsPositionX.length; e++) {
        drawers[e] = this.generateDrawers(
          thick,
          depth,
          objectColor,
          objectTexture,
          columnsPositionX,
          shelvesPositionY,
          drawerWidth,
          drawerHeight,
          this.constants.drawer.marginDrawerBetween,
          this.constants.drawer.marginDrawerHeight
        );
        drawers[e].name = "drawer n" + i + "_" + e;
        drawers[e].position.x =
          columnsPositionX[e] - drawerWidth / 2 - thick / 2;
        drawers[e].position.z = depth / 2;

        drawers[e].position.y = shelvesPositionY[i] + drawerHeight / 2;
        drawersGroup.add(drawers[e]);
      }
    }

    return drawersGroup;
  },

  generateDrawers(
    thick,
    depth,
    objectColor,
    objectTexture,
    columnsPositionX,
    shelvesPositionY,
    drawerWidth,
    drawerHeight,
    marginDrawerBetween,
    marginDrawerHeight
  ) {
    var drawer = new THREE.Group();
    var drawerWidth = columnsPositionX[1] - columnsPositionX[0] - thick / 2;
    var materialFrontBack = this.customMaterial(
      objectTexture,
      objectTexture,
      objectTexture,
      objectTexture,
      objectColor,
      objectColor
    ); //material frontal y anterior

    //pared frontal
    var geometryFront = new THREE.BoxGeometry(
      drawerWidth - thick / 2,
      drawerHeight,
      thick
    );
    drawerFront = new THREE.Mesh(geometryFront, materialFrontBack);
    drawerFront.castShadow = true;
    drawerFront.position.y = thick / 2;
    drawer.add(drawerFront);

    //paredes laterales
    var materialSide = this.customMaterial(
      objectColor,
      objectColor,
      objectTexture,
      objectTexture,
      objectTexture,
      objectTexture
    ); //material lateral

    var geometrySide = new THREE.BoxGeometry(
      thick,
      drawerHeight - thick - marginDrawerHeight,
      depth - thick
    );

    var drawerRight = new THREE.Mesh(geometrySide, materialSide);
    drawerRight.castShadow = true;
    drawerRight.position.x = drawerWidth / 2 - marginDrawerBetween;
    drawerRight.position.z = -depth / 2;
    drawerRight.position.y = thick / 2 - marginDrawerHeight / 2;
    drawer.add(drawerRight);

    var drawerLeft = drawerRight.clone();
    drawerLeft.castShadow = true;
    drawerLeft.position.x *= -1;
    drawer.add(drawerLeft);

    //pared inferior
    var materialBottom = this.customMaterial(
      objectTexture,
      objectTexture,
      objectColor,
      objectColor,
      objectTexture,
      objectTexture
    ); //material frontal y anterior

    var geometryBottom = new THREE.BoxGeometry(
      drawerWidth - thick - marginDrawerBetween,
      thick,
      depth - thick
    );
    var drawerBottom = new THREE.Mesh(geometryBottom, materialBottom);
    drawerBottom.castShadow = true;
    drawerBottom.position.y = -drawerHeight / 2 + thick;
    drawerBottom.position.z = -depth / 2;
    drawer.add(drawerBottom);

    //pared trasera
    var geometryBack = new THREE.BoxGeometry(
      drawerWidth - marginDrawerBetween,
      drawerHeight - thick - marginDrawerHeight,
      thick
    );
    var drawerBack = new THREE.Mesh(geometryBack, materialFrontBack);
    drawerBack.castShadow = false;
    drawerBack.position.z = -depth;
    drawerBack.position.y = thick / 2 - marginDrawerHeight / 2;
    drawer.add(drawerBack);

    return drawer;
  },

  positionateDoubleDoors(
    depth,
    thick,
    objectColor,
    objectTexture,
    columnsPositionX,
    shelvesPositionY
  ) {
    var doorWidth = (columnsPositionX[1] - columnsPositionX[0] - thick / 2) / 2;
    var doorHeight = shelvesPositionY[1] - shelvesPositionY[0] - thick / 2;
    var doubleDoors = [];
    var doubleDoorsGroup = new THREE.Group();
    doubleDoorsGroup.name = "double door group";
    var geometry = new THREE.BoxGeometry(doorWidth, doorHeight, thick);

    for (var z = 1; z > -2; z = z - 2) {
      for (var i = 0; i < shelvesPositionY.length - 1; i++) {
        for (var e = 1; e < columnsPositionX.length; e++) {
          doubleDoors[e] = this.generateDoors(
            thick,
            objectColor,
            objectTexture,
            columnsPositionX,
            shelvesPositionY,
            geometry,
            true,
            true
          );
          if (z == 1) {
            doubleDoors[e].position.x = columnsPositionX[e];
          } else {
            doubleDoors[e].position.x =
              columnsPositionX[e] - (columnsPositionX[1] - columnsPositionX[0]);
          }
          doubleDoors[e].scale.x = z;
          doubleDoors[e].position.z = depth / 2;
          doubleDoors[e].position.y = shelvesPositionY[i] + doorHeight / 2;
          doubleDoorsGroup.add(doubleDoors[e]);
        }
      }
    }

    return doubleDoorsGroup;
  },

  createSilouetteCubes(
    depth,
    thick,
    silouetteWidth,
    silouetteHeight,
    coverType
  ) {
    var silouetteDepth = depth + thick + 0.01;

    var geometry = new THREE.BoxGeometry(
      silouetteWidth,
      silouetteHeight - thick / 2,
      silouetteDepth - 0.1
    );
    var material = [];

    material = new THREE.MeshLambertMaterial({
      color: this.constants.silouette.silouetteColor,
      transparent: true,
      opacity: this.constants.silouette.silouetteOpacity,
      visible: false
    });
    silouette = new THREE.Mesh(geometry, material);
    silouette.name = "individual silouette";
    silouette.coverType = coverType;
    silouette.visible = true;
    silouette.clicked = false;
    silouette.closetIndex = [];
    silouette.height = silouetteHeight;

    return silouette;
  },

  customMaterial(left, right, top, bot, front, back) {
    var resultArrayCustomMaterial = [
      new THREE.MeshLambertMaterial(left), //LEFT
      new THREE.MeshLambertMaterial(right), //RIGHT
      new THREE.MeshLambertMaterial(top), //TOP
      new THREE.MeshLambertMaterial(bot), //BOT
      new THREE.MeshLambertMaterial(front), //FRONT
      new THREE.MeshLambertMaterial(back) //BACK
    ];
    return resultArrayCustomMaterial;
  },

  setPosition() {
    this.settings.mueble.position.set(
      this.variables.position_x,
      this.variables.position_y,
      this.variables.position_z
    );
  }
};
