var LIGHTS = {
    init: function (variables) {
        this.settings = {
            lights_shadow: null,
            lights_left: null,
            lights_right: null,
            lights_back: null
        };

        this.variables = {
            create: true,
            light_color: 0xffffff,
            light_intensity: 1,
            light_x: -6,
            light_y: 11,
            light_z: 12
        };

        $.extend(this.variables, variables);

        if (this.variables.create) this.set();
    },

    set: function () {
        // LIGHT shadow
        this.settings.lights_shadow = new THREE.SpotLight(this.variables.light_color, 0);
        this.settings.lights_shadow.position.set(this.variables.light_x, this.variables.light_y, this.variables.light_z);
        this.settings.lights_shadow.castShadow = true;
        this.settings.lights_shadow.shadow.mapSize.width = 1024;
        this.settings.lights_shadow.shadow.mapSize.height = 1024;
        this.settings.lights_shadow.angle = Math.PI / 6;
        //this.settings.lights.penumbra = 0;

        // LIGHT left
        this.settings.lights_left = new THREE.SpotLight(this.variables.light_color, this.variables.light_intensity);
        this.settings.lights_left.position.set(-15, 10, 10);
        this.settings.lights_left.decay = 1;
        this.settings.lights_left.distance = 250;

        // LIGHT right
        this.settings.lights_right = new THREE.SpotLight(this.variables.light_color, this.variables.light_intensity);
        this.settings.lights_right.position.set(15, 10, 10);
        this.settings.lights_right.decay = 1;
        this.settings.lights_right.distance = 250;

        // LIGHT back
        this.settings.lights_back = new THREE.SpotLight(this.variables.light_color, this.variables.light_intensity);
        this.settings.lights_back.position.set(0, -5, -5);
        this.settings.lights_back.decay = 1;
        this.settings.lights_back.distance = 250;
    },

    get: function (type) {
        switch (type) {
            case "shadow":
                return this.settings.lights_shadow;
                break;
            case "left":
                return this.settings.lights_left;
                break;
            case "right":
                return this.settings.lights_right;
                break;
            case "back":
                return this.settings.lights_back;
                break;
        }
    },

    change: function (name, val, callBack) {
        switch (name) {
            case "x":
                this.variables.light_x = parseFloat(val);
                break;
            case "y":
                this.variables.light_y = parseFloat(val);
                break;
            case "z":
                this.variables.light_z = parseFloat(val);
                break;
        }

        this.settings.lights.position.set(this.variables.light_x, this.variables.light_y, this.variables.light_z);

        callBack();
    }
};