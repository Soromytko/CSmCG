var LIGHT_POSITION

class Material {
    constructor() {
        this._properties = {
            color: [1.0, 1.0, 1.0],
        }
        this._shader
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

    bind() {
        this._shader.bind()
    }
}
