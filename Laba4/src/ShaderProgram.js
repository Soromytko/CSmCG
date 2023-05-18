class Shader {
    constructor() {

    }

    compileShader(gl, type, source) { 
        const shader = gl.createShader(type); 
        gl.shaderSource(shader, source); 
        gl.compileShader(shader); 
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { 
            alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)); 
            gl.deleteShader(shader);
            return null; 
        } 
        return shader;
    }
    
    createShaderProgram(gl, vertexShader, fragmentShader) {
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader); 
        gl.attachShader(shaderProgram, fragmentShader); 
        gl.linkProgram(shaderProgram); 
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) { 
            alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram)); 
            return null; 
        } 
        return shaderProgram
    }

    makeShaderProgram(gl, vertexShaderSourceCode, fragmentShaderSourceCode) {
        const vertexShader = this.compileShader(gl, gl.VERTEX_SHADER, vertexShaderSourceCode)
        const fragmentShader = this.compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSourceCode)

        this._shaderProgram = createShaderProgram(gl, vertShader, fragShader)

        return this._shaderProgram
    }

    get shaderProgram() {
        return this._shaderProgram
    }
}