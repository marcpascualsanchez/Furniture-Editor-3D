var GRID = {
    init: function (variables) {
        this.settings = {
            grid: null
        };

        this.variables = {
            create: true,
            size: 20,
            divisions: 20,
            colorCenterLine: 0xffffff,
            colorGrid: 0x555555
        };

        $.extend(this.variables, variables);

        if(this.variables.create) this.set();
    },

    set: function () {
        this.settings.grid = new THREE.GridHelper(
            this.variables.size,
            this.variables.divisions,
            this.variables.colorCenterLine,
            this.variables.colorGrid
        );
    },

    get: function () {
        return this.settings.grid;
    }
};