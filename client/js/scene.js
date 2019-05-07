var SCENE = {
    init: function (variables) {
        this.settings = {
            scene: null
        };

        this.variables = {
            create: true,
            background: 0xcccccc,
            fog: false,
            fog_color: 0xcccccc,
            fog_near: 10,
            fog_far: 20
        };

        $.extend(this.variables, variables);

        if (this.variables.create) this.set();
    },

    set: function () {
        // Crear la escena
        this.settings.scene = new THREE.Scene();

        // Definir el color del fondo de la escena
        this.settings.scene.background = new THREE.Color(this.variables.background);

        // Crear niebla de fondo
        if (this.variables.fog) {
            this.settings.scene.fog = new THREE.Fog(
                this.variables.fog_color,
                this.variables.fog_near,
                this.variables.fog_far
            );
        }
    },

    get: function () {
        return this.settings.scene;
    }
};