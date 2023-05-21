class Object {
    constructor(position, size = 1, color) {
        this._position = position
        this._rotationY = 0
        this._size = size
        this._color = color
    }

    get position() {
        return this._position
    }

    set position(value) {
        this._position = value
    }

    get rotationY() {
        return this._rotationY
    }

    set rotationY(value) {
        this._rotationY = value
    }

    get size() {
        return this._size
    }

    set size(value) {
        this._size = value
    }

    get color() {
        return this._color
    }

    set color(value) {
        this._color = value
    }

    get mesh() {
        return this._mesh
    }

    get material() {
        return this._material
    }

    set material(material) {
        this._material = material
    }

    render(baseMatrix) {
        gl.useProgram(this._material.shaderProgram)
    }

}


