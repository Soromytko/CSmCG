var gl = getGl()

function getGl() {
    const canvas = document.getElementById('canvas')
    if (!canvas) {
        alert("Canvas not found")
        throw new Error()
    }

    const gl = canvas.getContext('webgl')
    if (!gl) {
        alert("WebGL initialization error")
        throw new Error()
    }

    return gl
}

var POSITION_ATTRIBUTE_LOCATION = 0
var NORMAL_ATTRIBUTE_LOCATION = 1
var COLOR_ATTRIBUTE_LOCATION = 2

var COLOR_UNIFORM

const UNIFORM_TYPES = {
    FLOAT_1F: "FLOAT_1F",
    FLOAT_2F: "FLOAT_2F",
    FLOAT_3F: "FLOAT_3F",
}

class VertexBuffer {
    constructor(attributeLocation, data) {
        this._attributeLocation = attributeLocation
        this._data = data
        this._bufferId = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    }

    get attributeLocation() {
        return this._attributeLocation
    }

    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
    }

    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, 0)
    }
}

class IndexBuffer {
    constructor(data) {
        this._data = data
        this._bufferId = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._bufferId)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW)
    }

    bind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._bufferId)
    }

    unbind() {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, 0)
    }

    get count() {
        return this._data.length
    }
}

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

    bind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.bind()
            gl.vertexAttribPointer(vertexBuffer.attributeLocation, 3, gl.FLOAT, gl.FALSE, 0, 0)
            gl.enableVertexAttribArray(vertexBuffer.attributeLocation)
        })
        this._indexBuffer.bind()
    }

    unbind() {
        this._vertexBuffers.forEach(vertexBuffer => {
            vertexBuffer.unbind()
            gl.disableVertexAttribArray(vertexBuffer.attributeLocation)
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

class UniformBuffer {
    constructor(data = []) {
        this._data = data 
    }

    get data() {
        return this._data
    }

    set data(valueArray) {
        this._data = valueArray
    }
}