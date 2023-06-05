class VertexArray {
    constructor() {
        this._vertexBuffers = []
        this._layoutBuffers = []

        this._buffers = []
    }

    addVertexBuffer(vertexBuffer) {
        this._vertexBuffers.push(vertexBuffer)
    }

    setIndexBuffer(indexBuffer) {
        this._indexBuffer = indexBuffer
    }

    bind() {
        // this._buffers.forEach(buffers => {
        //     buffers.vertexBuffer.bind()
        //     buffers.layoutBuffer.bind()
        // })

        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.bind()
        })
        this._indexBuffer.bind()
    }

    // bind() {
    //     let index = 0
    //     this._vertexBuffers.forEach(vertexBuffer => {
    //         vertexBuffer.bind()
    //         // const layout = this._layoutBuffer.attributes[index]
    //         const layout = vertexBuffer.layout
    //         // gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0)
    //         gl.vertexAttribPointer(
    //             layout.location,
    //             layout.size,
    //             layout.normalized,
    //             layout.stride,
    //             layout.offset)
    //         gl.enableVertexAttribArray(0)
    //         index++
    //     })
    //     this._indexBuffer.bind()

    //     this._layout.forEach(layout => {
    //         gl.vertexAttribPointer(
    //             layout.location,
    //             layout.size,
    //             layout.normalized,
    //             layout.stride,
    //             layout.offset)
    //     })
    // }

    unbind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.unbind()
            gl.disableVertexAttribArray(0)
        })
        this._indexBuffer.unbind()
    }
}

class VertexArrayElement {
    constructor(vertexBuffer) {
        this._vertexBuffer = vertexBuffer
        this._locations = locations
    }

    get vertexBuffer() {
        return this._vertexBuffer
    }

    get locations() {
        return this._locations
    }

}