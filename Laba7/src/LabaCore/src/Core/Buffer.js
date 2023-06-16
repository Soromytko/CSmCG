class VertexBuffer {
    constructor(data) {
        this._layoutBuffer = new LayoutBuffer()
        this._data = data
        this._bufferId = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    }

    get attributeLocation() {
        return this._attributeLocation
    }

    setLayoutBuffer(layoutBuffer) {
        this._layoutBuffer = layoutBuffer
    }

    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
        this._layoutBuffer.bind()
    }

    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, undefined)
        this._layoutBuffer.unbind()
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
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, undefined)
    }

    get count() {
        return this._data.length
    }
}

class Attribute {
    constructor(location, size, type, normalized, stride, offset) {
        this._location = location
        this._size = size
        this._type = type
        this._normalized = normalized
        this._stride = stride
        this._offset = offset
    }

    bind() {
        gl.vertexAttribPointer(
            this._location,
            this._size,
            this._type,
            this._normalized,
            this._stride,
            this._offset,
        )
        gl.enableVertexAttribArray(this._location)
    }

    unbind() {
        gl.disableVertexAttribArray(this._location)
    }
}

class LayoutBuffer {
    constructor(attributes = []) {
        this._attributes = attributes

        let stride = 0
        let offset = 0
        attributes.forEach(attribute => {
            
        })
    }

    bind() {
        this._attributes.forEach(attribute => attribute.bind())
    }

    unbind() {
        this._attributes.forEach(attribute => attribute.unbind())
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

    setLayout(location, type) {
        this._location = location
        this._type = type
    }

    bind() {
        switch(this._type) {
            case UNIFORM_TYPES.FLOAT_1F: {
                gl.uniform1f(this._location, this._data[0])
                return
            }
            case UNIFORM_TYPES.FLOAT_2F: {
                gl.uniform2f(this._location, this._data[0], this._data[1])
                return
            }
            case UNIFORM_TYPES.FLOAT_3F: {
                gl.uniform3f(this._location, this._data[0], this._data[1], this._data[2])
                return 
            }
            case UNIFORM_TYPES.MAT_4F: {
                gl.uniformMatrix4fv(this._location, false, this._data)
                return
            }
        }
    }
}
