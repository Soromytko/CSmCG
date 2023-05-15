// Singleton class
class CubeMesh {
    constructor() {
        if (CubeMesh._instance) {
            return CubeMesh._instance
        }

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
        ]

        this._normals = [
            // Front face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
    
            // Back face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
    
            // Top face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
    
            // Bottom face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
    
            // Right face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            
            // Left face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
        ]
    
        this._indices = [
            0, 1, 2, 0, 2, 3, // front
            4, 5, 6, 4, 6, 7, // back
            8, 9, 10, 8, 10, 11, // top
            12, 13, 14, 12, 14, 15, // bottom
            16, 17, 18, 16, 18, 19, // right
            20, 21, 22, 20, 22, 23, // left
        ]
    
        CubeMesh._instance = this
    }

    createBuffers(gl) {
        this._vertexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._vertices), gl.STATIC_DRAW)

        this._normalBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBufferObject)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this._normals), gl.STATIC_DRAW)

        this._indexBufferObject = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBufferObject)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW)
    }

    get vertices() {
        return this._vertices
    }
    
    get indices() {
        return this._indices
    }

    get normals() {
        return this._normals
    }

    setVertexAttributePointers(vertexPositionAttribLoc, vertexNormalAttribLoc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        gl.vertexAttribPointer(vertexPositionAttribLoc, 3, gl.FLOAT, gl.FALSE, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBufferObject)
        gl.vertexAttribPointer(vertexNormalAttribLoc, 3, gl.FLOAT, gl.FALSE, 0, 0)
    }
}


