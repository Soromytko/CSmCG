class MeshRenderer {
    constructor(mesh) {
        this._mesh = mesh
        this._material
    }

    get mesh() {
        return this._mesh
    }

    set mesh(mesh) {
        this._mesh = mesh
    }

    get material() {
        return this._material
    }

    beind() {
        const mesh = this._mesh
        mesh.attributes.forEach(attribute => {
            attribute.enable()
        })
    }

    unbind() {
        const mesh = this._mesh
        mesh.attributes.forEach(attribute => {
            attribute.disable()
        })
    }

    render() {
        // this._material.use()
        this._material.bind()
        
        // specifying shader uniforms
        this._mesh.vertexArray.draw()
    }
}

