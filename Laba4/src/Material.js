class Material {
    set vertexShaderSourceCode(sourceCode) {
        this._vertexShaderSourceCode = sourceCode
    }

    set fragmentShaderSourceCode(sourceCode) {
        this._fragmentShaderSourceCode = sourceCode
    }

    get shaderProgram() {
        return this._shaderProgram
    }

    build() {
        const vertexCompiledShader = this._compileShader(gl.VERTEX_SHADER, this._vertexShaderSourceCode)
        const fragmentCompiledShader = this._compileShader(gl.FRAGMENT_SHADER, this._fragmentShaderSourceCode)

        if (!vertexCompiledShader || !fragmentCompiledShader) {
            return undefined
        }

        this._shaderProgram = this._linkShaders(vertexCompiledShader, fragmentCompiledShader)

        if (this._shaderProgram) {
            this._init()
            return true
        }

        return false
    }

    use() {
        if (!this._shaderProgram) {
            console.log("The shader program is undefined")
            return
        }

        gl.useProgram(this._shaderProgram)
    }

    // setUniform(uniformType, value) {
    //     switch (uniformType) {
    //         case LIGHT_UNIFORM: {
    //             gl.uniform3f(u_Color)
    //             break;
    //         }
    //     }
    // }

    _compileShader(type, source) { 
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
    
    _linkShaders(vertexShader, fragmentShader) {
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

}
