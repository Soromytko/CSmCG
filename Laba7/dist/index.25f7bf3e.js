class Engine {
    constructor(){
        if (Engine._instance) return Engine._instance;
        this.PROJECT_MATRIX = glMatrix.mat4.create();
        glMatrix.mat4.perspective(this.PROJECT_MATRIX, 60 * Math.PI / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        this.CAMERA_MATRIX = glMatrix.mat4.create();
        Engine._instance = this;
    }
    addEventListener(event, callback) {
        document.addEventListener(event, callback);
    }
}

//# sourceMappingURL=index.25f7bf3e.js.map
