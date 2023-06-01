class VertexArray {
    constructor() {
        this._vertexBuffers = []
        this._indexBuffer
    }

    addVertexBuffer(vertexBuffer) {
        this._vertexBuffers.push(vertexBuffer)
    }

    setIndexBuffer(indexBuffer) {
        this._indexBuffer = indexBuffer
    }

    setLayout(layout) {
        
    }

    bind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.bind()
            gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
            gl.enableVertexAttribArray(0)
        })
        this._indexBuffer.bind()
    }

    unbind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.unbind()
            gl.disableVertexAttribArray(0)
        })
        this._indexBuffer.unbind()
    }

    // Call useProgram() before calling
    draw() {
        this.bind()
        gl.drawElements(gl.TRIANGLES, this._indexBuffer.count, gl.UNSIGNED_SHORT, 0)
        this.unbind()
    }
}

class Layout {
    constructor(location, ) {

    }
}