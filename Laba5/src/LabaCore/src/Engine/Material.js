var LIGHT_POSITION

class Material {
    constructor(shader) {
        this._data = {
            float1: {},
            float2: {},
            float3: {},
            mat4: {},
            textures: {},
        }
        
        this._shader = shader
    }

    get shader() {
        return this._shader
    }

    set shader(shader) {
        if (!shader.isBuilt) {
            console.warn("Shader ", shader, " not built")
        }
        this._shader = shader
    }

    apply() {
        this._shader.bind()

        for (const [key, value] of Object.entries(this._data.float1)) {
            const location = this._shader.getUniformLocation(key)
            this._shader.setFloat1(key, value)
        }
        for (const [key, value] of Object.entries(this._data.float2)) {
            this._shader.setFloat2(key, value[0], value[1])
        }
        for (const [key, value] of Object.entries(this._data.float3)) {
            this._shader.setFloat3(key, value[0], value[1], value[2])
        }
        for (const [key, value] of Object.entries(this._data.mat4)) {
            this._shader.setMat4(key, value)
        }
        for (const [key, value] of Object.entries(this._data.textures)) {
            // TODO
            // const location = this._shader.getUniformLocation(key)
            this._shader.setInt1(key, value._counter)
            value.bind()
        }
    }

    setFloat1(name, value) {
        this._data.float1[name] = value
    }

    setFloat3(name, value) {
        this._data.float3[name] = value
    }

    setMat4(name, value) {
        this._data.mat4[name] = value
    }

    setTexture(name, value) {
        this._data.textures[name] = value
    }

}
