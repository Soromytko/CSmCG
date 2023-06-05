class Renderer {
    constructor(x, y, width, height) {
        if (this._instance) {
            return
        }

        gl.viewport(x, y, width, height)

        this._instance = this
    }

    set cleaningColor(color) {
        gl.clearColor(color[0], color[1], color[2], color[3])
    }

    submit(shader, vertexArray) {
        if (!shader) {
            console.warn("The shader is undefined")
        }
        if (!vertexArray) {
            consoel.warn("The vertexArray is  undefined")
        }

        this._shader = shader
        this._vertexArray = vertexArray
        
        this._shader.bind()
        this._vertexArray.bind()
    }

    clear(mask) {
        // gl.clear(gl.COLOR_BUFFER_BIT)
        gl.clear(mask)
    }

    render() {
        gl.drawElements(gl.TRIANGLES, this._indexBuffer.count, gl.UNSIGNED_SHORT, 0)
        // gl.drawElements(gl.TRIANGLES, this._vertexArray._indexBuffer.count, gl.UNSIGNED_SHORT, 0)
        
        // this._shader.unbind()        
        // this._vertexArray.unbind()
    }
}