var LIGHT_POSITION

class Material {
    constructor() {
        this._properties = {
            color: [1.0, 1.0, 1.0],
        }
        this._shader
    }

    get shaderProgram() {
        return this._shaderProgram
    }

    get shader() {
        return this._shader
    }

    set shader(shader) {
        if (!shader.isBuilt) {
            console.warn("Shader ${shader} not built")
        }
        this._shader = shader
    }

    use() {
        if (!this._shaderProgram) {
            console.log("The shader program is undefined")
            return
        }

        gl.useProgram(this._shaderProgram)
    }

    bind() {
        COLOR_UNIFORM_BUFFER.data = this._properties.color
        this._shader.bind()
    }
}
