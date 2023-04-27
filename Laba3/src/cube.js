class Cube {
    constructor(position, size = 1, color) {
        this._vertices = [
            // Front face
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            // Back face
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            // Top face
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Right face
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            
            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
        ];

        this._indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23, // left
        ];

        this.position = position
        this.rotation = 0
        this.size = size
        this.color = color
    }

    attachShaderProgram(shaderProgram) {
        this._shaderProgram = shaderProgram
    }

    createBuffers(gl) {
        // vertex buffer
        this._vertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW)
        const positionAttribLocation = gl.getAttribLocation(this._shaderProgram, 'vertexPosition')
        gl.vertexAttribPointer(positionAttribLocation, 3, gl.FLOAT, gl.FALSE, 0, 0)
        gl.enableVertexAttribArray(positionAttribLocation)
        this._positionAttribute = positionAttribLocation

        //triangle buffer
        this._indexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferObject)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW)
    }

    render(gl, baseMatrix) {
        gl.useProgram(this._shaderProgram)
        gl.enableVertexAttribArray(this._positionAttribute)

        // ProjectMatrix
        const projectionMatrix = glMatrix.mat4.create()
        glMatrix.mat4.perspective(projectionMatrix, (60 * Math.PI) / 180, gl.canvas.clientWidth / gl.canvas.clientHeight, 0.1, 100.0);
        const uProjectMat = gl.getUniformLocation(this._shaderProgram, 'u_ProjectMat')
        gl.uniformMatrix4fv(uProjectMat, false, projectionMatrix)
         
        //Local Matrix
        const localMat = glMatrix.mat4.create()
        glMatrix.mat4.translate(localMat, baseMatrix, [this.position.x, this.position.y, this.position.z, 0])
        glMatrix.mat4.rotate(localMat, localMat, this.rotation, [0, 1, 0])
        const uLocal = gl.getUniformLocation(this._shaderProgram, 'u_mLocal')
        gl.uniformMatrix4fv(uLocal, false, localMat)

        // Size
        const uSize = gl.getUniformLocation(this._shaderProgram, "u_Size")
        gl.uniform1f (uSize, this.size)

        //Color
        const uColor = gl.getUniformLocation(this._shaderProgram, "u_Color")
        gl.uniform4f(uColor, this.color.r, this.color.g, this.color.b, 1)

        // Draw
        gl.drawElements(gl.TRIANGLES, this._indices.length, gl.UNSIGNED_SHORT, 0);
    }
}