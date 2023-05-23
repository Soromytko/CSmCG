class Mesh {
    constructor() {
      
    }

    _createBuffers() {
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


