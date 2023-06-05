class VertexBuffer {
    constructor(data) {
        // this._attributeLocation = attributeLocation
        this._data = data
        this._bufferId = gl.createBuffer()
        this._layout = []
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW)
    }

    get attributeLocation() {
        return this._attributeLocation
    }

    addLayout(size, type, normalized, stride, offset) {
        _layout.push({
            size: size,
            type: type,
            normalized: normalized,
            stride: stride,
            offset: offset,
        })
        
        // TODO

        // const stride = this._rules.length > 0 ? this._rules[this._rules.length - 1].stride : 0

        // this._rules.push({
        //     type: type,
        //     stride: stride
        // })
    }

    setLayoutBuffer(layoutBuffer) {
        this._layoutBuffer = layoutBuffer
    }

    bind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufferId)
    }

    unbind() {
        gl.bindBuffer(gl.ARRAY_BUFFER, undefined)
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
    constructor(location, attributeType) {
        this._location = location
        this._type = attributeType

        this._size = 0
        this._stride = 0
        this._offset = 0
    }
}

class LayoutBuffer {
    constructor(attributes) {
        this._attributes = attributes


        let stride = 0
        let offset = 0
        attributes.forEach(attribute => {
            
        })
    }

    get attributes() {
        return this._attributes
    }

    addAttribute(location, size, type, normalized, stride, offset) {
        this._attributes.push({
            location: location,
            size: size,
            type: type,
            normalized: normalized,
            stride: stride,
            offset: offset,
        })
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
