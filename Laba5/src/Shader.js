class Shader {
    constructor(vertexShaderSourceCode, fragmentShaderSourceCode) {
        this._vertexShaderSourceCode = vertexShaderSourceCode
        this._fragmentShaderSourceCode = fragmentShaderSourceCode

        this._uniforms = {}
    }

    build() {
        const compiledVertexShader = this._compileShader(gl.VERTEX_SHADER, this._vertexShaderSourceCode)
        const compiledFragmentShader = this._compileShader(gl.FRAGMENT_SHADER, this._fragmentShaderSourceCode)

        if (!compiledVertexShader || !compiledFragmentShader) {
            return undefined
        }

        this._shaderProgram = this._linkShaders(compiledVertexShader, compiledFragmentShader)

        if (this._shaderProgram) {
            this._init()
            return true
        }

        return false
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


        switch(type) {
            case UNIFORM_TYPES.FLOAT1: {
                const location = gl.getUniformLocation(this._shaderProgram, name)
                if (location == -1) {
                    console.log(type, " uniform not found")
                    return
                }
                this._uniforms.push({
                    type: type,
                })
            }
            case UNIFORM_TYPES.FLOAT3: {
                const location = gl.getUniformLocation(this._shaderProgram, name)
                if (location == -1) {
                    console.log(type, " uniform not found")
                    return
                }
                this._uniforms.push({
                    type: type,
                })
            }
        }
    }

    bind() {
        if (!this._shaderProgram) {
            console.log("The shader program is undefined")
            return
        }

        gl.useProgram(this._shaderProgram)

        this._uniforms.forEach(uniform => {
            switch(uniform.type) {
                case UNIFORM_TYPES.FLOAT_1F: {
                    gl.uniform1f(uniform.location, uniform.buffer[0])
                    return
                }
                case UNIFORM_TYPES.FLOAT_2F: {
                    gl.uniform2f(uniform.location, uniform.buffer[0], unifrom.buffer[1])
                }
                case UNIFORM_TYPES.FLOAT_3F: {
                    gl.uniform3f(uniform.location, uniform.buffer[0], uniform.buffer[1], uniform.buffer[3])
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