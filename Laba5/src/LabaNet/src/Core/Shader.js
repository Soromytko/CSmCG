class Shader {
    constructor(vertexShaderSourceCode, fragmentShaderSourceCode) {
        this._vertexShaderSourceCode = vertexShaderSourceCode
        this._fragmentShaderSourceCode = fragmentShaderSourceCode

        this._uniforms = []
    }

    get isBuilt() {
        return this._shaderProgram ? true : false
    }

    build() {
        const compiledVertexShader = this._compileShader(gl.VERTEX_SHADER, this._vertexShaderSourceCode)
        const compiledFragmentShader = this._compileShader(gl.FRAGMENT_SHADER, this._fragmentShaderSourceCode)

        if (!compiledVertexShader || !compiledFragmentShader) {
            return false
        }

        this._shaderProgram = this._linkShaders(compiledVertexShader, compiledFragmentShader)

        if (this._shaderProgram) {
            return true
        }

        return false
    }

    addAttributeLocation(name) {
        return gl.getAttribLocation(this._shaderProgram, name)
    }

    bindVertexBuffer(name, buffer) {
        
    }

    addUniform(type, name, buffer) {
        const location = gl.getUniformLocation(this._shaderProgram, name)
        if (location == -1) {
            console.log(name, " uniform not found")
            return
        }

        this._uniforms.push({
            location: location,
            type: type,
            buffer: buffer
        })
    }

    bind() {
        if (!this._shaderProgram) {
            console.error("The shader program is undefined")
            return
        }

        gl.useProgram(this._shaderProgram)

        this._uniforms.forEach(uniform => {
            switch(uniform.type) {
                case UNIFORM_TYPES.FLOAT_1F: {
                    gl.uniform1f(uniform.location, uniform.buffer.data[0])
                    return
                }
                case UNIFORM_TYPES.FLOAT_2F: {
                    gl.uniform2f(uniform.location, uniform.buffer.data[0], unifrom.buffer.data[1])
                    return
                }
                case UNIFORM_TYPES.FLOAT_3F: {
                    gl.uniform3f(uniform.location, uniform.buffer.data[0], uniform.buffer.data[1], uniform.buffer.data[2])
                    return 
                }
                case UNIFORM_TYPES.MAT_4F: {
                    gl.uniformMatrix4fv(uniform.location, false, uniform.buffer.data)
                    return
                }
            }
        })
    }

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