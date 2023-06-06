var LIGHT_POSITION

class Material {
    constructor() {
        this._properties = {
            color: [1.0, 1.0, 1.0],
        }
        
        this._data = {
            float1: {},
            float2: {},
            float3: {},
            mat4: {},
        }
        
        this._shader
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
            this._shader.setFlaot1(key, value)
        }
        for (const [key, value] of Object.entries(this._data.float2)) {
            this._shader.setFloat2(key, value)
        }
        for (const [key, value] of Object.entries(this._data.float3)) {
            this._shader.setFloat3(key, value)
        }
        for(const [key, value] of Object.entries(this._data.mat4)) {
            this._shader.setMat4(key, value)
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

}