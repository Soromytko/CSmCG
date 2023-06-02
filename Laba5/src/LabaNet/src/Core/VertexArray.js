class VertexArray {
    constructor() {
        this._vertexBuffers = []
        this._indexBuffer
        this._layoutBuffer
    }

    addVertexBuffer(vertexBuffer) {
        this._vertexBuffers.push(vertexBuffer)
    }

    setIndexBuffer(indexBuffer) {
        this._indexBuffer = indexBuffer
    }

    setLayoutBuffer(layoutBuffer) {
        this._layoutBuffer = layoutBuffer
    }

    bind() {
        let index = 0
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.bind()
            // const layout = this._layoutBuffer.attributes[index]
            // gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
            gl.vertexAttribPointer(
                layout.location,
                layout.size,
                layout.normalized,
                layout.stride,
                layout.offset)
            gl.enableVertexAttribArray(0)
            index++
        })
        this._indexBuffer.bind()

        this._layout.forEach(layout => {
            gl.vertexAttribPointer(
                layout.location,
                layout.size,
                layout.normalized,
                layout.stride,
                layout.offset)
        })
    }

    unbind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.unbind()
            gl.disableVertexAttribArray(0)
        })
        this._indexBuffer.unbind()
    }
}
