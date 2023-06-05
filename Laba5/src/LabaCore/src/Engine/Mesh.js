class Mesh {
    constructor() {
        this._vertexArray = []
        this._normals = []
        this._indices = []
    }

    get vertices() {
        return this._vertices
    }
    
    get normals() {
        return this._normals
    }

    get indices() {
        return this._indices
    }

    get vertexArray() {
        return this._vertexArray
    }

    setVertexAttributePointers(vertexPositionAttribLoc, vertexNormalAttribLoc) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBufferObject)
        gl.vertexAttribPointer(vertexPositionAttribLoc, 3, gl.FLOAT, gl.FALSE, 0, 0)

        gl.bindBuffer(gl.ARRAY_BUFFER, this._normalBufferObject)
        gl.vertexAttribPointer(vertexNormalAttribLoc, 3, gl.FLOAT, gl.FALSE, 0, 0)
    }

    _createBuffers() {
        const vertexPositionBuffer = new VertexBuffer(this._vertices)
        vertexPositionBuffer.setLayoutBuffer(new LayoutBuffer([
            new Attribute(0, 3, gl.FLOAT, gl.GALSE, 0, 0)
        ]))

        const vertexNormalBuffer = new VertexArray(this._normals)
        vertexNormalBuffer.setLayoutBuffer(new LayoutBuffer([
            new Attribute(0, 3, gl.FLOAT, gl.GALSE, 0, 0)
        ]))

        const indexBuffer = new IndexBuffer(this._indices)

        this._vertexArray = new VertexArray()
        this._vertexArra.addVertexBuffer(vertexPositionBuffer)
        this._vertexArray.addVertexBuffer(vertexNormalBuffer)
        this._vertexArray.setIndexBuffer(new IndexBuffer(this._indices))


        return

        this._vertexArray = new VertexArray()
        this._vertexArray.addVertexBuffer(new VertexBuffer(this._vertices))
        // this._vertexArray.addVertexBuffer(new VertexBuffer(this._normals))
        this._vertexArray.setIndexBuffer(new IndexBuffer(this._indices))


        return

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
}